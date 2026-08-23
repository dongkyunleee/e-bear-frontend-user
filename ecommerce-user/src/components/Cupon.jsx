import React, { useState } from "react";
import "./Cupon.css";
import { DownloadIcon } from "./CustomTag";

const Cupon = ({data}) => {
    const conditionMap = {
        gt: '초과',
        ge: '이상',
        lt: '미만',
        le: '이하'
      };

    const conditionText = conditionMap[data.condition];

    return (
        <div className="div-cupon">
            <div>
                <div>
                    <span className="cupon-price">{data.price} </span>
                    <span className="money-type">원</span>
                </div>
                <div>
                    <span className="cupon-publisher">[{data.publisher}] </span>
                    <span className="sale-cupon">할인 쿠폰 </span> <br/>
                    <span className="sale-cupon-date">({data.startDt} ~ {data.endDt})</span>
                </div>
                <div className="cupon-condition-div">
                    <span className="cupon-condition">{data.conditionPrice}원 {conditionText} 구매시</span>
                </div>
            </div>
            

            <div className="cupon-download">
                <DownloadIcon/>
            </div>
        </div>
    )
}

export default Cupon;