import "./MyCart.css"
import SideNavigation from "../components/SideNavigation"
import MyPageHeader from "../components/MyPageHeader";
import { useState } from "react";

const MyCart = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    let sideMenu = [
        {
            title: "회원정보 조회 및 수정",
            link: "/mypage/userinfo",
        },
        {
            title: "주문내역",
            link: "/mypage/orderlist",
        },
        {
            title: "문의내역",
            subMenu: [
                {
                    title: "고객문의",
                    link: "/mypage/inquiry",
                },
                {
                    title: "신고문의",
                    link: "/mypage/inquiryreport",
                }
            ]
        },
        {
            title: "찜목록",
            link: "/mypage/wishlist",
        },
        {
            title: "최근 본 상품",
            link: "/mypage/currentview",
        },
        {
            title: "쿠폰",
            link: "/mypage/cupon",
        },
        {
            title: "포인트",
            link: "/mypage/point",
        },
        {
            title: "회원탈퇴"
        }
    ];

    const initialItems = [
        { id: 1, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41000, option: '사이즈 (M)', quantity: 1, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 2, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41700, option: '사이즈 (M)', quantity: 1, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 3, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41300, option: '사이즈 (M)', quantity: 1, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 4, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41200, option: '사이즈 (M)', quantity: 7, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 5, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41000, option: '사이즈 (M)', quantity: 1, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 6, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41700, option: '사이즈 (M)', quantity: 7, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 7, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41000, option: '사이즈 (M)', quantity: 1, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 8, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41000, option: '사이즈 (M)', quantity: 9, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
        { id: 9, brand: '유닉스', name: '오브제 헤어 드라이기 UN-B1919N', price: 41000, option: '사이즈 (M)', quantity: 10, img: 'https://myplace-phinf.pstatic.net/20240604_38/1717466827116N09KN_JPEG/IMG_2879.jpeg' },
    ];

    const [items, setItems] = useState(
        initialItems.map(item => ({ ...item, checked: true }))
    );

    // 수량 증감 핸들러
    const handleQuantity = (id, type) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, quantity: type === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1) };
            }
            return item;
        }));
    };

    // 모든 item의 checked가 true인지 확인
    const isAllChecked = items.length > 0 && items.every((item) => item.checked);

    // 전체 선택 체크박스 핸들러
    const handleSelectAll = (e) => {
        const { checked } = e.target;
        // 모든 아이템의 checked 상태를 전체 선택 체크박스와 동일하게 변경
        setItems(items.map((item) => ({ ...item, checked })));
    };

    // 개별 상품 체크박스 핸들러
    const handleSelectItem = (id) => {
        setItems(items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    // 결제 금액 계산 로직 (체크된 상품만 필터링)
    const checkedItems = items.filter((item) => item.checked);
    const totalCheckedCount = checkedItems.length; // 체크된 상품 개수

    // 체크된 상품들의 합산
    const totalGoodsPrice = checkedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const shippingFee = 0; // 배송비 로직
    const totalDiscount = 0; // 할인 금액
    const finalPrice = totalGoodsPrice + shippingFee - totalDiscount; // 최종 결제 금액

    return (
        <>
            <MyPageHeader title={"장바구니"} toggleSidebar={() => setIsSidebarOpen(true)} />
            <div className="main-layout">
                <SideNavigation sideMenu={sideMenu} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="main-content">
                    <div className="cart-container">
                        <div className="cart-list-section">
                            <div className="list-controls">
                                <label className="checkbox-label">
                                    {/* 전체 선택 체크박스 연동 */}
                                    <input
                                        type="checkbox"
                                        checked={isAllChecked}
                                        onChange={handleSelectAll}
                                    />
                                    <span>전체 선택</span>
                                </label>
                                <div className="control-buttons">
                                    <button className="btn-outline">선택 삭제</button>
                                    <button className="btn-outline">선택 주문</button>
                                </div>
                            </div>

                            <ul className="cart-list">
                                {items.map((item) => (
                                    <li key={item.id} className="cart-item">
                                        {/* 개별 선택 체크박스 연동 */}
                                        <input
                                            type="checkbox"
                                            className="item-checkbox"
                                            checked={item.checked}
                                            onChange={() => handleSelectItem(item.id)}
                                        />
                                        <div className="item-image">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <p className="item-brand">{item.brand}</p>
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-price">{item.price.toLocaleString()} 원</p>
                                            <p className="item-option">옵션 : {item.option}</p>
                                            <p className="item-qty-text">수량 : {item.quantity}개</p>

                                            <div className="quantity-controls">
                                                <button onClick={() => handleQuantity(item.id, 'plus')}>+</button>
                                                <button onClick={() => handleQuantity(item.id, 'minus')}>-</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="cart-summary-section">
                            <div className="summary-box">
                                <h4>결제 예정 금액</h4>
                                <div className="summary-row">
                                    <span>총 상품 금액</span>
                                    {/* 계산된 총 상품 금액 출력 */}
                                    <span>{totalGoodsPrice.toLocaleString()}원</span>
                                </div>
                                <div className="summary-row">
                                    <span>총 배송비</span>
                                    <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
                                </div>
                                <div className="summary-row">
                                    <span>총 할인 금액</span>
                                    <span>{totalDiscount.toLocaleString()}원</span>
                                </div>
                                <div className="divider"></div>
                                <div className="summary-row total">
                                    <span>최종 결제 금액</span>
                                    {/* 계산된 최종 금액 출력 */}
                                    <span className="total-price">{finalPrice.toLocaleString()}원</span>
                                </div>
                                {/* 체크된 건수가 반영된 주문 버튼 */}
                                <button className="order-button">총 {totalCheckedCount}건 주문하기</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default MyCart;