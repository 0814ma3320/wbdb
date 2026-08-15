import {
  Link,
  useParams,
} from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";
import {
  getViewingSeason,
  getGamesForSeason,
} from "../data/seasonStorage";
import {
  formatBattingAverage,
  formatOps,
  formatThreeDecimalStat,
  getPlayerStats,
  getRecentBattingStats,
  getRecentPitchingStats,
  getRecentBattingGameLogs,
  getRecentPitchingGameLogs,
} from "../utils/playerStats";

export default function PlayerDetail() {
  const { playerId } = useParams();

  const currentSeason = getViewingSeason();

  const players = getPlayersForSeason(
    currentSeason
  ).filter(
    (player) =>
      player.teamName === "和桐バブルス"
  );

  const player = players.find(
    (item) =>
      String(item.id) === String(playerId) ||
      String(item.number) === String(playerId)
  );

  if (!player) {
    return (
      <div
  style={pageStyle}
  className="player-detail-page"
>
        <h1>選手が見つかりません</h1>

        <Link
          to="/players"
          style={linkStyle}
        >
          ← 選手名鑑へ戻る
        </Link>
      </div>
    );
  }

  

const allGames = loadGames();

const games = getGamesForSeason(
  allGames,
  currentSeason
);

const stats = getPlayerStats(
  games,
  player,
  currentSeason
);

const recentBattingStats =
  getRecentBattingStats(
    games,
    player,
    5
  );

const recentPitchingStats =
  getRecentPitchingStats(
    games,
    player,
    5
  );

const recentBattingLogs =
  getRecentBattingGameLogs(
    games,
    player,
    5
  );

const recentPitchingLogs =
  getRecentPitchingGameLogs(
    games,
    player,
    5
  );

const isPitcher =
  player.category === "投手";

  return (
    <div
  style={pageStyle}
  className="player-detail-page"
>
      <p>
        <Link
          to="/players"
          style={linkStyle}
        >
          ← 選手名鑑へ戻る
        </Link>
      </p>

      <h1>
        背番号 {player.number}　
        {player.name}
      </h1>

      <table style={profileTableStyle}>
        <tbody>
          <tr>
            <th style={profileHeaderStyle}>
              {isPitcher
                ? "役割"
                : "守備区分"}
            </th>

            <td style={profileCellStyle}>
              {player.position}
            </td>
          </tr>

          <tr>
            <th style={profileHeaderStyle}>
              {isPitcher
                ? "利き手"
                : "投打"}
            </th>

            <td style={profileCellStyle}>
              {isPitcher
                ? player.throws
                : player.throwsBats}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={sectionTitleStyle}>
  Season {currentSeason} 成績
</h2>

      {isPitcher ? (
  <PitchingStats
    stats={stats}
    recentStats={recentPitchingStats}
    recentLogs={recentPitchingLogs}
  />
) : (
  <BattingStats
    stats={stats}
    recentStats={recentBattingStats}
    recentLogs={recentBattingLogs}
  />
)}
    </div>
  );
}

