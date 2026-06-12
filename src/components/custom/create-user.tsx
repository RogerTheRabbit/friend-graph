import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldDescription } from "../../components/ui/field"
import { useNavigate } from "react-router"
import { Input } from "../ui/input"
import type { FriendGraph } from "@/lib/types"

function CreateUser() {
  const [name, setName] = useState("")
  const [data, setData] = useState<FriendGraph>({ nodes: [], links: [] })
  const [saveDisabled, setSaveDisabled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setData(
      JSON.parse(
        localStorage.getItem("graph") || '{ "nodes": [], "links": [] }'
      ) as FriendGraph
    )
  }, [])

  useEffect(() => {
    if (
      (data.nodes &&
        data.nodes
          .map((val) => val.id.toLocaleLowerCase())
          .includes(name.trim().toLocaleLowerCase())) ||
      name.trim().length === 0
    ) {
      setSaveDisabled(true)
    } else {
      setSaveDisabled(false)
    }
  }, [name])

  const saveChanges = () => {
    localStorage.setItem(
      "graph",
      JSON.stringify({
        ...data,
        nodes: [...data.nodes, { id: name.trim(), group: 1 }],
      })
    )
    navigate(`/add?name=${name}`)
  }

  return (
    <>
      <div className="align-center flex h-screen w-screen flex-grow items-center justify-center">
        <div className="grid w-full max-w-sm gap-4">
          <Field data-invalid={saveDisabled}>
            <FieldLabel htmlFor="input-field-name">Your Name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            {saveDisabled && (
              <FieldDescription>
                Someone alread has that name. name should be unique so can be
                differentiated from others. Try putting a last name.
              </FieldDescription>
            )}
          </Field>

          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saveDisabled} onClick={saveChanges}>
            Create
          </Button>
        </div>
      </div>
    </>
  )
}

export default CreateUser
