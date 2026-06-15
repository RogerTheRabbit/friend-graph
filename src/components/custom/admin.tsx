import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Field, FieldLabel } from "../ui/field"
import { useNavigate } from "react-router"
import { Toaster } from "../ui/sonner"
import { toast } from "sonner"
import { AutosizeTextarea } from "./autosize-text-area"

function Admin() {
  const [data, setData] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    setData(
      JSON.stringify(JSON.parse(localStorage.getItem("graph") || "{}"), null, 2)
    )
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid max-h-screen w-full max-w-lg gap-4">
        <Field>
          <FieldLabel>Graph</FieldLabel>
        </Field>
        <AutosizeTextarea
          placeholder="Paste JSON here"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>

        <Button
          type="submit"
          onClick={() => {
            try {
              JSON.parse(data)
              localStorage.setItem("graph", JSON.stringify(JSON.parse(data)))
            } catch (err) {
              toast.error("Invalid JSON", {
                description: err instanceof Error ? err.message : String(err),
              })
            }
          }}
        >
          Save changes
        </Button>
      </div>
      <Toaster />
    </div>
  )
}

export default Admin
