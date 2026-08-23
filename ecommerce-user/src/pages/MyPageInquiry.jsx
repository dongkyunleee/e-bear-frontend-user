import "./MyPageInquiry.css"
import SideNavigation from "../components/SideNavigation"
import InquiryItem from "../components/InquiryItem"
import MyPageHeader from "../components/MyPageHeader";
import { useEffect, useState } from "react";
import api from "../api/axios";

const MyPageInquiry = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);

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
    ]

    const getInquiryList = async () => {
        try {
            setLoading(true);

            const response = await api.get("/inquiry/user/list");

            console.log(response.data);

            const inquiryList = response.data.inquiries || [];

            const convertedList = inquiryList.map((inquiry) => ({
                id: inquiry.inquiryNo,
                inquiryNo: inquiry.inquiryNo,
                productNo: inquiry.productNo,
                imageUrl: inquiry.productImageUrl,
                brand: inquiry.brandName,
                productName: inquiry.productName,
                title: inquiry.title,
                date: formatDate(inquiry.regDate),
                content: inquiry.content,
                replyStatus: inquiry.answered ? 1 : 0,
                response: inquiry.answered ? inquiry.answerContent : null
            }));

            setInquiries(convertedList);
        } catch (err) {
            console.error("문의 목록 조회 실패:", err);
            alert("문의 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInquiryList();
    }, []);

    const formatDate = (dateTime) => {
        if (!dateTime) return "";

        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}.${month}.${day}`;
    };

    return (
        <>
            <MyPageHeader title={"문의내역 (고객문의)"} toggleSidebar={() => setIsSidebarOpen(true)} />

            <div className="main-layout">
                {/* 사이드 네비게이션 메뉴 */}
                <SideNavigation sideMenu={sideMenu} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* 메인 콘텐츠 */}
                <main className="main-content">
                    {/* 문의 목록 */}
                    <div className="inquiry-list">
                        {loading && <p>문의 목록을 불러오는 중입니다.</p>}

                        {!loading && inquiries.length === 0 && (
                            <p>등록된 문의가 없습니다.</p>
                        )}

                        {!loading && inquiries.map((data, index) => (
                            <InquiryItem key={data.id || index} item={data} />
                        ))}
                    </div>
                </main>
            </div>
        </>
    )

}

export default MyPageInquiry