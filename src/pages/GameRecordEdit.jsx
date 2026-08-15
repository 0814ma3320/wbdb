import { useState } from "react";
import { getPlayersForSeason } from "../data/playerStorage";
import { getGameSeason } from "../data/seasonStorage";
import { leaguePlayers } from "../data/leaguePlayers";
import { formatSeasonDate } from "../utils/seasonCalendar";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

export default function GameRecordEdit() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const games = loadGames();

const game = games.find(
  (item) => String(item.id) === String(gameId)
);

const gameSeason = getGameSeason(game);

const players = getPlayersForSeason(
  gameSeason
);

const bubblesWon =
  Number(game?.bubblesScore) >
  Number(game?.opponentScore);

const bubblesPitchers = players
  .filter(
    (player) =>
      player.teamName === "和桐バブルス" &&
      player.category === "投手"
  )
  .map((player) => ({
    id: player.id,
    name: player.name,
    label: `${player.number} ${player.name}`,
  }));

const opponentPitchers =
  leaguePlayers[game?.opponent]?.pitchers?.map(
    (name, index) => ({
      id: `opponent-p-${index}`,
      name,
      label: name,
    })
  ) ?? [];

const bubblesFielders = players
  .filter(
    (player) =>
      player.teamName === "和桐バブルス" &&
      player.category === "野手"
  )
  .map((player) => ({
    id: player.id,
    name: player.name,
    label: `${player.number} ${player.name}`,
  }));

const opponentFielders =
  leaguePlayers[game?.opponent]?.fielders?.map(
    (name, index) => ({
      id: `opponent-f-${index}`,
      name,
      label: name,
    })
  ) ?? [];

const bubblesPlayers = players
  .filter(
    (player) =>
      player.teamName === "和桐バブルス"
  )
  .map((player) => ({
    id: player.id,
    name: player.name,
    label: `${player.number} ${player.name}`,
  }));

const relayPitchers = Array.isArray(
  game?.pitcherAppearances
)
  ? game.pitcherAppearances
      .map((appearance) =>
        bubblesPitchers.find(
          (pitcher) =>
            String(pitcher.id) ===
            String(appearance.playerId)
        )
      )
      .filter(Boolean)
  : [];

const [records, setRecords] = useState(() =>
  createInitialRecords(
    game?.records,
    game,
    relayPitchers.length > 0
      ? relayPitchers
      : bubblesPitchers,
    bubblesFielders
  )
);

  const [error, setError] = useState("");

  if (!game) {
    return (
      <div style={pageStyle}>
        <h1>試合が見つかりません</h1>

        <Link to="/games" style={linkStyle}>
          ← 試合一覧へ戻る
        </Link>
      </div>
    );
  }

  function updateDecision(type, field, value) {
    setRecords((current) => ({
      ...current,
      [type]: {
        ...current[type],
        [field]: value,
      },
    }));

    setError("");
  }

  function updateHold(index, field, value) {
    setRecords((current) => ({
      ...current,
      holds: current.holds.map((hold, holdIndex) =>
        holdIndex === index
          ? {
              ...hold,
              [field]: value,
            }
          : hold
      ),
    }));

    setError("");
  }

