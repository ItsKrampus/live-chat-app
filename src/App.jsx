import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Chat from "./Chat";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {user ? (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat App</h2>
            <button className="logout-btn" onClick={logout}>
              X
            </button>
          </div>
          <Chat user={user} />
        </div>
      ) : (
        <div className="login-container">
          <h1>Welcome to the chat app!</h1>
          <button onClick={login} className="login-btn">
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
