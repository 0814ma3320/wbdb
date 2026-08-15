import { players as initialPlayers } from "./players";

const PLAYER_STORAGE_KEY = "wakagiri_players";

function createInitialPlayers() {
  return initialPlayers.map((player) => ({
    ...player,
    teamName: player.teamName ?? "和桐バブルス",
    active: player.active ?? true,
    joinedSeason: player.joinedSeason ?? 1,
    leftSeason: player.leftSeason ?? null,
    tenures:
  Array.isArray(player.tenures) &&
  player.tenures.length > 0
    ? player.tenures
    : [
        {
          joinedSeason:
            player.joinedSeason ?? 1,
          leftSeason:
            player.leftSeason ?? null,
        },
      ],
  }));
}

export function getPlayers() {
  const savedPlayers = localStorage.getItem(
    PLAYER_STORAGE_KEY
  );

  if (!savedPlayers) {
    const initialData = createInitialPlayers();

    localStorage.setItem(
      PLAYER_STORAGE_KEY,
      JSON.stringify(initialData)
    );

    return initialData;
  }

  try {
    const parsedPlayers = JSON.parse(savedPlayers);

    if (!Array.isArray(parsedPlayers)) {
      throw new Error("選手データが配列ではありません");
    }

    return parsedPlayers.map((player) => ({
  ...player,
  teamName: player.teamName ?? "和桐バブルス",
  active: player.active ?? true,
  joinedSeason: player.joinedSeason ?? 1,
  leftSeason: player.leftSeason ?? null,
  tenures:
    Array.isArray(player.tenures) &&
    player.tenures.length > 0
      ? player.tenures
      : [
          {
            joinedSeason:
              player.joinedSeason ?? 1,
            leftSeason:
              player.leftSeason ?? null,
          },
        ],
}));
  } catch (error) {
    console.error(
      "選手データの読み込みに失敗しました。",
      error
    );

    const initialData = createInitialPlayers();

    localStorage.setItem(
      PLAYER_STORAGE_KEY,
      JSON.stringify(initialData)
    );

    return initialData;
  }
}

export function savePlayers(players) {
  localStorage.setItem(
    PLAYER_STORAGE_KEY,
    JSON.stringify(players)
  );
}
export function getPlayersForSeason(
  seasonNumber
) {
  const season = Number(seasonNumber);

  if (
    !Number.isInteger(season) ||
    season < 1
  ) {
    return [];
  }

  return getPlayers().filter((player) => {
    const tenures =
      Array.isArray(player.tenures) &&
      player.tenures.length > 0
        ? player.tenures
        : [
            {
              joinedSeason:
                player.joinedSeason ?? 1,
              leftSeason:
                player.leftSeason ?? null,
            },
          ];

    return tenures.some((tenure) => {
      const joinedSeason = Number(
        tenure.joinedSeason ?? 1
      );

      const leftSeason =
        tenure.leftSeason === null ||
        tenure.leftSeason === undefined ||
        tenure.leftSeason === ""
          ? null
          : Number(tenure.leftSeason);

      const joined =
        season >= joinedSeason;

      const notLeftYet =
        leftSeason === null ||
        season <= leftSeason;

      return joined && notLeftYet;
    });
  });
}