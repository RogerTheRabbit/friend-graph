import type { FriendGraph } from "./types"
import JSZip from "jszip"

export const convertToMarkdown = (graph: FriendGraph): void => {
  const zip = new JSZip()

  const names = graph.nodes.map((node) => node.id)

  names.forEach((name) => {
    const connections = new Set<String>(
      graph.links
        .filter((link) => link.source === name || link.target === name)
        .map((link) => (link.source === name ? link.target : link.source))
    )

    zip.file(
      `${name}.md`,
      [...connections].map((connection) => `- [[${connection}]]`).join("\n")
    )
  })

  zip.generateAsync({ type: "blob" }).then((content) => {
    const url = URL.createObjectURL(content)
    const link = document.createElement("a")
    link.href = url
    link.download = "FriendGraphObsidianExport.zip"
    link.click()

    URL.revokeObjectURL(url)
  })
}

export default { convertToMarkdown }
