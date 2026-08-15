import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getPlayers,
  savePlayers,
} from "../data/playerStorage";
import { getCurrentSeason } from "../data/seasonStorage";
export default function PlayerManagement() {
  const currentSeason = getCurrentSeason();

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [category, setCategory] =
    useState("野手");

  const [throwsBats, setThrowsBats] =
    useState("右投右打");

  const [playerList, setPlayerList] =
    useState(() => getPlayers());

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] =
    useState("捕手");
    const [teamName, setTeamName] =
  useState("和桐バブルス");
const [editingPlayerId, setEditingPlayerId] =
  useState(null);

const [editingNumber, setEditingNumber] =
  useState("");
  const sortedPlayers = [...playerList].sort(
    (a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      return a.number - b.number;
    }
  );

  function handleCategoryChange(event) {
    const nextCategory = event.target.value;

    setCategory(nextCategory);

    if (nextCategory === "野手") {
      setPosition("捕手");
      setThrowsBats("右投右打");
    } else {
      setPosition("先発");
      setThrowsBats("右投");
    }
  }

 function addPlayer() {
  const trimmedName = name.trim();
  const isBubblesPlayer =
    teamName === "和桐バブルス";

  if (!trimmedName) {
    alert("選手名を入力してください");
    return;
  }

  let numericNumber = null;

  if (isBubblesPlayer) {
    numericNumber = Number(number);

    if (
      number === "" ||
      Number.isNaN(numericNumber)
    ) {
      alert("背番号を入力してください");
      return;
    }

    if (numericNumber < 0) {
      alert("背番号は0以上で入力してください");
      return;
    }

    const duplicatedNumber = playerList.some(
      (player) =>
        player.active &&
        player.teamName === "和桐バブルス" &&
        Number(player.number) === numericNumber
    );

    if (duplicatedNumber) {
      const shouldContinue = window.confirm(
        `背番号${numericNumber}は和桐バブルスの現役選手が使用しています。\nそのまま追加しますか？`
      );

      if (!shouldContinue) {
        return;
      }
    }
  }

  const newPlayer = {
    id: `player-${Date.now()}`,
    name: trimmedName,
    teamName,
    category,
    active: true,
joinedSeason: currentSeason,
leftSeason: null,
tenures: [
  {
    joinedSeason: currentSeason,
    leftSeason: null,
  },
],
    number: isBubblesPlayer
      ? numericNumber
      : null,

    position: isBubblesPlayer
      ? position
      : null,

    ...(isBubblesPlayer
      ? category === "野手"
        ? {
            throwsBats,
          }
        : {
            throws: throwsBats,
          }
      : {}),
  };

  const updatedPlayers = [
    ...playerList,
    newPlayer,
  ];

  setPlayerList(updatedPlayers);
  savePlayers(updatedPlayers);

  setName("");
  setNumber("");
  setCategory("野手");
  setPosition("捕手");
  setThrowsBats("右投右打");
  setTeamName("和桐バブルス");
  setShowAddForm(false);
}

 function togglePlayerStatus(playerId) {
  const targetPlayer = playerList.find(
    (player) => player.id === playerId
  );

  if (!targetPlayer) {
    return;
  }

  const nextStatus = !targetPlayer.active;

  const message = nextStatus
    ? `${targetPlayer.name}をSeason ${currentSeason}から現役復帰させますか？`
    : `${targetPlayer.name}をSeason ${currentSeason}で退団扱いにしますか？\n過去の記録は削除されません。`;

  if (!window.confirm(message)) {
    return;
  }

  const updatedPlayers = playerList.map(
    (player) => {
      if (player.id !== playerId) {
        return player;
      }

      const tenures =
        Array.isArray(player.tenures) &&
        player.tenures.length > 0
          ? [...player.tenures]
          : [
              {
                joinedSeason:
                  player.joinedSeason ?? 1,
                leftSeason:
                  player.leftSeason ?? null,
              },
            ];

      if (nextStatus) {
        tenures.push({
          joinedSeason: currentSeason,
          leftSeason: null,
        });

        return {
          ...player,
          active: true,
          leftSeason: null,
          tenures,
        };
      }

      const updatedTenures =
        tenures.map((tenure, index) =>
          index === tenures.length - 1
            ? {
                ...tenure,
                leftSeason: currentSeason,
              }
            : tenure
        );

      return {
        ...player,
        active: false,
        leftSeason: currentSeason,
        tenures: updatedTenures,
      };
    }
  );

  setPlayerList(updatedPlayers);
  savePlayers(updatedPlayers);
}
function deletePlayer(playerId) {
  const targetPlayer = playerList.find(
    (player) => player.id === playerId
  );

  if (!targetPlayer) {
    return;
  }

  const confirmed = window.confirm(
    `${targetPlayer.name}を完全に削除しますか？\n\nこの操作は取り消せません。テスト選手や誤登録した選手だけに使用してください。`
  );

  if (!confirmed) {
    return;
  }

  const updatedPlayers = playerList.filter(
    (player) => player.id !== playerId
  );

  setPlayerList(updatedPlayers);
  savePlayers(updatedPlayers);
}
function startEdit(player) {
  setEditingPlayerId(player.id);
  setEditingNumber(String(player.number));
}

