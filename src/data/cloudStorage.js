import { supabase } from "../supabase";

function getLocalStorageSnapshot() {
  const snapshot = {};

  for (
    let index = 0;
    index < localStorage.length;
    index += 1
  ) {
    const key = localStorage.key(index);

    if (!key) {
      continue;
    }

    // Supabaseのログイン情報は
    // クラウド保存しない
    if (key.startsWith("sb-")) {
      continue;
    }

    snapshot[key] =
      localStorage.getItem(key);
  }

  return snapshot;
}

export async function saveDataToCloud() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "ログインしていません。"
    );
  }

  const snapshot =
    getLocalStorageSnapshot();

  const { error } = await supabase
    .from("app_data")
    .upsert(
      {
        user_id: user.id,
        data_key: "wakagiri-all-data",
        data_value: snapshot,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,data_key",
      }
    );

  if (error) {
    throw error;
  }

  return true;
}
export async function loadDataFromCloud() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "ログインしていません。"
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("app_data")
    .select("data_value")
    .eq("user_id", user.id)
    .eq(
      "data_key",
      "wakagiri-all-data"
    )
    .single();

  if (error) {
    throw error;
  }

  const snapshot =
    data?.data_value;

  if (!snapshot) {
    throw new Error(
      "クラウドデータがありません。"
    );
  }

  Object.entries(snapshot).forEach(
    ([key, value]) => {
      localStorage.setItem(
        key,
        value
      );
    }
  );

  return true;
}