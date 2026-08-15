import { useState } from "react";
import { Link } from "react-router-dom";
import { formatSeasonDate } from "../utils/seasonCalendar";
import {
  getViewingSeason,
  getGamesForSeason,
  getSeasonLabel,
} from "../data/seasonStorage";
export default function GameList() {
  const currentSeason = getViewingSeason();

  const [allGames, setAllGames] =
    useState(() => loadGames());

  const games = getGamesForSeason(
    allGames,
    currentSeason
  );

  function handleDeleteGame(gameId) {
    const confirmed = window.confirm(
      "この試合を削除しますか？\n\n削除すると、この試合の打撃成績・投手成績なども集計対象から外れます。"
    );

    if (!confirmed) {
      return;
    }

    const updatedGames =
      allGames.filter(
        (game) =>
          String(game.id) !==
          String(gameId)
      );

    localStorage.setItem(
      "games",
      JSON.stringify(updatedGames)
    );

    setAllGames(updatedGames);
  }

  const sortedGames = [...games].sort(
  (a, b) =>
    getSeasonDateNumber(b.date) -
    getSeasonDateNumber(a.date)
);

  return (
    <div
  style={pageStyle}
  className="game-list-page"
>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
  {getSeasonLabel(currentSeason)} 試合一覧
</h1>

          <Link to="/" style={linkStyle}>
            ← ホームへ戻る
          </Link>
        </div>

        <Link
          to="/game"
          style={registerButtonStyle}
        >
          ＋ 試合を登録
        </Link>
      </div>

      <div style={summaryStyle}>
        登録試合数：
        <strong>{sortedGames.length}試合</strong>
      </div>

      {sortedGames.length === 0 ? (
        <div style={emptyStyle}>
          <h2>
            登録されている試合はありません
          </h2>

          <p>
            「試合を登録」から最初の試合を
            入力しましょう。
          </p>

          <Link
            to="/game"
            style={emptyButtonStyle}
          >
            試合登録へ進む
          </Link>
        </div>
      ) : (
        <div style={gameListStyle}>
         {sortedGames.map((game) => (
  <GameCard
    key={game.id}
    game={game}
    onDelete={handleDeleteGame}
  />
))}
        </div>
      )}
    </div>
  );
}

function GameCard({
  game,
  onDelete,
}) {
  const result = getResult(game);

  return (
   <div
  style={cardStyle}
  className="game-card"
>
      <div style={dateStyle}>
        {formatSeasonDate(game.date)}
      </div>

      <div
  style={gameMainStyle}
  className="game-card-main"
>
        <div style={resultStyle(result)}>
          {result}
        </div>

        <div style={opponentStyle}>
          VS {game.opponent}
        </div>

        <div style={scoreStyle}>
          {game.bubblesScore}
          <span style={hyphenStyle}>
            －
          </span>
          {game.opponentScore}
        </div>

        <div style={placeStyle}>
          {game.homeAway === "home"
            ? "ホーム"
            : "ビジター"}
        </div>

        <Link
          to={`/games/${game.id}`}
          style={detailButtonStyle}
        >
          詳細を見る →
        </Link>

        <button
          type="button"
          onClick={() =>
            onDelete(game.id)
          }
          style={deleteButtonStyle}
        >
          削除
        </button>
      </div>
    </div>
  );
}

function getSeasonDateNumber(dateText) {
  if (!dateText) {
    return 0;
  }

  const parts = String(dateText).split("-");

  const month =
    parts.length === 3
      ? Number(parts[1])
      : Number(parts[0]);

  const day =
    parts.length === 3
      ? Number(parts[2])
      : Number(parts[1]);

  return month * 100 + day;
}
function loadGames() {
  try {
    const storedData =
      localStorage.getItem("games");

    const parsedData = storedData
      ? JSON.parse(storedData)
      : [];

    return Array.isArray(parsedData)
      ? parsedData
      : [];
  } catch {
    return [];
  }
}

function getResult(game) {
  const bubblesScore = Number(
    game.bubblesScore
  );

  const opponentScore = Number(
    game.opponentScore
  );

  if (bubblesScore > opponentScore) {
    return "○";
  }

  if (bubblesScore < opponentScore) {
    return "●";
  }

  return "△";
}



function resultStyle(result) {
  return {
    width: 42,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color:
      result === "○"
        ? "#d32f2f"
        : result === "●"
        ? "#1565c0"
        : "#555555",
  };
}

const pageStyle = {
  padding: 30,
  maxWidth: 1000,
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

const registerButtonStyle = {
  display: "inline-block",
  padding: "12px 20px",
  backgroundColor: "#222222",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: 8,
  fontWeight: "bold",
};

const summaryStyle = {
  marginTop: 30,
  padding: 16,
  backgroundColor: "#f2f2f2",
  borderRadius: 8,
};

const emptyStyle = {
  marginTop: 30,
  padding: 40,
  border: "1px solid #cccccc",
  borderRadius: 10,
  textAlign: "center",
  backgroundColor: "#ffffff",
};

const emptyButtonStyle = {
  display: "inline-block",
  marginTop: 15,
  padding: "12px 22px",
  backgroundColor: "#0066cc",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: 8,
  fontWeight: "bold",
};

const gameListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 30,
};



const cardStyle = {
  padding: 20,
  border: "1px solid #bbbbbb",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  cursor: "pointer",
};

const dateStyle = {
  marginBottom: 15,
  fontWeight: "bold",
  color: "#555555",
};

const gameMainStyle = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const opponentStyle = {
  minWidth: 180,
  fontSize: 18,
  fontWeight: "bold",
};

const scoreStyle = {
  minWidth: 130,
  fontSize: 28,
  fontWeight: "bold",
  textAlign: "center",
};

const hyphenStyle = {
  margin: "0 15px",
};

const placeStyle = {
  padding: "6px 12px",
  backgroundColor: "#eeeeee",
  borderRadius: 20,
  fontSize: 14,
};


const detailButtonStyle = {
  marginLeft: "auto",
  color: "#0066cc",
  fontWeight: "bold",
  textDecoration: "none",
};

const deleteButtonStyle = {
  padding: "8px 14px",
  border: "none",
  borderRadius: 6,
  backgroundColor: "#d32f2f",
  color: "#ffffff",
  fontWeight: "bold",
  cursor: "pointer",
};