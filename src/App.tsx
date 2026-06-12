import { Graph } from "@/components/custom/chart/graph"
import { useNavigate } from "react-router"
import { Button } from "./components/ui/button"
import { Plus } from "lucide-react"

export function App() {
  const navigate = useNavigate()

  return (
    <div>
      <Button
        variant="outline"
        size="icon-lg"
        className="m-3"
        onClick={() => navigate("/add")}
      >
        <Plus />
      </Button>
      <div className="flex min-h-svh p-6">
        <div className="min-h-0 flex-1">
          <Graph />
        </div>
      </div>
    </div>
  )
}

export default App
