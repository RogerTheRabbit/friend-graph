import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Route, Routes } from "react-router"
import AddFriend from "./components/custom/add-friend.tsx"
import CreateUser from "./components/custom/create-user.tsx"
const basename = import.meta.env.VITE_BASE || "/"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/add" element={<AddFriend />} />
          <Route path="/create" element={<CreateUser />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
