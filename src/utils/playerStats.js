import {
  getSeason1PlayerBaseStats,
} from "../data/season1BaseStats";
const emptyStats = {
  games: 0,

  wins: 0,
losses: 0,
saves: 0,
holds: 0,
pitchingGames: 0,
starts: 0,

innings: 0,
inningsOuts: 0,
hitsAllowed: 0,
homeRunsAllowed: 0,
strikeouts: 0,
walksAllowed: 0,
hitBatters: 0,
runsAllowed: 0,
earnedRuns: 0,

era: 0,
whip: 0,
winningPercentage: 0,
strikeoutsPerNine: 0,

  atBats: 0,
  plateAppearances: 0,
  hits: 0,
  singles: 0,
  doubles: 0,
  triples: 0,
  homeRuns: 0,
  totalBases: 0,

  runsBattedIn: 0,
  walks: 0,
  hitByPitch: 0,
  sacrificeFlies: 0,
  stolenBases: 0,
  heroCount: 0,

  battingAverage: 0,
  onBasePercentage: 0,
  sluggingPercentage: 0,
  ops: 0,

  multiHitGames: 0,
  threeHitGames: 0,
};

/**
 * 全試合から、指定したバブルス選手の成績を集計する
 *
 * @param {Array} games localStorageから取得した試合一覧
 * @param {Object} player players.js内の選手データ
 * @returns {Object} 集計済み成績
 */
