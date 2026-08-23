import { useState } from "react";
import './OrderItem.css';
import useMediaQuery from "../hooks/useMediaQuery";
import Pagination from '@mui/material/Pagination';
import OrderItemReviewPopup from "../components/OrderItemReviewPopup"
import OrderItemPayInfoPopup from "../components/OrderItemPayInfoPopup"
import PopUp from "../components/PopUp"
import { ChevronRightIcon } from '../components/CustomTag';

function OrderItem({ orderProducts }) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [payInfoPopupItem, setPayInfoPopupItem] = useState(null);
    const handleClosePayModal = () => {
        setPayInfoPopupItem(null);
    };

    const [reviewPopupItem, setReviewPopupItem] = useState(null);
    const handleCloseReviewPopup = () => {
        setReviewPopupItem(null);
    };
    return (
        <div className="order-list">
            {orderProducts.length === 0 ? (
                <p className="no-order">주문내역이 없습니다.</p>
            ) : (
                orderProducts.map((item, index) => (
                    <div key={index} className="order-list-content">
                        {isMobile ? (
                            // 모바일용 레이아웃
                            <div className="order-mobile-layout">
                                <p className="order-date">{item.orderDate}</p>
                                <div className="recipent-info">
                                    <p className="recipient">받으시는 분</p>
                                    <p className="recipient-name">{item.recipient}</p>
                                </div>
                                <p className="delivery-status-mobile">{item.deliveryStatus}</p>
                                <div className="order-product-mobile">
                                    <img src={item.imgSrc} alt="상품 이미지" className="product-image" />
                                    <div className="pay-btn-area">
                                        <button className="pay-btn-mobile" onClick={() => setPayInfoPopupItem(item)}>
                                            결제정보
                                        </button>
                                        <ChevronRightIcon className="pay-chev-icon" />
                                    </div>
                                    <div className="order-product-info">
                                        <p className="product-brand">{item.brand}</p>
                                        <p className="product-name">{item.product}</p>
                                        <p className="product-quantity">수량 {item.quantity}개</p>
                                        <p className="product-price">{item.price} 원</p>
                                    </div>
                                    {item.deliveryStatus === "배송완료" && (
                                        <button className="review-btn-mobile" onClick={() => setReviewPopupItem(item)}>
                                            리뷰 작성
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // PC용 레이아웃
                            <>
                                <div className="order-list-basic-data">
                                    <p className="order-date">{item.orderDate}</p>
                                    <div className="recipent-info">
                                        <p className="recipient">받으시는 분</p>
                                        <p className="recipient-name">{item.recipient}</p>
                                    </div>
                                </div>
                                <div className="order-list-product-area">
                                    <img
                                        src={item.imgSrc}
                                        alt="상품 이미지"
                                        className="product-image" />
                                    <div>
                                        <p className="product-brand">{item.brand}</p>
                                        <p className="product-name">{item.product}</p>
                                        <p className="product-quantity">수량 {item.quantity}개</p>
                                        <p className="product-price">{item.price} 원</p>
                                    </div>
                                </div>
                                <div className="order-list-status-area">
                                    <p className="delivery-status">{item.deliveryStatus}</p>
                                </div>
                                <div className="order-list-button-area">
                                    <button className="pay-btn" onClick={() => setPayInfoPopupItem(item)}>결제정보</button>
                                    {item.deliveryStatus === "배송완료" && (
                                        <button className="review-btn" onClick={() => setReviewPopupItem(item)}>리뷰 작성</button>
                                    )}
                                </div>
                            </>)}
                    </div>
                ))
            )}
            <Pagination count={10} color="primary" />
            <PopUp
                isOpen={Boolean(payInfoPopupItem)}
                onClose={handleClosePayModal}
                title={"주문 결제정보"}
                component={<OrderItemPayInfoPopup item={payInfoPopupItem} />}
            />
            <PopUp
                isOpen={Boolean(reviewPopupItem)}
                onClose={handleCloseReviewPopup}
                title={"리뷰 작성"}
                component={reviewPopupItem ? (<OrderItemReviewPopup productId={reviewPopupItem.productId} boardId={reviewPopupItem.boardId} onClose={handleCloseReviewPopup} />) : null}
            />
        </div>
    )
}

export default OrderItem;