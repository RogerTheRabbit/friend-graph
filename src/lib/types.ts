import type { SimulationLinkDatum, SimulationNodeDatum } from "d3"

type FriendNode = {
  id: string
  group: number
} & SimulationNodeDatum

type FriendLink = {
  source: string
  target: string
  value: number
} & SimulationLinkDatum<FriendNode>

type FriendGraph = {
  nodes: FriendNode[]
  links: FriendLink[]
}

export type { FriendNode, FriendLink, FriendGraph }
