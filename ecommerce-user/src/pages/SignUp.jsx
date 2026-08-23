import "./SignUp.css";
import api from "../api/axios.js";

const SignUp = () => {

    const sendEmailCode = async () => {
        const email = document.querySelector(".email-input").value;
        console.log(email);
        await api.post("/email/send", { email });
        alert("인증코드 발송!");
    }
    
    const verifyEmailCode = async () => {
        const email = document.querySelector(".email-input").value;
        const code = document.querySelector(".email-auth-code-input").value;
        
        await api.post("/email/verify", { email, code });
        alert("이메일 인증 완료!");
    }

    const handleSignUp = async () => {
        const name = document.querySelector(".name-input").value;
        const id = document.querySelector(".id-input").value;
        const password = document.querySelector(".password-input").value;
        const passwordConfirm = document.querySelector(".password-confirm-input").value;
        const email = document.querySelector(".email-input").value;
        const emailAuthCode = document.querySelector(".email-auth-code-input").value;

        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {

            await api.post("/signup", {
                name: name,
                id: id,
                pw: password,
                email: email,
                emailAuthCode: emailAuthCode,
            });
            alert("가입이 완료되었습니다.");
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message ?? "가입 요청에 실패했습니다.");
        }
    };

    return (
       <div className="signup-container">
            <div className="signup-title">
                eBear
            </div>
            <div className="signup-input-container">
                <input className="signup-input name-input" type="text" placeholder="이름" />
                <input className="signup-input id-input" type="text" placeholder="아이디" />
                <input className="signup-input password-input" type="password" placeholder="비밀번호" />
                <input className="signup-input password-confirm-input" type="password" placeholder="비밀번호 확인" />
                <div className="email-auth-container">
                    <input className="signup-email-input email-input" type="text" placeholder="이메일" />
                    <button className="email-auth-button" onClick={sendEmailCode}>이메일 발송</button>
                </div>

                <div className="email-auth-container">
                    <input className="signup-email-input email-auth-code-input" type="text" placeholder="인증번호 입력" />
                    <button type="button" className="email-auth-button" onClick={verifyEmailCode}>
                        인증확인
                    </button>
                </div>
                {/* <input className="signup-input email-auth-code-input email-auth-code-input" type="text" placeholder="이메일 인증번호" /> */}
                <button
                    type="button"
                    className="signup-button"
                    onClick={handleSignUp}
                >
                    가입하기
                </button>
            </div>
       </div>
    )
}

export default SignUp;