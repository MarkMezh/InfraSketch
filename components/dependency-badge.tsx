"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function DependencyBadge({
  resourceName,
  dependencyName,
  onClick,
}: {
  resourceName: string
  dependencyName: string
  onClick?: () => void
}) {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1 cursor-pointer hover:bg-muted transition-colors px-2 py-1 rounded-md"
      onClick={onClick}
    >
      <span className="text-xs font-medium">{resourceName}</span>
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs font-medium">{dependencyName}</span>
    </Badge>
  )
}