function addHold() {
  setRecords((current) => ({
    ...current,
    holds: [
      ...current.holds,
      {
        side: "bubbles",
        playerId: "",
        name: "",
        count: "",
      },
    ],
  }));
}

  function removeHold(index) {
    setRecords((current) => ({
      ...current,
      holds: current.holds.filter(
        (_, holdIndex) => holdIndex !== index
      ),
    }));
  }

  function updateHomeRun(index, field, value) {
    setRecords((current) => ({
      ...current,
      homeRuns: current.homeRuns.map(
        (homeRun, homeRunIndex) =>
          homeRunIndex === index
            ? {
                ...homeRun,
                [field]: value,
              }
            : homeRun
      ),
    }));

    setError("");
  }

  function addHomeRun() {
  setRecords((current) => ({
    ...current,
    homeRuns: [
      ...current.homeRuns,
      {
        side: "bubbles",
        playerId: "",
        name: "",
        number: "",
        detail: "",
      },
    ],
  }));
}

  function removeHomeRun(index) {
    setRecords((current) => ({
      ...current,
      homeRuns: current.homeRuns.filter(
        (_, homeRunIndex) =>
          homeRunIndex !== index
      ),
    }));
  }

  function updatePitchingStat(
  playerId,
  field,
  value
) {
  setRecords((current) => ({
    ...current,
    pitchingStats: current.pitchingStats.map(
      (stat) =>
        String(stat.playerId) ===
        String(playerId)
          ? {
              ...stat,
              [field]: value,
            }
          : stat
    ),
  }));

  setError("");
}
  function updateBattingStat(
    playerId,
    field,
    value
  ) {
    setRecords((current) => ({
      ...current,
      battingStats: current.battingStats.map(
        (stat) =>
          String(stat.playerId) ===
          String(playerId)
            ? {
                ...stat,
                [field]: value,
              }
            : stat
      ),
    }));

    setError("");
  }

  function handleSave() {
    const validationError =
      validateRecords(records);

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const cleanedRecords = {
  hero: bubblesWon
    ? cleanHero(records.hero)
    : null,

  win: cleanDecision(records.win),
  loss: cleanDecision(records.loss),
  save: cleanDecision(records.save),

      holds: records.holds
  .filter(
    (hold) =>
      hold.name.trim() !== "" ||
      hold.count !== ""
  )
  .map((hold) => ({
    side: hold.side ?? "bubbles",
    playerId: hold.playerId ?? "",
    name: hold.name.trim(),
    count:
      hold.count === ""
        ? ""
        : Number(hold.count),
  })),

homeRuns: records.homeRuns
  .filter(
    (homeRun) =>
      homeRun.name.trim() !== "" ||
      homeRun.number !== "" ||
      homeRun.detail.trim() !== ""
  )
  .map((homeRun) => ({
    side: homeRun.side ?? "bubbles",
    playerId: homeRun.playerId ?? "",
    name: homeRun.name.trim(),
    number:
      homeRun.number === ""
        ? ""
        : Number(homeRun.number),
    detail: homeRun.detail.trim(),
  })),
pitchingStats: records.pitchingStats
  .filter((stat) =>
    [
      stat.innings,
      stat.hitsAllowed,
      stat.homeRunsAllowed,
      stat.strikeouts,
      stat.walksAllowed,
      stat.hitBatters,
      stat.runsAllowed,
      stat.earnedRuns,
    ].some((value) => value !== "")
  )
  .map((stat) => ({
    playerId: stat.playerId,
    name: stat.name.trim(),
    innings: Number(stat.innings || 0),
    hitsAllowed: Number(stat.hitsAllowed || 0),
    homeRunsAllowed: Number(
      stat.homeRunsAllowed || 0
    ),
    strikeouts: Number(stat.strikeouts || 0),
    walksAllowed: Number(
      stat.walksAllowed || 0
    ),
    hitBatters: Number(stat.hitBatters || 0),
    runsAllowed: Number(
      stat.runsAllowed || 0
    ),
    earnedRuns: Number(
      stat.earnedRuns || 0
    ),
  })),

battingStats: records.battingStats
  .filter((stat) =>
    [
      stat.atBats,
      stat.hits,
      stat.doubles,
      stat.triples,
      stat.homeRuns,
      stat.runsBattedIn,
      stat.walks,
      stat.hitByPitch,
      stat.sacrificeFlies,
    ].some((value) => value !== "")
  )
  .map((stat) => ({
    playerId: stat.playerId,
    name: stat.name.trim(),

    atBats: Number(stat.atBats || 0),
    hits: Number(stat.hits || 0),
    doubles: Number(stat.doubles || 0),
    triples: Number(stat.triples || 0),
    homeRuns: Number(stat.homeRuns || 0),
    runsBattedIn: Number(
      stat.runsBattedIn || 0
    ),
    walks: Number(stat.walks || 0),
    hitByPitch: Number(
      stat.hitByPitch || 0
    ),
    sacrificeFlies: Number(
      stat.sacrificeFlies || 0
    ),
    stolenBases: Number(
  stat.stolenBases || 0
),
  })),
    };

    const updatedGames = games.map((item) => {
      if (
        String(item.id) !== String(gameId)
      ) {
        return item;
      }

      return {
        ...item,
        records: cleanedRecords,
        updatedAt: new Date().toISOString(),
      };
    });

    localStorage.setItem(
      "games",
      JSON.stringify(updatedGames)
    );

    navigate(`/games/${gameId}`);
  }

  return (
    <div style={pageStyle}>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
            試合記録の登録
          </h1>

          <Link
            to={`/games/${gameId}`}
            style={linkStyle}
          >
            ← 試合詳細へ戻る
          </Link>
        </div>

        <div style={gameInfoStyle}>
          <strong>
            {formatSeasonDate(game.date)}
          </strong>

          <span>
            バブルス {game.bubblesScore}
            －{game.opponentScore}{" "}
            {game.opponent}
          </span>
        </div>
      </div>

      <div style={noticeStyle}>
        勝敗投手、ホールド、セーブ、本塁打がない項目は
        空欄のままで保存できます。
      </div>

      {error && (
  <div style={errorStyle}>
    {error}
  </div>
)}

{bubblesWon && (
  <section style={sectionStyle}>
    <h2 style={sectionTitleStyle}>
      🏆 ヒーロー
    </h2>

    <p style={helpTextStyle}>
      この試合のヒーローをバブルス所属選手から選択してください。
      選択しないままでも保存できます。
    </p>

    <select
      value={records.hero?.playerId ?? ""}
      onChange={(event) => {
        const selectedPlayer =
          bubblesPlayers.find(
            (player) =>
              String(player.id) ===
              String(event.target.value)
          );

        setRecords((current) => ({
          ...current,
          hero: selectedPlayer
            ? {
                playerId: selectedPlayer.id,
                name: selectedPlayer.name,
              }
            : {
                playerId: "",
                name: "",
              },
        }));

        setError("");
      }}
      style={{
        ...nameInputStyle,
        marginTop: 18,
        maxWidth: 500,
      }}
    >
      <option value="">
        ヒーローを選択
      </option>

      {bubblesPlayers.map((player) => (
        <option
          key={player.id}
          value={player.id}
        >
          {player.label}
        </option>
      ))}
    </select>
  </section>
)}

<section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          責任投手・投手記録
        </h2>

  <DecisionRow
  label="勝"
  decision={records.win}
  countLabel="勝目"
  opponentName={game.opponent}
  bubblesPitchers={bubblesPitchers}
  opponentPitchers={opponentPitchers}
  onChange={(nextDecision) =>
    setRecords((current) => ({
      ...current,
      win: nextDecision,
    }))
  }
/>

<DecisionRow
  label="負"
  decision={records.loss}
  countLabel="敗目"
  opponentName={game.opponent}
  bubblesPitchers={bubblesPitchers}
  opponentPitchers={opponentPitchers}
  onChange={(nextDecision) =>
    setRecords((current) => ({
      ...current,
      loss: nextDecision,
    }))
  }
/>

<DecisionRow
  label="S"
  decision={records.save}
  countLabel="S"
  opponentName={game.opponent}
  bubblesPitchers={bubblesPitchers}
  opponentPitchers={opponentPitchers}
  onChange={(nextDecision) =>
    setRecords((current) => ({
      ...current,
      save: nextDecision,
    }))
  }
/>

        <div style={subsectionStyle}>
          <div style={subsectionHeaderStyle}>
            <h3 style={{ margin: 0 }}>
              ホールド
            </h3>

            <button
              type="button"
              onClick={addHold}
              style={addButtonStyle}
            >
              ＋ Hを追加
            </button>
          </div>

          {records.holds.length === 0 ? (
  <p style={emptyTextStyle}>
    ホールド投手はいません。
  </p>
) : (
  records.holds.map((hold, index) => (
    <HoldRow
      key={index}
      hold={hold}
      index={index}
      opponentName={game.opponent}
      bubblesPitchers={bubblesPitchers}
      opponentPitchers={opponentPitchers}
      onChange={(field, value) =>
        updateHold(index, field, value)
      }
      onRemove={() => removeHold(index)}
    />
  ))
)}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={subsectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>
              本塁打
            </h2>

            <p style={helpTextStyle}>
              例：ラクス／41号／2ラン
            </p>
          </div>

          <button
            type="button"
            onClick={addHomeRun}
            style={addButtonStyle}
          >
            ＋ 本塁打を追加
          </button>
        </div>

        {records.homeRuns.length === 0 ? (
  <p style={emptyTextStyle}>
    本塁打はありません。
  </p>
) : (
  records.homeRuns.map((homeRun, index) => (
    <HomeRunRow
      key={index}
      homeRun={homeRun}
      index={index}
      opponentName={game.opponent}
      bubblesFielders={bubblesFielders}
      opponentFielders={opponentFielders}
      onChange={(field, value) =>
        updateHomeRun(index, field, value)
      }
      onRemove={() => removeHomeRun(index)}
    />
  ))
)}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          打撃成績
        </h2>

        <p style={helpTextStyle}>
          出場した選手だけ入力してください。未入力の選手は保存されません。
        </p>

        <BattingStatsTable
          battingStats={records.battingStats}
          onChange={updateBattingStat}
        />
      </section>

<section style={sectionStyle}>
  <h2 style={sectionTitleStyle}>
    投手成績
  </h2>

  <p style={helpTextStyle}>
    登板した投手のみ入力してください。
  </p>

  <PitchingStatsTable
    pitchingStats={records.pitchingStats}
    onChange={updatePitchingStat}
  />
</section>

<div style={buttonAreaStyle}>
        <Link
          to={`/games/${gameId}`}
          style={cancelButtonStyle}
        >
          キャンセル
        </Link>

        <button
          type="button"
          onClick={handleSave}
          style={saveButtonStyle}
        >
          試合記録を保存
        </button>
      </div>
    </div>
  );
}

