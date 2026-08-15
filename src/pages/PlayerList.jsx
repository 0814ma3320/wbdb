import { Link } from "react-router-dom";
import { getPlayersForSeason } from "../data/playerStorage";
import { getViewingSeason } from "../data/seasonStorage";

export default function PlayerList() {
 const viewingSeason = getViewingSeason();

const players = getPlayersForSeason(
  viewingSeason
)
  .filter(
    (player) =>
      player.teamName === "和桐バブルス"
  )
  .sort(
    (a, b) =>
      Number(a.number) - Number(b.number)
  );

  const catchers = players.filter(
    (player) =>
      player.category === "野手" &&
      player.position === "捕手"
  );

  const infielders = players.filter(
    (player) =>
      player.category === "野手" &&
      player.position === "内野手"
  );

  const outfielders = players.filter(
    (player) =>
      player.category === "野手" &&
      player.position === "外野手"
  );

  const pitchers = players.filter(
    (player) => player.category === "投手"
  );

  return (
    <div
  style={pageStyle}
  className="player-list-page"
>
      <h1>選手名鑑</h1>

      <p>
        <Link to="/" style={backLinkStyle}>
          ← ホームへ戻る
        </Link>
      </p>

      <p>
        <Link
          to="/players/manage"
          style={managementLinkStyle}
        >
          選手管理画面を開く
        </Link>
      </p>

      <p>
        登録選手：
        <strong>{players.length}人</strong>
      </p>

      <PlayerTable
        title="捕手"
        players={catchers}
        isPitcher={false}
      />

      <PlayerTable
        title="内野手"
        players={infielders}
        isPitcher={false}
      />

      <PlayerTable
        title="外野手"
        players={outfielders}
        isPitcher={false}
      />

      <PlayerTable
        title="投手"
        players={pitchers}
        isPitcher={true}
      />
    </div>
  );
}

function PlayerTable({
  title,
  players,
  isPitcher,
}) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2>
        {title}（{players.length}人）
      </h2>

      <div
  style={{ overflowX: "auto" }}
  className="player-table-scroll"
>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>
                背番号
              </th>

              <th style={headerStyle}>
                選手名
              </th>

              <th style={headerStyle}>
                所属
              </th>

              <th style={headerStyle}>
                {isPitcher
                  ? "役割"
                  : "守備区分"}
              </th>

              <th style={headerStyle}>
                {isPitcher
                  ? "利き手"
                  : "投打"}
              </th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td style={cellStyle}>
                  {player.number}
                </td>

                <td style={cellStyle}>
                  <Link
                    to={`/players/${player.id}`}
                    style={playerLinkStyle}
                  >
                    {player.name}
                  </Link>
                </td>

                <td style={cellStyle}>
                  {player.teamName ??
                    "和桐バブルス"}
                </td>

                <td style={cellStyle}>
                  {player.position}
                </td>

                <td style={cellStyle}>
                  {isPitcher
                    ? player.throws
                    : player.throwsBats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const pageStyle = {
  padding: 30,
  maxWidth: 1100,
  margin: "0 auto",
  fontFamily: "sans-serif",
};

const tableStyle = {
  width: "100%",
  minWidth: 700,
  borderCollapse: "collapse",
};

const headerStyle = {
  border: "1px solid #666",
  padding: 12,
  backgroundColor: "#222",
  color: "#fff",
  textAlign: "center",
};

const cellStyle = {
  border: "1px solid #aaa",
  padding: 10,
  textAlign: "center",
};

const playerLinkStyle = {
  color: "#0066cc",
  textDecoration: "underline",
  fontWeight: "bold",
  cursor: "pointer",
};

const backLinkStyle = {
  color: "#0066cc",
};

const managementLinkStyle = {
  display: "inline-block",
  padding: "10px 16px",
  backgroundColor: "#222",
  color: "#fff",
  textDecoration: "none",
  borderRadius: 4,
};