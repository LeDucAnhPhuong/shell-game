"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
let style = {};
let halfWidthCard = 0;
let halfHeightCard = 0;
export default function Card({ value, onClick }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });
  const [style, setStyle] = useState({});
  const [styleShadow, setStyleShadow] = useState({});
  useEffect(() => {
    halfWidthCard = (cardRef.current?.clientWidth || 0) / 2;
    halfHeightCard = (cardRef.current?.clientHeight || 0) / 2;

    setStyleShadow(
      rotate.x === 0 && rotate.y === 0
        ? {
            transform: "translate(0)",
            transition: "all 0.5s ease-out 0s",
            background:
              "radial-gradient(circle, rgba(0,0,0) 3%, transparent 60%)",
            opacity: 0,
          }
        : {
            transform: `translate(${-rotate.x}px, ${rotate.y}px)`,
            background:
              "radial-gradient(circle, rgba(0,0,0) 3%, transparent 60%)",
            transition: "all 0.1s ease-out 0s",
            opacity:
              (Math.abs(rotate.x) + Math.abs(rotate.y)) /
              ((halfWidthCard + halfHeightCard) * 0.7),
          }
    );
    setStyle(
      rotate.x === 0 && rotate.y === 0
        ? {
            transform: "rotate3d(0,0,0,0deg) scale(1)",
            transition: "transform 0.5s ease-out 0s",
          }
        : {
            transform: `rotate3d(${rotate.y * (2 / halfHeightCard)}, ${
              rotate.x * (2 / halfWidthCard)
            }, 0, ${
              (Math.abs(rotate.x) + Math.abs(rotate.y)) *
              (20 / (halfWidthCard + halfHeightCard))
            }deg) scale(1.3)`,
            transition: "transform 0.1s ease-out 0s",
          }
    );
  }, [rotate]);
  return (
    <button
      value={value}
      onClick={() => onClick(value)}
      onMouseMove={(e) => {
        const rotate = {
          x:
            e.clientX -
            ((cardRef?.current?.offsetLeft || 0) +
              (cardRef?.current?.clientWidth || 0) / 2),
          y:
            (cardRef?.current?.offsetTop || 0) +
            (cardRef?.current?.clientHeight || 0) / 2 -
            e.clientY,
        };
        setRotate(rotate);
      }}
      onMouseLeave={() => {
        setRotate({ x: 0, y: 0 });
      }}
      ref={(el) => (cardRef.current = el)}
      className="relative w-full h-full rounded-[16px] bg-[#f5f5f5] overflow-hidden p-[20px]"
      style={style}
    >
      <div className="inset-0 absolute">
        <div className="flex flex-col justify-between rounded-[20px]   pointer-events-none">
          <span
            style={styleShadow}
            className="z-[-1] inset-[-50%] absolute blur-[10px] pointer-events-none"
          ></span>
          <div className="text-[24px] font-[700] text-[#202020]">{value}</div>
        </div>
      </div>
    </button>
  );
}
