import {
  Link,
  useParams,
} from "react-router-dom";
import { formatSeasonDate } from "../utils/seasonCalendar";

export default function GameDetail() {
  const { gameId } = useParams();

  const games = loadGames();

  const game = games.find(
    (item) =>
      String(item.id) === String(gameId)
  );

  if (!game) {
    return (
      <div style={pageStyle}>
        <h1>試合が見つかりません</h1>

        <p>
          試合データが削除されたか、
          URLが正しくない可能性があります。
        </p>

        <Link to="/games" style={linkStyle}>
          ← 試合一覧へ戻る
        </Link>
      </div>
    );
  }

  const result = getResult(game);

  const lineup = Array.isArray(game.lineup)
    ? [...game.lineup].sort(
        (a, b) =>
          Number(a.battingOrder) -
          Number(b.battingOrder)
      )
    : [];

  const pitcherAppearances = Array.isArray(
    game.pitcherAppearances
  )
    ? game.pitcherAppearances
    : [];

const battingStats = Array.isArray(
  game.records?.battingStats
)
  ? game.records.battingStats
  : [];

const pitchingStats = Array.isArray(
  game.records?.pitchingStats
)
  ? game.records.pitchingStats
  : [];

  const records = normalizeRecords(
    game.records
  );

  return (
    <div
  style={pageStyle}
  className="game-detail-page"
>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
            試合詳細
          </h1>

          <Link to="/games" style={linkStyle}>
            ← 試合一覧へ戻る
          </Link>
        </div>

        <div
          style={resultBadgeStyle(result.symbol)}
        >
          {result.symbol} {result.text}
        </div>
      </div>

      <section style={scoreSectionStyle}>
        <div style={dateStyle}>
          {formatSeasonDate(game.date)}
          ・
          {game.homeAway === "home"
            ? "ホーム"
            : "ビジター"}
        </div>

        <div
  style={scoreBoardStyle}
  className="game-score-board"
>
          <div style={teamStyle}>
            バブルス
          </div>

          <div style={scoreNumberStyle}>
            {game.bubblesScore}
          </div>

          <div style={scoreHyphenStyle}>
            －
          </div>

          <div style={scoreNumberStyle}>
            {game.opponentScore}
          </div>

          <div style={teamStyle}>
            {game.opponent}
          </div>
        </div>

        <GameRecordSummary records={records} />

        <Link
          to={`/games/${game.id}/records`}
          style={recordEditButtonStyle}
        >
          {hasRecords(records)
            ? "試合記録を編集"
            : "勝敗投手・本塁打を登録"}
        </Link>
      </section>

      <LineupSection
        gameId={game.id}
        lineup={lineup}
      />
<BattingStatsSection
  battingStats={battingStats}
/>
      <PitcherRelaySection
  gameId={game.id}
  pitcherAppearances={pitcherAppearances}
/>

      <PitchingStatsSection
  pitchingStats={pitchingStats}
/>

      
    </div>
  );
}

