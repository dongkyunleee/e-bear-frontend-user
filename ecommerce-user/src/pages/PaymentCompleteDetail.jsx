import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom"; 
import "./PaymentCompleteDetail.css"
import Headers from "../components/Headers"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation"
import api from "../api/axios";
// import AWS from "aws-sdk"

const PaymentComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");
    const [paymentData, setPaymentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 서버로부터 진짜 결제 정보를 다시 조회
        const fetchPaymentDetails = async () => {
            if (!orderId) {
                setIsLoading(false);
                return;
            }

            try {
                // 이 주소는 회원님의 백엔드 API 엔드포인트에 맞춰 수정
                const response = await api.post("/api/payments/details", {
                    orderId : orderId
                });
                
                if (response.status === 200) {
                    const data = await response.json();
                    setPaymentData(data); // DB의 실시간 정보를 상태에 저장
                }
            } catch (error) {
                console.error("결제 내역 조회 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [orderId]);

    if (isLoading) {
        return <div className="ebear-container" style={{ textAlign: 'center', padding: '100px' }}>결제 내역을 확인하고 있습니다...</div>;
    }

    // 비정상 접근 차단 (주문번호가 없거나 서버 조회에 실패한 경우)
    if (!orderId || !paymentData) {
        alert("유효하지 않은 주문 정보입니다. 메인 페이지로 이동합니다.");
        return <Navigate to="/" replace />;
    }

    const formatPrice = (price) => price?.toLocaleString('ko-KR') || '0';

    let navigationMenu = [
        {
            title: "Hot",
            link: "/my-page/info",
        },
        {
            title: "세일",
            link: "/my-page/order",
        },
        {
            title: "라이브",
            link: "/my-page/inquiry",
        },
        {
            title: "이벤트",
            link: "/my-page/inquiry",
        },
        {
            title: "회원혜택",
            link: "/my-page/inquiry",
        }
    ]

    const totalPrice = paymentData?.totalAmount || 0;

    return (
        <div className="ebear-container">
            {/* 헤더 */}
            {/* <Headers /> */}

            {/* 네비게이션 */}
            <Navigation navigationMenu={navigationMenu} />

            <div className="page-title">
                <h1>결제 완료</h1>
            </div>

            <div className="main-layout">

                {/* 메인 콘텐츠 */}
                <main className="main-content">

                    <div style={{ marginBottom: "20px", fontSize: "16px" }}>
                        <strong>주문번호:</strong> {orderId}
                    </div>

                    {/* 추후 주문한 상품 렌더링 필요 */}
                    <div className="payment-product-grid">
                        {products.map(paymentData => (
                            <div key={paymentData.orderItemNo} className="payment-product-card">
                                <div className="payment-product-image-container">
                                    <img src={paymentData.imageUrl || 'https://via.placeholder.com/300'} alt={paymentData.name} />
                                </div>
                                <div className="payment-product-details">
                                    <span className="payment-product-brand">{paymentData.boardTitle}</span>
                                    <p className="payment-product-name">상품명 : {paymentData.name}</p>
                                    <p className="payment-product-name">수량 : {paymentData.quantity}</p>
                                    <p className="payment-product-name">옵션 : {paymentData.option}</p>
                                    
                                    <div className="payment-product-price">
                                        <span className="payment-normal-price">{formatPrice(paymentData.price)}원</span>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 총 합계 */}
                    <div className="payment-total-price-container">
                        합계: <span className="payment-total-price">{formatPrice(totalPrice)}원</span>
                    </div>

                    {/* 주문내역 보기 버튼 */}
                    <div className="payment-order-details-button-container">
                    <button className="payment-order-details-button">주문내역 보기</button>
                    </div>
                </main>
            </div>
            {/* 푸터 */}
            {/* <Footer /> */}
        </div>
    )

}

export default PaymentComplete