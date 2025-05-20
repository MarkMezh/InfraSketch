"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export function DependencySelector({
  resources,
  selectedDependencies = [],
  onChange,
  currentResourceId,
  resourceType,
}: {
  resources: any[]
  selectedDependencies: string[]
  onChange: (dependencies: string[]) => void
  currentResourceId?: string
  resourceType?: string
}) {
  const [open, setOpen] = useState(false)
  const [filteredResources, setFilteredResources] = useState<any[]>([])

  // Filter out the current resource and apply any resource type filtering
  useEffect(() => {
    let filtered = resources.filter((resource) => resource.id !== currentResourceId)

    // Apply resource type filtering based on the current resource type
    if (resourceType) {
      // Define valid dependency types for each resource type
      const validDependencies: Record<string, string[]> = {
        EC2: ["VPC", "S3"],
        RDS: ["VPC"],
        S3: [],
        VPC: [],
      }

      if (validDependencies[resourceType]) {
        filtered = filtered.filter((resource) => validDependencies[resourceType].includes(resource.type))
      }
    }

    setFilteredResources(filtered)
  }, [resources, currentResourceId, resourceType])

  const toggleDependency = (resourceId: string) => {
    if (selectedDependencies.includes(resourceId)) {
      onChange(selectedDependencies.filter((id) => id !== resourceId))
    } else {
      onChange([...selectedDependencies, resourceId])
    }
  }

  const getResourceById = (id: string) => {
    return resources.find((resource) => resource.id === id)
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            Select dependencies
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search resources..." />
            <CommandList>
              <CommandEmpty>No resources found.</CommandEmpty>
              <CommandGroup>
                {filteredResources.map((resource) => (
                  <CommandItem
                    key={resource.id}
                    value={resource.id}
                    onSelect={() => {
                      toggleDependency(resource.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDependencies.includes(resource.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="font-medium">{resource.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({resource.type})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedDependencies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedDependencies.map((depId) => {
            const resource = getResourceById(depId)
            return resource ? (
              <Badge key={depId} variant="secondary" className="flex items-center gap-1">
                {resource.name}
                <button className="ml-1 rounded-full hover:bg-muted p-0.5" onClick={() => toggleDependency(depId)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