function DecisionRow({
  label,
  decision,
  countLabel,
  opponentName,
  bubblesPitchers,
  opponentPitchers,
  onChange,
}) {
  const selectedSide = decision.side ?? "bubbles";

  function handleSideChange(side) {
    onChange({
      ...decision,
      side,
      playerId: "",
      name: "",
    });
  }

  function handlePlayerChange(value) {
    if (selectedSide === "bubbles") {
      const selectedPlayer = bubblesPitchers.find(
        (player) => player.id === value
      );

      onChange({
        ...decision,
        playerId: selectedPlayer?.id ?? "",
        name: selectedPlayer?.name ?? "",
      });

      return;
    }

    onChange({
      ...decision,
      playerId: "",
      name: value,
    });
  }

  return (
    <div style={decisionBoxStyle}>
      <div style={recordSymbolStyle}>
        {label}
      </div>

      <div style={decisionContentStyle}>
        <div style={sideButtonAreaStyle}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`${label}-side`}
              value="bubbles"
              checked={selectedSide === "bubbles"}
              onChange={() =>
                handleSideChange("bubbles")
              }
            />
            バブルス
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`${label}-side`}
              value="opponent"
              checked={selectedSide === "opponent"}
              onChange={() =>
                handleSideChange("opponent")
              }
            />
            {opponentName}
          </label>
        </div>

        <div style={decisionInputAreaStyle}>
          <select
            value={
              selectedSide === "bubbles"
                ? decision.playerId ?? ""
                : decision.name ?? ""
            }
            onChange={(event) =>
              handlePlayerChange(event.target.value)
            }
            style={nameInputStyle}
          >
            <option value="">
              投手を選択
            </option>

            {selectedSide === "bubbles"
              ? bubblesPitchers.map((pitcher) => (
                  <option
                    key={pitcher.id}
                    value={pitcher.id}
                  >
                    {pitcher.label}
                  </option>
                ))
              : opponentPitchers.map((pitcher) => (
  <option
    key={pitcher.id}
    value={pitcher.name}
  >
    {pitcher.label}
  </option>
))}
          </select>

          <div style={countAreaStyle}>
            <input
              type="number"
              min="1"
              value={decision.count}
              placeholder="今季"
              onChange={(event) =>
                onChange({
                  ...decision,
                  count: event.target.value,
                })
              }
              style={countInputStyle}
            />

            <span>{countLabel}</span>
          </div>
        </div>
      </div>
        </div>
  );
}

