import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog"
import { useEffect, useState } from "react"
import type { FriendGraph } from "../../lib/types"
import statFuncs from "../../lib/stats"
import { Shuffle } from "lucide-react"
import { useSearchParams } from "react-router"
import { Button } from "../ui/button"

function StatsDialog() {
  const [statsOpen, setStatsOpen] = useState(false)
  const [stats, setStats] = useState<string[]>([])
  const [statIdx, setStatIdx] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState<FriendGraph>({ nodes: [], links: [] })

  useEffect(() => {
    setData(
      JSON.parse(
        localStorage.getItem("graph") || '{ "nodes": [], "links": [] }'
      )
    )
  }, [])

  useEffect(() => {
    const name = searchParams.get("name")
    console.log("name", name)
    if (!!name) {
      setStatsOpen(true)
      setStats(
        Object.values(statFuncs)
          .map((val) => val(data, name))
          .filter((val) => val.length !== 0)
      )
    }
  }, [data])

  return (
    <Dialog
      open={statsOpen}
      onOpenChange={(val) => {
        setStatsOpen(val)
        setSearchParams("")
      }}
    >
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            Welcome to the party, {searchParams.get("name")} 🥳
          </DialogTitle>
          <DialogDescription className="flex flex-col">
            <span className="m-1">{stats[statIdx]}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
          <Button
            size="icon"
            onClick={() => setStatIdx((statIdx + 1) % stats.length)}
          >
            <Shuffle />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StatsDialog