export function getPlayerStats(
  games,
  player,
  seasonNumber = null
) {
  const stats = {
    ...emptyStats,
  };

  if (!Array.isArray(games) || !player) {
    return stats;
  }

  games.forEach((game) => {
  const records = game?.records;

  let appearedInGame = false;

  const pitcherAppearances = Array.isArray(
    game?.pitcherAppearances
  )
    ? game.pitcherAppearances
    : [];

  const startingPitcher =
    pitcherAppearances[0];

  if (
    startingPitcher &&
    (
      String(startingPitcher.playerId ?? "") ===
        String(player.id) ||
      String(startingPitcher.playerName ?? "").trim() ===
        String(player.name ?? "").trim()
    )
  ) {
    stats.starts += 1;
    appearedInGame = true;
  }

  if (!records) {
    if (appearedInGame) {
      stats.games += 1;
    }

    return;
  }

  if (isSameBubblesPlayer(records.win, player)) { 
      stats.wins += 1;
      appearedInGame = true;
    }

    if (isSameBubblesPlayer(records.loss, player)) {
      stats.losses += 1;
      appearedInGame = true;
    }

    if (isSameBubblesPlayer(records.save, player)) {
      stats.saves += 1;
      appearedInGame = true;
    }
if (isSameBubblesPlayer(records.hero, player)) {
  stats.heroCount += 1;
  appearedInGame = true;
}
    if (Array.isArray(records.holds)) {
      records.holds.forEach((hold) => {
        if (isSameBubblesPlayer(hold, player)) {
          stats.holds += 1;
          appearedInGame = true;
        }
      });
    }

    if (Array.isArray(records.battingStats)) {
      const battingStat =
        records.battingStats.find((stat) =>
          isSameBubblesPlayer(stat, player)
        );

      if (battingStat) {
        const atBats = toNonNegativeNumber(
          battingStat.atBats
        );

        const hits = toNonNegativeNumber(
          battingStat.hits
        );

        const doubles = toNonNegativeNumber(
          battingStat.doubles
        );

        const triples = toNonNegativeNumber(
          battingStat.triples
        );

        const homeRuns = toNonNegativeNumber(
          battingStat.homeRuns
        );

        const runsBattedIn =
          toNonNegativeNumber(
            battingStat.runsBattedIn
          );

        const walks = toNonNegativeNumber(
          battingStat.walks
        );

        const hitByPitch =
          toNonNegativeNumber(
            battingStat.hitByPitch
          );

        const sacrificeFlies =
          toNonNegativeNumber(
            battingStat.sacrificeFlies
          );
          const stolenBases =
  toNonNegativeNumber(
    battingStat.stolenBases
  );

        const singles = Math.max(
          hits -
            doubles -
            triples -
            homeRuns,
          0
        );

        const totalBases =
          singles +
          doubles * 2 +
          triples * 3 +
          homeRuns * 4;

        stats.atBats += atBats;
        stats.hits += hits;
        stats.singles += singles;
        stats.doubles += doubles;
        stats.triples += triples;
        stats.homeRuns += homeRuns;
        stats.totalBases += totalBases;

        stats.runsBattedIn += runsBattedIn;
        stats.walks += walks;
        stats.hitByPitch += hitByPitch;
        stats.sacrificeFlies += sacrificeFlies;
        stats.stolenBases += stolenBases;

        if (hits >= 2) {
          stats.multiHitGames += 1;
        }

        if (hits >= 3) {
          stats.threeHitGames += 1;
        }

        appearedInGame = true;
      }
    }
    if (Array.isArray(records.pitchingStats)) {
  const pitchingStat =
    records.pitchingStats.find((stat) =>
      isSameBubblesPlayer(stat, player)
    );

  if (pitchingStat) {
    stats.pitchingGames += 1;

    stats.inningsOuts += inningsToOuts(
  pitchingStat.innings
);

    stats.hitsAllowed += toNonNegativeNumber(
      pitchingStat.hitsAllowed
    );

    stats.homeRunsAllowed += toNonNegativeNumber(
      pitchingStat.homeRunsAllowed
    );

    stats.strikeouts += toNonNegativeNumber(
      pitchingStat.strikeouts
    );

    stats.walksAllowed += toNonNegativeNumber(
      pitchingStat.walksAllowed
    );

    stats.hitBatters += toNonNegativeNumber(
      pitchingStat.hitBatters
    );

    stats.runsAllowed += toNonNegativeNumber(
      pitchingStat.runsAllowed
    );

    stats.earnedRuns += toNonNegativeNumber(
      pitchingStat.earnedRuns
    );

    appearedInGame = true;
  }
}

    if (appearedInGame) {
      stats.games += 1;
    }
  });
    if (Number(seasonNumber) === 1) {
    const baseStats =
      getSeason1PlayerBaseStats(player);

    stats.games +=
      toNonNegativeNumber(
        baseStats.games
      );

    stats.wins +=
      toNonNegativeNumber(
        baseStats.wins
      );

    stats.losses +=
      toNonNegativeNumber(
        baseStats.losses
      );

    stats.saves +=
      toNonNegativeNumber(
        baseStats.saves
      );

    stats.holds +=
      toNonNegativeNumber(
        baseStats.holds
      );

    stats.pitchingGames +=
      toNonNegativeNumber(
        baseStats.pitchingGames
      );

    stats.starts +=
      toNonNegativeNumber(
        baseStats.starts
      );

    stats.inningsOuts +=
      toNonNegativeNumber(
        baseStats.inningsOuts
      );

    stats.hitsAllowed +=
      toNonNegativeNumber(
        baseStats.hitsAllowed
      );

    stats.homeRunsAllowed +=
      toNonNegativeNumber(
        baseStats.homeRunsAllowed
      );

    stats.strikeouts +=
      toNonNegativeNumber(
        baseStats.strikeouts
      );

    stats.walksAllowed +=
      toNonNegativeNumber(
        baseStats.walksAllowed
      );

    stats.hitBatters +=
      toNonNegativeNumber(
        baseStats.hitBatters
      );

    stats.runsAllowed +=
      toNonNegativeNumber(
        baseStats.runsAllowed
      );

    stats.earnedRuns +=
      toNonNegativeNumber(
        baseStats.earnedRuns
      );

    stats.atBats +=
      toNonNegativeNumber(
        baseStats.atBats
      );

    stats.hits +=
      toNonNegativeNumber(
        baseStats.hits
      );

    stats.doubles +=
      toNonNegativeNumber(
        baseStats.doubles
      );

    stats.triples +=
      toNonNegativeNumber(
        baseStats.triples
      );

    stats.homeRuns +=
      toNonNegativeNumber(
        baseStats.homeRuns
      );

    stats.runsBattedIn +=
      toNonNegativeNumber(
        baseStats.runsBattedIn
      );

    stats.walks +=
      toNonNegativeNumber(
        baseStats.walks
      );

    stats.hitByPitch +=
      toNonNegativeNumber(
        baseStats.hitByPitch
      );

    stats.sacrificeFlies +=
      toNonNegativeNumber(
        baseStats.sacrificeFlies
      );

    stats.stolenBases +=
      toNonNegativeNumber(
        baseStats.stolenBases
      );

    stats.heroCount +=
      toNonNegativeNumber(
        baseStats.heroCount
      );

    stats.multiHitGames +=
      toNonNegativeNumber(
        baseStats.multiHitGames
      );

    stats.threeHitGames +=
      toNonNegativeNumber(
        baseStats.threeHitGames
      );
  }

  stats.singles = Math.max(
    stats.hits -
      stats.doubles -
      stats.triples -
      stats.homeRuns,
    0
  );

  stats.totalBases =
    stats.singles +
    stats.doubles * 2 +
    stats.triples * 3 +
    stats.homeRuns * 4;
  stats.innings = outsToInnings(
  stats.inningsOuts
);
  stats.plateAppearances =
    stats.atBats +
    stats.walks +
    stats.hitByPitch +
    stats.sacrificeFlies;

  stats.battingAverage =
    stats.atBats > 0
      ? stats.hits / stats.atBats
      : 0;

  const onBaseDenominator =
    stats.atBats +
    stats.walks +
    stats.hitByPitch +
    stats.sacrificeFlies;

  stats.onBasePercentage =
    onBaseDenominator > 0
      ? (
          stats.hits +
          stats.walks +
          stats.hitByPitch
        ) / onBaseDenominator
      : 0;

  stats.sluggingPercentage =
    stats.atBats > 0
      ? stats.totalBases / stats.atBats
      : 0;

  stats.ops =
  stats.onBasePercentage +
  stats.sluggingPercentage;

const inningsDecimal =
  stats.inningsOuts > 0
    ? stats.inningsOuts / 3
    : 0;

stats.era =
  inningsDecimal > 0
    ? (stats.earnedRuns * 9) /
      inningsDecimal
    : 0;

stats.whip =
  inningsDecimal > 0
    ? (stats.walksAllowed +
        stats.hitsAllowed) /
      inningsDecimal
    : 0;

stats.winningPercentage =
  stats.wins + stats.losses > 0
    ? stats.wins /
      (stats.wins + stats.losses)
    : 0;

stats.strikeoutsPerNine =
  inningsDecimal > 0
    ? (stats.strikeouts * 9) /
      inningsDecimal
    : 0;

return stats;
}

