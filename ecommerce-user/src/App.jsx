import "./App.css"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Headers from "./components/Headers"
import Footer from "./components/Footer"
import MainPage from "./pages/MainPage"
import Login from "./pages/Login"
import MyPageUserInfo from "./pages/MyPageUserInfo"
import MyPageOrderList from "./pages/MyPageOrderList"
import MyPageCupon from "./pages/MyPageCupon"
import MyPagePoint from "./pages/MyPagePoint"
import MyPageInquiry from "./pages/MyPageInquiry"
import MyPageWishlist from "./pages/MyPageWishlist"
import MyPageInquiryReport from "./pages/MyPageInquiryReport"
import FindId from "./pages/FindId"
import Signup from "./pages/Signup"
import SignupTermsAgreement from "./pages/SignupTermsAgreement"
import ProductListPage from "./pages/ProductListPage"
import MyPageCurrentView from "./pages/MyPageCurrentView"
import ProductViewPage from "./pages/ProductViewPage"

import PaymentComplete from "./pages/PaymentComplete"

import CommonError from "./pages/CommonError"
import { CloseIcon, MessageIcon } from "./components/CustomTag"
import { useState } from "react"
import Chat from "./components/Chat"
import PaymentPage from "./pages/PaymentPage"

//토스 테스트
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CheckoutPage } from './pages/toss/CheckoutPage';
import { SuccessPage } from './pages/toss/SuccessPage';
import { FailPage } from './pages/toss/FailPage';
import './pages/toss/style.css';

function App() {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const toggleMessage = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  if (location.pathname === '/user/err') {
    return (
      <Routes>
        <Route path="/err" element={<CommonError />} />
        <Route path="*" element={<CommonError />} />
      </Routes>
    );
  }
  return (
    <div className="ebear-container">
     <Headers />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/mypage/userinfo" element={<MyPageUserInfo />} />
        <Route path="/mypage/orderlist" element={<MyPageOrderList />} />
        <Route path="/mypage/cupon" element={<MyPageCupon />} />
        <Route path="/mypage/point" element={<MyPagePoint />} />
        <Route path="/mypage/inquiry" element={<MyPageInquiry />} />
        <Route path="/mypage/inquiryreport" element={<MyPageInquiryReport />} />
        <Route path="/mypage/wishlist" element={<MyPageWishlist />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signuptermsagreement" element={<SignupTermsAgreement />} />
        <Route path="/product-list/:id" element={<ProductListPage />} />
        <Route path="/mypage/currentview" element={<MyPageCurrentView />} />
        <Route path="/product/view/:id" element={<ProductViewPage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/payment/complete" element={<PaymentComplete />} />
        {/* 토스 테스트 */}
        <Route path="/toss" element={<CheckoutPage />} />
        <Route path="/toss/success" element={<SuccessPage />} />
        <Route path="/toss/fail" element={<FailPage />} />

      </Routes>
      {isMessageOpen && (
        <Chat />
      )}
      <div className="message" onClick={toggleMessage}>
        {isMessageOpen ? <CloseIcon /> : <MessageIcon />}
      </div>
     <Footer />
   </div>
  )
}

export default App
