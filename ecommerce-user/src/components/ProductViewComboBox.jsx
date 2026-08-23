import React from 'react';
import {  ChevronDownIcon } from "../components/CustomTag"
import './ProductViewComboBox.css';

function ProductViewComboBox({ comboOptionList, comboBox, handleComboBox, handleComboBoxItem }) {
  
    return (
        <div className="comboBox-section">
            <div className="comboBox">
                <a onClick={handleComboBox}>
                    <div className="comboBox-header">
                        <span>등급</span>
                        <ChevronDownIcon className={comboBox ? "rotate-180" : ""} />
                    </div>
                </a>
                <ul className="comboBox-option" style={{display: comboBox ? "block" : "none"}}>
                    {comboOptionList.map((data, index) => {
                        return (
                        <li className="comboBox-option-item" key={data.productOptionId || index}>
                            <a onClick={() => handleComboBoxItem(data)}>
                                <div className="comboBox-header-option">
                                    <span>{data.productOptionName}</span>
                                    <span>{data.productOptionPrice}</span>
                                </div>
                            </a>
                        </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ProductViewComboBox;