/**
 * 全バブルス選手の成績をまとめて集計する
 *
 * @param {Array} games 試合一覧
 * @param {Array} players バブルス選手一覧
 * @returns {Object} 選手IDをキーにした成績一覧
 */
export function calculatePlayerStats(
  games,
  players,
  seasonNumber = null
) {
  if (!Array.isArray(players)) {
    return {};
  }

  return players.reduce((allStats, player) => {
    allStats[String(player.id)] = {
      playerId: player.id,
      name: player.name,
      ...getPlayerStats(
  games,
  player,
  seasonNumber
),
    };

    return allStats;
  }, {});
}
export function getRecentBattingStats(
  games,
  player,
  limit = 5
) {
  if (!Array.isArray(games) || !player) {
    return {
      games: 0,
      plateAppearances: 0,
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
      battingAverage: 0,
      onBasePercentage: 0,
      sluggingPercentage: 0,
      ops: 0,
    };
  }

  const recentGames = [...games]
    .sort(
      (a, b) =>
        getGameDateNumber(b.date) -
        getGameDateNumber(a.date)
    )
    .filter((game) => {
      const battingStats =
        game?.records?.battingStats;

      if (!Array.isArray(battingStats)) {
        return false;
      }

      return battingStats.some((stat) =>
        isSameBubblesPlayer(stat, player)
      );
    })
    .slice(0, limit);

  const result = {
    games: recentGames.length,
    plateAppearances: 0,
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
    battingAverage: 0,
    onBasePercentage: 0,
    sluggingPercentage: 0,
    ops: 0,
  };

  recentGames.forEach((game) => {
    const stat =
      game.records.battingStats.find(
        (item) =>
          isSameBubblesPlayer(
            item,
            player
          )
      );

    if (!stat) {
      return;
    }

    result.atBats +=
      toNonNegativeNumber(
        stat.atBats
      );

    result.hits +=
      toNonNegativeNumber(
        stat.hits
      );

    result.doubles +=
      toNonNegativeNumber(
        stat.doubles
      );

    result.triples +=
      toNonNegativeNumber(
        stat.triples
      );

    result.homeRuns +=
      toNonNegativeNumber(
        stat.homeRuns
      );

    result.runsBattedIn +=
      toNonNegativeNumber(
        stat.runsBattedIn
      );

    result.walks +=
      toNonNegativeNumber(
        stat.walks
      );

    result.hitByPitch +=
      toNonNegativeNumber(
        stat.hitByPitch
      );

    result.sacrificeFlies +=
      toNonNegativeNumber(
        stat.sacrificeFlies
      );

    result.stolenBases +=
      toNonNegativeNumber(
        stat.stolenBases
      );
  });

  result.plateAppearances =
    result.atBats +
    result.walks +
    result.hitByPitch +
    result.sacrificeFlies;

  result.battingAverage =
    result.atBats > 0
      ? result.hits /
        result.atBats
      : 0;

  const onBaseDenominator =
    result.atBats +
    result.walks +
    result.hitByPitch +
    result.sacrificeFlies;

  result.onBasePercentage =
    onBaseDenominator > 0
      ? (
          result.hits +
          result.walks +
          result.hitByPitch
        ) /
        onBaseDenominator
      : 0;

  const singles = Math.max(
    result.hits -
      result.doubles -
      result.triples -
      result.homeRuns,
    0
  );

  const totalBases =
    singles +
    result.doubles * 2 +
    result.triples * 3 +
    result.homeRuns * 4;

  result.sluggingPercentage =
    result.atBats > 0
      ? totalBases /
        result.atBats
      : 0;

  result.ops =
    result.onBasePercentage +
    result.sluggingPercentage;

  return result;
}

