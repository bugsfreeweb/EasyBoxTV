import React from "react";

function Footer({ isLightMode }) {
  return (
    <div
      className={`w-full  ${
        isLightMode ? "bg-gray" : "bg-darkBg"
      }  flex items-center justify-center`}
    >
      <h1
        className={`font-medium text-sm p-4  ${
          isLightMode ? "text-black" : "text-white"
        }`}
      >
        © Copyright 2025 Bugsfree Studio
      </h1>
    </div>
  );
}

export default Footer;
