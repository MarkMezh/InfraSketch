"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Resource {
  id: string
  name: string
  type: string
  dependencies?: string[]
}

export function DependencyGraph({ resources }: { resources: Resource[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 400
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw nodes and edges
    const nodeRadius = 30
    const nodeSpacing = 150
    const startX = canvas.width / 2 - ((resources.length - 1) * nodeSpacing) / 2
    const startY = 100

    // Map resources to positions
    const nodePositions: Record<string, { x: number; y: number }> = {}

    // First pass: position nodes
    resources.forEach((resource, index) => {
      const x = startX + index * nodeSpacing
      const y = startY + (resource.dependencies?.length ? 0 : 100)
      nodePositions[resource.id] = { x, y }
    })

    // Second pass: adjust positions based on dependencies
    resources.forEach((resource) => {
      if (resource.dependencies?.length) {
        const deps = resource.dependencies
        const depNodes = deps.map((id) => nodePositions[id])

        // If resource has dependencies, position it below them
        if (depNodes.length > 0) {
          const avgX = depNodes.reduce((sum, pos) => sum + pos.x, 0) / depNodes.length
          const maxY = Math.max(...depNodes.map((pos) => pos.y))

          nodePositions[resource.id] = {
            x: avgX,
            y: maxY + 100,
          }
        }
      }
    })

    // Draw edges first (so they appear behind nodes)
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 2

    resources.forEach((resource) => {
      if (resource.dependencies?.length) {
        const { x: targetX, y: targetY } = nodePositions[resource.id]

        resource.dependencies.forEach((depId) => {
          const { x: sourceX, y: sourceY } = nodePositions[depId]

          // Draw arrow
          ctx.beginPath()
          ctx.moveTo(sourceX, sourceY + nodeRadius)
          ctx.lineTo(targetX, targetY - nodeRadius)

          // Draw arrowhead
          const angle = Math.atan2(targetY - sourceY, targetX - sourceX)
          const arrowLength = 10
          ctx.lineTo(
            targetX - arrowLength * Math.cos(angle - Math.PI / 6),
            targetY - nodeRadius - arrowLength * Math.sin(angle - Math.PI / 6),
          )
          ctx.moveTo(targetX, targetY - nodeRadius)
          ctx.lineTo(
            targetX - arrowLength * Math.cos(angle + Math.PI / 6),
            targetY - nodeRadius - arrowLength * Math.sin(angle + Math.PI / 6),
          )

          ctx.stroke()
        })
      }
    })

    // Draw nodes
    resources.forEach((resource) => {
      const { x, y } = nodePositions[resource.id]

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)

      // Set color based on resource type
      switch (resource.type) {
        case "EC2":
          ctx.fillStyle = "#f97316"
          break
        case "VPC":
          ctx.fillStyle = "#0ea5e9"
          break
        case "S3":
          ctx.fillStyle = "#22c55e"
          break
        case "RDS":
          ctx.fillStyle = "#8b5cf6"
          break
        default:
          ctx.fillStyle = "#64748b"
      }

      ctx.fill()
      ctx.stroke()

      // Draw text
      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(resource.name, x, y)

      // Draw resource type
      ctx.fillStyle = "#fff"
      ctx.font = "10px sans-serif"
      ctx.fillText(resource.type, x, y + 15)
    })
  }, [resources])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Dependencies</CardTitle>
        <CardDescription>Visual representation of resource dependencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <canvas ref={canvasRef} className="min-h-[400px]" />
        </div>
      </CardContent>
    </Card>
  )
}