export function getRecentPitchingStats(
  games,
  player,
  limit = 5
) {
  if (!Array.isArray(games) || !player) {
    return {
      appearances: 0,
      starts: 0,
      wins: 0,
      losses: 0,
      saves: 0,
      holds: 0,
      innings: 0,
      inningsOuts: 0,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
      strikeouts: 0,
      walksAllowed: 0,
      hitBatters: 0,
      runsAllowed: 0,
      earnedRuns: 0,
      era: 0,
      whip: 0,
      strikeoutsPerNine: 0,
    };
  }

  const recentGames = [...games]
    .sort(
      (a, b) =>
        getGameDateNumber(b.date) -
        getGameDateNumber(a.date)
    )
    .filter((game) => {
      const pitchingStats =
        game?.records?.pitchingStats;

      if (!Array.isArray(pitchingStats)) {
        return false;
      }

      return pitchingStats.some((stat) =>
        isSameBubblesPlayer(stat, player)
      );
    })
    .slice(0, limit);

  const result = {
    appearances: recentGames.length,
    starts: 0,
    wins: 0,
    losses: 0,
    saves: 0,
    holds: 0,
    innings: 0,
    inningsOuts: 0,
    hitsAllowed: 0,
    homeRunsAllowed: 0,
    strikeouts: 0,
    walksAllowed: 0,
    hitBatters: 0,
    runsAllowed: 0,
    earnedRuns: 0,
    era: 0,
    whip: 0,
    strikeoutsPerNine: 0,
  };

  recentGames.forEach((game) => {
    const stat =
      game.records.pitchingStats.find(
        (item) =>
          isSameBubblesPlayer(
            item,
            player
          )
      );

    if (!stat) {
      return;
    }

    result.inningsOuts +=
      inningsToOuts(
        stat.innings
      );

    result.hitsAllowed +=
      toNonNegativeNumber(
        stat.hitsAllowed
      );

    result.homeRunsAllowed +=
      toNonNegativeNumber(
        stat.homeRunsAllowed
      );

    result.strikeouts +=
      toNonNegativeNumber(
        stat.strikeouts
      );

    result.walksAllowed +=
      toNonNegativeNumber(
        stat.walksAllowed
      );

    result.hitBatters +=
      toNonNegativeNumber(
        stat.hitBatters
      );

    result.runsAllowed +=
      toNonNegativeNumber(
        stat.runsAllowed
      );

    result.earnedRuns +=
      toNonNegativeNumber(
        stat.earnedRuns
      );

    const relay = Array.isArray(
      game?.pitcherAppearances
    )
      ? game.pitcherAppearances
      : [];

    const starter = relay[0];

    if (
      starter &&
      (
        String(
          starter.playerId ?? ""
        ) ===
          String(player.id) ||
        String(
          starter.playerName ?? ""
        ).trim() ===
          String(
            player.name ?? ""
          ).trim()
      )
    ) {
      result.starts += 1;
    }

    if (
      isSameBubblesPlayer(
        game.records?.win,
        player
      )
    ) {
      result.wins += 1;
    }

    if (
      isSameBubblesPlayer(
        game.records?.loss,
        player
      )
    ) {
      result.losses += 1;
    }

    if (
      isSameBubblesPlayer(
        game.records?.save,
        player
      )
    ) {
      result.saves += 1;
    }

    if (
      Array.isArray(
        game.records?.holds
      )
    ) {
      game.records.holds.forEach(
        (hold) => {
          if (
            isSameBubblesPlayer(
              hold,
              player
            )
          ) {
            result.holds += 1;
          }
        }
      );
    }
  });

  result.innings =
    outsToInnings(
      result.inningsOuts
    );

  const inningsDecimal =
    result.inningsOuts > 0
      ? result.inningsOuts / 3
      : 0;

  result.era =
    inningsDecimal > 0
      ? (
          result.earnedRuns * 9
        ) /
        inningsDecimal
      : 0;

  result.whip =
    inningsDecimal > 0
      ? (
          result.walksAllowed +
          result.hitsAllowed
        ) /
        inningsDecimal
      : 0;

  result.strikeoutsPerNine =
    inningsDecimal > 0
      ? (
          result.strikeouts * 9
        ) /
        inningsDecimal
      : 0;

  return result;
}
export function getRecentBattingGameLogs(
  games,
  player,
  limit = 5
) {
  if (!Array.isArray(games) || !player) {
    return [];
  }

  return [...games]
    .sort(
      (a, b) =>
        getGameDateNumber(b.date) -
        getGameDateNumber(a.date)
    )
    .map((game) => {
      const battingStats =
        game?.records?.battingStats;

      if (!Array.isArray(battingStats)) {
        return null;
      }

      const stat = battingStats.find(
        (item) =>
          isSameBubblesPlayer(
            item,
            player
          )
      );

      if (!stat) {
        return null;
      }

      const atBats =
        toNonNegativeNumber(
          stat.atBats
        );

      const hits =
        toNonNegativeNumber(
          stat.hits
        );

      const doubles =
        toNonNegativeNumber(
          stat.doubles
        );

      const triples =
        toNonNegativeNumber(
          stat.triples
        );

      const homeRuns =
        toNonNegativeNumber(
          stat.homeRuns
        );

      const walks =
        toNonNegativeNumber(
          stat.walks
        );

      const hitByPitch =
        toNonNegativeNumber(
          stat.hitByPitch
        );

      const sacrificeFlies =
        toNonNegativeNumber(
          stat.sacrificeFlies
        );

      const runsBattedIn =
        toNonNegativeNumber(
          stat.runsBattedIn
        );

      const stolenBases =
        toNonNegativeNumber(
          stat.stolenBases
        );

      const plateAppearances =
        atBats +
        walks +
        hitByPitch +
        sacrificeFlies;

      const battingAverage =
        atBats > 0
          ? hits / atBats
          : 0;

      const onBaseDenominator =
        atBats +
        walks +
        hitByPitch +
        sacrificeFlies;

      const onBasePercentage =
        onBaseDenominator > 0
          ? (
              hits +
              walks +
              hitByPitch
            ) /
            onBaseDenominator
          : 0;

      const singles = Math.max(
        hits -
          doubles -
          triples -
          homeRuns,
        0
      );

      const totalBases =
        singles +
        doubles * 2 +
        triples * 3 +
        homeRuns * 4;

      const sluggingPercentage =
        atBats > 0
          ? totalBases / atBats
          : 0;

      return {
        gameId: game.id,
        date: game.date,
        opponent: game.opponent,
        plateAppearances,
        atBats,
        hits,
        doubles,
        triples,
        homeRuns,
        runsBattedIn,
        walks,
        stolenBases,
        battingAverage,
        onBasePercentage,
        sluggingPercentage,
        ops:
          onBasePercentage +
          sluggingPercentage,
      };
    })
    .filter(Boolean)
    .slice(0, limit);
}