function HoldRow({
  hold,
  index,
  opponentName,
  bubblesPitchers,
  opponentPitchers,
  onChange,
  onRemove,
}) {
  const selectedSide = hold.side ?? "bubbles";

  function handleSideChange(side) {
    onChange("side", side);
    onChange("playerId", "");
    onChange("name", "");
  }

  function handlePlayerChange(value) {
    if (selectedSide === "bubbles") {
      const selectedPlayer = bubblesPitchers.find(
        (player) =>
          String(player.id) === String(value)
      );

      onChange(
        "playerId",
        selectedPlayer?.id ?? ""
      );

      onChange(
        "name",
        selectedPlayer?.name ?? ""
      );

      return;
    }

    onChange("playerId", "");
    onChange("name", value);
  }

  return (
    <div style={decisionBoxStyle}>
      <div style={recordSymbolStyle}>
        H
      </div>

      <div style={decisionContentStyle}>
        <div style={sideButtonAreaStyle}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`hold-${index}-side`}
              value="bubbles"
              checked={selectedSide === "bubbles"}
              onChange={() =>
                handleSideChange("bubbles")
              }
            />
            バブルス
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`hold-${index}-side`}
              value="opponent"
              checked={selectedSide === "opponent"}
              onChange={() =>
                handleSideChange("opponent")
              }
            />
            {opponentName}
          </label>
        </div>

        <div style={decisionInputAreaStyle}>
          <select
            value={
              selectedSide === "bubbles"
                ? hold.playerId ?? ""
                : hold.name ?? ""
            }
            onChange={(event) =>
              handlePlayerChange(
                event.target.value
              )
            }
            style={nameInputStyle}
          >
            <option value="">
              投手を選択
            </option>

            {selectedSide === "bubbles"
              ? bubblesPitchers.map((pitcher) => (
                  <option
                    key={pitcher.id}
                    value={pitcher.id}
                  >
                    {pitcher.label}
                  </option>
                ))
              : opponentPitchers.map((pitcher) => (
  <option
    key={pitcher.id}
    value={pitcher.name}
  >
    {pitcher.label}
  </option>
))}
          </select>

          <div style={countAreaStyle}>
            <input
              type="number"
              min="1"
              value={hold.count}
              placeholder="今季"
              onChange={(event) =>
                onChange(
                  "count",
                  event.target.value
                )
              }
              style={countInputStyle}
            />

            <span>H</span>
          </div>

          <button
            type="button"
            onClick={onRemove}
            style={removeButtonStyle}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