function cancelEdit() {
  setEditingPlayerId(null);
  setEditingNumber("");
}

function saveNumber(playerId) {
  const numericNumber = Number(editingNumber);

  if (
    editingNumber === "" ||
    Number.isNaN(numericNumber)
  ) {
    alert("背番号を入力してください");
    return;
  }

  if (numericNumber < 0) {
    alert("背番号は0以上で入力してください");
    return;
  }

  const duplicatedNumber = playerList.some(
    (player) =>
      player.id !== playerId &&
      player.active &&
      Number(player.number) === numericNumber
  );

  if (duplicatedNumber) {
    const shouldContinue = window.confirm(
      `背番号${numericNumber}は別の現役選手が使用しています。\nそのまま変更しますか？`
    );

    if (!shouldContinue) {
      return;
    }
  }

  const updatedPlayers = playerList.map(
    (player) =>
      player.id === playerId
        ? {
            ...player,
            number: numericNumber,
          }
        : player
  );

  setPlayerList(updatedPlayers);
  savePlayers(updatedPlayers);

  setEditingPlayerId(null);
  setEditingNumber("");
}

  return (
    <div style={pageStyle}>
      <div style={topStyle}>
        <h1>選手管理</h1>

        <Link to="/">← ホームへ戻る</Link>
      </div>

      <button
        onClick={() =>
          setShowAddForm((current) => !current)
        }
        style={buttonStyle}
      >
        ＋ 新規選手追加
      </button>

    {showAddForm && (
  <div style={formStyle}>
    <h3 style={formTitleStyle}>
      新規選手
    </h3>

    <input
      type="text"
      placeholder="選手名"
      value={name}
      onChange={(event) =>
        setName(event.target.value)
      }
    />

    <select
      value={teamName}
      onChange={(event) =>
        setTeamName(event.target.value)
      }
    >
      <option value="和桐バブルス">
        和桐バブルス
      </option>
      <option value="ライオンズ">
        ライオンズ
      </option>
      <option value="ジャイアンツ">
        ジャイアンツ
      </option>
      <option value="イーグルス">
        イーグルス
      </option>
      <option value="スワローズ">
        スワローズ
      </option>
      <option value="タイガース">
        タイガース
      </option>
    </select>

    <select
      value={category}
      onChange={handleCategoryChange}
    >
      <option value="野手">野手</option>
      <option value="投手">投手</option>
    </select>

    {teamName === "和桐バブルス" && (
      <>
        <input
          type="number"
          placeholder="背番号"
          min="0"
          value={number}
          onChange={(event) =>
            setNumber(event.target.value)
          }
        />

        <select
          value={position}
          onChange={(event) =>
            setPosition(event.target.value)
          }
        >
          {category === "野手" ? (
            <>
              <option value="捕手">捕手</option>
              <option value="内野手">内野手</option>
              <option value="外野手">外野手</option>
            </>
          ) : (
            <>
              <option value="先発">先発</option>
              <option value="中継ぎ">中継ぎ</option>
            </>
          )}
        </select>

        <select
          value={throwsBats}
          onChange={(event) =>
            setThrowsBats(event.target.value)
          }
        >
          {category === "野手" ? (
            <>
              <option value="右投右打">右投右打</option>
              <option value="右投左打">右投左打</option>
              <option value="右投両打">右投両打</option>
              <option value="左投左打">左投左打</option>
              <option value="左投右打">左投右打</option>
              <option value="左投両打">左投両打</option>
            </>
          ) : (
            <>
              <option value="右投">右投</option>
              <option value="左投">左投</option>
            </>
          )}
        </select>
      </>
    )}

    <button
      onClick={addPlayer}
      style={addButtonStyle}
    >
      追加
    </button>
  </div>
)}

      <p>
        登録選手：
        <strong>{playerList.length}人</strong>
      </p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>背番号</th>
            <th style={headerStyle}>名前</th>
            <th style={headerStyle}>所属</th>
            <th style={headerStyle}>区分</th>
            <th style={headerStyle}>
              ポジション
            </th>
                        <th style={headerStyle}>投打</th>
            <th style={headerStyle}>状態</th>
<th style={headerStyle}>加入Season</th>
<th style={headerStyle}>退団Season</th>
<th style={headerStyle}>操作</th>
          </tr>
        </thead>

        <tbody>
          {sortedPlayers.map((player) => (
            <tr key={player.id}>
              <td style={cellStyle}>
  {editingPlayerId === player.id ? (
    <input
      type="number"
      min="0"
      value={editingNumber}
      onChange={(event) =>
        setEditingNumber(event.target.value)
      }
      style={{
        width: 65,
        padding: 6,
        textAlign: "center",
      }}
    />
 ) : (
  player.number ?? "－"
)}
</td>

              <td style={cellStyle}>
                {player.name}
              </td>

              <td style={cellStyle}>
                {player.teamName ??
                  "和桐バブルス"}
              </td>

              <td style={cellStyle}>
                {player.category}
              </td>

              <td style={cellStyle}>
  {player.position ?? "－"}
</td>

              <td style={cellStyle}>
  {player.throwsBats ??
    player.throws ??
    "－"}
</td>

                            <td style={cellStyle}>
                {player.active
                  ? "現役"
                  : "退団"}
              </td>
<td style={cellStyle}>
  Season {player.joinedSeason ?? 1}
</td>

<td style={cellStyle}>
  {player.active
    ? "－"
    : `Season ${player.leftSeason ?? "-"}`}
</td>
              <td style={cellStyle}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 6,
      flexWrap: "wrap",
    }}
  >
    {(player.teamName ?? "和桐バブルス") ===
  "和桐バブルス" &&
  (editingPlayerId === player.id ? (
    <>
      <button
        type="button"
        onClick={() => saveNumber(player.id)}
        style={saveButtonStyle}
      >
        保存
      </button>

      <button
        type="button"
        onClick={cancelEdit}
        style={cancelButtonStyle}
      >
        キャンセル
      </button>
    </>
  ) : (
    <button
      type="button"
      onClick={() => startEdit(player)}
      style={editButtonStyle}
    >
      背番号編集
    </button>
  ))}

    <button
      type="button"
      onClick={() =>
        togglePlayerStatus(player.id)
      }
      style={
        player.active
          ? retireButtonStyle
          : returnButtonStyle
      }
    >
      {player.active
        ? "退団"
        : "現役復帰"}
    </button>
    <button
  type="button"
  onClick={() =>
    deletePlayer(player.id)
  }
  style={deleteButtonStyle}
>
  完全削除
</button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const pageStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: 30,
  fontFamily: "sans-serif",
};

const topStyle = {
  marginBottom: 25,
};

const tableStyle = {
  width: "100%",
  minWidth: 850,
  borderCollapse: "collapse",
};

const headerStyle = {
  border: "1px solid #666",
  padding: 10,
  backgroundColor: "#222",
  color: "#fff",
  textAlign: "center",
};

const cellStyle = {
  border: "1px solid #aaa",
  padding: 10,
  textAlign: "center",
};

const buttonStyle = {
  marginBottom: 20,
  padding: "10px 18px",
  fontSize: 16,
  cursor: "pointer",
};

const addButtonStyle = {
  padding: "8px 18px",
  cursor: "pointer",
  fontWeight: "bold",
};

const formStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 20,
};

const formTitleStyle = {
  width: "100%",
  margin: "0 0 5px",
};
const retireButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #b00020",
  color: "#b00020",
  borderRadius: 4,
  fontWeight: "bold",
};

const returnButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #087f23",
  color: "#087f23",
  borderRadius: 4,
  fontWeight: "bold",
};
const editButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #0066cc",
  color: "#0066cc",
  borderRadius: 4,
  fontWeight: "bold",
};

const saveButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#0066cc",
  border: "1px solid #0066cc",
  color: "#fff",
  borderRadius: 4,
  fontWeight: "bold",
};

const cancelButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #666",
  color: "#333",
  borderRadius: 4,
  fontWeight: "bold",
};
const deleteButtonStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#b00020",
  border: "1px solid #b00020",
  color: "#fff",
  borderRadius: 4,
  fontWeight: "bold",
};