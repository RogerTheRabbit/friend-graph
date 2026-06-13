import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

import type { FriendGraph, FriendNode, FriendLink } from "@/lib/types"

export const Graph = () => {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [data, setData] = useState<FriendGraph>({ nodes: [], links: [] })

  useEffect(() => {
    setData(
      JSON.parse(
        localStorage.getItem("graph") || '{ "nodes": [], "links": [] }'
      )
    )

    if (!ref.current) return

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!size.width || !size.height) return

    const width = size.width
    const height = size.height

    const links = data.links?.map((d) => ({ ...d })) || []
    const nodes = data.nodes?.map((d) => ({ ...d })) || []

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<FriendNode, FriendLink>(links)
          .id((d) => d.id)
          .distance(250)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50).strength(1))

    const svg = d3
      .select(ref.current)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: 100%;")

    const link = svg
      .append("g")
      .attr("stroke", "var(--border)")
      .selectAll<SVGGElement, FriendNode>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", "3")

    const node = svg
      .append("g")
      .attr("stroke-width", 1)
      .selectAll<SVGGElement, FriendNode>("g")
      .data(nodes)
      .join("g")

    node.append("circle").attr("r", 50).attr("fill", "var(--card)")

    node
      .append("text")
      .text((d) => d.id.toUpperCase())
      .attr("fill", "var(--foreground)")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")

    node.call(
      d3
        .drag<SVGGElement, FriendNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    simulation.on("tick", ticked)

    function ticked() {
      link
        .attr("x1", (d) => (d.source as FriendNode).x ?? 0)
        .attr("y1", (d) => (d.source as FriendNode).y ?? 0)
        .attr("x2", (d) => (d.target as FriendNode).x ?? 0)
        .attr("y2", (d) => (d.target as FriendNode).y ?? 0)

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    }

    function dragstarted(
      event: d3.D3DragEvent<SVGGElement, FriendNode, FriendNode>,
      d: FriendNode
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, FriendNode, FriendNode>,
      d: FriendNode
    ) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(
      event: d3.D3DragEvent<SVGGElement, FriendNode, FriendNode>,
      d: FriendNode
    ) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [size, data])

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />
}

export default Graph
