import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getPlayersForSeason } from "../data/playerStorage";
import { getGameSeason } from "../data/seasonStorage";
import { formatSeasonDate } from "../utils/seasonCalendar";

export default function PitcherRelayEdit() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const games = loadGames();
  const game = games.find(
    (item) =>
      String(item.id) === String(gameId)
  );

  const gameSeason = getGameSeason(game);

const pitchers = getPlayersForSeason(
  gameSeason
)
  .filter(
    (player) =>
      player.teamName === "和桐バブルス" &&
      player.category === "投手"
  )
  .sort(
    (a, b) =>
      Number(a.number ?? 999) -
      Number(b.number ?? 999)
  );

  const [relay, setRelay] = useState(() =>
    createInitialRelay(
      game?.pitcherAppearances
    )
  );

  const [error, setError] = useState("");

  if (!game) {
    return (
      <div style={pageStyle}>
        <h1>試合が見つかりません</h1>

        <Link
          to="/games"
          style={linkStyle}
        >
          ← 試合一覧へ戻る
        </Link>
      </div>
    );
  }

  function addPitcher() {
    setRelay((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        playerId: "",
        playerNumber: "",
        playerName: "",
      },
    ]);

    setError("");
  }

  function removePitcher(index) {
    setRelay((current) =>
      current.filter(
        (_, rowIndex) =>
          rowIndex !== index
      )
    );

    setError("");
  }

  function handlePlayerChange(
    index,
    playerId
  ) {
    const selectedPlayer =
      pitchers.find(
        (player) =>
          String(player.id) ===
          String(playerId)
      );

    setRelay((current) =>
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
          playerId: selectedPlayer.id,
          playerNumber:
            selectedPlayer.number ?? "",
          playerName:
            selectedPlayer.name,
        };
      })
    );

    setError("");
  }

  function movePitcher(
    index,
    direction
  ) {
    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= relay.length
    ) {
      return;
    }

    setRelay((current) => {
      const copied = [...current];

      const temporary =
        copied[index];

      copied[index] =
        copied[nextIndex];

      copied[nextIndex] =
        temporary;

      return copied;
    });
  }

  function handleSave() {
    const validationError =
      validateRelay(relay);

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const cleanedRelay =
      relay
        .filter(
          (row) =>
            row.playerId !== ""
        )
        .map((row, index) => ({
          order: index + 1,
          playerId: row.playerId,
          playerNumber:
            row.playerNumber,
          playerName:
            row.playerName,
        }));

    const updatedGames =
      games.map((item) => {
        if (
          String(item.id) !==
          String(gameId)
        ) {
          return item;
        }

        return {
          ...item,
          pitcherAppearances:
            cleanedRelay,
          updatedAt:
            new Date().toISOString(),
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
            投手リレー登録
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
            {formatSeasonDate(
              game.date
            )}
          </strong>

          <span>
            VS {game.opponent}
          </span>
        </div>
      </div>

      <section style={noticeStyle}>
        <strong>
          登板順に登録してください
        </strong>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          先発投手を1番上にして、
          その後の中継ぎ・抑えを
          登板順に追加します。
        </p>
      </section>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div style={relayAreaStyle}>
        {relay.length === 0 ? (
          <p style={emptyTextStyle}>
            登板投手はまだ登録されていません。
          </p>
        ) : (
          relay.map(
            (row, index) => (
              <div
                key={row.id}
                style={rowStyle}
              >
                <div style={orderStyle}>
                  {index + 1}
                </div>

                <div style={playerFieldStyle}>
                  <label
                    style={labelStyle}
                  >
                    投手
                  </label>

                  <select
                    value={
                      row.playerId
                    }
                    onChange={(
                      event
                    ) =>
                      handlePlayerChange(
                        index,
                        event.target.value
                      )
                    }
                    style={selectStyle}
                  >
                    <option value="">
                      投手を選択してください
                    </option>

                    {pitchers.map(
                      (pitcher) => (
                        <option
                          key={
                            pitcher.id
                          }
                          value={
                            pitcher.id
                          }
                        >
                          {pitcher.number}　
                          {pitcher.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div style={rowButtonAreaStyle}>
                  <button
                    type="button"
                    onClick={() =>
                      movePitcher(
                        index,
                        -1
                      )
                    }
                    disabled={
                      index === 0
                    }
                    style={
                      smallButtonStyle
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      movePitcher(
                        index,
                        1
                      )
                    }
                    disabled={
                      index ===
                      relay.length - 1
                    }
                    style={
                      smallButtonStyle
                    }
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removePitcher(
                        index
                      )
                    }
                    style={
                      removeButtonStyle
                    }
                  >
                    削除
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>

      <button
        type="button"
        onClick={addPitcher}
        style={addButtonStyle}
      >
        ＋ 投手を追加
      </button>

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
          投手リレーを保存
        </button>
      </div>
    </div>
  );
}

function createInitialRelay(
  savedRelay
) {
  if (!Array.isArray(savedRelay)) {
    return [];
  }

  return savedRelay.map(
    (row, index) => ({
      id:
        row.id ??
        `relay-${index}`,
      playerId:
        row.playerId ?? "",
      playerNumber:
        row.playerNumber ?? "",
      playerName:
        row.playerName ?? "",
    })
  );
}

function validateRelay(relay) {
  const filledRows =
    relay.filter(
      (row) =>
        row.playerId !== ""
    );

  const incompleteRow =
    relay.find(
      (row) =>
        row.playerId === "" &&
        (
          row.playerName !== "" ||
          row.playerNumber !== ""
        )
    );

  if (incompleteRow) {
    return "投手が正しく選択されていない行があります。";
  }

  const playerIds =
    filledRows.map(
      (row) =>
        String(row.playerId)
    );

  if (
    new Set(playerIds).size !==
    playerIds.length
  ) {
    return "同じ投手を複数回登録することはできません。";
  }

  return "";
}

function loadGames() {
  try {
    const storedData =
      localStorage.getItem(
        "games"
      );

    const parsedData =
      storedData
        ? JSON.parse(
            storedData
          )
        : [];

    return Array.isArray(
      parsedData
    )
      ? parsedData
      : [];
  } catch {
    return [];
  }
}

const pageStyle = {
  maxWidth: 900,
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

const relayAreaStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  marginTop: 25,
};

const rowStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: 14,
  padding: 16,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
  flexWrap: "wrap",
};

const orderStyle = {
  minWidth: 42,
  paddingBottom: 10,
  fontSize: 26,
  fontWeight: "bold",
  textAlign: "center",
};

const playerFieldStyle = {
  flex: "1 1 300px",
};

const labelStyle = {
  display: "block",
  marginBottom: 7,
  fontWeight: "bold",
};

const selectStyle = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: 46,
  padding: 11,
  border: "1px solid #999999",
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#222222",
  fontSize: 16,
};

const rowButtonAreaStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const smallButtonStyle = {
  minWidth: 44,
  minHeight: 44,
  padding: "8px 12px",
  border: "1px solid #888888",
  borderRadius: 7,
  backgroundColor: "#ffffff",
  cursor: "pointer",
};

const addButtonStyle = {
  marginTop: 20,
  minHeight: 46,
  padding: "11px 18px",
  border: "none",
  borderRadius: 8,
  backgroundColor: "#0066cc",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

const removeButtonStyle = {
  minHeight: 44,
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
  minHeight: 48,
  padding: "13px 24px",
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};