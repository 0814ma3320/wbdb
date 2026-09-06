import { players as initialPlayers } from "./players";
import { leaguePlayers } from "./leaguePlayers";

const PLAYER_STORAGE_KEY = "wakagiri_players";
function createInitialLeaguePlayers() {
  return Object.entries(leaguePlayers).flatMap(
    ([teamName, roster]) => [
      ...(roster.fielders ?? []).map(
        (name, index) => ({
          id: `league-${teamName}-fielder-${index}`,
          name,
          teamName,
          category: "野手",
          active: true,
          joinedSeason: 1,
          leftSeason: null,
          tenures: [
            {
              teamName,
              joinedSeason: 1,
              leftSeason: null,
            },
          ],
          number: null,
          position: null,
        })
      ),

      ...(roster.pitchers ?? []).map(
        (name, index) => ({
          id: `league-${teamName}-pitcher-${index}`,
          name,
          teamName,
          category: "投手",
          active: true,
          joinedSeason: 1,
          leftSeason: null,
          tenures: [
            {
              teamName,
              joinedSeason: 1,
              leftSeason: null,
            },
          ],
          number: null,
          position: null,
        })
      ),
    ]
  );
}

function createInitialPlayers() {
  const bubblesPlayers = initialPlayers.map((player) => ({
    ...player,
    teamName: player.teamName ?? "和桐バブルス",
    active: player.active ?? true,
    joinedSeason: player.joinedSeason ?? 1,
    leftSeason: player.leftSeason ?? null,
   tenures:
  Array.isArray(player.tenures) &&
  player.tenures.length > 0
    ? player.tenures.map((tenure) => ({
        ...tenure,
        teamName:
          tenure.teamName ??
          player.teamName ??
          "和桐バブルス",
      }))
    : [
        {
          teamName:
            player.teamName ??
            "和桐バブルス",
          joinedSeason:
            player.joinedSeason ?? 1,
          leftSeason:
            player.leftSeason ?? null,
        },
      ],
    }));

  return [
    ...bubblesPlayers,
    ...createInitialLeaguePlayers(),
  ];
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
    const existingIds = new Set(
  parsedPlayers.map((player) =>
    String(player.id)
  )
);

const missingLeaguePlayers =
  createInitialLeaguePlayers().filter(
    (player) =>
      !existingIds.has(String(player.id))
  );

const mergedPlayers = [
  ...parsedPlayers,
  ...missingLeaguePlayers,
];

    return mergedPlayers.map((player) => ({
  ...player,
  teamName: player.teamName ?? "和桐バブルス",
  active: player.active ?? true,
  joinedSeason: player.joinedSeason ?? 1,
  leftSeason: player.leftSeason ?? null,
  tenures:
  Array.isArray(player.tenures) &&
  player.tenures.length > 0
    ? player.tenures.map((tenure) => ({
        ...tenure,
        teamName:
          tenure.teamName ??
          player.teamName ??
          "和桐バブルス",
      }))
    : [
        {
          teamName:
            player.teamName ??
            "和桐バブルス",
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

  return getPlayers()
  .map((player) => {
    const tenures =
      Array.isArray(player.tenures) &&
      player.tenures.length > 0
        ? player.tenures
        : [
            {
              teamName:
                player.teamName ??
                "和桐バブルス",
              joinedSeason:
                player.joinedSeason ?? 1,
              leftSeason:
                player.leftSeason ?? null,
            },
          ];

    const matchedTenure = tenures.find(
      (tenure) => {
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
          season < leftSeason;

        return joined && notLeftYet;
      }
    );

    if (!matchedTenure) {
      return null;
    }

    return {
      ...player,
      teamName:
        matchedTenure.teamName ??
        player.teamName ??
        "和桐バブルス",
    };
  })
  .filter(Boolean);
}