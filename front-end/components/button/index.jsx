import React from "react";
import { useEffect, useState, useRef } from "react";
let timeClicked;

const Button = ({ onClick, value }) => {
  const [positionMouse, setPositionMouse] = useState({
    x: 0,
    y: 0,
  });
  const [countClicked, setCountClicked] = useState(0);
  const buttonRef = useRef(null);
  return (
    <button
      className="overflow-hidden btn-style p-[10px_20px] relative  transition-color duration-500 rounded-[12px] w-[200px] flex items-center justify-center"
      value={value}
      ref={(el) => (buttonRef.current = el)}
      onClick={(event) => {
        const valueCoin = Number(event?.target?.value);
        const left = buttonRef?.current?.offsetLeft || 0;
        const top = buttonRef?.current?.offsetTop || 0;
        setPositionMouse({
          x: event.pageX - left,
          y: event.pageY - top,
        });
        clearTimeout(timeClicked);
        timeClicked = setTimeout(() => setCountClicked(0), 1000);
        setCountClicked(countClicked + 1);
        onClick(valueCoin);
      }}
      onMouseLeave={() => {
        clearTimeout(timeClicked);
        setTimeout(() => setCountClicked(0), 1000);
      }}
    >
      <span className="list__effect pointer-events-none">
        {Array(countClicked)
          .fill(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((_, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#fff",

                top: positionMouse.y,
                left: positionMouse.x,
              }}
              className="button__effect pointer-events-none"
            ></span>
          ))}
      </span>
      <p className="z-[10] pointer-events-none">{value}</p>
    </button>
  );
};

export default Button;
