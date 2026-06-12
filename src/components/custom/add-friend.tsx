import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "../../components/ui/field"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useNavigate, useSearchParams } from "react-router"
import type { FriendGraph } from "@/lib/types"

function AddFriend() {
  const anchor = useComboboxAnchor()
  const data: FriendGraph = JSON.parse(
    localStorage.getItem("graph") || '{ "nodes": [], "links": [] }'
  )
  const [source, setSource] = useState<string>("")
  const [items, setItems] = useState<String[]>([])
  const [friends, setFriends] = useState<String[]>([])
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [searchParams, _] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const name = searchParams.get("name")
    if (name && data.nodes.map((node) => node.id).includes(name)) {
      setSource(name)
    }
  }, [])

  useEffect(() => {
    setItems(
      data.nodes?.filter((val) => val.id !== source).map((node) => node.id)
    )
    setFriends(friends.filter((val) => val !== source))
  }, [source])

  useEffect(() => {
    if (source.length !== 0 && friends.length !== 0) {
      setSaveDisabled(false)
    } else {
      setSaveDisabled(true)
    }
  }, [source, friends])

  const saveChanges = () => {
    localStorage.setItem(
      "graph",
      JSON.stringify({
        ...data,
        links: [
          ...data["links"],
          ...friends.map((friend) => {
            return { source: source, target: friend, value: 1 }
          }),
        ],
      })
    )
    navigate("/")
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="grid w-full max-w-sm gap-4">
          <Field>
            <FieldLabel htmlFor="input-field-name">Your Name</FieldLabel>
            <Select
              value={source}
              onValueChange={(val) => {
                setSource(val)
              }}
              required={true}
            >
              <SelectTrigger className="w-full" id="input-field-name">
                <SelectValue placeholder="Select your name" />
              </SelectTrigger>
              <SelectContent>
                {data.nodes?.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button
            variant="link"
            className="text-secondary"
            onClick={() => navigate("/create")}
          >
            Don't see your name? Click here
          </Button>
          <Field>
            <FieldLabel htmlFor="input-friend-select">Your Friends</FieldLabel>
            <Combobox
              multiple
              items={items}
              id="input-friend-select"
              value={friends}
              onValueChange={(val) => setFriends(val)}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(item) => (
                    <React.Fragment>
                      {item.length === 0 && (
                        <span className="text-muted-foreground">
                          Select your friends
                        </span>
                      )}
                      {item.map((val: string) => (
                        <ComboboxChip key={val}>{val}</ComboboxChip>
                      ))}
                    </React.Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor} className="relative z-[60]">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>

          <Button type="submit" disabled={saveDisabled} onClick={saveChanges}>
            Save changes
          </Button>
        </div>
      </div>
    </>
  )
}

export default AddFriend
