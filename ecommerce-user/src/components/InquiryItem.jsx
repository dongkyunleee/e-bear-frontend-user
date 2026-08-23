import { useState } from "react";
import './InquiryItem.css';
import { ChevronUpIcon, ChevronDownIcon } from '../components/CustomTag';

export default function InquiryItem({ item }) {
    const [showResponse, setShowResponse] = useState(false);

    return (
        <div className="inquiry-item">
            <div className="inquiry-content">
                <div className="product-area">
                    <img
                        src={item.imageUrl}
                        alt="상품 이미지"
                        className="product-image"
                    />
                    <div className="inqury-product-info">
                        <p className="brand-name">{item.brand}</p>
                        <p className="product-name">{item.productName}</p>
                    </div>
                </div>
                <div className="inquiry-details">
                    <p className="my-inquiry-title">{item.title}</p>
                    <p className="inquiry-body-content">{item.content}</p>
                    <div className="inquiry-meta">
                        <p className="inquiry-date">{item.date}</p>
                        <span className="separator">|</span>
                        <div className="reply-status-group">
                            <button className="view-response-btn" onClick={() => { if (item.response) { setShowResponse(!showResponse); } }}>
                                {item.replyStatus === 0 ? "확인중" : "답변 완료"}
                                {item.response && (showResponse ?
                                    <ChevronUpIcon className="nav-icon" />
                                    : <ChevronDownIcon className="nav-icon" />)
                                }
                            </button>
                        </div>
                    </div>

                    {showResponse && item.response && (
                        <div className="response-section">
                            <p>{item.response}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
