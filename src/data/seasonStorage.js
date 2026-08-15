const CURRENT_SEASON_KEY =
  "currentSeason";

const VIEWING_SEASON_KEY =
  "viewingSeason";

/**
 * 現在進行中のSeasonを取得
 *
 * 新しい試合はこのSeasonに保存する。
 */
export function getCurrentSeason() {
  const stored =
    localStorage.getItem(
      CURRENT_SEASON_KEY
    );

  const seasonNumber =
    Number(stored);

  if (
    Number.isInteger(seasonNumber) &&
    seasonNumber >= 1
  ) {
    return seasonNumber;
  }

  return 1;
}

/**
 * 現在進行中のSeasonを設定
 */
export function setCurrentSeason(
  seasonNumber
) {
  const number =
    Number(seasonNumber);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    return;
  }

  localStorage.setItem(
    CURRENT_SEASON_KEY,
    String(number)
  );
}

/**
 * 今画面で見ているSeasonを取得
 *
 * 未設定なら進行中Seasonを見る。
 */
export function getViewingSeason() {
  const stored =
    localStorage.getItem(
      VIEWING_SEASON_KEY
    );

  const seasonNumber =
    Number(stored);

  const currentSeason =
    getCurrentSeason();

  if (
    Number.isInteger(seasonNumber) &&
    seasonNumber >= 1 &&
    seasonNumber <= currentSeason
  ) {
    return seasonNumber;
  }

  return currentSeason;
}

/**
 * 閲覧するSeasonを変更
 *
 * 進行中Season自体は変更しない。
 */
export function setViewingSeason(
  seasonNumber
) {
  const number =
    Number(seasonNumber);

  const currentSeason =
    getCurrentSeason();

  if (
    !Number.isInteger(number) ||
    number < 1 ||
    number > currentSeason
  ) {
    return;
  }

  localStorage.setItem(
    VIEWING_SEASON_KEY,
    String(number)
  );
}

/**
 * 次のSeasonを開始
 */
export function startNextSeason() {
  const nextSeason =
    getCurrentSeason() + 1;

  setCurrentSeason(nextSeason);

  // 新Season開始時は
  // 閲覧画面も新Seasonへ移動
  setViewingSeason(nextSeason);

  return nextSeason;
}

/**
 * 表示用
 */
export function getSeasonLabel(
  seasonNumber = getViewingSeason()
) {
  return `Season ${seasonNumber}`;
}

/**
 * 試合の所属Seasonを取得
 *
 * season情報がない旧データは
 * Season1として扱う。
 */
export function getGameSeason(game) {
  const seasonNumber =
    Number(game?.season);

  if (
    Number.isInteger(seasonNumber) &&
    seasonNumber >= 1
  ) {
    return seasonNumber;
  }

  return 1;
}

/**
 * 指定Seasonの試合だけ取得
 */
export function getGamesForSeason(
  games,
  seasonNumber = getViewingSeason()
) {
  if (!Array.isArray(games)) {
    return [];
  }

  return games.filter(
    (game) =>
      getGameSeason(game) ===
      Number(seasonNumber)
  );
}