import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Field, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { useNavigate } from "react-router"
import { Toaster } from "../ui/sonner"
import { toast } from "sonner"

function Admin() {
  const [data, setData] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    setData(localStorage.getItem("graph") || "")
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid w-full max-w-sm gap-4">
        <Field>
          <FieldLabel>Graph</FieldLabel>
        </Field>
        <Textarea
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
