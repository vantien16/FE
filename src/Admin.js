import React from "react";
import Sidebar from "./pages/adminpage/global/Sidebar";
import Topbar from "./pages/adminpage/global/Topbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/adminpage/dashboard/Dashboard";
import Bar from "./pages/adminpage/bar/Bar";
import Pie from "./pages/adminpage/pie/Pie";
import Line from "./pages/adminpage/line/Line";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@emotion/react";
import { useState } from "react";
import { CssBaseline } from "@mui/material";
import Calendar from "./pages/adminpage/calendar/calendar";
import Team from "./pages/adminpage/team/Team";
// import Contacts from "./pages/adminpage/contacts";
// import Invoices from "./pages/adminpage/invoices";
import FAQ from "./pages/adminpage/faq";
import Form from "./pages/adminpage/form";
import PostsUser from "./pages/adminpage/postadmin";
import PetsUser from "./pages/adminpage/petadmin";

function Admin() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/posts" element={<PostsUser />} />
              <Route path="/pets" element={<PetsUser />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
