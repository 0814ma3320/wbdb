import { Link } from "react-router-dom";
import {
  getCurrentSeason,
  getViewingSeason,
  getSeasonLabel,
} from "../data/seasonStorage";
import {
  saveDataToCloud,
  loadDataFromCloud,
} from "../data/cloudStorage";

function downloadBackup() {
  const backupData = {};
  

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (key) {
      backupData[key] =
        localStorage.getItem(key);
    }
  }

  const backup = {
    createdAt: new Date().toISOString(),
    localStorage: backupData,
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `wakagiri-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  window.alert(
    "バックアップを保存しました。"
  );
}
export default function Home() {
  const currentSeason = getCurrentSeason();
  const viewingSeason = getViewingSeason();
   async function handleCloudSave() {
  try {
      await saveDataToCloud();

      window.alert(
        "クラウドに保存しました。"
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "クラウド保存に失敗しました。"
      );
    }
  }
    async function handleCloudLoad() {
    try {
      await loadDataFromCloud();

      window.alert(
        "クラウドから読み込みました。"
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      window.alert(
        "クラウド読み込みに失敗しました。"
      );
    }
  }
  return (
  <div
    style={pageStyle}
    className="home-page"
  >
      <h1 style={titleStyle}>
        パワポケデータ管理
      </h1>

      <p style={subTitleStyle}>
        和桐バブルスの試合・選手データ管理
      </p>
<div style={seasonStatusStyle}>
  <div style={seasonBoxStyle}>
    <span style={seasonLabelStyle}>
      進行中
    </span>

    <strong style={seasonValueStyle}>
      {getSeasonLabel(currentSeason)}
    </strong>
  </div>

  <div style={seasonBoxStyle}>
    <span style={seasonLabelStyle}>
      閲覧中
    </span>

    <strong style={seasonValueStyle}>
      {getSeasonLabel(viewingSeason)}
    </strong>
  </div>
</div>
      <div
  style={menuStyle}
  className="home-menu"
>
        <Link
          to="/game"
          style={buttonStyle}
        >
          <span style={iconStyle}>✏️</span>
          試合登録
        </Link>

        <Link
          to="/games"
          style={buttonStyle}
        >
          <span style={iconStyle}>⚾</span>
          試合一覧
        </Link>

        <Link
          to="/players"
          style={buttonStyle}
        >
          <span style={iconStyle}>👥</span>
          選手名鑑
        </Link>

                <Link
          to="/season"
          style={buttonStyle}
        >
          <span style={iconStyle}>🏆</span>
          シーズン成績
        </Link>
        <Link
  to="/season-management"
  style={buttonStyle}
>
  <span style={iconStyle}>🔄</span>
  シーズン管理
</Link>
        <Link
  to="/team-stats"
  style={buttonStyle}
>
  <span style={iconStyle}>📊</span>
  チーム成績
</Link>

<Link
  to="/awards"
  style={buttonStyle}
>
  <span style={iconStyle}>🥇</span>
  表彰登録
</Link>

<Link
  to="/players/manage"
  style={buttonStyle}
>
  <span style={iconStyle}>⚙️</span>
  選手管理
</Link>
<button
  type="button"
  onClick={downloadBackup}
  style={backupButtonStyle}
>
  <span style={iconStyle}>💾</span>
  データバックアップ
</button>
<button
  type="button"
  onClick={handleCloudSave}
  style={cloudButtonStyle}
>
  <span style={iconStyle}>☁️</span>
  クラウド保存
</button>
<button
  type="button"
  onClick={handleCloudLoad}
  style={cloudButtonStyle}
>
  <span style={iconStyle}>📥</span>
  クラウドから読込
</button>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "60px 30px",
  fontFamily: "sans-serif",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: 10,
  fontSize: 36,
};

const subTitleStyle = {
  color: "#666",
  marginBottom: 45,
};
const seasonStatusStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 35,
};

const seasonBoxStyle = {
  minWidth: 150,
  padding: "14px 20px",
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#f7f7f7",
};

const seasonLabelStyle = {
  display: "block",
  marginBottom: 5,
  color: "#666666",
  fontSize: 13,
};

const seasonValueStyle = {
  fontSize: 20,
};
const menuStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  maxWidth: 800,
  margin: "0 auto",
};

const buttonStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 130,
  padding: 20,
  backgroundColor: "#222",
  color: "#fff",
  textDecoration: "none",
  borderRadius: 12,
  fontSize: 20,
  fontWeight: "bold",
};

const iconStyle = {
  display: "block",
  marginBottom: 10,
  fontSize: 32,
};
const backupButtonStyle = {
  ...buttonStyle,
  width: "100%",
  border: "none",
  fontFamily: "inherit",
  cursor: "pointer",
};
const cloudButtonStyle = {
  ...buttonStyle,
  width: "100%",
  border: "none",
  fontFamily: "inherit",
  cursor: "pointer",
};