"use client";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import swal from "sweetalert";
import Button from "../../components/button";
import Card from "../../components/card";
const URL = "localhost:4000";
const BUTTONS = [
  {
    value: 1,
    color: "#3A1078",
  },
  {
    value: 2,
    color: "#4E31AA",
  },
  {
    value: 5,
    color: "#2F58CD",
  },
  {
    value: 10,
    color: "#1D2B53",
  },
  {
    value: 20,
    color: "#0F2167",
  },
  {
    value: 50,
    color: "#0F2167",
  },
];

export default function Home() {
  const inputChatRef = useRef(null);
  const scrollRef = useRef(null);
  const [online, setOnline] = useState(false);
  const [coin, setCoin] = useState(0);
  const [socket, setSocket] = useState(null);
  const [CARDS, setCards] = useState([
    { type: "shrimp", coin: 0 },
    { type: "crab", coin: 0 },
    { type: "gourd", coin: 0 },
    { type: "fish", coin: 0 },
    { type: "chicken", coin: 0 },
    { type: "Deer", coin: 0 },
  ]);
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
      swal.close();
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
    if (roomChat[0]?.idUserName === id)
      scrollRef?.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    socket?.on("chat-from-server", (data) => {
      setRoomChat([data.room, ...roomChat]);
    });
    return () => socket?.off("chat-from-server");
  }, [roomChat]);
  function handleCoin(value) {
    setCoin(coin + value);
  }
  function handleBet(type) {
    if (coin === 0) return;
    socket?.emit("bet-coin-from-client", {
      type: type,
      coin: coin,
    });
    socket?.on("bet-coin-success", () => {
      setCoin(0);
    });
  }
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
      if (!value.trim()) {
        playOnline();
        return;
      }
      swal("Waiting!!", {
        icon: "info",
        buttons: [false],
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
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
      <section className="w-full min-h-full flex flex-col gap-[20px]">
        <div className="bg-[#1a1a1a] flex flex-wrap justify-between gap-[40px] gap-y-[20px]  rounded-[8px] w-full h-4/5  p-[20px]">
          {CARDS?.map((card) => (
            <div className="w-[200px] h-[calc((50% - 30px))] ">
              <Card value={card.type} onClick={handleBet} />
            </div>
          ))}
        </div>
        <div className="flex w-full h-1/5 gap-[20px]">
          <div className="bg-[#1a1a1a] flex justify-between px-[20px] rounded-[8px] w-4/5 h-full items-center">
            {BUTTONS.map((btn) => (
              <Button onClick={handleCoin} value={btn.value} />
            ))}
          </div>
          <span className="bg-[#1a1a1a] flex justify-center px-[20px] w-1/5 h-full rounded-[8px] items-center overflow-hidden">
            <p className="font-[700] text-[50px] text-[#fff]">{coin}</p>
          </span>
        </div>
      </section>
      <aside className=" flex flex-col  gap-[20px] w-[400px] min-h-full justify-between">
        <div className="bg-[#1a1a1a] rounded-[8px] w-full h-1/5 "></div>
        <div className="bg-[#1a1a1a]  rounded-[8px] flex flex-col justify-between w-full h-4/5">
          <ul className=" w-full h-full z-[8] relative overflow-y-hidden flex flex-col ">
            <div className="absolute inset-0 flex flex-col justify-end pt-[15px] ">
              <div
                ref={(el) => (scrollRef.current = el)}
                className="w-full h-auto  flex flex-col-reverse overflow-y-scroll gap-[12px] p-[0_20px_15px_10px]  "
              >
                {roomChat.length !== 0 &&
                  roomChat?.map((user, index) => (
                    <li
                      key={user.idMess}
                      className={` flex flex-col gap-[4px] ${
                        id === user.idUserName ? "items-end" : "items-start"
                      }`}
                    >
                      <h5
                        className={`text-[14px] transition-new-mess-name ${
                          id === user.idUserName
                            ? "text-[#6c47ff]"
                            : "text-[#fff]"
                        } font-[600] color-[#f5f5f5] capitalize`}
                      >
                        {user.userName}
                      </h5>
                      <div className="transition-new-mess-content p-[8px_12px] text-[12px] font-[500] rounded-[12px] bg-[#3b3b3b9c] break-words">
                        {user.content}
                      </div>
                    </li>
                  ))}
              </div>
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
        </div>
      </aside>
    </main>
  );
}
