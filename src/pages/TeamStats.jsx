import { Link } from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";

import {
  calculatePlayerStats,
  formatBattingAverage,
  formatOps,
  formatThreeDecimalStat,
} from "../utils/playerStats";
import {
  getViewingSeason,
  getGamesForSeason,
  getSeasonLabel,
} from "../data/seasonStorage";
import {
  getSeason1BaseTeam,
} from "../data/season1BaseStats";

export default function TeamStats() {
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
      Number.isFinite(
        Number(game?.bubblesScore)
      ) &&
      Number.isFinite(
        Number(game?.opponentScore)
      )
  );
  const season1BaseTeam =
  currentSeason === 1
    ? getSeason1BaseTeam()
    : {
        games: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        runsScored: 0,
        runsAllowed: 0,
      };

  const gameRecord =
  calculateGameRecord(
    completedGames,
    season1BaseTeam
  );

  const homeRecord = calculateGameRecord(
    completedGames.filter(
      (game) => game.homeAway === "home"
    )
  );

  const awayRecord = calculateGameRecord(
    completedGames.filter(
      (game) => game.homeAway !== "home"
    )
  );

  const streakStats =
    calculateStreakStats(completedGames);

  const recentGames = [...completedGames]
    .sort(sortGamesByDate)
    .slice(-10);

  const recentRecord =
    calculateGameRecord(recentGames);

  const playerStats = calculatePlayerStats(
  completedGames,
  players,
  currentSeason
);

  const fielderStats = players
    .filter(
      (player) => player.category === "野手"
    )
    .map((player) => ({
      ...player,
      ...playerStats[String(player.id)],
    }));

  const pitcherStats = players
    .filter(
      (player) => player.category === "投手"
    )
    .map((player) => ({
      ...player,
      ...playerStats[String(player.id)],
    }));

  const battingStats =
    calculateTeamBattingStats(fielderStats);

  const pitchingStats =
    calculateTeamPitchingStats(pitcherStats);

  return (
    <div
  style={pageStyle}
  className="team-stats-page"
>
      <div style={topAreaStyle}>
        <div>
          <h1 style={titleStyle}>
  和桐バブルス {getSeasonLabel(currentSeason)} チーム成績
</h1>

          <p style={subTitleStyle}>
            登録済みの試合・個人成績から自動集計
          </p>
        </div>

        <Link to="/" style={backLinkStyle}>
          ← ホームへ戻る
        </Link>
      </div>

      {completedGames.length === 0 ? (
        <div style={noticeStyle}>
          完了済みの試合がありません。
          試合スコアを登録すると、
          チーム成績が表示されます。
        </div>
      ) : (
        <>
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              🏆 シーズン成績
            </h2>

            <div style={mainRecordStyle}>
              <div style={recordSummaryStyle}>
                <strong style={recordTextStyle}>
                  {gameRecord.wins}勝
                  {gameRecord.losses}敗
                  {gameRecord.ties}分
                </strong>

                <span style={winningPercentageStyle}>
                  勝率{" "}
                  {formatWinningPercentage(
                    gameRecord.winningPercentage
                  )}
                </span>
              </div>

              <div
  style={mainGridStyle}
  className="team-main-grid"
>
                <StatCard
                  label="試合"
                  value={`${gameRecord.games}試合`}
                />

                <StatCard
                  label="勝利"
                  value={`${gameRecord.wins}勝`}
                />

                <StatCard
                  label="敗戦"
                  value={`${gameRecord.losses}敗`}
                />

                <StatCard
                  label="引き分け"
                  value={`${gameRecord.ties}分`}
                />

                <StatCard
                  label="得点"
                  value={`${gameRecord.runsScored}点`}
                />

                <StatCard
                  label="失点"
                  value={`${gameRecord.runsAllowed}点`}
                />

                <StatCard
                  label="得失点差"
                  value={formatRunDifference(
                    gameRecord.runDifference
                  )}
                />

                <StatCard
                  label="1試合平均得点"
                  value={formatAverage(
                    gameRecord.averageRunsScored
                  )}
                />

                <StatCard
                  label="1試合平均失点"
                  value={formatAverage(
                    gameRecord.averageRunsAllowed
                  )}
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              🔥 連勝・連敗
            </h2>

            <div
  style={statGridStyle}
  className="team-stat-grid"
>
              <StatCard
                label="現在"
                value={formatCurrentStreak(
                  streakStats
                )}
              />

              <StatCard
                label="最長連勝"
                value={`${streakStats.longestWinningStreak}連勝`}
              />

              <StatCard
                label="最長連敗"
                value={`${streakStats.longestLosingStreak}連敗`}
              />

              <StatCard
                label="最近10試合"
                value={
                  recentRecord.games > 0
                    ? `${recentRecord.wins}勝${recentRecord.losses}敗${recentRecord.ties}分`
                    : "記録なし"
                }
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              🏟️ ホーム・ビジター
            </h2>

            <div
  style={twoColumnGridStyle}
  className="team-record-grid"
>
              <RecordCard
                title="ホーム"
                icon="🏠"
                record={homeRecord}
              />

              <RecordCard
                title="ビジター"
                icon="✈️"
                record={awayRecord}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              ⚾ チーム打撃成績
            </h2>

            <div
  style={statGridStyle}
  className="team-stat-grid"
>
              <StatCard
                label="チーム打率"
                value={formatBattingAverage(
                  battingStats.battingAverage
                )}
              />

              <StatCard
                label="出塁率"
                value={formatBattingAverage(
                  battingStats.onBasePercentage
                )}
              />

              <StatCard
                label="長打率"
                value={formatBattingAverage(
                  battingStats.sluggingPercentage
                )}
              />

              <StatCard
                label="OPS"
                value={formatOps(
                  battingStats.ops
                )}
              />

              <StatCard
                label="打数"
                value={`${battingStats.atBats}`}
              />

              <StatCard
                label="安打"
                value={`${battingStats.hits}本`}
              />

              <StatCard
                label="二塁打"
                value={`${battingStats.doubles}本`}
              />

              <StatCard
                label="三塁打"
                value={`${battingStats.triples}本`}
              />

              <StatCard
                label="本塁打"
                value={`${battingStats.homeRuns}本`}
              />

              <StatCard
                label="打点"
                value={`${battingStats.runsBattedIn}打点`}
              />

              <StatCard
                label="四球"
                value={`${battingStats.walks}個`}
              />

             <StatCard
  label="盗塁"
  value={`${battingStats.stolenBases}個`}
/>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              🧤 チーム投手成績
            </h2>

            <div
  style={statGridStyle}
  className="team-stat-grid"
>
              <StatCard
                label="防御率"
                value={formatPitchingStat(
                  pitchingStats.era
                )}
              />

              <StatCard
                label="WHIP"
                value={formatPitchingStat(
                  pitchingStats.whip
                )}
              />

              <StatCard
                label="投球回"
                value={`${formatInnings(
                  pitchingStats.innings
                )}回`}
              />

              <StatCard
                label="被安打"
                value={`${pitchingStats.hitsAllowed}本`}
              />

              <StatCard
                label="被本塁打"
                value={`${pitchingStats.homeRunsAllowed}本`}
              />

              <StatCard
                label="奪三振"
                value={`${pitchingStats.strikeouts}個`}
              />

              <StatCard
                label="与四球"
                value={`${pitchingStats.walksAllowed}個`}
              />

              <StatCard
                label="与死球"
                value={`${pitchingStats.hitBatters}個`}
              />

              <StatCard
                label="失点"
                value={`${pitchingStats.runsAllowed}点`}
              />

              <StatCard
                label="自責点"
                value={`${pitchingStats.earnedRuns}点`}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  note = "",
}) {
  return (
    <div style={statCardStyle}>
      <span style={statLabelStyle}>
        {label}
      </span>

      <strong style={statValueStyle}>
        {value}
      </strong>

      {note && (
        <small style={statNoteStyle}>
          {note}
        </small>
      )}
    </div>
  );
}

function RecordCard({
  title,
  icon,
  record,
}) {
  return (
    <div style={recordCardStyle}>
      <h3 style={recordCardTitleStyle}>
        {icon} {title}
      </h3>

      <strong style={recordCardMainStyle}>
        {record.wins}勝
        {record.losses}敗
        {record.ties}分
      </strong>

      <div style={recordCardDetailsStyle}>
        <span>
          試合：{record.games}
        </span>

        <span>
          勝率：
          {formatWinningPercentage(
            record.winningPercentage
          )}
        </span>

        <span>
          得点：{record.runsScored}
        </span>

        <span>
          失点：{record.runsAllowed}
        </span>

        <span>
          得失点差：
          {formatRunDifference(
            record.runDifference
          )}
        </span>
      </div>
    </div>
  );
}

function calculateGameRecord(
  games,
  baseRecord = {}
) {
  const record = {
  games: Number(baseRecord.games ?? 0),
  wins: Number(baseRecord.wins ?? 0),
  losses: Number(baseRecord.losses ?? 0),
  ties: Number(baseRecord.ties ?? 0),
  runsScored: Number(
    baseRecord.runsScored ?? 0
  ),
  runsAllowed: Number(
    baseRecord.runsAllowed ?? 0
  ),
  runDifference: 0,
  winningPercentage: 0,
  averageRunsScored: 0,
  averageRunsAllowed: 0,
};

  games.forEach((game) => {
    const bubblesScore = Number(
      game.bubblesScore
    );

    const opponentScore = Number(
      game.opponentScore
    );

    if (
      !Number.isFinite(bubblesScore) ||
      !Number.isFinite(opponentScore)
    ) {
      return;
    }

    record.games += 1;
    record.runsScored += bubblesScore;
    record.runsAllowed += opponentScore;

    if (bubblesScore > opponentScore) {
      record.wins += 1;
    } else if (
      bubblesScore < opponentScore
    ) {
      record.losses += 1;
    } else {
      record.ties += 1;
    }
  });

  record.runDifference =
    record.runsScored -
    record.runsAllowed;

  const decidedGames =
    record.wins + record.losses;

  record.winningPercentage =
    decidedGames > 0
      ? record.wins / decidedGames
      : 0;

  record.averageRunsScored =
    record.games > 0
      ? record.runsScored / record.games
      : 0;

  record.averageRunsAllowed =
    record.games > 0
      ? record.runsAllowed / record.games
      : 0;

  return record;
}

function calculateTeamBattingStats(
  fielderStats
) {
  const totals = fielderStats.reduce(
    (result, player) => {
      result.atBats += Number(
        player.atBats ?? 0
      );

      result.hits += Number(
        player.hits ?? 0
      );

      result.totalBases += Number(
        player.totalBases ?? 0
      );

      result.doubles += Number(
        player.doubles ?? 0
      );

      result.triples += Number(
        player.triples ?? 0
      );

      result.homeRuns += Number(
        player.homeRuns ?? 0
      );

      result.runsBattedIn += Number(
        player.runsBattedIn ?? 0
      );

      result.walks += Number(
        player.walks ?? 0
      );

      result.hitByPitch += Number(
        player.hitByPitch ?? 0
      );

      result.sacrificeFlies += Number(
        player.sacrificeFlies ?? 0
      );

result.stolenBases += Number(
  player.stolenBases ?? 0
);

      return result;
    },
    {
      atBats: 0,
      hits: 0,
      totalBases: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      runsBattedIn: 0,
      walks: 0,
      hitByPitch: 0,
      sacrificeFlies: 0,
      stolenBases: 0,
    }
  );

  totals.battingAverage =
    totals.atBats > 0
      ? totals.hits / totals.atBats
      : 0;

  const onBaseDenominator =
    totals.atBats +
    totals.walks +
    totals.hitByPitch +
    totals.sacrificeFlies;

  totals.onBasePercentage =
    onBaseDenominator > 0
      ? (
          totals.hits +
          totals.walks +
          totals.hitByPitch
        ) / onBaseDenominator
      : 0;

  totals.sluggingPercentage =
    totals.atBats > 0
      ? totals.totalBases / totals.atBats
      : 0;

  totals.ops =
    totals.onBasePercentage +
    totals.sluggingPercentage;

  return totals;
}

function calculateTeamPitchingStats(
  pitcherStats
) {
  const totals = pitcherStats.reduce(
    (result, player) => {
      result.innings += Number(
        player.innings ?? 0
      );

      result.hitsAllowed += Number(
        player.hitsAllowed ?? 0
      );

      result.homeRunsAllowed += Number(
        player.homeRunsAllowed ?? 0
      );

      result.strikeouts += Number(
        player.strikeouts ?? 0
      );

      result.walksAllowed += Number(
        player.walksAllowed ?? 0
      );

      result.hitBatters += Number(
        player.hitBatters ?? 0
      );

      result.runsAllowed += Number(
        player.runsAllowed ?? 0
      );

      result.earnedRuns += Number(
        player.earnedRuns ?? 0
      );

      return result;
    },
    {
      innings: 0,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
      strikeouts: 0,
      walksAllowed: 0,
      hitBatters: 0,
      runsAllowed: 0,
      earnedRuns: 0,
      era: 0,
      whip: 0,
    }
  );

  totals.era =
    totals.innings > 0
      ? (
          totals.earnedRuns * 9
        ) / totals.innings
      : 0;

  totals.whip =
    totals.innings > 0
      ? (
          totals.walksAllowed +
          totals.hitsAllowed
        ) / totals.innings
      : 0;

  return totals;
}

function calculateStreakStats(games) {
  const sortedGames = [...games].sort(
    sortGamesByDate
  );

  let currentType = "";
  let currentCount = 0;

  let longestWinningStreak = 0;
  let longestLosingStreak = 0;

  sortedGames.forEach((game) => {
    const bubblesScore = Number(
      game.bubblesScore
    );

    const opponentScore = Number(
      game.opponentScore
    );

    if (bubblesScore === opponentScore) {
      currentType = "";
      currentCount = 0;
      return;
    }

    const result =
      bubblesScore > opponentScore
        ? "win"
        : "loss";

    if (currentType === result) {
      currentCount += 1;
    } else {
      currentType = result;
      currentCount = 1;
    }

    if (result === "win") {
      longestWinningStreak = Math.max(
        longestWinningStreak,
        currentCount
      );
    }

    if (result === "loss") {
      longestLosingStreak = Math.max(
        longestLosingStreak,
        currentCount
      );
    }
  });

  return {
    currentType,
    currentCount,
    longestWinningStreak,
    longestLosingStreak,
  };
}

function sortGamesByDate(gameA, gameB) {
  const dateA = new Date(
    `${gameA.date ?? ""}T00:00:00`
  ).getTime();

  const dateB = new Date(
    `${gameB.date ?? ""}T00:00:00`
  ).getTime();

  const safeDateA = Number.isFinite(dateA)
    ? dateA
    : 0;

  const safeDateB = Number.isFinite(dateB)
    ? dateB
    : 0;

  if (safeDateA !== safeDateB) {
    return safeDateA - safeDateB;
  }

  return String(gameA.id ?? "").localeCompare(
    String(gameB.id ?? "")
  );
}

function formatCurrentStreak(streakStats) {
  if (
    !streakStats.currentType ||
    streakStats.currentCount === 0
  ) {
    return "連勝・連敗なし";
  }

  return streakStats.currentType === "win"
    ? `${streakStats.currentCount}連勝中`
    : `${streakStats.currentCount}連敗中`;
}

function formatWinningPercentage(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return ".000";
  }

  return number
    .toFixed(3)
    .replace(/^0/, "");
}

