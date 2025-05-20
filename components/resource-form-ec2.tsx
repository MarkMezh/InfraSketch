"use client"

import type React from "react"

import { useState } from "react"
import { Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DependencySelector } from "@/components/dependency-selector"

export function ResourceFormEC2({
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
  const [name, setName] = useState(initialData?.name || "web-server")
  const [instanceType, setInstanceType] = useState(initialData?.properties?.instance_type || "t2.micro")
  const [ami, setAmi] = useState(initialData?.properties?.ami || "ami-12345678")
  const [keyName, setKeyName] = useState(initialData?.properties?.key_name || "")
  const [enablePublicIP, setEnablePublicIP] = useState(
    initialData?.properties?.associate_public_ip_address !== undefined
      ? initialData.properties.associate_public_ip_address
      : true,
  )
  // Add dependencies state
  const [customDependencies, setCustomDependencies] = useState(initialData?.customDependencies || [])

  // Update the handleSubmit function to include dependencies
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a copy of the initial data to preserve the id
    const updatedResource = {
      ...(initialData || {}),
      type: "EC2",
      name,
      properties: {
        instance_type: instanceType,
        ami,
        key_name: keyName || null,
        associate_public_ip_address: enablePublicIP,
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
            <Server className="h-6 w-6" />
            <CardTitle>EC2 Instance</CardTitle>
          </div>
          <CardDescription>Configure an Amazon EC2 instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="web-server" required />
            <p className="text-sm text-muted-foreground">This will be used as the resource identifier in Terraform</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance-type">Instance Type</Label>
            <select
              id="instance-type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={instanceType}
              onChange={(e) => setInstanceType(e.target.value)}
            >
              <option value="t2.micro">t2.micro (1 vCPU, 1 GiB RAM)</option>
              <option value="t2.small">t2.small (1 vCPU, 2 GiB RAM)</option>
              <option value="t2.medium">t2.medium (2 vCPU, 4 GiB RAM)</option>
              <option value="t3.micro">t3.micro (2 vCPU, 1 GiB RAM)</option>
              <option value="t3.small">t3.small (2 vCPU, 2 GiB RAM)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ami">AMI ID</Label>
            <Input id="ami" value={ami} onChange={(e) => setAmi(e.target.value)} placeholder="ami-12345678" required />
            <p className="text-sm text-muted-foreground">Amazon Machine Image ID to use for the instance</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-name">Key Pair Name (Optional)</Label>
            <Input
              id="key-name"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="my-key-pair"
            />
            <p className="text-sm text-muted-foreground">Key pair for SSH access to the instance</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="public-ip"
              checked={enablePublicIP}
              onCheckedChange={(checked) => setEnablePublicIP(checked as boolean)}
            />
            <Label htmlFor="public-ip">Associate Public IP Address</Label>
          </div>

          <div className="space-y-2">
            <Label>Custom Dependencies</Label>
            <DependencySelector
              resources={allResources}
              selectedDependencies={customDependencies}
              onChange={setCustomDependencies}
              currentResourceId={initialData?.id}
              resourceType="EC2"
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
