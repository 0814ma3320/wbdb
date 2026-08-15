/**
 * Season1だけの途中スタート用初期成績
 *
 * 9/3終了時点など、
 * 「ここまでの通算成績」を保存するための特例データ。
 *
 * Season2以降は使用しません。
 */
const SEASON1_BASE_TEAM_KEY =
  "season1BaseTeam";
const SEASON1_BASE_STATS_KEY =
  "season1BaseStats";

/**
 * 全選手のSeason1初期成績を取得
 */
export function getSeason1BaseStats() {
  try {
    const stored =
      localStorage.getItem(
        SEASON1_BASE_STATS_KEY
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

/**
 * 指定選手のSeason1初期成績を取得
 */
export function getSeason1PlayerBaseStats(
  player
) {
  if (!player) {
    return createEmptyBaseStats();
  }

  const allStats =
    getSeason1BaseStats();

  const saved =
    allStats[String(player.id)];

  if (!saved) {
    return createEmptyBaseStats();
  }

  return {
    ...createEmptyBaseStats(),
    ...saved,
  };
}

/**
 * 指定選手のSeason1初期成績を保存
 */
export function saveSeason1PlayerBaseStats(
  playerId,
  stats
) {
  if (
    playerId === undefined ||
    playerId === null ||
    playerId === ""
  ) {
    return;
  }

  const allStats =
    getSeason1BaseStats();

  allStats[String(playerId)] = {
    ...createEmptyBaseStats(),
    ...stats,
  };

  localStorage.setItem(
    SEASON1_BASE_STATS_KEY,
    JSON.stringify(allStats)
  );
}

/**
 * Season1初期成績を全選手分まとめて保存
 */
export function saveSeason1BaseStats(
  statsByPlayer
) {
  const safeStats =
    statsByPlayer &&
    typeof statsByPlayer === "object"
      ? statsByPlayer
      : {};

  localStorage.setItem(
    SEASON1_BASE_STATS_KEY,
    JSON.stringify(safeStats)
  );
}

/**
 * 初期値
 *
 * 率系は保存しない。
 * 打率・OPS・防御率・WHIP・K/9などは
 * 合算後にplayerStats.js側で自動計算する。
 */
export function createEmptyBaseStats() {
  return {
    games: 0,

    wins: 0,
    losses: 0,
    saves: 0,
    holds: 0,
    pitchingGames: 0,
    starts: 0,

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

/**
 * Season1初期成績を全削除
 *
 * 入力をやり直す場合用。
 */
export function clearSeason1BaseStats() {
  localStorage.removeItem(
    SEASON1_BASE_STATS_KEY
  );
}

export function getSeason1BaseTeam() {
  try {
    const stored =
      localStorage.getItem(
        SEASON1_BASE_TEAM_KEY
      );

    if (!stored) {
      return {
        games: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        runsScored: 0,
        runsAllowed: 0,
      };
    }

    const parsed = JSON.parse(stored);

    return {
      games: Number(parsed.games ?? 0),
      wins: Number(parsed.wins ?? 0),
      losses: Number(parsed.losses ?? 0),
      ties: Number(parsed.ties ?? 0),
      runsScored: Number(
        parsed.runsScored ?? 0
      ),
      runsAllowed: Number(
        parsed.runsAllowed ?? 0
      ),
    };
  } catch {
    return {
      games: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      runsScored: 0,
      runsAllowed: 0,
    };
  }
}

export function saveSeason1BaseTeam(
  teamStats
) {
  localStorage.setItem(
    SEASON1_BASE_TEAM_KEY,
    JSON.stringify({
      games: Number(
        teamStats.games ?? 0
      ),
      wins: Number(
        teamStats.wins ?? 0
      ),
      losses: Number(
        teamStats.losses ?? 0
      ),
      ties: Number(
        teamStats.ties ?? 0
      ),
      runsScored: Number(
        teamStats.runsScored ?? 0
      ),
      runsAllowed: Number(
        teamStats.runsAllowed ?? 0
      ),
    })
  );
}