function GameRecordSummary({ records }) {
  if (!hasRecords(records)) {
    return (
      <div style={noRecordStyle}>
        勝敗投手や本塁打はまだ登録されていません。
      </div>
    );
  }

  return (
    <div style={recordSummaryStyle}>
      <div style={decisionGridStyle}>
        <RecordItem
          label="勝"
          value={formatDecision(
            records.win,
            "勝目"
          )}
        />

        <RecordItem
          label="負"
          value={formatDecision(
            records.loss,
            "敗目"
          )}
        />

        {records.holds.map(
          (hold, index) => (
            <RecordItem
              key={`${hold.name}-${index}`}
              label="H"
              value={formatDecision(
                hold,
                "H"
              )}
            />
          )
        )}

        <RecordItem
          label="S"
          value={formatDecision(
            records.save,
            "S"
          )}
        />
      </div>

      {records.homeRuns.length > 0 && (
        <div style={homeRunSummaryStyle}>
          <strong style={homeRunLabelStyle}>
            本塁打
          </strong>

          <div style={homeRunListStyle}>
            {records.homeRuns.map(
              (homeRun, index) => (
                <span
                  key={`${homeRun.name}-${index}`}
                  style={homeRunChipStyle}
                >
                  {homeRun.name}
                  {homeRun.number !== ""
                    ? ` ${homeRun.number}号`
                    : ""}
                  {homeRun.detail
                    ? `（${homeRun.detail}）`
                    : ""}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RecordItem({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div style={recordItemStyle}>
      <strong style={recordLabelStyle}>
        {label}
      </strong>

      <span>{value}</span>
    </div>
  );
}

function LineupSection({ gameId, lineup }) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>
          スタメン
        </h2>

        <span style={countStyle}>
          登録数：{lineup.length}
        </span>
      </div>

      <p style={sectionHelpStyle}>
        DH制のため、投手はスタメンに含めず、
        投手リレーで管理します。
      </p>

      {lineup.length === 0 ? (
        <p style={emptyTextStyle}>
          スタメンはまだ登録されていません。
        </p>
      ) : (
        <div
  style={tableWrapperStyle}
  className="game-detail-table-scroll"
>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>
                  打順
                </th>

                <th style={tableHeaderStyle}>
                  守備
                </th>

                <th style={tableHeaderStyle}>
                  背番号
                </th>

                <th style={tableHeaderStyle}>
                  選手名
                </th>
              </tr>
            </thead>

            <tbody>
              {lineup.map((row) => (
                <tr key={row.battingOrder}>
                  <td style={centerCellStyle}>
                    {row.battingOrder}
                  </td>

                  <td style={centerCellStyle}>
                    <strong>{row.position}</strong>
                  </td>

                  <td style={centerCellStyle}>
                    {row.playerNumber}
                  </td>

                  <td style={nameCellStyle}>
                    {row.playerName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        to={`/games/${gameId}/lineup`}
        style={editButtonStyle}
      >
        {lineup.length === 0
          ? "スタメンを登録"
          : "スタメンを編集"}
      </Link>
    </section>
  );
}

function PitcherRelaySection({
  gameId,
  pitcherAppearances,
}) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>
          投手リレー
        </h2>

        <span style={countStyle}>
          登録数：{pitcherAppearances.length}
        </span>
      </div>

      {pitcherAppearances.length === 0 ? (
        <p style={emptyTextStyle}>
          登板投手はまだ登録されていません。
        </p>
      ) : (
        <div style={relayListStyle}>
          {pitcherAppearances.map(
            (pitcher, index) => (
              <div
                key={`${pitcher.playerId}-${index}`}
                style={relayItemStyle}
              >
                <strong>
                  {index + 1}
                </strong>

                <span>
                  {pitcher.playerNumber
                    ? `${pitcher.playerNumber} `
                    : ""}
                  {pitcher.playerName}
                </span>
              </div>
            )
          )}
        </div>
      )}

      <Link
        to={`/games/${gameId}/pitchers`}
        style={editButtonStyle}
      >
        {pitcherAppearances.length === 0
          ? "投手リレーを登録"
          : "投手リレーを編集"}
      </Link>
    </section>
  );
}

function PitchingStatsSection({
  pitchingStats,
}) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>
          投手個人成績
        </h2>

        <span style={countStyle}>
          登録数：{pitchingStats.length}
        </span>
      </div>

      {pitchingStats.length === 0 ? (
        <p style={emptyTextStyle}>
          投手成績はまだ登録されていません。
        </p>
      ) : (
        <div
  style={tableWrapperStyle}
  className="game-detail-table-scroll"
>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>
                  投手
                </th>
                <th style={tableHeaderStyle}>
                  回
                </th>
                <th style={tableHeaderStyle}>
                  被安
                </th>
                <th style={tableHeaderStyle}>
                  被本
                </th>
                <th style={tableHeaderStyle}>
                  奪三
                </th>
                <th style={tableHeaderStyle}>
                  四球
                </th>
                <th style={tableHeaderStyle}>
                  死球
                </th>
                <th style={tableHeaderStyle}>
                  失点
                </th>
                <th style={tableHeaderStyle}>
                  自責
                </th>
              </tr>
            </thead>

            <tbody>
              {pitchingStats.map((stat) => (
                <tr key={stat.playerId}>
                  <td style={nameCellStyle}>
                    {stat.name}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.innings}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.hitsAllowed}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.homeRunsAllowed}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.strikeouts}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.walksAllowed}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.hitBatters}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.runsAllowed}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.earnedRuns}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
function BattingStatsSection({
  battingStats,
}) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>
          野手個人成績
        </h2>

        <span style={countStyle}>
          登録数：{battingStats.length}
        </span>
      </div>

      {battingStats.length === 0 ? (
        <p style={emptyTextStyle}>
          野手成績はまだ登録されていません。
        </p>
      ) : (
        <div
  style={tableWrapperStyle}
  className="game-detail-table-scroll"
>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>
                  選手
                </th>
<th style={tableHeaderStyle}>
  打席
</th>
                <th style={tableHeaderStyle}>
                  打数
                </th>

                <th style={tableHeaderStyle}>
                  安打
                </th>
                <th style={tableHeaderStyle}>
  打率
</th>

<th style={tableHeaderStyle}>
  出塁率
</th>

<th style={tableHeaderStyle}>
  長打率
</th>

<th style={tableHeaderStyle}>
  OPS
</th>
                <th style={tableHeaderStyle}>
                  二塁打
                </th>

                <th style={tableHeaderStyle}>
                  三塁打
                </th>

                <th style={tableHeaderStyle}>
                  本塁打
                </th>

                <th style={tableHeaderStyle}>
                  打点
                </th>

                <th style={tableHeaderStyle}>
                  四球
                </th>

                <th style={tableHeaderStyle}>
                  死球
                </th>

                <th style={tableHeaderStyle}>
                  犠飛
                </th>
              </tr>
            </thead>

            <tbody>
              {battingStats.map((stat) => (
                <tr key={stat.playerId}>
                  <td style={nameCellStyle}>
                    {stat.name}
                  </td>
<td style={centerCellStyle}>
  {stat.atBats +
    stat.walks +
    stat.hitByPitch +
    stat.sacrificeFlies}
</td>
                  <td style={centerCellStyle}>
                    {stat.atBats}
                  </td>

                  <td style={centerCellStyle}> 
                    {stat.hits}
                  </td>
<td style={centerCellStyle}>
  {stat.atBats > 0
    ? (stat.hits / stat.atBats)
        .toFixed(3)
        .replace("0.", ".")
    : ".000"}
</td>

<td style={centerCellStyle}>
  {(
    (stat.hits +
      stat.walks +
      stat.hitByPitch) /
    Math.max(
      1,
      stat.atBats +
        stat.walks +
        stat.hitByPitch +
        stat.sacrificeFlies
    )
  )
    .toFixed(3)
    .replace("0.", ".")}
</td>
<td style={centerCellStyle}>
  {(
    (
      stat.hits +
      stat.doubles +
      stat.triples * 2 +
      stat.homeRuns * 3
    ) /
    Math.max(1, stat.atBats)
  )
    .toFixed(3)
    .replace("0.", ".")}
</td>

<td style={centerCellStyle}>
  {(
    (stat.hits +
      stat.walks +
      stat.hitByPitch) /
      Math.max(
        1,
        stat.atBats +
          stat.walks +
          stat.hitByPitch +
          stat.sacrificeFlies
      ) +
    (
      stat.hits +
      stat.doubles +
      stat.triples * 2 +
      stat.homeRuns * 3
    ) /
      Math.max(1, stat.atBats)
  ).toFixed(3)}
</td>

                  <td style={centerCellStyle}>
                    {stat.doubles}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.triples}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.homeRuns}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.runsBattedIn}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.walks}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.hitByPitch}
                  </td>

                  <td style={centerCellStyle}>
                    {stat.sacrificeFlies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function normalizeRecords(records) {
  return {
    win: records?.win ?? null,
    loss: records?.loss ?? null,
    save: records?.save ?? null,

    holds: Array.isArray(records?.holds)
      ? records.holds
      : [],

    homeRuns: Array.isArray(
      records?.homeRuns
    )
      ? records.homeRuns
      : [],
  };
}

function hasRecords(records) {
  return Boolean(
    records.win ||
      records.loss ||
      records.save ||
      records.holds.length > 0 ||
      records.homeRuns.length > 0
  );
}

function formatDecision(record, suffix) {
  if (!record?.name) {
    return "";
  }

  if (
    record.count === "" ||
    record.count === undefined ||
    record.count === null
  ) {
    return record.name;
  }

  return `${record.name}（${record.count}${suffix}）`;
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
    return {
      symbol: "○",
      text: "勝利",
    };
  }

  if (bubblesScore < opponentScore) {
    return {
      symbol: "●",
      text: "敗戦",
    };
  }

  return {
    symbol: "△",
    text: "引き分け",
  };
}



function resultBadgeStyle(symbol) {
  let backgroundColor = "#eeeeee";
  let color = "#333333";

  if (symbol === "○") {
    backgroundColor = "#ffebee";
    color = "#b71c1c";
  }

  if (symbol === "●") {
    backgroundColor = "#e3f2fd";
    color = "#0d47a1";
  }

  return {
    padding: "12px 20px",
    borderRadius: 24,
    backgroundColor,
    color,
    fontSize: 18,
    fontWeight: "bold",
  };
}

const pageStyle = {
  maxWidth: 1000,
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
};

const scoreSectionStyle = {
  marginTop: 30,
  padding: 28,
  border: "1px solid #bbbbbb",
  borderRadius: 12,
  backgroundColor: "#ffffff",
  textAlign: "center",
};

const dateStyle = {
  marginBottom: 20,
  color: "#555555",
  fontWeight: "bold",
};

const scoreBoardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
};

const teamStyle = {
  minWidth: 150,
  fontSize: 21,
  fontWeight: "bold",
};

const scoreNumberStyle = {
  fontSize: 46,
  fontWeight: "bold",
};

const scoreHyphenStyle = {
  fontSize: 32,
  fontWeight: "bold",
};

const noRecordStyle = {
  marginTop: 25,
  padding: 14,
  borderRadius: 8,
  backgroundColor: "#f3f3f3",
  color: "#666666",
};

const recordSummaryStyle = {
  marginTop: 25,
  padding: 18,
  borderTop: "1px solid #dddddd",
  borderBottom: "1px solid #dddddd",
  textAlign: "left",
};

const decisionGridStyle = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
};

const recordItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const recordLabelStyle = {
  minWidth: 28,
  fontSize: 17,
};

const homeRunSummaryStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 15,
  marginTop: 18,
  flexWrap: "wrap",
};

const homeRunLabelStyle = {
  minWidth: 60,
};

const homeRunListStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const homeRunChipStyle = {
  padding: "5px 10px",
  borderRadius: 16,
  backgroundColor: "#fff3e0",
};

const recordEditButtonStyle = {
  display: "inline-block",
  marginTop: 22,
  padding: "11px 18px",
  borderRadius: 7,
  backgroundColor: "#0066cc",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "bold",
};

const sectionStyle = {
  marginTop: 30,
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  flexWrap: "wrap",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 18,
};

const sectionHelpStyle = {
  marginTop: -5,
  marginBottom: 20,
  color: "#666666",
  fontSize: 14,
};

const countStyle = {
  padding: "5px 10px",
  borderRadius: 16,
  backgroundColor: "#eeeeee",
  fontSize: 14,
};

const tableWrapperStyle = {
  overflowX: "auto",
  marginBottom: 20,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderStyle = {
  padding: 11,
  border: "1px solid #bbbbbb",
  backgroundColor: "#f3f3f3",
  textAlign: "center",
};

const centerCellStyle = {
  padding: 11,
  border: "1px solid #bbbbbb",
  textAlign: "center",
};

const nameCellStyle = {
  padding: 11,
  border: "1px solid #bbbbbb",
  fontWeight: "bold",
};

const emptyTextStyle = {
  color: "#666666",
};
const relayListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 18,
};

const relayItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  border: "1px solid #dddddd",
  borderRadius: 8,
  backgroundColor: "#fafafa",
};

const editButtonStyle = {
  display: "inline-block",
  marginTop: 10,
  padding: "11px 18px",
  borderRadius: 7,
  backgroundColor: "#222222",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "bold",
};

const disabledButtonStyle = {
  marginTop: 10,
  padding: "11px 18px",
  border: "none",
  borderRadius: 7,
  backgroundColor: "#cccccc",
  color: "#666666",
  fontWeight: "bold",
  cursor: "not-allowed",
};

const comingSoonStyle = {
  marginBottom: 0,
  color: "#888888",
  fontSize: 13,
};