function formatRunDifference(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (number > 0) {
    return `+${number}`;
  }

  return String(number);
}

function formatAverage(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}

function formatPitchingStat(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return "0.00";
  }

  return number.toFixed(2);
}

function formatInnings(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(1);
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
  marginTop: 28,
  padding: 20,
  borderRadius: 10,
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

const mainRecordStyle = {
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 14,
  backgroundColor: "#ffffff",
};

const recordSummaryStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 15,
  marginBottom: 22,
  flexWrap: "wrap",
};

const recordTextStyle = {
  fontSize: 30,
};

const winningPercentageStyle = {
  fontSize: 22,
  fontWeight: "bold",
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(145px, 1fr))",
  gap: 14,
};

const statGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const twoColumnGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
};

const statCardStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 105,
  padding: 18,
  border: "1px solid #d5d5d5",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
};

const statLabelStyle = {
  marginBottom: 8,
  color: "#666666",
  fontSize: 14,
  fontWeight: "bold",
};

const statValueStyle = {
  color: "#222222",
  fontSize: 26,
};

const statNoteStyle = {
  marginTop: 8,
  color: "#888888",
  fontSize: 11,
};

const recordCardStyle = {
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 12,
  backgroundColor: "#ffffff",
};

const recordCardTitleStyle = {
  marginTop: 0,
  marginBottom: 16,
};

const recordCardMainStyle = {
  display: "block",
  marginBottom: 18,
  fontSize: 27,
};

const recordCardDetailsStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 10,
  color: "#555555",
};