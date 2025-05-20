"use client"

import type React from "react"

import { useState } from "react"
import { Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DependencySelector } from "@/components/dependency-selector"

export function ResourceFormRDS({
  onSave,
  onCancel,
  initialData,
  allResources = [],
}: {
  onSave: (data: any) => void
  onCancel: () => void
  initialData?: any
  allResources?: any[]
}) {
  const [name, setName] = useState(initialData?.name || "database")
  const [engine, setEngine] = useState(initialData?.properties?.engine || "mysql")
  const [instanceClass, setInstanceClass] = useState(initialData?.properties?.instance_class || "db.t3.micro")
  const [allocatedStorage, setAllocatedStorage] = useState(
    initialData?.properties?.allocated_storage?.toString() || "20",
  )
  const [multiAZ, setMultiAZ] = useState(
    initialData?.properties?.multi_az !== undefined ? initialData.properties.multi_az : false,
  )
  const [customDependencies, setCustomDependencies] = useState(initialData?.customDependencies || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a copy of the initial data to preserve the id
    const updatedResource = {
      ...(initialData || {}),
      type: "RDS",
      name,
      properties: {
        engine,
        instance_class: instanceClass,
        allocated_storage: Number.parseInt(allocatedStorage, 10),
        multi_az: multiAZ,
      },
      customDependencies,
    }

    onSave(updatedResource)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <CardTitle>RDS Database</CardTitle>
          </div>
          <CardDescription>Configure an Amazon RDS database instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="database" required />
            <p className="text-sm text-muted-foreground">This will be used as the resource identifier in Terraform</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engine">Database Engine</Label>
            <select
              id="engine"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
            >
              <option value="mysql">MySQL</option>
              <option value="postgres">PostgreSQL</option>
              <option value="mariadb">MariaDB</option>
              <option value="oracle-ee">Oracle</option>
              <option value="sqlserver-ex">SQL Server Express</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance-class">Instance Class</Label>
            <select
              id="instance-class"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={instanceClass}
              onChange={(e) => setInstanceClass(e.target.value)}
            >
              <option value="db.t3.micro">db.t3.micro (1 vCPU, 1 GiB RAM)</option>
              <option value="db.t3.small">db.t3.small (1 vCPU, 2 GiB RAM)</option>
              <option value="db.t3.medium">db.t3.medium (2 vCPU, 4 GiB RAM)</option>
              <option value="db.m5.large">db.m5.large (2 vCPU, 8 GiB RAM)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocated-storage">Allocated Storage (GB)</Label>
            <Input
              id="allocated-storage"
              type="number"
              min="20"
              max="1000"
              value={allocatedStorage}
              onChange={(e) => setAllocatedStorage(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="multi-az" checked={multiAZ} onCheckedChange={(checked) => setMultiAZ(checked as boolean)} />
            <Label htmlFor="multi-az">Multi-AZ Deployment</Label>
          </div>

          <div className="space-y-2">
            <Label>Custom Dependencies</Label>
            <DependencySelector
              resources={allResources}
              selectedDependencies={customDependencies}
              onChange={setCustomDependencies}
              currentResourceId={initialData?.id}
              resourceType="RDS"
            />
            <p className="text-sm text-muted-foreground">
              Select additional dependencies not automatically detected from code
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update Resource" : "Add Resource"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
