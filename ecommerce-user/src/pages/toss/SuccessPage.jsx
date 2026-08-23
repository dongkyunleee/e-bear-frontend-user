import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const navigate = useNavigate();
  const hasRequested = useRef(false); // 중복 호출 방지

  useEffect(() => {
    // 승인 요청 중복 방지
    if (hasRequested.current) return;
    hasRequested.current = true;

    async function confirmPayment() {
      try {
        // 결제 승인 요청
        await api.post("/api/payments/confirm", {
          paymentKey : paymentKey,
          orderId : orderId,
          amount: Number(amount)
        });
        // 성공 시 결제 완료 화면 이동
        navigate(`/pages/complete?orderPaymentId=${orderId}`, { replace: true });

      } catch (error) {
        console.error('결제승인 중 오류 : ', error);

        let errorCode = 'SERVER_ERROR';
        let errorMessage = '서버와의 통신에 실패했습니다.';

        if (error.response && error.response.data) {
          const serverError = error.response.data;
          errorCode = serverError.code || errorCode;
          errorMessage = serverError.message || errorMessage;
        }

        // window.location.href = `/user/toss/fail?code=${errorJson.code}&message=${encodeURIComponent(errorJson.message)}`;
        navigate('/user/toss/fail', { 
          replace: true, 
          state: { code: errorCode, message: errorMessage } 
        });
        
        // window.location.href = `/user/toss/fail?code=SERVER_ERROR&message=${encodeURIComponent("서버와의 통신에 실패했습니다.")}`;
      }
    } 

    // 페이지 진입 즉시 자동으로 승인 함수 실행
    confirmPayment();
  }, [paymentKey, orderId, amount, navigate]); // 의존성 배열


  // paymentStatus가 null일 때 (자동 승인 통신 중) 보여줄 로딩 화면
  return (
    <div className="wrapper w-100">
      <div className="flex-column align-center confirm-loading w-100 max-w-540">
        <div className="flex-column align-center">
          <img
            src="https://static.toss.im/lotties/loading-spot-apng.png"
            width="120"
            height="120"
            alt="loading"
          />
          <h2 className="title text-center">안전하게 결제를 처리하고 있어요</h2>
          <h4 className="text-center description">잠시만 기다려주세요...</h4>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="wrapper w-100">
  //     {isConfirmed ? (
  //       <div
  //         className="flex-column align-center confirm-success w-100 max-w-540"
  //         style={{
  //           display: "flex"
  //         }}
  //       >
  //         <img
  //           src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
  //           width="120"
  //           height="120"
  //         />
  //         <h2 className="title">결제를 완료했어요</h2>
  //         <div className="response-section w-100">
  //           <div className="flex justify-between">
  //             <span className="response-label">결제 금액</span>
  //             <span id="amount" className="response-text">
  //               {amount}
  //             </span>
  //           </div>
  //           <div className="flex justify-between">
  //             <span className="response-label">주문번호</span>
  //             <span id="orderId" className="response-text">
  //               {orderId}
  //             </span>
  //           </div>
  //           <div className="flex justify-between">
  //             <span className="response-label">paymentKey</span>
  //             <span id="paymentKey" className="response-text">
  //               {paymentKey}
  //             </span>
  //           </div>
  //         </div>

  //         <div className="w-100 button-group">
            
  //           <div className="flex" style={{ gap: "16px" }}>
  //             <a
  //               className="btn w-100"
  //               href="https://developers.tosspayments.com/sandbox"
  //             >
  //               다시 테스트하기
  //             </a>
  //             <a
  //               className="btn w-100"
  //               href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
  //               target="_blank"
  //               rel="noopner noreferer"
  //             >
  //               결제 연동 문서가기
  //             </a>
  //           </div>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="flex-column align-center confirm-loading w-100 max-w-540">
  //         <div className="flex-column align-center">
  //           <img
  //             src="https://static.toss.im/lotties/loading-spot-apng.png"
  //             width="120"
  //             height="120"
  //           />
  //           <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
  //           <h4 className="text-center description">결제 승인하고 완료해보세요.</h4>
  //         </div>
  //         <div className="w-100">
  //           <button className="btn primary w-100" onClick={confirmPayment}>
  //           결제 승인하기
  //         </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}