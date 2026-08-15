import { useState } from "react";
import { Link } from "react-router-dom";
import { leaguePlayers } from "../data/LeaguePlayers";

import { getPlayersForSeason } from "../data/playerStorage";
import {
  getViewingSeason,
  getSeasonLabel,
} from "../data/seasonStorage";

const BEST_NINE_POSITIONS = [
  "投手",
  "捕手",
  "一塁手",
  "二塁手",
  "三塁手",
  "遊撃手",
  "外野手1",
  "外野手2",
  "外野手3",
  "指名打者",
];

const GOLD_GLOVE_POSITIONS = [
  "投手",
  "捕手",
  "一塁手",
  "二塁手",
  "三塁手",
  "遊撃手",
  "外野手1",
  "外野手2",
  "外野手3",
];

export default function Awards() {
  const currentSeason = getViewingSeason();

 const bubblesPlayers = getPlayersForSeason(
  currentSeason
);

const otherTeamPlayers = Object.entries(
  leaguePlayers
).flatMap(([teamName, roster]) => [
  ...roster.fielders.map((name) => ({
    id: `${teamName}-fielder-${name}`,
    name,
    teamName,
    category: "野手",
  })),

  ...roster.pitchers.map((name) => ({
    id: `${teamName}-pitcher-${name}`,
    name,
    teamName,
    category: "投手",
  })),
]);

const players = [
  ...bubblesPlayers,
  ...otherTeamPlayers,
];

  const [awards, setAwards] = useState(() =>
    loadAwards(currentSeason)
  );

  const [message, setMessage] = useState("");

  function updateSingleAward(
    field,
    playerId
  ) {
    const player = findPlayer(
      players,
      playerId
    );

    setAwards((current) => ({
      ...current,
      [field]: player
        ? createSavedPlayer(player)
        : null,
    }));

    setMessage("");
  }

  function updatePositionAward(
    awardType,
    position,
    playerId
  ) {
    const player = findPlayer(
      players,
      playerId
    );

    setAwards((current) => ({
      ...current,
      [awardType]: {
        ...current[awardType],
        [position]: player
          ? createSavedPlayer(player)
          : null,
      },
    }));

    setMessage("");
  }

  function handleSave() {
    const allAwards =
      loadAllAwards();

    allAwards[String(currentSeason)] =
      awards;

    localStorage.setItem(
      "seasonAwards",
      JSON.stringify(allAwards)
    );

    setMessage(
      `${getSeasonLabel(
        currentSeason
      )}の表彰を保存しました。`
    );
  }

  return (
    <div
  style={pageStyle}
  className="awards-page"
>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
            {getSeasonLabel(
              currentSeason
            )} 表彰登録
          </h1>

          <Link
            to="/"
            style={linkStyle}
          >
            ← ホームへ戻る
          </Link>
        </div>
      </div>

      {message && (
        <div style={successStyle}>
          {message}
        </div>
      )}

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          主要表彰
        </h2>

        <AwardSelect
          label="MVP"
          value={awards.mvp}
          players={players}
          onChange={(playerId) =>
            updateSingleAward(
              "mvp",
              playerId
            )
          }
        />

        <AwardSelect
          label="新人王"
          value={awards.rookie}
          players={players}
          onChange={(playerId) =>
            updateSingleAward(
              "rookie",
              playerId
            )
          }
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          ベストナイン
        </h2>

        <p style={helpTextStyle}>
          投手・捕手・一塁手・二塁手・三塁手・
          遊撃手・外野手3名・指名打者の10名です。
        </p>

        {BEST_NINE_POSITIONS.map(
          (position) => (
            <PositionAwardSelect
              key={position}
              position={position}
              value={
                awards.bestNine[
                  position
                ]
              }
              players={players}
              onChange={(playerId) =>
                updatePositionAward(
                  "bestNine",
                  position,
                  playerId
                )
              }
            />
          )
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          ゴールデングラブ
        </h2>

        <p style={helpTextStyle}>
          投手・捕手・一塁手・二塁手・三塁手・
          遊撃手・外野手3名の9名です。
          指名打者はありません。
        </p>

        {GOLD_GLOVE_POSITIONS.map(
          (position) => (
            <PositionAwardSelect
              key={position}
              position={position}
              value={
                awards.goldGlove[
                  position
                ]
              }
              players={players}
              onChange={(playerId) =>
                updatePositionAward(
                  "goldGlove",
                  position,
                  playerId
                )
              }
            />
          )
        )}
      </section>

      <button
        type="button"
        onClick={handleSave}
        style={saveButtonStyle}
      >
        {getSeasonLabel(
          currentSeason
        )} の表彰を保存
      </button>
    </div>
  );
}

function AwardSelect({
  label,
  value,
  players,
  onChange,
}) {
  return (
    <div
  style={rowStyle}
  className="award-select-row"
>
      <label style={labelStyle}>
        {label}
      </label>

      <select
        value={value?.playerId ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={selectStyle}
      >
        <option value="">
          選択してください
        </option>

        {players.map((player) => (
  <option
    key={player.id}
    value={player.id}
  >
    {getTeamCode(player.teamName)} {player.name}
  </option>
))}
      </select>
    </div>
  );
}

function PositionAwardSelect({
  position,
  value,
  players,
  onChange,
}) {
  const selectablePlayers =
    players.filter((player) =>
      position === "投手"
        ? player.category === "投手"
        : player.category === "野手"
    );

  return (
    <div
  style={rowStyle}
  className="award-select-row"
>
      <label style={labelStyle}>
        {formatPositionLabel(
          position
        )}
      </label>

      <select
        value={value?.playerId ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={selectStyle}
      >
        <option value="">
          選択してください
        </option>

       {selectablePlayers.map((player) => (
  <option
    key={player.id}
    value={player.id}
  >
    {getTeamCode(player.teamName)} {player.name}
  </option>
))}
      </select>
    </div>
  );
}
function getTeamCode(teamName) {
  const teamCodes = {
    "和桐バブルス": "B",
    "タイガース": "T",
    "ライオンズ": "L",
    "ジャイアンツ": "G",
    "スワローズ": "S",
    "イーグルス": "E",
  };

  return teamCodes[teamName] ?? teamName;
}
function formatPositionLabel(position) {
  if (
    position.startsWith("外野手")
  ) {
    return position.replace(
      "外野手",
      "外野手 "
    );
  }

  return position;
}

function findPlayer(
  players,
  playerId
) {
  if (!playerId) {
    return null;
  }

  return players.find(
    (player) =>
      String(player.id) ===
      String(playerId)
  );
}

function createSavedPlayer(player) {
  return {
    playerId: player.id,
    playerName: player.name,
    teamName: player.teamName,
  };
}

function createEmptyAwards() {
  return {
    mvp: null,
    rookie: null,

    bestNine:
      BEST_NINE_POSITIONS.reduce(
        (result, position) => {
          result[position] = null;
          return result;
        },
        {}
      ),

    goldGlove:
      GOLD_GLOVE_POSITIONS.reduce(
        (result, position) => {
          result[position] = null;
          return result;
        },
        {}
      ),
  };
}

function loadAwards(seasonNumber) {
  const allAwards =
    loadAllAwards();

  const saved =
    allAwards[
      String(seasonNumber)
    ];

  if (!saved) {
    return createEmptyAwards();
  }

  const empty =
    createEmptyAwards();

  return {
    ...empty,
    ...saved,

    bestNine: {
      ...empty.bestNine,
      ...(saved.bestNine ?? {}),
    },

    goldGlove: {
      ...empty.goldGlove,
      ...(saved.goldGlove ?? {}),
    },
  };
}

function loadAllAwards() {
  try {
    const stored =
      localStorage.getItem(
        "seasonAwards"
      );

    if (!stored) {
      return {};
    }

    const parsed =
      JSON.parse(stored);

    return parsed &&
      typeof parsed === "object"
      ? parsed
      : {};
  } catch {
    return {};
  }
}

const pageStyle = {
  maxWidth: 850,
  margin: "0 auto",
  padding: 30,
  fontFamily: "sans-serif",
};

const topAreaStyle = {
  marginBottom: 25,
};

const linkStyle = {
  color: "#0066cc",
};

const sectionStyle = {
  marginTop: 25,
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 18,
};

const helpTextStyle = {
  marginBottom: 20,
  color: "#666666",
  lineHeight: 1.7,
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  marginBottom: 14,
  flexWrap: "wrap",
};

const labelStyle = {
  flex: "0 0 120px",
  fontWeight: "bold",
};

const selectStyle = {
  boxSizing: "border-box",
  flex: "1 1 350px",
  minHeight: 44,
  padding: 10,
  border: "1px solid #999999",
  borderRadius: 7,
  backgroundColor: "#ffffff",
  color: "#222222",
  fontSize: 16,
};

const saveButtonStyle = {
  width: "100%",
  marginTop: 30,
  padding: 15,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
};

const successStyle = {
  marginTop: 20,
  padding: 15,
  borderRadius: 8,
  backgroundColor: "#e8f5e9",
  color: "#1b5e20",
  fontWeight: "bold",
};