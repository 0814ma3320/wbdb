import { Link } from "react-router-dom";
import {
  getViewingSeason,
  getGamesForSeason,
  getRegularSeasonGames,
  getPostseasonGames,
} from "../data/seasonStorage";

export default function LineupStats() {
  const season = getViewingSeason();

  const allGames = loadGames();

  const seasonGames = getGamesForSeason(
    allGames,
    season
  );

  const targetGames = seasonGames.filter(
    (game) =>
      game.lineupStatsEnabled === true &&
      Array.isArray(game.lineup) &&
      game.lineup.length > 0
  );

  const regularGames =
    getRegularSeasonGames(targetGames);

  const postseasonGames =
    getPostseasonGames(targetGames);
const battingOrderStats =
  createBattingOrderStats(regularGames);
  const positionStats =
  createPositionStats(regularGames);
  const postseasonBattingOrderStats =
  createBattingOrderStats(postseasonGames);

const postseasonPositionStats =
  createPositionStats(postseasonGames);
  return (
    <div style={pageStyle}>
      <h1>スタメン集計</h1>

      <p>
        <Link to="/">← ホームへ戻る</Link>
      </p>

      <p>
        Season {season}
      </p>

      <p>
        レギュラーシーズン：
        {regularGames.length}試合
      </p>
      <h2>打順別スタメン</h2>

{Array.from({ length: 9 }, (_, index) => {
  const order = index + 1;

  const ranking = Object.values(
    battingOrderStats[order] ?? {}
  )
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return (
    <div key={order}>
      <h3>{order}番</h3>

      {ranking.length === 0 ? (
        <p>データなし</p>
      ) : (
        <ol>
          {ranking.map((player) => (
            <li key={player.playerId}>
              {player.playerName}：
              {player.games}試合
            </li>
          ))}
        </ol>
      )}
    </div>
  );
})}
<h2>守備位置別スタメン</h2>

{[
  ["捕", "捕手"],
  ["一", "一塁手"],
  ["二", "二塁手"],
  ["三", "三塁手"],
  ["遊", "遊撃手"],
  ["左", "左翼手"],
  ["中", "中堅手"],
  ["右", "右翼手"],
  ["指", "指名打者"],
].map(([position, label]) => {
  const ranking = Object.values(
    positionStats[position] ?? {}
  )
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return (
    <div key={position}>
      <h3>{label}</h3>

      {ranking.length === 0 ? (
        <p>データなし</p>
      ) : (
        <ol>
          {ranking.map((player) => (
            <li key={player.playerId}>
              {player.playerName}：
              {player.games}試合
            </li>
          ))}
        </ol>
      )}
    </div>
  );
})}

      <p>
        Postseason：
        {postseasonGames.length}試合
      </p>
      <h2>Postseason 打順別スタメン</h2>

{Array.from({ length: 9 }, (_, index) => {
  const order = index + 1;

  const ranking = Object.values(
    postseasonBattingOrderStats[order] ?? {}
  )
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return (
    <div key={`ps-order-${order}`}>
      <h3>{order}番</h3>

      {ranking.length === 0 ? (
        <p>データなし</p>
      ) : (
        <ol>
          {ranking.map((player) => (
            <li key={player.playerId}>
              {player.playerName}：
              {player.games}試合
            </li>
          ))}
        </ol>
      )}
    </div>
  );
  <h2>Postseason 守備位置別スタメン</h2>

{[
  ["捕", "捕手"],
  ["一", "一塁手"],
  ["二", "二塁手"],
  ["三", "三塁手"],
  ["遊", "遊撃手"],
  ["左", "左翼手"],
  ["中", "中堅手"],
  ["右", "右翼手"],
  ["指", "指名打者"],
].map(([position, label]) => {
  const ranking = Object.values(
    postseasonPositionStats[position] ?? {}
  )
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return (
    <div key={`ps-position-${position}`}>
      <h3>{label}</h3>

      {ranking.length === 0 ? (
        <p>データなし</p>
      ) : (
        <ol>
          {ranking.map((player) => (
            <li key={player.playerId}>
              {player.playerName}：
              {player.games}試合
            </li>
          ))}
        </ol>
      )}
    </div>
  );
})}
})}
    </div>
  );
}
function createBattingOrderStats(games) {
  const counts = {};

  games.forEach((game) => {
    game.lineup.forEach((row) => {
      const order = Number(row.battingOrder);
      const playerId = String(row.playerId);
      const playerName = row.playerName;

      if (!counts[order]) {
        counts[order] = {};
      }

      if (!counts[order][playerId]) {
        counts[order][playerId] = {
          playerId,
          playerName,
          games: 0,
        };
      }

      counts[order][playerId].games += 1;
    });
  });

  return counts;
}
function createPositionStats(games) {
  const counts = {};

  games.forEach((game) => {
    game.lineup.forEach((row) => {
      const position = row.position;
      const playerId = String(row.playerId);
      const playerName = row.playerName;

      if (!position) {
        return;
      }

      if (!counts[position]) {
        counts[position] = {};
      }

      if (!counts[position][playerId]) {
        counts[position][playerId] = {
          playerId,
          playerName,
          games: 0,
        };
      }

      counts[position][playerId].games += 1;
    });
  });

  return counts;
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

const pageStyle = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: 30,
  fontFamily: "sans-serif",
};