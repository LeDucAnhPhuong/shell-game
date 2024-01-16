"use client";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import swal from "sweetalert";
const URL = "https://shell-game-a6u6.vercel.app/";
// const URL = "https://76ff91048896478a9bcc1e602f2a9b7d.serveo.net";
export default function Home() {
  const inputChatRef = useRef(null);
  const [online, setOnline] = useState(false);
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [socketToConnect, setSocketToConnect] = useState(null);
  const [userName, setUserName] = useState();
  const [contentChat, setContentChat] = useState("");
  const [roomChat, setRoomChat] = useState([]);
  const [id, setId] = useState();
  useEffect(() => {
    function handleEnter(event) {
      if (event.key == "Enter") {
        handleChat();
      }
    }
    window.addEventListener("keypress", handleEnter);
    return () => window.removeEventListener("keypress", handleEnter);
  }, [contentChat]);
  useEffect(() => {
    socket?.on("connect", () => {
      setOnline(true);
      setId(socket.id);
      const socketData = {
        data: {
          isLogin: true,
          id: socket.id,
          userName: userName,
        },
      };
      socket?.on("start-chat", (data) => {
        setRoomChat(data.room);
      });
      socket?.emit("userName-from-client", { userName: userName });
    });
    return () => {
      socket?.off("start-chat");
      socket?.off("connect");
    };
  }, [socket]);
  useEffect(() => {
    socket?.on("chat-from-server", (data) => {
      console.log("data", data);
      setRoomChat([...roomChat, data.room]);
    });
    return () => socket?.off("chat-from-server");
  }, [roomChat]);
  function handleInputChat(event) {
    setContentChat(event.target.textContent);
  }
  function handleChat() {
    if (!contentChat.trim()) return;
    inputChatRef.current.innerText = "";
    socket?.emit("chat-from-client", {
      content: contentChat,
    });
    setContentChat("");
  }
  async function playOnline() {
    await swal({
      title: "Type Your Name",
      text: "This name will follow you forever so be careful",
      closeOnClickOutside: false,
      closeOnEsc: false,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your name",
          type: "text",
        },
      },
    }).then((value) => {
      if (!value.trim()) return;
      const newSocket = io(URL, {
        autoConnect: true,
      });
      setUserName(value);
      setSocket(newSocket);
    });
  }
  if (!online)
    return (
      <main className="flex w-[100vw] h-[100vh] p-0 justify-center items-center">
        <button
          onClick={() => {
            playOnline();
          }}
          className="p-[10px_20px] bg-[#202020]  font-[700] text-[30px] rounded-[20px]"
        >
          Play online
        </button>
      </main>
    );
  return (
    <main className="flex min-h-screen max-w-[1600px] max-h-[900px] mx-[auto] gap-[20px] justify-between p-[15px_10px]">
      <section className="w-full min-h-full bg-[#1a1a1a] rounded-[8px]"></section>
      <aside className="bg-[#1a1a1a] flex flex-col rounded-[8px] gap-[10px] w-[400px] min-h-full justify-between">
        <ul className=" w-full h-full  z-[8] overflow-hidden  relative">
          <div className="absolute inset-0 flex flex-col p-[15px_10px] gap-[12px] justify-end">
            {roomChat.length !== 0 &&
              roomChat?.map((user, index) => (
                <li
                  key={user.userName + index}
                  className={`flex flex-col gap-[4px] ${
                    id === user.idUserName ? "items-end" : "items-start"
                  }`}
                >
                  <h5
                    className={`text-[14px]  ${
                      id === user.idUserName ? "text-[#6c47ff]" : "text-[#fff]"
                    } font-[600] color-[#f5f5f5] capitalize`}
                  >
                    {user.userName}
                  </h5>
                  <div className="p-[8px_12px] text-[12px] font-[500] rounded-[12px] bg-[#3b3b3b9c] break-words">
                    {user.content}
                  </div>
                </li>
              ))}
          </div>
        </ul>
        <div className="flex flex-col gap-[10px] p-[20px_10px_10px_10px] z-[10]">
          <div className="bg-[#3b3b3b] relative rounded-[4px] w-full min-h-[40px] h-[auto] p-[5px_10px]">
            <div
              ref={(el) => (inputChatRef.current = el)}
              onInput={handleInputChat}
              contentEditable
              className="text-[#fff] bg-[transparent] leading-[200%] w-full h-full outline-none break-words flex  "
            ></div>
            {!contentChat && (
              <span className="absolute pointer-events-none text-[#ffffff59] inset-0 z-10 pl-[10px] flex items-center">
                <p className="text-[12px]">Type your Thinking</p>
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <h5 className="text-[#fff] text-[14px] font-[500] capitalize">
              {userName}
            </h5>
            <button
              onClick={handleChat}
              className="rounded-[8px] bg-[#6c47ff] p-[8px_20px]"
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
