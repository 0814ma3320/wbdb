import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import GameInput from "./pages/GameInput";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";
import LineupEdit from "./pages/LineupEdit";
import GameRecordEdit from "./pages/GameRecordEdit";
import PlayerList from "./pages/PlayerList";
import PlayerDetail from "./pages/PlayerDetail";
import SeasonStats from "./pages/SeasonStats";
import TeamStats from "./pages/TeamStats";
import PitcherRelayEdit from "./pages/PitcherRelayEdit";
import SeasonManagement from "./pages/SeasonManagement";
import Season1BaseStats from "./pages/Season1BaseStats";
import Awards from "./pages/Awards";
import PlayerManagement from "./pages/PlayerManagement";
import Login from "./pages/Login";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";

function RequireAuth({ children }) {
  const [loading, setLoading] =
    useState(true);

  const [loggedIn, setLoggedIn] =
    useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(Boolean(user));
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return null;
  }

  if (!loggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
  path="/"
  element={
    <RequireAuth>
      <Home />
    </RequireAuth>
  }
/>
       <Route
  path="/login"
  element={<Login />}
/>
        <Route
          path="/game"
          element={<GameInput />}
        />

        <Route
          path="/games"
          element={<GameList />}
        />

        <Route
          path="/games/:gameId"
          element={<GameDetail />}
        />

        <Route
          path="/games/:gameId/lineup"
          element={<LineupEdit />}
        />

        <Route
          path="/games/:gameId/records"
          element={<GameRecordEdit />}
        />
        <Route
  path="/games/:gameId/pitchers"
  element={<PitcherRelayEdit />}
/>

        <Route
          path="/players"
          element={<PlayerList />}
        />

                <Route
          path="/players/:playerId"
          element={<PlayerDetail />}
        />

        <Route
          path="/season"
          element={<SeasonStats />}
        />
        <Route
  path="/season-management"
  element={<SeasonManagement />}
/>
<Route
  path="/season1-base-stats"
  element={<Season1BaseStats />}
/>
<Route
  path="/awards"
  element={<Awards />}
/>

<Route
  path="/players/manage"
  element={<PlayerManagement />}
/>

        <Route
  path="/team-stats"
  element={<TeamStats />}
/>
      </Routes>
    </BrowserRouter>
  );
}