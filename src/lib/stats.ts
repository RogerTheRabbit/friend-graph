import type { FriendGraph } from "./types"

type AdjacencyMap = Map<string, Set<string>>

function buildUndirectedAdjacency(graph: FriendGraph): AdjacencyMap {
  const adjacency = new Map<string, Set<string>>()

  for (const node of graph.nodes) {
    adjacency.set(node.id, new Set())
  }

  for (const link of graph.links) {
    if (link.source === link.target) continue

    adjacency.get(link.source)?.add(link.target)
    adjacency.get(link.target)?.add(link.source)
  }

  return adjacency
}

function getPersonName(graph: FriendGraph, id: string) {
  return graph.nodes.find((n) => n.id === id)?.id
}

export function personWithMostMutualFriends(
  graph: FriendGraph,
  nodeId: string
): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const myFriends = adjacency.get(nodeId) ?? new Set()

  let best: { id: string; mutualFriends: number } | undefined

  for (const candidate of adjacency.keys()) {
    if (candidate === nodeId) continue
    if (myFriends.has(candidate)) continue

    const candidateFriends = adjacency.get(candidate) ?? new Set()

    let mutualFriends = 0

    for (const friend of myFriends) {
      if (candidateFriends.has(friend)) {
        mutualFriends++
      }
    }

    if (!best || mutualFriends > best.mutualFriends) {
      best = {
        id: candidate,
        mutualFriends,
      }
    }
  }

  if (!best || best.mutualFriends === 0) {
    return ""
  }

  return `🤝 You and ${getPersonName(graph, best.id)} share ${best.mutualFriends} mutual friends — probably time to meet.`
}

export function recommendFriends(
  graph: FriendGraph,
  nodeId: string,
  limit = 3
): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const friends = adjacency.get(nodeId) ?? new Set()

  const recommendations: {
    id: string
    mutualFriends: number
  }[] = []

  for (const candidate of adjacency.keys()) {
    if (candidate === nodeId) continue
    if (friends.has(candidate)) continue

    const candidateFriends = adjacency.get(candidate) ?? new Set()

    let mutualFriends = 0

    for (const friend of friends) {
      if (candidateFriends.has(friend)) {
        mutualFriends++
      }
    }

    if (mutualFriends > 0) {
      recommendations.push({
        id: candidate,
        mutualFriends,
      })
    }
  }

  const top = recommendations
    .sort((a, b) => b.mutualFriends - a.mutualFriends)
    .slice(0, limit)

  if (!top.length) {
    return ""
  }

  return `✨ ${top
    .map((r) => getPersonName(graph, r.id))
    .join(", ")} keep showing up in your circles. Worth an introduction?`
}

export function bridgeScore(graph: FriendGraph, nodeId: string): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const friends = adjacency.get(nodeId)

  if (!friends) {
    return ""
  }

  const groups = new Set<number>()

  for (const friendId of friends) {
    const friend = graph.nodes.find((n) => n.id === friendId)

    if (friend) {
      groups.add(friend.group)
    }
  }

  return `🌉 You're connecting ${groups.size} different communities.`
}

export function twoHopReach(graph: FriendGraph, nodeId: string): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const friends = adjacency.get(nodeId) ?? new Set()

  const reached = new Set<string>()

  for (const friend of friends) {
    const secondDegree = adjacency.get(friend) ?? new Set()

    for (const person of secondDegree) {
      if (person !== nodeId && !friends.has(person)) {
        reached.add(person)
      }
    }
  }

  if (reached.size === 0) {
    return ""
  }

  return `🚀 Through your friends, you can reach ${reached.size} new people.`
}

export function closestNonFriend(graph: FriendGraph, nodeId: string): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const directFriends = adjacency.get(nodeId) ?? new Set()

  const queue: [string, number][] = [[nodeId, 0]]
  const visited = new Set([nodeId])

  while (queue.length) {
    const [current, distance] = queue.shift()!

    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next)) continue

      visited.add(next)

      if (distance >= 1 && !directFriends.has(next)) {
        return `👋 ${getPersonName(graph, next)} is only ${
          distance + 1
        } introductions away - Reach out!`
      }

      queue.push([next, distance + 1])
    }
  }

  return ""
}

export function hiddenConnectorScore(
  graph: FriendGraph,
  nodeId: string
): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const friends = [...(adjacency.get(nodeId) ?? [])]

  if (friends.length < 2) {
    return ""
  }

  let disconnectedPairs = 0

  for (let i = 0; i < friends.length; i++) {
    for (let j = i + 1; j < friends.length; j++) {
      const a = friends[i]
      const b = friends[j]

      if (!adjacency.get(a)?.has(b)) {
        disconnectedPairs++
      }
    }
  }

  if (disconnectedPairs === 0) {
    return ""
  }

  return `🕸️ Quiet but important: removing you would split ${disconnectedPairs} friendship paths.`
}

export function mostUnexpectedConnection(
  graph: FriendGraph,
  nodeId: string
): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const me = graph.nodes.find((n) => n.id === nodeId)

  if (!me) {
    return ""
  }

  const myFriends = adjacency.get(nodeId) ?? new Set()

  let best:
    | {
        id: string
        mutualFriends: number
      }
    | undefined

  for (const candidate of graph.nodes) {
    if (candidate.id === nodeId) continue
    if (candidate.group === me.group) continue
    if (myFriends.has(candidate.id)) continue

    const candidateFriends = adjacency.get(candidate.id) ?? new Set()

    let mutual = 0

    for (const friend of myFriends) {
      if (candidateFriends.has(friend)) {
        mutual++
      }
    }

    if (!best || mutual > best.mutualFriends) {
      best = {
        id: candidate.id,
        mutualFriends: mutual,
      }
    }
  }

  if (!best || best.mutualFriends === 0) {
    return ""
  }

  return `🎲 You and ${getPersonName(
    graph,
    best.id
  )} come from different worlds but share ${best.mutualFriends} mutual friends.`
}

export function bestIntroducer(graph: FriendGraph, nodeId: string): string {
  const adjacency = buildUndirectedAdjacency(graph)

  const myFriends = adjacency.get(nodeId) ?? new Set()

  let best:
    | {
        id: string
        newPeople: number
      }
    | undefined

  for (const friend of myFriends) {
    const introductions = new Set<string>()

    for (const person of adjacency.get(friend) ?? []) {
      if (person !== nodeId && !myFriends.has(person)) {
        introductions.add(person)
      }
    }

    if (!best || introductions.size > best.newPeople) {
      best = {
        id: friend,
        newPeople: introductions.size,
      }
    }
  }

  if (!best || !best.newPeople) {
    return ""
  }

  return `🎉 If ${getPersonName(
    graph,
    best.id
  )} introduced you to everyone they know, you'd meet ${
    best.newPeople
  } new people.`
}

export default {
  personWithMostMutualFriends,
  recommendFriends,
  bridgeScore,
  twoHopReach,
  closestNonFriend,
  hiddenConnectorScore,
  mostUnexpectedConnection,
  bestIntroducer,
}
