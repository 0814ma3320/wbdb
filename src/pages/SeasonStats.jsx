import { Link } from "react-router-dom";
import { getPlayersForSeason } from "../data/playerStorage";
import {
  getViewingSeason,
  getGamesForSeason,
  getSeasonLabel,
} from "../data/seasonStorage";
import {
  calculatePlayerStats,
  formatBattingAverage,
  formatOps,
  formatThreeDecimalStat,
} from "../utils/playerStats";
import {
  getSeason1BaseTeam,
} from "../data/season1BaseStats";
export default function SeasonStats() {
  const currentSeason = getViewingSeason();

  const players = getPlayersForSeason(
    currentSeason
  ).filter(
    (player) =>
      player.teamName === "和桐バブルス"
  );

const allGames = loadGames();

const games = getGamesForSeason(
  allGames,
  currentSeason
);

const completedGames = games.filter(
  (game) =>
    Number.isFinite(Number(game?.bubblesScore)) &&
    Number.isFinite(Number(game?.opponentScore))
);

const season1BaseTeam =
  currentSeason === 1
    ? getSeason1BaseTeam()
    : { games: 0 };

const totalCompletedGames =
  completedGames.length +
  Number(season1BaseTeam.games ?? 0);

const requiredPlateAppearances = Math.floor(
  totalCompletedGames * 3.1
);

const requiredInnings =
  totalCompletedGames;

  const playerStats = calculatePlayerStats(
  games,
  players,
  currentSeason
);

  const fielders = players.filter(
    (player) => player.category === "野手"
  );

  const pitchers = players.filter(
    (player) => player.category === "投手"
  );

  const fielderStats = fielders.map((player) => ({
    ...player,
    ...playerStats[String(player.id)],
  }));

  const pitcherStats = pitchers.map((player) => ({
    ...player,
    ...playerStats[String(player.id)],
  }));

     const battingAverageRanking = sortRanking(
    fielderStats.filter(
      (player) =>
        Number(
          player.plateAppearances ?? 0
        ) >= requiredPlateAppearances &&
        Number(player.atBats ?? 0) > 0
    ),
    "battingAverage"
  );

    const onBaseRanking = sortRanking(
    fielderStats.filter(
      (player) =>
        Number(
          player.plateAppearances ?? 0
        ) >= requiredPlateAppearances &&
        Number(player.atBats ?? 0) > 0
    ),
    "onBasePercentage"
  );

  const sluggingRanking = sortRanking(
    fielderStats.filter(
      (player) =>
        Number(
          player.plateAppearances ?? 0
        ) >= requiredPlateAppearances &&
        Number(player.atBats ?? 0) > 0
    ),
    "sluggingPercentage"
  );

  const opsRanking = sortRanking(
    fielderStats.filter(
      (player) =>
        Number(
          player.plateAppearances ?? 0
        ) >= requiredPlateAppearances &&
        Number(player.atBats ?? 0) > 0
    ),
    "ops"
  );

  const hitsRanking = sortRanking(
    fielderStats,
    "hits"
  );

  const doublesRanking = sortRanking(
    fielderStats,
    "doubles"
  );

  const triplesRanking = sortRanking(
    fielderStats,
    "triples"
  );

  const homeRunsRanking = sortRanking(
    fielderStats,
    "homeRuns"
  );

  const runsBattedInRanking = sortRanking(
    fielderStats,
    "runsBattedIn"
  );

  const walksRanking = sortRanking(
    fielderStats,
    "walks"
  );
  const stolenBasesRanking = sortRanking(
  fielderStats,
  "stolenBases"
);

  const multiHitRanking = sortRanking(
    fielderStats,
    "multiHitGames"
  );

  const threeHitRanking = sortRanking(
    fielderStats,
    "threeHitGames"
  );

  const gamesRanking = sortRanking(
    fielderStats,
    "games"
  );
  const heroRanking = sortRanking(
  [...fielderStats, ...pitcherStats],
  "heroCount"
);

  const winsRanking = sortRanking(
    pitcherStats,
    "wins"
  );

  const savesRanking = sortRanking(
    pitcherStats,
    "saves"
  );

  const holdsRanking = sortRanking(
    pitcherStats,
    "holds"
  );

  const pitchingGamesRanking = sortRanking(
  pitcherStats,
  "pitchingGames"
);
const startsRanking = sortRanking(
  pitcherStats,
  "starts"
);

const winningPercentageRanking = sortRanking(
  pitcherStats.filter(
    (player) =>
      Number(player.wins ?? 0) +
        Number(player.losses ?? 0) >=
      5
  ),
  "winningPercentage"
);

const requiredK9Innings =
  totalCompletedGames / 3;

const strikeoutsPerNineRanking = sortRanking(
  pitcherStats.filter(
    (player) =>
      Number(player.inningsOuts ?? 0) >=
      requiredK9Innings * 3
  ),
  "strikeoutsPerNine"
);
  const eraRanking = sortRanking(
  pitcherStats.filter(
    (player) =>
      Number(player.inningsOuts ?? 0) >=
      requiredInnings * 3
  ),
  "era",
  "asc"
);

const whipRanking = sortRanking(
  pitcherStats.filter(
    (player) =>
      Number(player.inningsOuts ?? 0) >=
      requiredInnings * 3
  ),
  "whip",
  "asc"
);

const strikeoutsRanking = sortRanking(
  pitcherStats,
  "strikeouts"
);

const inningsRanking = sortRanking(
  pitcherStats,
  "innings"
);

  const titleHolders = [
    {
      title: "首位打者",
      icon: "🥇",
      players: getLeaders(
        battingAverageRanking,
        "battingAverage"
      ),
      value: (player) =>
        formatBattingAverage(
          player.battingAverage
        ),
    },
    {
      title: "最多安打",
      icon: "⚾",
      players: getLeaders(
        hitsRanking,
        "hits"
      ),
      value: (player) =>
        `${player.hits}安打`,
    },
    {
      title: "本塁打王",
      icon: "💥",
      players: getLeaders(
        homeRunsRanking,
        "homeRuns"
      ),
      value: (player) =>
        `${player.homeRuns}本`,
    },
    {
      title: "打点王",
      icon: "🔥",
      players: getLeaders(
        runsBattedInRanking,
        "runsBattedIn"
      ),
      value: (player) =>
        `${player.runsBattedIn}打点`,
    },
    {
  title: "盗塁王",
  icon: "⚡",
  players: getLeaders(
    stolenBasesRanking,
    "stolenBases"
  ),
  value: (player) =>
    `${player.stolenBases}盗塁`,
},
{
  title: "最多ヒーロー",
  icon: "🏆",
  players: getLeaders(
    heroRanking,
    "heroCount"
  ),
  value: (player) =>
    `${player.heroCount}回`,
},
    {
      title: "最多勝",
      icon: "🏅",
      players: getLeaders(
        winsRanking,
        "wins"
      ),
      value: (player) =>
        `${player.wins}勝`,
    },
    {
      title: "最多セーブ",
      icon: "🔒",
      players: getLeaders(
        savesRanking,
        "saves"
      ),
      value: (player) =>
        `${player.saves}S`,
    },
    {
      title: "最優秀中継ぎ",
      icon: "🛡️",
      players: getLeaders(
        holdsRanking,
        "holds"
      ),
      value: (player) =>
        `${player.holds}H`,
    },
    {
  title: "最優秀防御率",
  icon: "🧱",
  players: getLeaders(
    eraRanking,
    "era"
  ),
  value: (player) =>
    formatThreeDecimalStat(player.era),
},
{
  title: "最多奪三振",
  icon: "💨",
  players: getLeaders(
    strikeoutsRanking,
    "strikeouts"
  ),
  value: (player) =>
    `${player.strikeouts}個`,
},
{
  title: "最高WHIP",
  icon: "🎯",
  players: getLeaders(
    whipRanking,
    "whip"
  ),
  value: (player) =>
    formatThreeDecimalStat(player.whip),
},
  ];

  return (
  <div
    style={pageStyle}
    className="season-stats-page"
  >
      <div style={topAreaStyle}>
        <div>
          <h1>
  {getSeasonLabel(currentSeason)} 個人成績
</h1>

          <p style={subTitleStyle}>
            和桐バブルス シーズン成績
          </p>
        </div>

        <Link to="/" style={backLinkStyle}>
          ← ホームへ戻る
        </Link>
      </div>

      {games.length === 0 && (
        <div style={noticeStyle}>
          まだ試合データがありません。
          試合登録後に成績が表示されます。
        </div>
      )}

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          🏆 タイトルホルダー
        </h2>

        <div
  style={titleHolderGridStyle}
  className="season-title-grid"
>
          {titleHolders.map((titleHolder) => (
            <TitleHolderCard
              key={titleHolder.title}
              title={titleHolder.title}
              icon={titleHolder.icon}
              players={titleHolder.players}
              value={titleHolder.value}
            />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          野手成績
        </h2>
               <p style={qualificationTextStyle}>
  規定打席：{requiredPlateAppearances}打席
  （消化{totalCompletedGames}試合 × 3.1）
</p>

        <div
  style={rankingGridStyle}
  className="season-ranking-grid"
>
          <RankingCard
            title="打率"
            ranking={battingAverageRanking}
            value={(player) =>
              formatBattingAverage(
                player.battingAverage
              )
            }
          />

          <RankingCard
            title="安打"
            ranking={hitsRanking}
            value={(player) =>
              `${player.hits}安打`
            }
          />

          <RankingCard
            title="本塁打"
            ranking={homeRunsRanking}
            value={(player) =>
              `${player.homeRuns}本`
            }
          />

          <RankingCard
            title="打点"
            ranking={runsBattedInRanking}
            value={(player) =>
              `${player.runsBattedIn}打点`
            }
          />

          <RankingCard
            title="出場試合"
            ranking={gamesRanking}
            value={(player) =>
              `${player.games}試合`
            }
          />
          <RankingCard
  title="盗塁"
  ranking={stolenBasesRanking}
  value={(player) =>
    `${player.stolenBases}盗塁`
  }
  

/>
<RankingCard
  title="ヒーロー"
  ranking={heroRanking}
  value={(player) =>
    `${player.heroCount}回`
  }
/>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          投手成績
        </h2>
        <p style={qualificationTextStyle}>
  規定投球回：{requiredInnings}回
  （消化{totalCompletedGames}試合）
</p>

        <div
  style={rankingGridStyle}
  className="season-ranking-grid"
>
          <RankingCard
            title="勝利"
            ranking={winsRanking}
            value={(player) =>
              `${player.wins}勝`
            }
          />
          <RankingCard
  title="先発"
  ranking={startsRanking}
  value={(player) =>
    `${player.starts}先発`
  }
/>

<RankingCard
  title="勝率"
  ranking={winningPercentageRanking}
  value={(player) =>
    formatThreeDecimalStat(
      player.winningPercentage
    )
  }
/>

<RankingCard
  title="K/9"
  ranking={strikeoutsPerNineRanking}
  value={(player) =>
    Number(
      player.strikeoutsPerNine ?? 0
    ).toFixed(2)
  }
/>

          <RankingCard
            title="セーブ"
            ranking={savesRanking}
            value={(player) =>
              `${player.saves}S`
            }
          />

          <RankingCard
            title="ホールド"
            ranking={holdsRanking}
            value={(player) =>
              `${player.holds}H`
            }
          />
<RankingCard
  title="防御率"
  ranking={eraRanking}
  value={(player) =>
    formatThreeDecimalStat(player.era)
  }
/>

<RankingCard
  title="WHIP"
  ranking={whipRanking}
  value={(player) =>
    formatThreeDecimalStat(player.whip)
  }
/>

<RankingCard
  title="奪三振"
  ranking={strikeoutsRanking}
  value={(player) =>
    `${player.strikeouts}個`
  }
/>

<RankingCard
  title="投球回"
  ranking={inningsRanking}
  value={(player) =>
    `${player.innings}回`
  }
/>
          <RankingCard
  title="登板試合"
  ranking={pitchingGamesRanking}
  value={(player) =>
    `${player.pitchingGames}試合`
  }
/>
        </div>
      </section>
    </div>
  );
}

function TitleHolderCard({
  title,
  icon,
  players,
  value,
}) {
  const hasValidRecord =
    players.length > 0 &&
    hasRecordedValue(players[0], title);

  return (
    <div
  style={titleHolderGridStyle}
  
>

      <div style={titleHolderHeaderStyle}>
        <span style={titleHolderIconStyle}>
          {icon}
        </span>

        <h3 style={titleHolderTitleStyle}>
          {title}
        </h3>
      </div>

      {!hasValidRecord ? (
        <p style={titleHolderEmptyStyle}>
          記録なし
        </p>
      ) : (
        <div style={titleHolderPlayersStyle}>
          {players.map((player) => (
            <div
              key={player.id}
              style={titleHolderPlayerStyle}
            >
              <Link
                to={`/players/${player.id}`}
                style={titleHolderLinkStyle}
              >
                <span style={titleHolderNameStyle}>
                  {player.name}
                </span>

                <span style={titleHolderNumberStyle}>
                  #{player.number}
                </span>
              </Link>

              <strong style={titleHolderValueStyle}>
                {value(player)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RankingCard({
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
        <p style={emptyTextStyle}>
          記録なし
        </p>
      ) : (
        <ol style={rankingListStyle}>
          {ranking.map((player, index) => (
            <li
              key={player.id}
              style={rankingItemStyle}
            >
              <span style={rankStyle}>
                {index + 1}
              </span>

              <Link
                to={`/players/${player.id}`}
                style={playerLinkStyle}
              >
                <span style={playerNameStyle}>
                  {player.name}
                </span>

                <span style={playerNumberStyle}>
                  #{player.number}
                </span>
              </Link>

              <strong style={valueStyle}>
                {value(player)}
              </strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function sortRanking(
  players,
  statName,
  order = "desc"
) {
  return [...players].sort((playerA, playerB) => {
    const valueA = Number(
      playerA[statName] ?? 0
    );

    const valueB = Number(
      playerB[statName] ?? 0
    );

    if (valueA !== valueB) {
      return order === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    const gamesDifference =
      Number(playerB.games ?? 0) -
      Number(playerA.games ?? 0);

    if (gamesDifference !== 0) {
      return gamesDifference;
    }

    return String(playerA.name).localeCompare(
      String(playerB.name),
      "ja"
    );
  });
}

function getLeaders(ranking, statName) {
  if (ranking.length === 0) {
    return [];
  }

  const highestValue = Number(
    ranking[0][statName] ?? 0
  );

  return ranking.filter(
    (player) =>
      Number(player[statName] ?? 0) === highestValue
  );
}

function hasRecordedValue(player, title) {
  if (!player) {
    return false;
  }

  if (title === "首位打者") {
    return Number(player.atBats ?? 0) > 0;
  }

  if (title === "最多安打") {
    return Number(player.hits ?? 0) > 0;
  }

  if (title === "本塁打王") {
    return Number(player.homeRuns ?? 0) > 0;
  }

  if (title === "打点王") {
    return Number(player.runsBattedIn ?? 0) > 0;
  }
  if (title === "盗塁王") {
  return Number(player.stolenBases ?? 0) > 0;
}
if (title === "最多ヒーロー") {
  return Number(player.heroCount ?? 0) > 0;
}

  if (title === "最多勝") {
    return Number(player.wins ?? 0) > 0;
  }

  if (title === "最多セーブ") {
    return Number(player.saves ?? 0) > 0;
  }

  if (title === "最優秀中継ぎ") {
    return Number(player.holds ?? 0) > 0;
  }
  if (title === "最優秀防御率") {
  return Number(player.innings ?? 0) > 0;
}

if (title === "最多奪三振") {
  return Number(player.strikeouts ?? 0) > 0;
}

if (title === "最高WHIP") {
  return Number(player.innings ?? 0) > 0;
}

  return false;
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
  padding: "30px",
  fontFamily: "sans-serif",
};

const topAreaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const titleStyle = {
  marginBottom: 8,
};

const subTitleStyle = {
  margin: 0,
  color: "#666666",
};

const backLinkStyle = {
  color: "#0066cc",
  fontWeight: "bold",
};

const noticeStyle = {
  marginTop: 25,
  padding: 16,
  borderRadius: 8,
  backgroundColor: "#fff8e1",
  color: "#6d4c00",
  lineHeight: 1.7,
};

const sectionStyle = {
  marginTop: 32,
};

const sectionTitleStyle = {
  marginBottom: 18,
  paddingBottom: 10,
  borderBottom: "3px solid #222222",
};

const titleHolderGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 16,
};

const titleHolderCardStyle = {
  border: "1px solid #d5d5d5",
  borderRadius: 12,
  backgroundColor: "#ffffff",
  overflow: "hidden",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
};

const titleHolderHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "13px 16px",
  backgroundColor: "#222222",
  color: "#ffffff",
};

const titleHolderIconStyle = {
  fontSize: 24,
};

const titleHolderTitleStyle = {
  margin: 0,
  fontSize: 18,
};

const titleHolderPlayersStyle = {
  padding: "8px 16px",
};

const titleHolderPlayerStyle = {
  padding: "12px 0",
  borderBottom: "1px solid #eeeeee",
};

const titleHolderLinkStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  color: "#0066cc",
  textDecoration: "none",
};

const titleHolderNameStyle = {
  fontSize: 21,
  fontWeight: "bold",
};

const titleHolderNumberStyle = {
  color: "#777777",
  fontSize: 13,
};

const titleHolderValueStyle = {
  display: "block",
  marginTop: 8,
  color: "#222222",
  fontSize: 24,
  textAlign: "center",
};

const titleHolderEmptyStyle = {
  margin: 0,
  padding: 22,
  color: "#777777",
  textAlign: "center",
};

const rankingGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 20,
};

const rankingCardStyle = {
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  overflow: "hidden",
};

const rankingTitleStyle = {
  margin: 0,
  padding: "14px 18px",
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 20,
};

const rankingListStyle = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const rankingItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minHeight: 58,
  padding: "10px 14px",
  borderBottom: "1px solid #eeeeee",
};

const rankStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 32px",
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#eeeeee",
  color: "#222222",
  fontWeight: "bold",
};

const playerLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1,
  minWidth: 0,
  color: "#0066cc",
  textDecoration: "none",
};

const playerNameStyle = {
  fontWeight: "bold",
};

const playerNumberStyle = {
  color: "#777777",
  fontSize: 13,
};

const valueStyle = {
  color: "#222222",
  whiteSpace: "nowrap",
};

const emptyTextStyle = {
  margin: 0,
  padding: 20,
  color: "#777777",
  textAlign: "center",
};
const qualificationTextStyle = {
  marginTop: -8,
  marginBottom: 18,
  color: "#666666",
  fontSize: 14,
};