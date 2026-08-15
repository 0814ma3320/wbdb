// 全Seasonで2011年と同じ曜日配置を使用する。
// 実際の西暦は画面に表示しない。

const WEEKDAYS = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

/**
 * "MM-DD" または "YYYY-MM-DD" から月日を取得する
 */
export function getSeasonMonthDay(dateText) {
  if (!dateText) {
    return null;
  }

  const parts = String(dateText).split("-");

  if (parts.length === 3) {
    return {
      month: Number(parts[1]),
      day: Number(parts[2]),
    };
  }

  if (parts.length === 2) {
    return {
      month: Number(parts[0]),
      day: Number(parts[1]),
    };
  }

  return null;
}

/**
 * 2011年の曜日配置を使って曜日を取得する。
 * Seasonが変わっても曜日配置は変わらない。
 */
export function getSeasonWeekday(
  month,
  day
) {
  const referenceDate = new Date(
    2011,
    month - 1,
    day
  );

  return WEEKDAYS[
    referenceDate.getDay()
  ];
}

/**
 * 試合日を「8月7日(金)」形式で表示する。
 */
export function formatSeasonDate(dateText) {
  const monthDay =
    getSeasonMonthDay(dateText);

  if (!monthDay) {
    return "日付未設定";
  }

  const { month, day } = monthDay;

  if (
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return dateText;
  }

  const weekday =
    getSeasonWeekday(month, day);

  return `${month}月${day}日(${weekday})`;
}

/**
 * シーズンで使用可能な日付か判定する。
 * 現在は3月1日〜10月31日。
 */
export function isSeasonDate(
  month,
  day
) {
  if (
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (month < 3 || month > 10) {
    return false;
  }

  const referenceDate = new Date(
    2011,
    month - 1,
    day
  );

  return (
    referenceDate.getFullYear() === 2011 &&
    referenceDate.getMonth() ===
      month - 1 &&
    referenceDate.getDate() === day
  );
}