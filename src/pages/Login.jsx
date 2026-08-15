import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [message, setMessage] =
    useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("ログイン中...");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setMessage(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      );
      return;
    }

    setMessage("");
    navigate("/");
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          和桐バブルス
        </h1>

        <p style={descriptionStyle}>
          データ管理サイトにログイン
        </p>

        <form onSubmit={handleLogin}>
          <label style={labelStyle}>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              style={inputStyle}
              required
            />
          </label>

          <button
            type="submit"
            style={buttonStyle}
          >
            ログイン
          </button>
        </form>

        {message && (
          <p style={messageStyle}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  boxSizing: "border-box",
  fontFamily: "sans-serif",
};

const cardStyle = {
  width: "100%",
  maxWidth: 420,
  padding: 30,
  border: "1px solid #cccccc",
  borderRadius: 12,
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const titleStyle = {
  marginTop: 0,
  marginBottom: 8,
  textAlign: "center",
  color: "#222222",
};

const descriptionStyle = {
  marginBottom: 25,
  textAlign: "center",
  color: "#666666",
};

const labelStyle = {
  display: "block",
  marginBottom: 18,
  color: "#222222",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  marginTop: 7,
  padding: 12,
  border: "1px solid #999999",
  borderRadius: 7,
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
  color: "#222222",
  fontSize: 16,
};

const buttonStyle = {
  width: "100%",
  padding: 13,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 17,
  fontWeight: "bold",
  cursor: "pointer",
};

const messageStyle = {
  marginTop: 18,
  textAlign: "center",
  color: "#b00020",
};