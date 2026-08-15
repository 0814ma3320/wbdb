import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentSeason,
  getViewingSeason,
  getSeasonLabel,
  setViewingSeason,
  startNextSeason,
} from "../data/seasonStorage";

export default function SeasonManagement() {
  const currentSeason = getCurrentSeason();

const viewingSeason = getViewingSeason();

const [selectedSeason, setSelectedSeason] =
  useState(viewingSeason);

function handleSeasonChange() {
  setViewingSeason(selectedSeason);

  window.location.reload();
}
  function handleNextSeason() {
    const nextSeason = currentSeason + 1;

    const confirmed = window.confirm(
      `${getSeasonLabel(currentSeason)}を終了して、Season ${nextSeason}を開始しますか？\n\nSeason ${currentSeason}の試合・個人成績は削除されません。`
    );

    if (!confirmed) {
      return;
    }

    startNextSeason();

    window.alert(
      `Season ${nextSeason}を開始しました。`
    );

    window.location.reload();
  }

  return (
    <div
  style={pageStyle}
  className="season-management-page"
>
      <div style={topAreaStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
            シーズン管理
          </h1>

          <Link to="/" style={linkStyle}>
            ← ホームへ戻る
          </Link>
        </div>
      </div>

     
    <section
  style={seasonStatusGridStyle}
  className="season-management-grid"
>
  <div style={currentSeasonStyle}>
    <div style={smallLabelStyle}>
      進行中Season
    </div>

    <div style={seasonNumberStyle}>
      {getSeasonLabel(currentSeason)}
    </div>

    <div style={statusNoteStyle}>
      新しく登録する試合はここに保存されます
    </div>
  </div>

  <div style={viewingSeasonStyle}>
    <div style={smallLabelDarkStyle}>
      閲覧中Season
    </div>

    <div style={seasonNumberDarkStyle}>
      {getSeasonLabel(viewingSeason)}
    </div>

    <div style={statusNoteDarkStyle}>
      試合一覧・個人成績・チーム成績などは
      このSeasonを表示します
    </div>
  </div>
</section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>
          次のシーズン
        </h2>

        <p style={descriptionStyle}>
          Season {currentSeason} のデータを残したまま、
          Season {currentSeason + 1} を開始します。
        </p>

        <p style={warningStyle}>
          次のSeasonを開始すると、新しく登録する試合は
          Season {currentSeason + 1} の成績として集計されます。
        </p>

        <button
          type="button"
          onClick={handleNextSeason}
          style={nextSeasonButtonStyle}
        >
          Season {currentSeason + 1} を開始
        </button>
      </section>

      <section style={sectionStyle}>
  <h2 style={{ marginTop: 0 }}>
    シーズン切り替え
  </h2>

  <p style={descriptionStyle}>
    見たいSeasonを選択してください。
  </p>

  <select
    value={selectedSeason}
    onChange={(event) =>
      setSelectedSeason(
        Number(event.target.value)
      )
    }
    style={seasonSelectStyle}
  >
    {Array.from(
      { length: currentSeason },
      (_, index) => index + 1
    ).map((seasonNumber) => (
      <option
        key={seasonNumber}
        value={seasonNumber}
      >
        Season {seasonNumber}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={handleSeasonChange}
    style={changeSeasonButtonStyle}
  >
    このSeasonを見る
  </button>
</section>
<section style={sectionStyle}>
  <h2 style={{ marginTop: 0 }}>
    Season1 初期成績
  </h2>

  <p style={descriptionStyle}>
    Season1途中までの通算成績を登録します。
    ここで入力した数字に、
    以降の試合成績が加算されます。
  </p>

  <Link
    to="/season1-base-stats"
    style={baseStatsButtonStyle}
  >
    Season1初期成績を登録
  </Link>
</section>
    </div>
  );
}

const pageStyle = {
  maxWidth: 800,
  margin: "0 auto",
  padding: 30,
  fontFamily: "sans-serif",
};

const topAreaStyle = {
  marginBottom: 30,
};

const linkStyle = {
  color: "#0066cc",
};

const currentSeasonStyle = {
  padding: 30,
  borderRadius: 12,
  backgroundColor: "#222222",
  color: "#ffffff",
  textAlign: "center",
};

const smallLabelStyle = {
  marginBottom: 8,
  fontSize: 15,
};

const seasonNumberStyle = {
  fontSize: 38,
  fontWeight: "bold",
};

const sectionStyle = {
  marginTop: 25,
  padding: 24,
  border: "1px solid #cccccc",
  borderRadius: 10,
  backgroundColor: "#ffffff",
};

const descriptionStyle = {
  lineHeight: 1.7,
};

const warningStyle = {
  marginTop: 20,
  padding: 15,
  borderRadius: 8,
  backgroundColor: "#fff8e1",
  color: "#6d4c00",
  lineHeight: 1.7,
};

const nextSeasonButtonStyle = {
  width: "100%",
  marginTop: 15,
  padding: 15,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
};
const seasonSelectStyle = {
  boxSizing: "border-box",
  width: "100%",
  padding: 12,
  border: "1px solid #999999",
  borderRadius: 7,
  backgroundColor: "#ffffff",
  fontSize: 16,
};

const changeSeasonButtonStyle = {
  width: "100%",
  marginTop: 12,
  padding: 13,
  border: "none",
  borderRadius: 8,
  backgroundColor: "#0066cc",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};
const baseStatsButtonStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 12,
  padding: 13,
  borderRadius: 8,
  backgroundColor: "#222222",
  color: "#ffffff",
  textAlign: "center",
  textDecoration: "none",
  fontSize: 16,
  fontWeight: "bold",
};
const seasonStatusGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const viewingSeasonStyle = {
  padding: 30,
  border: "2px solid #222222",
  borderRadius: 12,
  backgroundColor: "#ffffff",
  color: "#222222",
  textAlign: "center",
};

const smallLabelDarkStyle = {
  marginBottom: 8,
  fontSize: 15,
  fontWeight: "bold",
};

const seasonNumberDarkStyle = {
  fontSize: 38,
  fontWeight: "bold",
};

const statusNoteStyle = {
  marginTop: 10,
  fontSize: 13,
  color: "#dddddd",
  lineHeight: 1.5,
};

const statusNoteDarkStyle = {
  marginTop: 10,
  fontSize: 13,
  color: "#666666",
  lineHeight: 1.5,
};