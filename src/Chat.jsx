import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import './App.css';

function Chat({ user }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const endOfMessagesRef = useRef(null); // Ref for the last message element

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({ ...doc.data(), id: doc.id });
      });
      
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, "messages"), {
        text: message,
        createdAt: new Date(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div >
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.uid === user.uid ? 'user' : 'other'}`}
          >
            <img
              src={msg.photoURL || "https://via.placeholder.com/40"} 
              className="profile-pic"
            />
            <div className="message-text">
              <strong>{msg.displayName}</strong>: {msg.text}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}  
        />
        <button onClick={sendMessage} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
