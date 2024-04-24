import './App.css';
import { useEffect, useState } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:4000");
console.log("socket: ", socket);

socket.on("event-b", () => {
  console.log("event-b");
})

socket.on("signal", () => {
  console.log("get signal");
})

function App() {
  const [messages, setMessages] = useState([]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const message = ev.target.message.value;

    if (message.length === 0) return;

    const data = { id: socket.id, message: message };
    socket.emit("message", data, (response) => {
      if (response.status === 200) {
        setMessages((state) =>
          [...state, data]
        )
      }
    });

    ev.target.message.value = "";
  };

  const handleMessage = (data) => {
    console.log("get message: ", data);
    setMessages((state) => [...state, data]);
  }

  useEffect(() => {
    socket.emit("join");
    socket.on("message", handleMessage);
  }, []);

  return (
    <div className="App">
      <button onClick={() => {
        socket.emit("signal");
      }}>Emit</button>

      <form onSubmit={handleSubmit}>
        <input id="message" placeholder='메세지를 입력해 주세요'></input>
        <button>전송</button>
      </form>

      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
        {messages.length > 0 && messages.map((message, index) =>
          <div key={"message_" + index} style={{ display: "flex", gap: 8, justifyContent: socket.id == message.id ? "flex-end" : "flex-start", padding: 12}}>
            {socket.id !== message.id && <div>{message.id}</div>}
            <div>{message.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
