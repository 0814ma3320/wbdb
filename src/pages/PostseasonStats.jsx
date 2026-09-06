import { Link } from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";

import {
  getViewingSeason,
  getGamesForSeason,
  getPostseasonGames,
} from "../data/seasonStorage";

import {
  calculatePlayerStats,
  formatBattingAverage,
  formatOps,
  formatThreeDecimalStat,
} from "../utils/playerStats";

export default function PostseasonStats() {
  const currentSeason = getViewingSeason();

  const players = getPlayersForSeason(
    currentSeason
  ).filter(
    (player) =>
      player.teamName === "和桐バブルス"
  );

  const allGames = loadGames();

  const seasonGames = getGamesForSeason(
    allGames,
    currentSeason
  );

  const postseasonGames =
    getPostseasonGames(seasonGames);

  const completedGames =
    postseasonGames.filter(
      (game) =>
        Number.isFinite(
          Number(game?.bubblesScore)
        ) &&
        Number.isFinite(
          Number(game?.opponentScore)
        )
    );

  const playerStats =
    calculatePlayerStats(
      completedGames,
      players
    );
    const fielders = players.filter(
  (player) =>
    player.category === "野手"
);

const pitchers = players.filter(
  (player) =>
    player.category === "投手"
);

const fielderStats = fielders.map(
  (player) => ({
    ...player,
    ...playerStats[String(player.id)],
  })
);

const pitcherStats = pitchers.map(
  (player) => ({
    ...player,
    ...playerStats[String(player.id)],
  })
);
const battingAverageRanking = [
  ...fielderStats,
]
  .filter(
    (player) =>
      Number(player.atBats ?? 0) > 0
  )
  .sort(
    (a, b) =>
      Number(b.battingAverage ?? 0) -
      Number(a.battingAverage ?? 0)
  );

const homeRunsRanking = [
  ...fielderStats,
].sort(
  (a, b) =>
    Number(b.homeRuns ?? 0) -
    Number(a.homeRuns ?? 0)
);

const runsBattedInRanking = [
  ...fielderStats,
].sort(
  (a, b) =>
    Number(b.runsBattedIn ?? 0) -
    Number(a.runsBattedIn ?? 0)
);
const winsRanking = [
  ...pitcherStats,
].sort(
  (a, b) =>
    Number(b.wins ?? 0) -
    Number(a.wins ?? 0)
);

const eraRanking = [
  ...pitcherStats,
]
  .filter(
    (player) =>
      Number(player.inningsOuts ?? 0) > 0
  )
  .sort(
    (a, b) =>
      Number(a.era ?? 0) -
      Number(b.era ?? 0)
  );

const strikeoutsRanking = [
  ...pitcherStats,
].sort(
  (a, b) =>
    Number(b.strikeouts ?? 0) -
    Number(a.strikeouts ?? 0)
);

  return (
    <div style={pageStyle}>
      <div style={topAreaStyle}>
        <div>
          <h1>Postseason 成績</h1>

          <p>
            Season {currentSeason}
          </p>
        </div>

        <Link to="/" style={linkStyle}>
          ← ホームへ戻る
        </Link>
      </div>

      <p>
        PS試合数：
        {completedGames.length}試合
      </p>

      <section style={sectionStyle}>
  <h2>野手成績</h2>

  <RankingList
    title="打率"
    ranking={battingAverageRanking}
    value={(player) =>
      formatBattingAverage(
        player.battingAverage
      )
    }
  />

  <RankingList
    title="本塁打"
    ranking={homeRunsRanking}
    value={(player) =>
      `${player.homeRuns}本`
    }
  />

   <RankingList 
    title="打点" 
    ranking={runsBattedInRanking} 
    value={(player) => 
      `${player.runsBattedIn}打点` 
    } 
  /> 
</section>

<section style={sectionStyle}>
  <h2>投手成績</h2>

  <RankingList
    title="勝利"
    ranking={winsRanking}
    value={(player) =>
      `${player.wins}勝`
    }
  />

  <RankingList
    title="防御率"
    ranking={eraRanking}
    value={(player) =>
      formatThreeDecimalStat(
        player.era
      )
    }
  />

  <RankingList
    title="奪三振"
    ranking={strikeoutsRanking}
    value={(player) =>
      `${player.strikeouts}個`
    }
  />
</section>

    </div>
  );
}
function RankingList({
  title,
  ranking,
  value,
}) {
  return (
    <div style={rankingCardStyle}>
      <h3 style={rankingTitleStyle}>
        {title}
      </h3>

      {ranking.length === 0 ? (
        <p style={emptyStyle}>
          記録なし
        </p>
      ) : (
        <ol style={rankingListStyle}>
          {ranking.map(
            (player, index) => (
              <li
                key={player.id}
                style={rankingItemStyle}
              >
                <span>
                  {index + 1}位
                </span>

                <Link
                  to={`/players/${player.id}`}
                  style={playerLinkStyle}
                >
                  {player.name}
                </Link>

                <strong>
                  {value(player)}
                </strong>
              </li>
            )
          )}
        </ol>
      )}
    </div>
  );
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
  maxWidth: 1200,
  margin: "0 auto",
  padding: 30,
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
  fontWeight: "bold",
};
const sectionStyle = {
  marginTop: 30,
};

const rankingCardStyle = {
  marginTop: 18,
  border: "1px solid #cccccc",
  borderRadius: 10,
  overflow: "hidden",
  backgroundColor: "#ffffff",
};

const rankingTitleStyle = {
  margin: 0,
  padding: "12px 16px",
  backgroundColor: "#222222",
  color: "#ffffff",
};

const rankingListStyle = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const rankingItemStyle = {
  display: "grid",
  gridTemplateColumns: "70px 1fr auto",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  borderBottom: "1px solid #eeeeee",
};

const playerLinkStyle = {
  color: "#0066cc",
  textDecoration: "none",
  fontWeight: "bold",
};

const emptyStyle = {
  margin: 0,
  padding: 16,
  color: "#777777",
};