function HomeRunRow({
  homeRun,
  index,
  opponentName,
  bubblesFielders,
  opponentFielders,
  onChange,
  onRemove,
}) {
  const selectedSide = homeRun.side ?? "bubbles";

  function handleSideChange(side) {
    onChange("side", side);
    onChange("playerId", "");
    onChange("name", "");
  }

  function handlePlayerChange(value) {
    if (selectedSide === "bubbles") {
      const selectedPlayer = bubblesFielders.find(
        (player) =>
          String(player.id) === String(value)
      );

      onChange(
        "playerId",
        selectedPlayer?.id ?? ""
      );

      onChange(
        "name",
        selectedPlayer?.name ?? ""
      );

      return;
    }

    onChange("playerId", "");
    onChange("name", value);
  }

  return (
    <div style={decisionBoxStyle}>
      <div style={recordSymbolStyle}>
        HR
      </div>

      <div style={decisionContentStyle}>
        <div style={sideButtonAreaStyle}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`home-run-${index}-side`}
              value="bubbles"
              checked={selectedSide === "bubbles"}
              onChange={() =>
                handleSideChange("bubbles")
              }
            />
            バブルス
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name={`home-run-${index}-side`}
              value="opponent"
              checked={selectedSide === "opponent"}
              onChange={() =>
                handleSideChange("opponent")
              }
            />
            {opponentName}
          </label>
        </div>

        <div style={decisionInputAreaStyle}>
          <select
            value={
              selectedSide === "bubbles"
                ? homeRun.playerId ?? ""
                : homeRun.name ?? ""
            }
            onChange={(event) =>
              handlePlayerChange(
                event.target.value
              )
            }
            style={nameInputStyle}
          >
            <option value="">
              野手を選択
            </option>

            {selectedSide === "bubbles"
              ? bubblesFielders.map((fielder) => (
                  <option
                    key={fielder.id}
                    value={fielder.id}
                  >
                    {fielder.label}
                  </option>
                ))
              : opponentFielders.map((fielder) => (
  <option
    key={fielder.id}
    value={fielder.name}
  >
    {fielder.label}
  </option>
))}
          </select>

          <div style={countAreaStyle}>
            <input
              type="number"
              min="1"
              value={homeRun.number}
              placeholder="今季"
              onChange={(event) =>
                onChange(
                  "number",
                  event.target.value
                )
              }
              style={countInputStyle}
            />

            <span>号</span>
          </div>

          <input
            type="text"
            value={homeRun.detail}
            placeholder="ソロ、2ランなど"
            onChange={(event) =>
              onChange(
                "detail",
                event.target.value
              )
            }
            style={nameInputStyle}
          />

          <button
            type="button"
            onClick={onRemove}
            style={removeButtonStyle}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
function BattingStatsTable({
  battingStats,
  onChange,
}) {
  const columns = [
    {
      label: "打数",
      field: "atBats",
    },
    {
      label: "安打",
      field: "hits",
    },
    {
      label: "二塁打",
      field: "doubles",
    },
    {
      label: "三塁打",
      field: "triples",
    },
    {
      label: "本塁打",
      field: "homeRuns",
    },
    {
      label: "打点",
      field: "runsBattedIn",
    },
    {
      label: "四球",
      field: "walks",
    },
    {
      label: "死球",
      field: "hitByPitch",
    },
    {
      label: "犠飛",
      field: "sacrificeFlies",
    },
    {
  label: "盗塁",
  field: "stolenBases",
},
  ];

  return (
    <div style={battingTableWrapperStyle}>
      <table style={battingTableStyle}>
        <thead>
          <tr>
            <th style={battingHeaderStyle}>
              選手
            </th>

            {columns.map((column) => (
              <th
                key={column.field}
                style={battingNumberHeaderStyle}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {battingStats.map((stat) => (
            <tr key={stat.playerId}>
              <td style={battingPlayerCellStyle}>
                {stat.label}
              </td>

              {columns.map((column) => (
                <td
                  key={column.field}
                  style={battingCellStyle}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      stat[column.field] ?? ""
                    }
                    placeholder="0"
                    onChange={(event) =>
                      onChange(
                        stat.playerId,
                        column.field,
                        event.target.value
                      )
                    }
                    style={battingInputStyle}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PitchingStatsTable({
  pitchingStats,
  onChange,
}) {
  const columns = [
    {
      label: "投球回",
      field: "innings",
    },
    {
      label: "被安打",
      field: "hitsAllowed",
    },
    {
      label: "被本塁打",
      field: "homeRunsAllowed",
    },
    {
      label: "奪三振",
      field: "strikeouts",
    },
    {
      label: "与四球",
      field: "walksAllowed",
    },
    {
      label: "与死球",
      field: "hitBatters",
    },
    {
      label: "失点",
      field: "runsAllowed",
    },
    {
      label: "自責点",
      field: "earnedRuns",
    },
  ];

  return (
    <div style={battingTableWrapperStyle}>
      <table style={battingTableStyle}>
        <thead>
          <tr>
            <th style={battingHeaderStyle}>
              投手
            </th>

            {columns.map((column) => (
              <th
                key={column.field}
                style={battingNumberHeaderStyle}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pitchingStats.map((stat) => (
            <tr key={stat.playerId}>
              <td style={battingPlayerCellStyle}>
                {stat.label}
              </td>

              {columns.map((column) => (
                <td
                  key={column.field}
                  style={battingCellStyle}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      stat[column.field] ?? ""
                    }
                    placeholder="0"
                    onChange={(event) =>
                      onChange(
                        stat.playerId,
                        column.field,
                        event.target.value
                      )
                    }
                    style={battingInputStyle}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function createInitialRecords(
  savedRecords,
  game,
  bubblesPitchers,
  bubblesFielders
) {
  const bubblesWon =
    Number(game?.bubblesScore) >
    Number(game?.opponentScore);

  const bubblesLost =
    Number(game?.bubblesScore) <
    Number(game?.opponentScore);

  const winDefaultSide = bubblesWon
    ? "bubbles"
    : bubblesLost
      ? "opponent"
      : "bubbles";

  const lossDefaultSide = bubblesWon
    ? "opponent"
    : bubblesLost
      ? "bubbles"
      : "opponent";

  const saveDefaultSide = winDefaultSide;

return {
  hero: {
    playerId:
      savedRecords?.hero?.playerId ?? "",

    name:
      savedRecords?.hero?.name ??
      savedRecords?.hero?.playerName ??
      "",
  },

  win: normalizeDecision(
    savedRecords?.win,
    winDefaultSide
  ),

    loss: normalizeDecision(
      savedRecords?.loss,
      lossDefaultSide
    ),

    save: normalizeDecision(
      savedRecords?.save,
      saveDefaultSide
    ),

    holds: Array.isArray(savedRecords?.holds)
  ? savedRecords.holds.map((hold) => ({
      side: hold.side ?? "bubbles",
      playerId: hold.playerId ?? "",
      name: hold.name ?? "",
      count: hold.count ?? "",
    }))
  : [],

    homeRuns: Array.isArray(
  savedRecords?.homeRuns
)
  ? savedRecords.homeRuns.map(
      (homeRun) => ({
        side: homeRun.side ?? "bubbles",
        playerId: homeRun.playerId ?? "",
        name: homeRun.name ?? "",
        number: homeRun.number ?? "",
        detail: homeRun.detail ?? "",
      })
    )
  : [],

  pitchingStats: bubblesPitchers.map(
  (pitcher) => {
    const savedStat = Array.isArray(
      savedRecords?.pitchingStats
    )
      ? savedRecords.pitchingStats.find(
          (stat) =>
            String(stat.playerId) ===
              String(pitcher.id) ||
            stat.name === pitcher.name
        )
      : null;

    return {
      playerId: pitcher.id,
      name: pitcher.name,
      label: pitcher.label,

      innings: savedStat?.innings ?? "",
      hitsAllowed:
        savedStat?.hitsAllowed ?? "",
      homeRunsAllowed:
        savedStat?.homeRunsAllowed ?? "",
      strikeouts:
        savedStat?.strikeouts ?? "",
      walksAllowed:
        savedStat?.walksAllowed ?? "",
      hitBatters:
        savedStat?.hitBatters ?? "",
      runsAllowed:
        savedStat?.runsAllowed ?? "",
      earnedRuns:
        savedStat?.earnedRuns ?? "",
    };
  }
),
    battingStats: bubblesFielders.map(
      (fielder) => {
        const savedStat = Array.isArray(
          savedRecords?.battingStats
        )
          ? savedRecords.battingStats.find(
              (stat) =>
                String(stat.playerId) ===
                  String(fielder.id) ||
                stat.name === fielder.name
            )
          : null;

        return {
  playerId: fielder.id,
  name: fielder.name,
  label: fielder.label,

  atBats:
    savedStat?.atBats ?? "",

  hits:
    savedStat?.hits ?? "",

  doubles:
    savedStat?.doubles ?? "",

  triples:
    savedStat?.triples ?? "",

  homeRuns:
    savedStat?.homeRuns ?? "",

  runsBattedIn:
    savedStat?.runsBattedIn ?? "",

  walks:
    savedStat?.walks ?? "",

  hitByPitch:
    savedStat?.hitByPitch ?? "",

  sacrificeFlies:
    savedStat?.sacrificeFlies ?? "",

    stolenBases:
  savedStat?.stolenBases ?? "",
};
      }
    ),
  };
}

function normalizeDecision(
  savedDecision,
  defaultSide
) {
  return {
    side:
      savedDecision?.side ??
      defaultSide,

    playerId:
      savedDecision?.playerId ?? "",

    name:
      savedDecision?.name ??
      savedDecision?.playerName ??
      "",

    count:
      savedDecision?.count ?? "",
  };
}

function validateRecords(records) {
  const decisions = [
    {
      data: records.win,
      label: "勝投手",
    },
    {
      data: records.loss,
      label: "敗戦投手",
    },
    {
      data: records.save,
      label: "セーブ投手",
    },
  ];

  for (const decision of decisions) {
    const hasName =
      decision.data.name.trim() !== "";
    const hasCount =
      decision.data.count !== "";

    if (hasName !== hasCount) {
      return `${decision.label}は、投手名と今季記録の両方を入力してください。`;
    }
  }
for (
  let index = 0;
  index < records.pitchingStats.length;
  index += 1
) {
  const stat = records.pitchingStats[index];

  const fields = [
    stat.innings,
    stat.hitsAllowed,
    stat.homeRunsAllowed,
    stat.strikeouts,
    stat.walksAllowed,
    stat.hitBatters,
    stat.runsAllowed,
    stat.earnedRuns,
  ];

  const hasAnyValue = fields.some(
    (value) => value !== ""
  );

  if (!hasAnyValue) {
    continue;
  }

  const inningsText = String(
    stat.innings ?? ""
  ).trim();

  if (inningsText === "") {
    return `${stat.name}の投球回を入力してください。`;
  }

  const isValidInnings =
    /^\d+(\.[012])?$/.test(inningsText);

  if (!isValidInnings) {
    return `${stat.name}の投球回は、6、6.1、6.2のように入力してください。`;
  }

  const integerFields = [
    stat.hitsAllowed,
    stat.homeRunsAllowed,
    stat.strikeouts,
    stat.walksAllowed,
    stat.hitBatters,
    stat.runsAllowed,
    stat.earnedRuns,
  ];

  const hasInvalidNumber = integerFields.some(
    (value) => {
      const numberValue = Number(value || 0);

      return (
        !Number.isInteger(numberValue) ||
        numberValue < 0
      );
    }
  );

  if (hasInvalidNumber) {
    return `${stat.name}の投手成績には0以上の整数を入力してください。`;
  }

  const runsAllowed = Number(
    stat.runsAllowed || 0
  );

  const earnedRuns = Number(
    stat.earnedRuns || 0
  );

  if (earnedRuns > runsAllowed) {
    return `${stat.name}の自責点は失点以下にしてください。`;
  }
}

  for (
    let index = 0;
    index < records.holds.length;
    index += 1
  ) {
    const hold = records.holds[index];

    const hasName = hold.name.trim() !== "";
    const hasCount = hold.count !== "";

    if (hasName !== hasCount) {
      return `${
        index + 1
      }人目のホールドは、投手名と今季H数の両方を入力してください。`;
    }
  }

 for (
  let index = 0;
  index < records.battingStats.length;
  index += 1
) {
  const stat =
    records.battingStats[index];

  const fields = [
    stat.atBats,
    stat.hits,
    stat.doubles,
    stat.triples,
    stat.homeRuns,
    stat.runsBattedIn,
    stat.walks,
    stat.hitByPitch,
    stat.sacrificeFlies,
    stat.stolenBases,
  ];

  const hasAnyValue = fields.some(
    (value) => value !== ""
  );

  if (!hasAnyValue) {
    continue;
  }

  const numbers = fields.map(
    (value) => Number(value || 0)
  );

  const [
    atBats,
    hits,
    doubles,
    triples,
    homeRuns,
  ] = numbers;

  const hasInvalidNumber = numbers.some(
    (value) =>
      !Number.isInteger(value) ||
      value < 0
  );

  if (hasInvalidNumber) {
    return `${stat.name}の打撃成績には0以上の整数を入力してください。`;
  }

  if (hits > atBats) {
    return `${stat.name}の安打数は打数以下にしてください。`;
  }

  if (
    doubles + triples + homeRuns >
    hits
  ) {
    return `${stat.name}の二塁打・三塁打・本塁打の合計は、安打数以下にしてください。`;
  }
}

return "";
}

function cleanHero(hero) {
  if (
    !hero ||
    hero.playerId === "" ||
    hero.name.trim() === ""
  ) {
    return null;
  }

  return {
    playerId: hero.playerId,
    name: hero.name.trim(),
  };
}

function cleanDecision(decision) {
  if (
    decision.name.trim() === "" &&
    decision.count === ""
  ) {
    return null;
  }

  return {
    side: decision.side,
    playerId:
      decision.side === "bubbles"
        ? decision.playerId
        : null,
    name: decision.name.trim(),
    count: Number(decision.count),
  };
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

const gameInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "12px 18px",
  borderRadius: 8,
  backgroundColor: "#f2f2f2",
};

const noticeStyle = {
  marginTop: 30,
  padding: 16,
  borderRadius: 8,
  backgroundColor: "#f3f6fa",
  lineHeight: 1.7,
};

const errorStyle = {
  marginTop: 20,
  padding: 15,
  border: "1px solid #d32f2f",
  borderRadius: 8,
  backgroundColor: "#ffebee",
  color: "#b71c1c",
  fontWeight: "bold",
};

const sectionStyle = {
  marginTop: 30,
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 18,
};

const subsectionStyle = {
  marginTop: 25,
  paddingTop: 20,
  borderTop: "1px solid #dddddd",
};

const subsectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  flexWrap: "wrap",
};

const dynamicRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginTop: 14,
  flexWrap: "wrap",
};
const decisionBoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  marginTop: 18,
  padding: 16,
  border: "1px solid #dddddd",
  borderRadius: 8,
  flexWrap: "wrap",
};

const decisionContentStyle = {
  flex: "1 1 500px",
};

const sideButtonAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 12,
  flexWrap: "wrap",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontWeight: "bold",
};

const decisionInputAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};
const recordSymbolStyle = {
  width: 45,
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
};

const nameInputStyle = {
  boxSizing: "border-box",
  flex: "1 1 280px",
  padding: 11,
  border: "1px solid #999999",
  borderRadius: 6,
  fontSize: 16,
};

const countAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const countInputStyle = {
  boxSizing: "border-box",
  width: 105,
  padding: 11,
  border: "1px solid #999999",
  borderRadius: 6,
  fontSize: 16,
};

const addButtonStyle = {
  padding: "9px 14px",
  border: "none",
  borderRadius: 7,
  backgroundColor: "#0066cc",
  color: "#ffffff",
  fontWeight: "bold",
  cursor: "pointer",
};

const removeButtonStyle = {
  padding: "9px 13px",
  border: "1px solid #c62828",
  borderRadius: 7,
  backgroundColor: "#ffffff",
  color: "#c62828",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyTextStyle = {
  color: "#666666",
};

const helpTextStyle = {
  margin: 0,
  color: "#777777",
  fontSize: 13,
};

const homeRunRowStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: 14,
  marginTop: 18,
  padding: 16,
  border: "1px solid #dddddd",
  borderRadius: 8,
  flexWrap: "wrap",
};

const homeRunFieldStyle = {
  flex: "1 1 200px",
};

const numberFieldStyle = {
  flex: "0 1 140px",
};

const detailFieldStyle = {
  flex: "1 1 240px",
};

const labelStyle = {
  display: "block",
  marginBottom: 7,
  fontWeight: "bold",
};

const inputStyle = {
  boxSizing: "border-box",
  width: "100%",
  padding: 11,
  border: "1px solid #999999",
  borderRadius: 6,
  fontSize: 16,
};

const battingTableWrapperStyle = {
  marginTop: 18,
  overflowX: "auto",
};

const battingTableStyle = {
  width: "100%",
  minWidth: 1050,
  borderCollapse: "collapse",
};

const battingHeaderStyle = {
  padding: 12,
  border: "1px solid #cccccc",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const battingNumberHeaderStyle = {
  width: 110,
  padding: 12,
  border: "1px solid #cccccc",
  backgroundColor: "#f2f2f2",
  textAlign: "center",
};

const battingPlayerCellStyle = {
  padding: 12,
  border: "1px solid #cccccc",
  fontWeight: "bold",
};

const battingCellStyle = {
  padding: 8,
  border: "1px solid #cccccc",
  textAlign: "center",
};

const battingInputStyle = {
  boxSizing: "border-box",
  width: 80,
  padding: 9,
  border: "1px solid #999999",
  borderRadius: 6,
  fontSize: 16,
  textAlign: "center",
};

const buttonAreaStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 15,
  marginTop: 30,
  flexWrap: "wrap",
};

const cancelButtonStyle = {
  display: "inline-block",
  padding: "13px 22px",
  border: "1px solid #777777",
  borderRadius: 8,
  color: "#333333",
  textDecoration: "none",
  fontWeight: "bold",
};

const saveButtonStyle = {
  padding: "13px 24px",
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

