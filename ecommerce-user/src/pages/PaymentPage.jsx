import { useEffect, useState } from "react";
import "./PaymentPage.css";
import MyPageHeader from "../components/MyPageHeader";
import PopUp from "../components/PopUp";
import { CheckoutPage } from "./toss/CheckoutPage";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const PaymentPage = () => {
  const { id } = useParams(); 
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [point, setPoint] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderId, setOrderId] = useState(null); //서버에서 발급 받은 orderId 저장 상태 확인
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState("서울특별시 동작구 여의대방로");
  const [phone, setPhone] = useState("010-1234-5678");
  const [email, setEmail] = useState("abc1234@naver.com");
  const [deliveryReq, setDeliveryReq] = useState("부재시 문앞에 놓아주세요");
  
  const totalPrice = products.reduce((sum, item) => sum + (item.price * item.amount), 0);
  
  const handleFullPoint = () => {
    setPoint("7500");
  };

  const fetchOrder = async () => {
    try {
        const response = await api.get(`/order/find/${id}`);
        const data = response.data;
        console.log(data);

        const mappedProducts = data.productOptions.map(option => ({
          id: option.productOptionId,
          brand: option.productName, 
          name: option.productOptionName,
          price: option.price,
          amount: option.quantity,
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&h=120&fit=crop" 
      }));

      setProducts(mappedProducts);
    } catch (err) {
        console.error("주문 조회 실패:", err);
        console.error("status:", err.response?.status);
        console.error("data:", err.response?.data);
    }
};

  useEffect(() => {
    fetchOrder();
  }, []);

  // 결제하기 버튼 클릭 시 실행되는 로직
  // -> 결제 상태 변경(웹훅을 위해)
  const handlePaymentSubmit = async () => {
    try {
      // ==========================================
      // 1. 주문 저장 API 호출 (orderId 발급)
      // ==========================================
      const orderResponse = await api.post("/order/update", {
        orderId: id,
        address: address,
        tel: phone,
        email: email,
        deliveryRequired: deliveryReq
      });

      const serverOrderId = orderResponse.data.orderPaymentId;

      // ==========================================
      // 2. 결제 준비 API 호출 (받아온 orderPaymentId 전달)
      // ==========================================
      if(serverOrderId){
        const paymentResponse = await api.post("/api/payments/ready", {
          orderPaymentId: serverOrderId, // 발급받은 orderId를 그대로 결제 서버로 넘김
          paymentAmount: 100, 
          type: paymentMethod.toUpperCase(), 
        });

        if (paymentResponse.status != 200) {
          throw new Error("결제 준비 중 서버 오류가 발생했습니다.");
        }

        // ==========================================
        // 3. 모든 통신 성공 시 결제창 오픈
        // ==========================================
        setOrderId(serverOrderId); // 상태 업데이트
        setIsCheckoutOpen(true);   // 토스 팝업 오픈
      }
      

    } catch (error) {
      console.error("결제 진행 에러:", error);
      alert(error.message || "서버와 연결할 수 없습니다.");
    }
  };  

  return (
    <div className="payment-container">
      <MyPageHeader title={"결제화면"} />

      <main className="payment-main">
        <section className="product-list-container">
            {products.map((product) => (
                <div className="product-info-card" key={product.id}>
                    <div className="product-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                        <span className="brand-name">{product.brand}</span>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">{product.price.toLocaleString()}원</p>
                        <p className="product-amount">수량 {product.amount}개</p>
                        <div className="seller-info">판매자 정보</div>
                    </div>
                </div>
            ))}
            </section>

        <section className="info-list-section">
          <div className="info-row">
            <span className="info-label">배송지 정보</span>
            <span className="info-value">{address}<span className="arrow">&gt;</span></span>
          </div>
          <div className="info-row">
            <span className="info-label">휴대폰 번호</span>
            <span className="info-value">{phone}</span>
          </div>
          <div className="info-row">
            <span className="info-label">이메일</span>
            <span className="info-value">{email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">배송 요청사항</span>
            <select 
              className="shipping-select"
              value={deliveryReq}
              onChange={(e) => setDeliveryReq(e.target.value)}
            >
              <option value="부재시 문앞에 놓아주세요">부재시 문앞에 놓아주세요</option>
              <option value="직접 수령하겠습니다">직접 수령하겠습니다</option>
              <option value="벨을 누르지 마세요">벨을 누르지 마세요</option>
              <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
            </select>
          </div>
        </section>

        <section className="point-section">
          <h4 className="section-title">포인트</h4>
          <div className="point-input-group">
            <input 
              type="text" 
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="현재 잔여 포인트 : 7500P" 
            />
            <button className="point-btn" onClick={handleFullPoint}>전액 사용</button>
          </div>
        </section>
        {/*
        <section className="payment-method-section">
          <h4 className="section-title">결제 수단</h4>
          <div className="method-grid">
            {['card', 'bank', 'pay'].map((method) => (
              <button
                key={method}
                className={`method-item ${paymentMethod === method ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method === 'card' && '카드'}
                {method === 'bank' && '계좌이체'}
                {method === 'pay' && '페이'}
              </button>
            ))}
          </div>
        </section>
         */}
        <section className="final-payment-section">
          <div className="total-price-row">
            <span>최종 결제금액</span>
            <span className="total-price">{totalPrice.toLocaleString()}원</span>
          </div>
          <button
            className="pay-submit-btn"
            onClick={handlePaymentSubmit}
          >
            결제하기
          </button>
        </section>
      </main>
      <PopUp
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={"결제하기"}
        component={<CheckoutPage orderId={orderId} payAmount={100} />}
      />
    </div>
  );
};

export default PaymentPage;