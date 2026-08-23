import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { SendIcon } from "./CustomTag";
import Message from "./Message";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api/axios.js";

const Chat = () => {
    const [messageList, setMessageList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [myUserId, setMyUserId] = useState("");
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null); 

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    useEffect(() => {
        const initChat = async () => {
            try {
                const userRes = await api.get("/chat/user/me"); 
                setMyUserId(userRes.data.userId);
                const roomRes = await api.post("/chat/join");
                setRoomId(roomRes.data.roomId);
            } catch (error) {
                console.error("초기화 실패:", error);
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        if (!roomId || !myUserId) return;
        const token = localStorage.getItem('token');
        const client = new Client({
            webSocketFactory: () =>
                new SockJS("/ws"),
                connectHeaders: {
                    Authorization: token ? `${token}` : "", 
                },
            onConnect: () => {
                console.log("WebSocket connected");
                client.subscribe(
                    `/topic/chat/${roomId}`,
                    (message) => {
                        const data = JSON.parse(message.body);
                        const formattedMessage = {
                            ...data,
                            isMe: data.senderId === myUserId,
                            message: data.content, 
                            date: new Date().toLocaleDateString(),
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        };
                        setMessageList(prev => [...prev, formattedMessage]);
                    }
                );
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId, myUserId]);


    const sendMessage = () => {
        if (!inputValue.trim()) return;

        const message = {
            roomId: roomId,
            content: inputValue,
            senderId: myUserId,
        };

        stompClient.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify(message),
        });

        setInputValue("");
    };

    if (!roomId) {
        return (
            <div className="chat-window">
                <div className="chat-header">대화</div>
                <div className="chat-messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    채팅방 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                대화
            </div>

            <div className="chat-messages">
                {messageList.map((message, index) => (
                    <Message
                        key={index}
                        data={message}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="채팅을 입력해주세요..."
                />

                <button
                    className="send-btn"
                    onClick={sendMessage}
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default Chat;