export function getRecentPitchingGameLogs(
  games,
  player,
  limit = 5
) {
  if (!Array.isArray(games) || !player) {
    return [];
  }

  return [...games]
    .sort(
      (a, b) =>
        getGameDateNumber(b.date) -
        getGameDateNumber(a.date)
    )
    .map((game) => {
      const pitchingStats =
        game?.records?.pitchingStats;

      if (!Array.isArray(pitchingStats)) {
        return null;
      }

      const stat = pitchingStats.find(
        (item) =>
          isSameBubblesPlayer(
            item,
            player
          )
      );

      if (!stat) {
        return null;
      }

      const inningsOuts =
        inningsToOuts(
          stat.innings
        );

      const inningsDecimal =
        inningsOuts > 0
          ? inningsOuts / 3
          : 0;

      const hitsAllowed =
        toNonNegativeNumber(
          stat.hitsAllowed
        );

      const strikeouts =
        toNonNegativeNumber(
          stat.strikeouts
        );

      const walksAllowed =
        toNonNegativeNumber(
          stat.walksAllowed
        );

      const earnedRuns =
        toNonNegativeNumber(
          stat.earnedRuns
        );

      let decision = "";

      if (
        isSameBubblesPlayer(
          game.records?.win,
          player
        )
      ) {
        decision = "勝";
      } else if (
        isSameBubblesPlayer(
          game.records?.loss,
          player
        )
      ) {
        decision = "敗";
      } else if (
        isSameBubblesPlayer(
          game.records?.save,
          player
        )
      ) {
        decision = "S";
      }

      return {
        gameId: game.id,
        date: game.date,
        opponent: game.opponent,
        decision,
        innings:
          outsToInnings(
            inningsOuts
          ),
        hitsAllowed,
        homeRunsAllowed:
          toNonNegativeNumber(
            stat.homeRunsAllowed
          ),
        strikeouts,
        walksAllowed,
        hitBatters:
          toNonNegativeNumber(
            stat.hitBatters
          ),
        runsAllowed:
          toNonNegativeNumber(
            stat.runsAllowed
          ),
        earnedRuns,
        era:
          inningsDecimal > 0
            ? (
                earnedRuns * 9
              ) /
              inningsDecimal
            : 0,
        whip:
          inningsDecimal > 0
            ? (
                hitsAllowed +
                walksAllowed
              ) /
              inningsDecimal
            : 0,
      };
    })
    .filter(Boolean)
    .slice(0, limit);
}
function getGameDateNumber(dateText) {
  if (!dateText) {
    return 0;
  }

  const parts =
    String(dateText).split("-");

  if (parts.length === 3) {
    return (
      Number(parts[1]) * 100 +
      Number(parts[2])
    );
  }

  if (parts.length === 2) {
    return (
      Number(parts[0]) * 100 +
      Number(parts[1])
    );
  }

  return 0;
}
/**
 * 打率・出塁率・長打率を「.000」形式で表示する
 *
 * @param {number} value
 * @returns {string}
 */
