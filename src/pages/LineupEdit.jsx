import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";
import { getGameSeason } from "../data/seasonStorage";
import { formatSeasonDate } from "../utils/seasonCalendar";



const positionOptions = [
  { value: "捕", label: "捕手" },
  { value: "一", label: "一塁手" },
  { value: "二", label: "二塁手" },
  { value: "三", label: "三塁手" },
  { value: "遊", label: "遊撃手" },
  { value: "左", label: "左翼手" },
  { value: "中", label: "中堅手" },
  { value: "右", label: "右翼手" },
  { value: "指", label: "指名打者" },
];

export default function LineupEdit() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const games = loadGames();

  const game = games.find(
    (item) =>
      String(item.id) === String(gameId)
  );

  const [lineup, setLineup] = useState(() =>
    createInitialLineup(game?.lineup)
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
const gameSeason = getGameSeason(game);

const players = getPlayersForSeason(
  gameSeason
)
  .filter(
    (player) =>
      player.teamName === "和桐バブルス" &&
      player.category === "野手"
  )
  .sort(
    (a, b) =>
      Number(a.number) - Number(b.number)
  );
  function handlePlayerChange(
    index,
    playerNumber
  ) {
    const selectedPlayer = players.find(
      (player) =>
        String(player.number) ===
        String(playerNumber)
    );

    setLineup((current) =>
      current.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        if (!selectedPlayer) {
          return {
            ...row,
            playerId: "",
            playerNumber: "",
            playerName: "",
          };
        }

        return {
          ...row,
          playerId: String(
            selectedPlayer.number
          ),
          playerNumber:
            selectedPlayer.number,
          playerName: selectedPlayer.name,
        };
      })
    );

    setError("");
  }

  function handlePositionChange(
    index,
    position
  ) {
    setLineup((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              position,
            }
          : row
      )
    );

    setError("");
  }

  function handleSave() {
    const validationError =
      validateLineup(lineup);

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const updatedGames = games.map((item) => {
      if (
        String(item.id) !== String(gameId)
      ) {
        return item;
      }

      return {
        ...item,

        lineup: lineup.map((row) => ({
          battingOrder: row.battingOrder,
          playerId: String(row.playerId),
          playerNumber: row.playerNumber,
          playerName: row.playerName,
          position: row.position,
        })),

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
            スタメン登録
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

          <span>VS {game.opponent}</span>
        </div>
      </div>

      <section style={noticeStyle}>
        <strong>DH制</strong>

        <p style={{ marginBottom: 0 }}>
          投手はスタメンに含めません。
          捕・一・二・三・遊・左・中・右・指を
          1人ずつ登録してください。
        </p>
      </section>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div style={lineupAreaStyle}>
        {lineup.map((row, index) => (
          <div
            key={row.battingOrder}
            style={rowStyle}
          >
            <div style={orderStyle}>
              {row.battingOrder}
              <span style={orderSuffixStyle}>
                番
              </span>
            </div>

            <div style={playerFieldStyle}>
              <label style={labelStyle}>
                選手
              </label>

              <select
                value={row.playerId}
                onChange={(event) =>
                  handlePlayerChange(
                    index,
                    event.target.value
                  )
                }
                style={selectStyle}
              >
                <option value="">
                  選手を選択してください
                </option>

                {players.map((player) => (
                  <option
                    key={player.number}
                    value={String(
                      player.number
                    )}
                  >
                    {player.number}　
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={positionFieldStyle}>
              <label style={labelStyle}>
                守備位置
              </label>

              <select
                value={row.position}
                onChange={(event) =>
                  handlePositionChange(
                    index,
                    event.target.value
                  )
                }
                style={selectStyle}
              >
                <option value="">
                  守備位置を選択
                </option>

                {positionOptions.map(
                  (position) => (
                    <option
                      key={position.value}
                      value={position.value}
                    >
                      {position.value}　
                      {position.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        ))}
      </div>

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
          スタメンを保存
        </button>
      </div>
    </div>
  );
}

function createInitialLineup(savedLineup) {
  const lineupData = Array.isArray(
    savedLineup
  )
    ? savedLineup
    : [];

  return Array.from(
    {
      length: 9,
    },
    (_, index) => {
      const battingOrder = index + 1;

      const savedRow = lineupData.find(
        (row) =>
          Number(row.battingOrder) ===
          battingOrder
      );

      return {
        battingOrder,

        playerId: savedRow?.playerId
          ? String(savedRow.playerId)
          : savedRow?.playerNumber
          ? String(savedRow.playerNumber)
          : "",

        playerNumber:
          savedRow?.playerNumber ?? "",

        playerName:
          savedRow?.playerName ?? "",

        position:
          savedRow?.position === "投"
            ? ""
            : savedRow?.position ?? "",
      };
    }
  );
}

function validateLineup(lineup) {
  const incompleteRow = lineup.find(
    (row) =>
      !row.playerId ||
      !row.playerName ||
      !row.position
  );

  if (incompleteRow) {
    return `${incompleteRow.battingOrder}番の選手または守備位置が未入力です。`;
  }

  const playerIds = lineup.map(
    (row) => String(row.playerId)
  );

  if (
    new Set(playerIds).size !==
    playerIds.length
  ) {
    return "同じ選手が複数の打順に登録されています。";
  }

  const positions = lineup.map(
    (row) => row.position
  );

  if (
    new Set(positions).size !==
    positionOptions.length
  ) {
    return "同じ守備位置が複数登録されています。";
  }

  const requiredPositions =
    positionOptions.map(
      (position) => position.value
    );

  const missingPosition =
    requiredPositions.find(
      (position) =>
        !positions.includes(position)
    );

  if (missingPosition) {
    const positionName =
      positionOptions.find(
        (position) =>
          position.value === missingPosition
      )?.label;

    return `${positionName}が登録されていません。`;
  }

  return "";
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
  gap: 5,
  padding: "12px 18px",
  borderRadius: 8,
  backgroundColor: "#f2f2f2",
};

const noticeStyle = {
  marginTop: 30,
  padding: 18,
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

const lineupAreaStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  marginTop: 25,
};

const rowStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: 18,
  padding: 18,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  flexWrap: "wrap",
};

const orderStyle = {
  minWidth: 70,
  paddingBottom: 9,
  fontSize: 28,
  fontWeight: "bold",
  textAlign: "center",
};

const orderSuffixStyle = {
  marginLeft: 3,
  fontSize: 15,
};

const playerFieldStyle = {
  flex: "1 1 350px",
};

const positionFieldStyle = {
  flex: "1 1 210px",
};

const labelStyle = {
  display: "block",
  marginBottom: 7,
  fontWeight: "bold",
};

const selectStyle = {
  boxSizing: "border-box",
  width: "100%",
  padding: 11,
  border: "1px solid #999999",
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#222222",
  fontSize: 16,
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