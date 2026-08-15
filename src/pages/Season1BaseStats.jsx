import { useState } from "react";
import { Link } from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";

import {
  getSeason1BaseStats,
  saveSeason1BaseStats,
  getSeason1BaseTeam,
  saveSeason1BaseTeam,
} from "../data/season1BaseStats";


export default function Season1BaseStats() {
  const players = getPlayersForSeason(1)
    .filter(
      (player) =>
        player.teamName === "和桐バブルス"
    )
    .sort(
      (a, b) =>
        Number(a.number ?? 999) -
        Number(b.number ?? 999)
    );

  const fielders = players.filter(
    (player) =>
      player.category === "野手"
  );

  const pitchers = players.filter(
    (player) =>
      player.category === "投手"
  );

  const [teamStats, setTeamStats] =
    useState(() => ({
      ...createEmptyTeamStats(),
      ...getSeason1BaseTeam(),
    }));

  const [playerStats, setPlayerStats] =
    useState(() => {
      const saved =
        getSeason1BaseStats();

      const result = {};

      players.forEach((player) => {
        result[String(player.id)] = {
          ...createEmptyPlayerStats(),
          ...(saved[String(player.id)] ?? {}),
        };
      });

      return result;
    });

  const [message, setMessage] =
    useState("");

  function updateTeamStat(
    field,
    value
  ) {
    setTeamStats((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
  }

  function updatePlayerStat(
    playerId,
    field,
    value
  ) {
    setPlayerStats((current) => ({
      ...current,

      [String(playerId)]: {
        ...createEmptyPlayerStats(),
        ...(current[String(playerId)] ?? {}),
        [field]: value,
      },
    }));

    setMessage("");
  }

  function handleSave() {
    const normalizedTeam =
      normalizeTeamStats(teamStats);

    const normalizedPlayers = {};

    players.forEach((player) => {
      const raw =
        playerStats[String(player.id)] ??
        createEmptyPlayerStats();

      normalizedPlayers[
        String(player.id)
      ] = normalizePlayerStats(
        raw,
        player.category
      );
    });

    saveSeason1BaseTeam(
      normalizedTeam
    );

    saveSeason1BaseStats(
      normalizedPlayers
    );

    setTeamStats(normalizedTeam);
    setPlayerStats(normalizedPlayers);

    setMessage(
      "Season1初期成績を保存しました。"
    );
  }

  return (
  <div
    style={pageStyle}
    className="season1-base-stats-page"
  >
      <h1>
        Season1 初期成績登録
      </h1>

      <p style={helpStyle}>
        過去の1試合ごとのデータがない期間の
        通算成績を登録します。
        ここで入力した数字に、
        今後登録する試合成績が加算されます。
      </p>

      <p>
        <Link
          to="/"
          style={linkStyle}
        >
          ← ホームへ戻る
        </Link>
      </p>

      {message && (
        <div style={successStyle}>
          {message}
        </div>
      )}

      <section style={sectionStyle}>
        <h2>
          チーム初期成績
        </h2>

        <div style={formGridStyle}>
          <NumberInput
            label="消化試合"
            value={teamStats.games}
            onChange={(value) =>
              updateTeamStat(
                "games",
                value
              )
            }
          />

          <NumberInput
            label="勝"
            value={teamStats.wins}
            onChange={(value) =>
              updateTeamStat(
                "wins",
                value
              )
            }
          />

          <NumberInput
            label="敗"
            value={teamStats.losses}
            onChange={(value) =>
              updateTeamStat(
                "losses",
                value
              )
            }
          />

          <NumberInput
            label="引分"
            value={teamStats.ties}
            onChange={(value) =>
              updateTeamStat(
                "ties",
                value
              )
            }
          />

          <NumberInput
            label="得点"
            value={teamStats.runsScored}
            onChange={(value) =>
              updateTeamStat(
                "runsScored",
                value
              )
            }
          />

          <NumberInput
            label="失点"
            value={teamStats.runsAllowed}
            onChange={(value) =>
              updateTeamStat(
                "runsAllowed",
                value
              )
            }
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>
          野手初期成績
        </h2>

        <div
  style={tableWrapperStyle}
  className="season1-base-table-scroll"
>
  <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerStyle}>
                  選手
                </th>
                <th style={headerStyle}>
                  試合
                </th>
                <th style={headerStyle}>
                  打数
                </th>
                <th style={headerStyle}>
                  安打
                </th>
                <th style={headerStyle}>
                  二塁打
                </th>
                <th style={headerStyle}>
                  三塁打
                </th>
                <th style={headerStyle}>
                  本塁打
                </th>
                <th style={headerStyle}>
                  打点
                </th>
                <th style={headerStyle}>
                  四球
                </th>
                <th style={headerStyle}>
                  死球
                </th>
                <th style={headerStyle}>
                  犠飛
                </th>
                <th style={headerStyle}>
                  盗塁
                </th>
                <th style={headerStyle}>
                  マルチ
                </th>
                <th style={headerStyle}>
                  猛打賞
                </th>
                <th style={headerStyle}>
                  ヒーロー
                </th>
              </tr>
            </thead>

            <tbody>
              {fielders.map((player) => (
                <FielderRow
                  key={player.id}
                  player={player}
                  stats={
                    playerStats[
                      String(player.id)
                    ]
                  }
                  onChange={
                    updatePlayerStat
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>
          投手初期成績
        </h2>

        <div
  style={tableWrapperStyle}
  className="season1-base-table-scroll"
>
  <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerStyle}>
                  選手
                </th>
                <th style={headerStyle}>
                  登板
                </th>
                <th style={headerStyle}>
                  先発
                </th>
                <th style={headerStyle}>
                  勝
                </th>
                <th style={headerStyle}>
                  敗
                </th>
                <th style={headerStyle}>
                  S
                </th>
                <th style={headerStyle}>
                  H
                </th>
                <th style={headerStyle}>
                  投球回
                </th>
                <th style={headerStyle}>
                  被安打
                </th>
                <th style={headerStyle}>
                  被本塁打
                </th>
                <th style={headerStyle}>
                  奪三振
                </th>
                <th style={headerStyle}>
                  与四球
                </th>
                <th style={headerStyle}>
                  与死球
                </th>
                <th style={headerStyle}>
                  失点
                </th>
                <th style={headerStyle}>
                  自責点
                </th>
                <th style={headerStyle}>
                  ヒーロー
                </th>
              </tr>
            </thead>

            <tbody>
              {pitchers.map((player) => (
                <PitcherRow
                  key={player.id}
                  player={player}
                  stats={
                    playerStats[
                      String(player.id)
                    ]
                  }
                  onChange={
                    updatePlayerStat
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        style={saveButtonStyle}
      >
        Season1初期成績を保存
      </button>
    </div>
  );
}


function FielderRow({
  player,
  stats,
  onChange,
}) {
  const fields = [
    "games",
    "atBats",
    "hits",
    "doubles",
    "triples",
    "homeRuns",
    "runsBattedIn",
    "walks",
    "hitByPitch",
    "sacrificeFlies",
    "stolenBases",
    "multiHitGames",
    "threeHitGames",
    "heroCount",
  ];

  return (
    <tr>
      <PlayerNameCell
        player={player}
      />

      {fields.map((field) => (
        <EditableCell
          key={field}
          value={stats?.[field] ?? 0}
          onChange={(value) =>
            onChange(
              player.id,
              field,
              value
            )
          }
        />
      ))}
    </tr>
  );
}


function PitcherRow({
  player,
  stats,
  onChange,
}) {
  const fields = [
    "pitchingGames",
    "starts",
    "wins",
    "losses",
    "saves",
    "holds",
  ];

  const afterInningsFields = [
    "hitsAllowed",
    "homeRunsAllowed",
    "strikeouts",
    "walksAllowed",
    "hitBatters",
    "runsAllowed",
    "earnedRuns",
    "heroCount",
  ];

  return (
    <tr>
      <PlayerNameCell
        player={player}
      />

      {fields.map((field) => (
        <EditableCell
          key={field}
          value={stats?.[field] ?? 0}
          onChange={(value) =>
            onChange(
              player.id,
              field,
              value
            )
          }
        />
      ))}

      <EditableCell
        value={
          stats?.innings ?? ""
        }
        step="0.1"
        onChange={(value) =>
          onChange(
            player.id,
            "innings",
            value
          )
        }
      />

      {afterInningsFields.map(
        (field) => (
          <EditableCell
            key={field}
            value={stats?.[field] ?? 0}
            onChange={(value) =>
              onChange(
                player.id,
                field,
                value
              )
            }
          />
        )
      )}
    </tr>
  );
}


function PlayerNameCell({
  player,
}) {
  return (
    <td style={nameCellStyle}>
      #{player.number} {player.name}
    </td>
  );
}


function EditableCell({
  value,
  onChange,
  step = "1",
}) {
  return (
    <td style={cellStyle}>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={inputStyle}
      />
    </td>
  );
}


function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <label style={numberInputStyle}>
      <span>
        {label}
      </span>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={teamInputStyle}
      />
    </label>
  );
}


function createEmptyPlayerStats() {
  return {
    games: 0,

    wins: 0,
    losses: 0,
    saves: 0,
    holds: 0,
    pitchingGames: 0,
    starts: 0,

    innings: "",
    inningsOuts: 0,

    hitsAllowed: 0,
    homeRunsAllowed: 0,
    strikeouts: 0,
    walksAllowed: 0,
    hitBatters: 0,
    runsAllowed: 0,
    earnedRuns: 0,

    atBats: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,

    runsBattedIn: 0,
    walks: 0,
    hitByPitch: 0,
    sacrificeFlies: 0,
    stolenBases: 0,

    heroCount: 0,
    multiHitGames: 0,
    threeHitGames: 0,
  };
}


function createEmptyTeamStats() {
  return {
    games: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    runsScored: 0,
    runsAllowed: 0,
  };
}


function normalizeTeamStats(
  stats
) {
  return {
    games: safeNumber(stats.games),
    wins: safeNumber(stats.wins),
    losses: safeNumber(stats.losses),
    ties: safeNumber(stats.ties),
    runsScored: safeNumber(
      stats.runsScored
    ),
    runsAllowed: safeNumber(
      stats.runsAllowed
    ),
  };
}


function normalizePlayerStats(
  stats,
  category
) {
  const result = {
    ...createEmptyPlayerStats(),
  };

  Object.keys(result).forEach(
    (field) => {
      if (
        field === "innings" ||
        field === "inningsOuts"
      ) {
        return;
      }

      result[field] =
        safeNumber(stats[field]);
    }
  );

  if (category === "投手") {
    result.innings =
      String(stats.innings ?? "");

    result.inningsOuts =
      inningsToOuts(
        stats.innings
      );
  } else {
    result.innings = "";
    result.inningsOuts = 0;
  }

  return result;
}


function safeNumber(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return 0;
  }

  return number;
}


function inningsToOuts(value) {
  const text =
    String(value ?? "").trim();

  if (!text) {
    return 0;
  }

  const [
    wholeText,
    fractionText = "0",
  ] = text.split(".");

  const whole =
    Number(wholeText);

  const fraction =
    Number(fractionText);

  if (
    !Number.isInteger(whole) ||
    whole < 0
  ) {
    return 0;
  }

  if (
    fraction !== 0 &&
    fraction !== 1 &&
    fraction !== 2
  ) {
    return 0;
  }

  return whole * 3 + fraction;
}


const pageStyle = {
  maxWidth: 1400,
  margin: "0 auto",
  padding: 30,
  fontFamily: "sans-serif",
};


const sectionStyle = {
  marginTop: 30,
};


const helpStyle = {
  color: "#666666",
  lineHeight: 1.7,
};


const linkStyle = {
  color: "#0066cc",
};


const successStyle = {
  marginTop: 20,
  padding: 15,
  borderRadius: 8,
  backgroundColor: "#e8f5e9",
  color: "#1b5e20",
  fontWeight: "bold",
};


const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 12,
};


const numberInputStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontWeight: "bold",
};


const teamInputStyle = {
  padding: 10,
  fontSize: 16,
};


const tableWrapperStyle = {
  overflowX: "auto",
};


const tableStyle = {
  width: "100%",
  minWidth: 1300,
  borderCollapse: "collapse",
};


const headerStyle = {
  border: "1px solid #aaaaaa",
  padding: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  textAlign: "center",
  whiteSpace: "nowrap",
};


const nameCellStyle = {
  border: "1px solid #aaaaaa",
  padding: 8,
  fontWeight: "bold",
  whiteSpace: "nowrap",
};


const cellStyle = {
  border: "1px solid #aaaaaa",
  padding: 4,
  textAlign: "center",
};


const inputStyle = {
  width: 65,
  padding: 6,
  boxSizing: "border-box",
  textAlign: "center",
};


const saveButtonStyle = {
  width: "100%",
  marginTop: 35,
  padding: 16,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
};