export function formatBattingAverage(value) {
  return formatThreeDecimalStat(value);
}

/**
 * OPSを「0.000」形式で表示する
 *
 * @param {number} value
 * @returns {string}
 */
export function formatOps(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return "0.000";
  }

  return number.toFixed(3);
}

/**
 * 打率・出塁率・長打率用の表示処理
 *
 * @param {number} value
 * @returns {string}
 */
export function formatThreeDecimalStat(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return ".000";
  }

  return number
    .toFixed(3)
    .replace(/^0/, "");
}

/**
 * 記録に登録されている選手と、
 * players.jsの選手が同一人物か判定する
 */
function isSameBubblesPlayer(record, player) {
  if (!record || !player) {
    return false;
  }

  if (record.side === "opponent") {
    return false;
  }

  const hasRecordPlayerId =
    record.playerId !== undefined &&
    record.playerId !== null &&
    record.playerId !== "";

  if (hasRecordPlayerId) {
    return (
      String(record.playerId) ===
      String(player.id)
    );
  }

  return (
    String(record.name ?? "").trim() ===
    String(player.name ?? "").trim()
  );
}

/**
 * 数値を安全に0以上の数値へ変換する
 */
function toNonNegativeNumber(value) {
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
  const text = String(value ?? "").trim();

  if (!text) {
    return 0;
  }

  const [wholeText, fractionText = "0"] =
    text.split(".");

  const whole = Number(wholeText);
  const fraction = Number(fractionText);

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

function outsToInnings(outs) {
  const safeOuts = Math.max(
    0,
    Math.floor(Number(outs) || 0)
  );

  const whole = Math.floor(
    safeOuts / 3
  );

  const remainder = safeOuts % 3;

  return Number(
    `${whole}.${remainder}`
  );
}