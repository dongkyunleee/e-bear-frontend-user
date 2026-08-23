import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginId = id.trim();
        if (!loginId || !pw) {
            alert("아이디와 비밀번호를 입력해 주세요.");
            return;
        }

        try {
            const data = await api.post("/login", {
                    userId: id,
                    password: pw
                });

            const token = data?.token ?? data?.accessToken;

            if (token) localStorage.setItem("token", token);
            // console.log(token);
            alert("로그인 성공!");
            navigate("/");
        } catch (err) {
            const body = err.response?.data;
            const msg =
                (typeof body === "string" ? body : body?.message ?? body?.error) ||
                "아이디 또는 비밀번호를 확인해 주세요.";
            alert(msg);
        }
    };

    return (
        <div className="login-container">
            <div>
                <h1 className="login-title">eBear</h1>
            </div>
            <div>
                <form onSubmit={handleLogin}>
                    <div>
                        <input
                            className="login-input login-id-input"
                            type="text"
                            placeholder="ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            autoComplete="username"
                        />
                        <input
                            className="login-input login-password-input"
                            type="password"
                            placeholder="Password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button type="submit" className="login-button">
                            Login
                        </button>

                        <label className="login-checkbox-label" htmlFor="autoLogin">
                            <div>
                                <input className="login-checkbox" type="checkbox" id="autoLogin" />
                                <span className="login-checkbox-span"></span>
                                <span className="login-checkbox-text">자동로그인</span>
                            </div>
                        </label>
                    </div>
                </form>
                <div className="login-link-container">
                    <Link className="login-link" to="/findid">
                        아이디 찾기
                    </Link>
                    <Link className="login-link" to="/findid">
                        비밀번호 찾기
                    </Link>
                    <Link className="login-link" to="/signuptermsagreement">
                        회원가입
                    </Link>
                </div>
                <div className="login-social-button-container">
                    <div className="login-social-button-item">
                        <a href="#" className="login-social-button"></a>
                        <span className="login-social-button-text">Google</span>
                    </div>
                    <div className="login-social-button-item">
                        <a href="#" className="login-social-button"></a>
                        <span className="login-social-button-text">Kakao</span>
                    </div>
                    <div className="login-social-button-item">
                        <a href="#" className="login-social-button"></a>
                        <span className="login-social-button-text">Naver</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
