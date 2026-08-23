import React from 'react';
import './ProductOptionSelectList.css';

function ProductOptionSelectList({selectProductOptionList, handleCountChange, updateCount, handleDeleteOption}) {
  
    return (
        <div className="product-options-list"> 
            {selectProductOptionList.map((data, index) => {
                return(
                    <ul className="b_product_buy_selected">
                        <li className="c_product_option_item">
                            <div className="option_item_info">
                                <strong className="option_name">{data.optionSubject}</strong>
                                <div className="option_amount c_product_input c_product_input_count">
                                    <div className="amount-area">
                                        <button type="button" className="btn_decrs on c_product_btn c_product_btn_count1" onClick={() => updateCount(index, -1)}><span className="skip">수량감소</span></button>
                                        <input type="text" name="prdcAmount" className="text form_input" title="수량설정" value={data.optionCount} onChange={(e) => handleCountChange(index, e.target.value)}/>
                                        <button type="button" className="btn_incrs on c_product_btn c_product_btn_count2" onClick={() => updateCount(index, 1)}><span className="skip">수량증가</span></button>
                                    </div>
                                </div>
                                <dl className="c_prd_price">
                                    <div className="price">
                                        <dt>판매가</dt>
                                        <dd><span className="value">{data.optionCount * data.optionPrice}</span><span className="unit">원</span></dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="ctrl">
                                <button type="button" className="btn_del c_product_btn c_product_btn_delete" onClick={() => handleDeleteOption(index)}></button>
                            </div>
                        </li>
                    </ul>
                )
            })}
        </div>
    );
}

export default ProductOptionSelectList;
