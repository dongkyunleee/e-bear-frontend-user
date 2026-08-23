import React from 'react';
import './Product.css';
import { useNavigate } from "react-router-dom";

function Product({product}) {
    const formatPrice = (price) => price.toLocaleString('ko-KR');
    const navigate = useNavigate();

    return (
        <div key={product.id} className="product-card" onClick={() => navigate(`/product/view/${product.id}`)}>
            <div className="product-image-container">
                <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
            </div>
            <div className="product-details">
                <span className="product-brand">{product.brand}</span>
                <p className="product-name">{product.name}</p>
                <div className="product-price">
                    {/* 세일 퍼센트 존재할경우 세일가로 표시 */}
                    {product.salePercentage ? (
                        <div className="product-price">
                            <span className="original-price">{formatPrice(product.price)}원</span>
                            <span className="sale-info">
                                <span className="sale-percentage">{product.salePercentage}%</span>
                                <span className="sale-price">{formatPrice(product.price - ((product.price * product.salePercentage) / 100))}원</span>
                            </span>
                        </div>
                    ) : (
                        <div className="product-price">
                            <span className="normal-price">{formatPrice(product.price)}원</span>
                        </div>
                    )}
                    {/* 별점 표시 */}
                    {product.rating && (
                        <div className="product-rating-container">
                            <span className="product-rating">★ {product.rating.toFixed(1)} ({product.reviewCount})</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Product;
