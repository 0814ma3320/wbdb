import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  formatSeasonDate,
  isSeasonDate,
} from "../utils/seasonCalendar";
import { getCurrentSeason } from "../data/seasonStorage";

const opponents = [
  "ライオンズ",
  "ジャイアンツ",
  "イーグルス",
  "スワローズ",
  "タイガース",
  "その他",
];

export default function GameInput() {
  const navigate = useNavigate();

  const [month, setMonth] = useState(3);
  const currentSeason = getCurrentSeason();

const [bubblesInnings, setBubblesInnings] =
  useState(Array(12).fill(""));

const [opponentInnings, setOpponentInnings] =
  useState(Array(12).fill(""));

const [showExtraInnings, setShowExtraInnings] =
  useState(false);
const [day, setDay] = useState(25);
  const [opponent, setOpponent] = useState("");
  const [homeAway, setHomeAway] = useState("home");
  const [bubblesScore, setBubblesScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [error, setError] = useState("");
  const [gameType, setGameType] = useState("regular");
const visibleInningCount =
  showExtraInnings ? 12 : 9;

const calculatedBubblesScore =
  bubblesInnings
    .slice(0, visibleInningCount)
    .reduce(
      (total, score) =>
        total + Number(score || 0),
      0
    );

const calculatedOpponentScore =
  opponentInnings
    .slice(0, visibleInningCount)
    .reduce(
      (total, score) =>
        total + Number(score || 0),
      0
    );
  function handleSubmit(event) {
    event.preventDefault();

    if (!isSeasonDate(month, day)) {
  setError("正しい試合日を選択してください。");
  return;
}

    if (!opponent) {
      setError("対戦相手を選択してください。");
      return;
    }

    if (
  currentSeason === 1 &&
  (bubblesScore === "" ||
    opponentScore === "")
) {
  setError(
    "両チームの得点を入力してください。"
  );
  return;
}

    const newGame = {
  id: crypto.randomUUID(),
  season: getCurrentSeason(),

  date: `2011-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  opponent,
  gameType,
  homeAway,

  bubblesScore:
  currentSeason === 1
    ? Number(bubblesScore)
    : calculatedBubblesScore,

opponentScore:
  currentSeason === 1
    ? Number(opponentScore)
    : calculatedOpponentScore,
    inningScores:
  currentSeason === 1
    ? null
    : {
        bubbles: bubblesInnings.slice(
          0,
          visibleInningCount
        ),
        opponent: opponentInnings.slice(
          0,
          visibleInningCount
        ),
      },

  lineup: [],
  pitcherAppearances: [],
  battingStats: [],
  pitchingStats: [],

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

    let savedGames = [];

    try {
      const storedData = localStorage.getItem("games");
      savedGames = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(savedGames)) {
        savedGames = [];
      }
    } catch {
      savedGames = [];
    }

    const updatedGames = [...savedGames, newGame];

    localStorage.setItem(
      "games",
      JSON.stringify(updatedGames)
    );

    navigate("/games");
  }

  return (
    <div style={pageStyle}>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>試合登録</h1>

          <Link to="/" style={linkStyle}>
            ← ホームへ戻る
          </Link>
        </div>

        <Link to="/games" style={listButtonStyle}>
          試合一覧を見る
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={sectionTitleStyle}>基本情報</h2>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={formGroupStyle}>
          <label htmlFor="date" style={labelStyle}>
            試合日
          </label>

         <div style={dateSelectAreaStyle}>
  <select
    value={month}
    onChange={(event) => {
      setMonth(Number(event.target.value));
      setDay(1);
      setError("");
    }}
    style={inputStyle}
  >
    {[3, 4, 5, 6, 7, 8, 9, 10].map(
      (item) => (
        <option key={item} value={item}>
          {item}月
        </option>
      )
    )}
  </select>

  <select
    value={day}
    onChange={(event) => {
      setDay(Number(event.target.value));
      setError("");
    }}
    style={inputStyle}
  >
    {getDaysInMonth(month).map((item) => (
      <option key={item} value={item}>
        {item}日
      </option>
    ))}
  </select>

  <strong>
    {formatSeasonDate(
      `2011-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    )}
  </strong>
</div>
          
        </div>
<div style={formGroupStyle}>
  <label htmlFor="gameType" style={labelStyle}>
    試合区分
  </label>

  <select
    id="gameType"
    value={gameType}
    onChange={(event) => {
      setGameType(event.target.value);
      setError("");
    }}
    style={inputStyle}
  >
    <option value="regular">
      レギュラーシーズン
    </option>

    <option value="ps1st">
      PS 1st
    </option>

    <option value="psFinal">
      PS FINAL
    </option>
  </select>
</div>
        <div style={formGroupStyle}>
          <label htmlFor="opponent" style={labelStyle}>
            対戦相手
          </label>

          <select
            id="opponent"
            value={opponent}
            onChange={(event) => {
              setOpponent(event.target.value);
              setError("");
            }}
            style={inputStyle}
          >
            <option value="">
              選択してください
            </option>

            {opponents.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <span style={labelStyle}>
            ホーム・ビジター
          </span>

          <div style={radioAreaStyle}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="homeAway"
                value="home"
                checked={homeAway === "home"}
                onChange={(event) =>
                  setHomeAway(event.target.value)
                }
              />
              ホーム
            </label>

            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="homeAway"
                value="visitor"
                checked={homeAway === "visitor"}
                onChange={(event) =>
                  setHomeAway(event.target.value)
                }
              />
              ビジター
            </label>
          </div>
        </div>
        {currentSeason >= 2 && (
  <div style={formGroupStyle}>
    <h3>イニング別スコア</h3>

    <div style={inningTableStyle}>
      <div style={inningRowStyle}>
        <strong>回</strong>

        {Array.from(
          {
            length: showExtraInnings ? 12 : 9,
          },
          (_, index) => (
            <strong key={index}>
              {index + 1}
            </strong>
          )
        )}
      </div>

      <div style={inningRowStyle}>
        <strong>バブルス</strong>

        {bubblesInnings
          .slice(
            0,
            showExtraInnings ? 12 : 9
          )
          .map((score, index) => (
            <input
              key={index}
              type="number"
              min="0"
              value={score}
              onChange={(event) => {
                const next = [
                  ...bubblesInnings,
                ];

                next[index] =
                  event.target.value;

                setBubblesInnings(next);
              }}
              style={inningInputStyle}
            />
          ))}
      </div>

      <div style={inningRowStyle}>
        <strong>
          {opponent || "対戦相手"}
        </strong>

        {opponentInnings
          .slice(
            0,
            showExtraInnings ? 12 : 9
          )
          .map((score, index) => (
            <input
              key={index}
              type="number"
              min="0"
              value={score}
              onChange={(event) => {
                const next = [
                  ...opponentInnings,
                ];

                next[index] =
                  event.target.value;

                setOpponentInnings(next);
              }}
              style={inningInputStyle}
            />
          ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setShowExtraInnings(
            !showExtraInnings
          )
        }
        style={extraInningButtonStyle}
      >
        {showExtraInnings
          ? "延長入力を閉じる"
          : "延長10〜12回を入力"}
      </button>
    </div>
  </div>
)}

        {currentSeason === 1 && (
  <div style={scoreAreaStyle}>
    <div style={scoreTeamStyle}>
      <label
        htmlFor="bubblesScore"
        style={labelStyle}
      >
        バブルス
      </label>

      <input
        id="bubblesScore"
        type="number"
        min="0"
        value={bubblesScore}
        onChange={(event) => {
          setBubblesScore(event.target.value);
          setError("");
        }}
        style={scoreInputStyle}
      />
    </div>

    <div style={scoreSeparatorStyle}>
      －
    </div>

    <div style={scoreTeamStyle}>
      <label
        htmlFor="opponentScore"
        style={labelStyle}
      >
        {opponent || "対戦相手"}
      </label>

      <input
        id="opponentScore"
        type="number"
        min="0"
        value={opponentScore}
        onChange={(event) => {
          setOpponentScore(event.target.value);
          setError("");
        }}
        style={scoreInputStyle}
      />
    </div>
  </div>
)}

        <ResultPreview
  bubblesScore={
    currentSeason === 1
      ? bubblesScore
      : calculatedBubblesScore
  }
  opponentScore={
    currentSeason === 1
      ? opponentScore
      : calculatedOpponentScore
  }
/>

        <button type="submit" style={saveButtonStyle}>
          試合を保存
        </button>
      </form>
    </div>
  );
}
function getDaysInMonth(month) {
  const daysInMonth = {
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
  };

  const count = daysInMonth[month] ?? 31;

  return Array.from(
    { length: count },
    (_, index) => index + 1
  );
}
function ResultPreview({
  bubblesScore,
  opponentScore,
}) {
  if (
    bubblesScore === "" ||
    opponentScore === ""
  ) {
    return null;
  }

  const bubbles = Number(bubblesScore);
  const opponent = Number(opponentScore);

  let result = "引き分け";
  let symbol = "△";

  if (bubbles > opponent) {
    result = "バブルスの勝利";
    symbol = "○";
  }

  if (bubbles < opponent) {
    result = "バブルスの敗戦";
    symbol = "●";
  }

  return (
    <div style={previewStyle}>
      <span style={previewSymbolStyle}>
        {symbol}
      </span>

      <strong>{result}</strong>
    </div>
  );
}

const pageStyle = {
  padding: 30,
  maxWidth: 900,
  margin: "0 auto",
  fontFamily: "sans-serif",
};

const topAreaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const linkStyle = {
  color: "#0066cc",
};

const listButtonStyle = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1px solid #222",
  borderRadius: 8,
  color: "#222",
  textDecoration: "none",
  fontWeight: "bold",
};

const formStyle = {
  marginTop: 30,
  padding: 30,
  border: "1px solid #bbb",
  borderRadius: 12,
  backgroundColor: "#fff",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 25,
};

const formGroupStyle = {
  marginBottom: 24,
};
const dateSelectAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontWeight: "bold",
};

const inputStyle = {
  boxSizing: "border-box",
  width: "100%",
  padding: 12,
  border: "1px solid #aaa",
  borderRadius: 6,
  fontSize: 16,
};

const radioAreaStyle = {
  display: "flex",
  gap: 25,
  flexWrap: "wrap",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};
const inningTableStyle = {
  overflowX: "auto",
};

const inningRowStyle = {
  display: "grid",
  gridTemplateColumns:
    "90px repeat(12, 60px)",
  gap: 8,
  alignItems: "center",
  marginBottom: 8,
};

const inningInputStyle = {
  width: 60,
  boxSizing: "border-box",
  padding: 8,
  border: "1px solid #aaaaaa",
  borderRadius: 6,
  textAlign: "center",
  fontSize: 16,
};

const extraInningButtonStyle = {
  marginTop: 10,
  padding: "10px 14px",
  border: "1px solid #222222",
  borderRadius: 6,
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontWeight: "bold",
};
const scoreAreaStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 20,
  marginTop: 35,
  marginBottom: 25,
  flexWrap: "wrap",
};

const scoreTeamStyle = {
  width: 180,
  textAlign: "center",
};

const scoreInputStyle = {
  boxSizing: "border-box",
  width: "100%",
  padding: 12,
  border: "1px solid #888",
  borderRadius: 6,
  fontSize: 28,
  fontWeight: "bold",
  textAlign: "center",
};

const scoreSeparatorStyle = {
  paddingBottom: 8,
  fontSize: 30,
  fontWeight: "bold",
};

const previewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 12,
  marginBottom: 25,
  padding: 15,
  backgroundColor: "#f2f2f2",
  borderRadius: 8,
  fontSize: 18,
};

const previewSymbolStyle = {
  fontSize: 28,
  fontWeight: "bold",
};

const saveButtonStyle = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222",
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
};

const errorStyle = {
  marginBottom: 20,
  padding: 14,
  border: "1px solid #d32f2f",
  borderRadius: 6,
  backgroundColor: "#ffebee",
  color: "#b71c1c",
  fontWeight: "bold",
};