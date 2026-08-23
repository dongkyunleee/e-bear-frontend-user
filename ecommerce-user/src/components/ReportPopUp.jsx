import { useState } from 'react';
import api from '../api/axios';
import './ReportPopUp.css';

function ReportPopUp({ productNo, onClose }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/report/user/write", {
                productNo: productNo,
                title: title,
                content: message,
            });

            alert("신고가 등록되었습니다.");
            setTitle("");
            setMessage("");

            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error("신고 등록 실패:", err);
            console.error("status:", err.response?.status);
            console.error("data:", err.response?.data);
            alert("신고 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-popup-container">
            <div className="report-popup-guide">
                <p>■ 상품과 관련없는 내용, 비방, 광고, 불건전한 내용의 글은 사전동의 없이 삭제될 수 있습니다.</p>
                <p>■ 신고 내용에 대한 답변 등록 시, 회원정보에 등록된 이메일로 안내드립니다.</p>
            </div>

            {/* 입력 영역 */}
            <div className="report-write-area">
                <input
                    type="text"
                    className="report-title"
                    placeholder="제목을 입력하세요."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="report-message"
                    placeholder="내용을 입력하세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>

            {/* 옵션 체크박스 & 제출 버튼 */}
            <div className="check-submit-area">
                {/*
                <label className="report-private-check">
                    <input className="report-checkbox" type="checkbox" />
                    <span className="report-checkbox-text">비밀글로 작성하기</span>
                </label>
                */}
                <button
                    className="submit-button"
                    disabled={!title.trim() || !message.trim() || loading}
                    onClick={handleSubmit}
                >
                    {loading ? "등록 중..." : "작성하기"}
                </button>
            </div>
        </div>
    )
}

export default ReportPopUp;