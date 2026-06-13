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

    const nodeCount = nodes.length
    const linkDistance = Math.max(
      80,
      Math.min(250, 10000 / Math.sqrt(nodeCount))
    )
    const chargeStrength = Math.max(-300, -1000 / Math.sqrt(nodes.length))

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<FriendNode, FriendLink>(links)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collide", d3.forceCollide(linkDistance * 0.3))

    const svg = d3
      .select(ref.current)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: 100%;")

    const graph = svg.append("g")

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        graph.attr("transform", event.transform)
      })

    svg.call(zoom)

    const link = graph
      .append("g")
      .attr("stroke", "var(--border)")
      .selectAll<SVGGElement, FriendNode>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", "5")

    const node = graph
      .append("g")
      .attr("stroke-width", 1)
      .selectAll<SVGGElement, FriendNode>("g")
      .data(nodes)
      .join("g")

    node.append("circle").attr("r", 60).attr("fill", "var(--card)")

    node
      .append("text")
      .attr("fill", "var(--foreground)")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .each(function (d) {
        const words = d.id.toUpperCase().split(" ")
        const text = d3.select(this)

        if (words.length === 1) {
          text.text(words[0])
          return
        }

        const lineHeight = 1.1 // em
        const startY = -((words.length - 1) * lineHeight) / 2

        words.forEach((word, i) => {
          text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? `${startY}em` : `${lineHeight}em`)
            .text(word)
        })
      })

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
      event.sourceEvent.stopPropagation()
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, FriendNode, FriendNode>,
      d: FriendNode
    ) {
      event.sourceEvent.stopPropagation()
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