function PitchingStats({
  stats,
  recentStats,
  recentLogs,
}) {
  const mainStats = [
  {
    label: "登板",
    value: stats.pitchingGames,
  },
  {
    label: "先発",
    value: stats.starts,
  },
  {
    label: "勝",
    value: stats.wins,
  },
  {
    label: "敗",
    value: stats.losses,
  },
  {
    label: "勝率",
    value: formatThreeDecimalStat(
      stats.winningPercentage
    ),
  },
  {
    label: "S",
    value: stats.saves,
  },
  {
    label: "H",
    value: stats.holds,
  },
  {
    label: "防御率",
    value: formatTwoDecimal(stats.era),
  },
  {
    label: "WHIP",
    value: formatTwoDecimal(stats.whip),
  },
  {
    label: "K/9",
    value: formatTwoDecimal(
      stats.strikeoutsPerNine
    ),
  },
  {
    label: "ヒーロー",
    value: stats.heroCount,
  },
];

  const pitchingTotals = [
    {
      label: "投球回",
      value: stats.innings,
    },
    {
      label: "被安打",
      value: stats.hitsAllowed,
    },
    {
      label: "被本塁打",
      value: stats.homeRunsAllowed,
    },
    {
      label: "奪三振",
      value: stats.strikeouts,
    },
    {
      label: "与四球",
      value: stats.walksAllowed,
    },
    {
      label: "与死球",
      value: stats.hitBatters,
    },
    {
      label: "失点",
      value: stats.runsAllowed,
    },
    {
      label: "自責点",
      value: stats.earnedRuns,
    },
  ];
  const recentPitchingItems = [
  {
    label: "登板",
    value: recentStats.appearances,
  },
  {
    label: "先発",
    value: recentStats.starts,
  },
  {
    label: "勝",
    value: recentStats.wins,
  },
  {
    label: "敗",
    value: recentStats.losses,
  },
  {
    label: "S",
    value: recentStats.saves,
  },
  {
    label: "H",
    value: recentStats.holds,
  },
  {
    label: "投球回",
    value: recentStats.innings,
  },
  {
    label: "被安打",
    value: recentStats.hitsAllowed,
  },
  {
    label: "被本塁打",
    value: recentStats.homeRunsAllowed,
  },
  {
    label: "奪三振",
    value: recentStats.strikeouts,
  },
  {
    label: "与四球",
    value: recentStats.walksAllowed,
  },
  {
    label: "与死球",
    value: recentStats.hitBatters,
  },
  {
    label: "失点",
    value: recentStats.runsAllowed,
  },
  {
    label: "自責点",
    value: recentStats.earnedRuns,
  },
  {
    label: "防御率",
    value: formatTwoDecimal(
      recentStats.era
    ),
  },
  {
    label: "WHIP",
    value: formatTwoDecimal(
      recentStats.whip
    ),
  },
  {
    label: "K/9",
    value: formatTwoDecimal(
      recentStats.strikeoutsPerNine
    ),
  },
];

  return (
    <div>
      <StatSection
        title="主要成績"
        items={mainStats}
      />

      <StatSection
        title="投球内容"
        items={pitchingTotals}
      />
<StatSection
  title="直近5登板"
  items={recentPitchingItems}
/>
<RecentPitchingLogTable
  logs={recentLogs}
/>
      <p style={noteStyle}>
        防御率は自責点×9÷投球回、
        WHIPは（被安打＋与四球）÷投球回で
        自動計算しています。
      </p>
    </div>
  );
}

