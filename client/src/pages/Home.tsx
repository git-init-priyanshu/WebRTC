import React from "react";

export default function Home() {
  return (
    <div className="homepage-container">
      <div className="input-container">
        <input type="email" placeholder="Enter your email id" />
        <input type="text" placeholder="Enter Room code" />
        <button>Enter Room</button>
      </div>
    </div>
  );
}
