import { Graph } from "@/components/custom/chart/graph"
import { useNavigate } from "react-router"
import { Button } from "./components/ui/button"
import { Plus } from "lucide-react"
import StatsDialog from "./components/custom/stats-dialog"

export function App() {
  const navigate = useNavigate()

  return (
    <div>
      <Button
        variant="outline"
        size="icon-lg"
        className="absolute top-0 right-0 m-3"
        onClick={() => navigate("/add")}
      >
        <Plus />
      </Button>
      <StatsDialog />
      <div className="flex min-h-svh">
        <div className="min-h-0 flex-1">
          <Graph />
        </div>
      </div>
    </div>
  )
}

export default App
