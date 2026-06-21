import { Graph } from "@/components/custom/chart/graph"
import { useNavigate } from "react-router"
import { Button } from "./components/ui/button"
import { Plus } from "lucide-react"
import StatsDialog from "./components/custom/stats-dialog"
import { Input } from "./components/ui/input"
import { useState } from "react"
import { useDebounce } from "use-debounce"

export function App() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [debouncedQuery] = useDebounce(query, 400)

  return (
    <div>
      <Input
        id="search-input"
        type="search"
        placeholder="Search"
        className="absolute top-0 left-0 m-3 w-3xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        variant="default"
        className="absolute top-0 right-0 m-3"
        onClick={() => navigate("/add")}
      >
        <Plus />
        Signin
      </Button>
      <StatsDialog />
      <div className="flex min-h-svh">
        <div className="min-h-0 flex-1">
          <Graph query={debouncedQuery} />
        </div>
      </div>
    </div>
  )
}

export default App