function BattingStats({
  stats,
  recentStats,
  recentLogs,
}) {
  const mainStats = [
    {
      label: "試合",
      value: stats.games,
    },
    {
      label: "打率",
      value: formatBattingAverage(
        stats.battingAverage
      ),
    },
    {
      label: "出塁率",
      value: formatThreeDecimalStat(
        stats.onBasePercentage
      ),
    },
    {
      label: "長打率",
      value: formatThreeDecimalStat(
        stats.sluggingPercentage
      ),
    },
    {
      label: "OPS",
      value: formatOps(stats.ops),
    },
  ];

  const battingTotals = [
    {
  label: "打席",
  value: stats.plateAppearances,
},
    {
      label: "打数",
      value: stats.atBats,
    },
    {
      label: "安打",
      value: stats.hits,
    },
    {
      label: "単打",
      value: stats.singles,
    },
    {
      label: "二塁打",
      value: stats.doubles,
    },
    {
      label: "三塁打",
      value: stats.triples,
    },
    {
      label: "本塁打",
      value: stats.homeRuns,
    },
    {
      label: "塁打",
      value: stats.totalBases,
    },
  ];

  const plateDisciplineStats = [
    {
      label: "打点",
      value: stats.runsBattedIn,
    },
    {
      label: "四球",
      value: stats.walks,
    },
    {
      label: "死球",
      value: stats.hitByPitch,
    },
    {
      label: "犠飛",
      value: stats.sacrificeFlies,
    },
  ];

    const gameAchievementStats = [
    {
      label: "マルチ安打",
      value: stats.multiHitGames,
    },
    {
      label: "猛打賞",
      value: stats.threeHitGames,
    },
    {
      label: "ヒーロー",
      value: stats.heroCount,
    },
    
  ];
  const recentBattingItems = [
  {
    label: "試合",
    value: recentStats.games,
  },
  {
    label: "打席",
    value: recentStats.plateAppearances,
  },
  {
    label: "打数",
    value: recentStats.atBats,
  },
  {
    label: "安打",
    value: recentStats.hits,
  },
  {
    label: "二塁打",
    value: recentStats.doubles,
  },
  {
    label: "三塁打",
    value: recentStats.triples,
  },
  {
    label: "本塁打",
    value: recentStats.homeRuns,
  },
  {
    label: "打点",
    value: recentStats.runsBattedIn,
  },
  {
    label: "四球",
    value: recentStats.walks,
  },
  {
    label: "盗塁",
    value: recentStats.stolenBases,
  },
  {
    label: "打率",
    value: formatBattingAverage(
      recentStats.battingAverage
    ),
  },
  {
    label: "出塁率",
    value: formatThreeDecimalStat(
      recentStats.onBasePercentage
    ),
  },
  {
    label: "長打率",
    value: formatThreeDecimalStat(
      recentStats.sluggingPercentage
    ),
  },
  {
    label: "OPS",
    value: formatOps(recentStats.ops),
  },
];

  return (
    <div>
      <StatSection
        title="主要成績"
        items={mainStats}
      />

      <StatSection
        title="安打・塁打"
        items={battingTotals}
      />

      <StatSection
        title="打点・出塁"
        items={plateDisciplineStats}
      />

      <StatSection
        title="試合記録"
        items={gameAchievementStats}
      />
<StatSection
  title="直近5試合"
  items={recentBattingItems}
/>
<RecentBattingLogTable
  logs={recentLogs}
/>

      <p style={noteStyle}>
        マルチ安打は1試合2安打以上、
        猛打賞は1試合3安打以上として
        集計します。
      </p>
    </div>
  );
}
function RecentBattingLogTable({ logs }) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return null;
  }

  return (
    <section style={statSectionStyle}>
      <h3 style={statSectionTitleStyle}>
        直近5試合 明細
      </h3>

      <div
  style={statsTableWrapperStyle}
  className="player-stats-scroll"
>
        <table style={dynamicStatsTableStyle}>
          <thead>
            <tr>
              <th style={statsHeaderStyle}>日付</th>
              <th style={statsHeaderStyle}>相手</th>
              <th style={statsHeaderStyle}>打席</th>
              <th style={statsHeaderStyle}>打数</th>
              <th style={statsHeaderStyle}>安打</th>
              <th style={statsHeaderStyle}>二塁打</th>
              <th style={statsHeaderStyle}>三塁打</th>
              <th style={statsHeaderStyle}>本塁打</th>
              <th style={statsHeaderStyle}>打点</th>
              <th style={statsHeaderStyle}>打率</th>
              <th style={statsHeaderStyle}>OPS</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.gameId}>
                <td style={statsCellStyle}>
                  {formatSimpleDate(log.date)}
                </td>

                <td style={statsCellStyle}>
                  {log.opponent}
                </td>

                <td style={statsCellStyle}>
                  {log.plateAppearances}
                </td>

                <td style={statsCellStyle}>
                  {log.atBats}
                </td>

                <td style={statsCellStyle}>
                  {log.hits}
                </td>

                <td style={statsCellStyle}>
                  {log.doubles}
                </td>

                <td style={statsCellStyle}>
                  {log.triples}
                </td>

                <td style={statsCellStyle}>
                  {log.homeRuns}
                </td>

                <td style={statsCellStyle}>
                  {log.runsBattedIn}
                </td>

                <td style={statsCellStyle}>
                  {formatBattingAverage(
                    log.battingAverage
                  )}
                </td>

                <td style={statsCellStyle}>
                  {formatOps(log.ops)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecentPitchingLogTable({ logs }) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return null;
  }

  return (
    <section style={statSectionStyle}>
      <h3 style={statSectionTitleStyle}>
        直近5登板 明細
      </h3>

      <div
  style={statsTableWrapperStyle}
  className="player-stats-scroll"
>
        <table style={dynamicStatsTableStyle}>
          <thead>
            <tr>
              <th style={statsHeaderStyle}>日付</th>
              <th style={statsHeaderStyle}>相手</th>
              <th style={statsHeaderStyle}>結果</th>
              <th style={statsHeaderStyle}>投球回</th>
              <th style={statsHeaderStyle}>被安打</th>
              <th style={statsHeaderStyle}>被本塁打</th>
              <th style={statsHeaderStyle}>奪三振</th>
              <th style={statsHeaderStyle}>与四球</th>
              <th style={statsHeaderStyle}>失点</th>
              <th style={statsHeaderStyle}>自責点</th>
              <th style={statsHeaderStyle}>防御率</th>
              <th style={statsHeaderStyle}>WHIP</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.gameId}>
                <td style={statsCellStyle}>
                  {formatSimpleDate(log.date)}
                </td>

                <td style={statsCellStyle}>
                  {log.opponent}
                </td>

                <td style={statsCellStyle}>
                  {log.decision || "-"}
                </td>

                <td style={statsCellStyle}>
                  {log.innings}
                </td>

                <td style={statsCellStyle}>
                  {log.hitsAllowed}
                </td>

                <td style={statsCellStyle}>
                  {log.homeRunsAllowed}
                </td>

                <td style={statsCellStyle}>
                  {log.strikeouts}
                </td>

                <td style={statsCellStyle}>
                  {log.walksAllowed}
                </td>

                <td style={statsCellStyle}>
                  {log.runsAllowed}
                </td>

                <td style={statsCellStyle}>
                  {log.earnedRuns}
                </td>

                <td style={statsCellStyle}>
                  {formatTwoDecimal(log.era)}
                </td>

                <td style={statsCellStyle}>
                  {formatTwoDecimal(log.whip)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function StatSection({
  title,
  items,
}) {
  return (
    <section style={statSectionStyle}>
      <h3 style={statSectionTitleStyle}>
        {title}
      </h3>

      <div
  style={statsTableWrapperStyle}
  className="player-stats-scroll"
>
        <table style={dynamicStatsTableStyle}>
          <thead>
            <tr>
              {items.map((item) => (
                <th
                  key={item.label}
                  style={statsHeaderStyle}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {items.map((item) => (
                <td
                  key={item.label}
                  style={statsCellStyle}
                >
                  {item.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
function formatSimpleDate(dateText) {
  if (!dateText) {
    return "-";
  }

  const parts = String(dateText).split("-");

  if (parts.length === 3) {
    return `${Number(parts[1])}/${Number(parts[2])}`;
  }

  if (parts.length === 2) {
    return `${Number(parts[0])}/${Number(parts[1])}`;
  }

  return dateText;
}
function formatTwoDecimal(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return "0.00";
  }

  return number.toFixed(2);
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
  padding: 30,
  maxWidth: 1000,
  margin: "0 auto",
  fontFamily: "sans-serif",
};

const profileTableStyle = {
  width: "100%",
  maxWidth: 600,
  borderCollapse: "collapse",
};

const profileHeaderStyle = {
  width: 180,
  padding: 12,
  border: "1px solid #aaaaaa",
  backgroundColor: "#f2f2f2",
  color: "#222222",
  textAlign: "left",
};

const profileCellStyle = {
  padding: 12,
  border: "1px solid #aaaaaa",
  backgroundColor: "#ffffff",
  color: "#222222",
};

const sectionTitleStyle = {
  marginTop: 32,
  marginBottom: 16,
};

const statSectionStyle = {
  marginTop: 24,
};

const statSectionTitleStyle = {
  marginBottom: 10,
};

const statsTableWrapperStyle = {
  overflowX: "auto",
};

const statsTableStyle = {
  width: "100%",
  minWidth: 600,
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const dynamicStatsTableStyle = {
  width: "100%",
  minWidth: 600,
  borderCollapse: "collapse",
};

const statsHeaderStyle = {
  minWidth: 110,
  padding: 12,
  border: "1px solid #aaaaaa",
  backgroundColor: "#f2f2f2",
  color: "#222222",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const statsCellStyle = {
  minWidth: 110,
  padding: 16,
  border: "1px solid #aaaaaa",
  backgroundColor: "#ffffff",
  color: "#222222",
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const noteStyle = {
  marginTop: 12,
  color: "#666666",
  fontSize: 13,
  lineHeight: 1.6,
};

const linkStyle = {
  color: "#0066cc",
};