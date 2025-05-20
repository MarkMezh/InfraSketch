"use client"

import type React from "react"

import { useState } from "react"
import { HardDrive } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DependencySelector } from "@/components/dependency-selector"

export function ResourceFormVPC({
  onSave,
  onCancel,
  initialData,
  allResources = [],
  isFirstVPC = false, // Add flag for first VPC in new project
}: {
  onSave: (data: any) => void
  onCancel: () => void
  initialData?: any
  allResources?: any[]
  isFirstVPC?: boolean
}) {
  const [name, setName] = useState(initialData?.name || "main-vpc")
  const [cidrBlock, setCidrBlock] = useState(initialData?.properties?.cidr_block || "10.0.0.0/16")
  const [subnetCidrMask, setSubnetCidrMask] = useState(initialData?.properties?.subnet_cidr_mask || "24")
  const [enableDnsSupport, setEnableDnsSupport] = useState(
    initialData?.properties?.enable_dns_support !== undefined ? initialData.properties.enable_dns_support : true,
  )
  const [enableDnsHostnames, setEnableDnsHostnames] = useState(
    initialData?.properties?.enable_dns_hostnames !== undefined ? initialData.properties.enable_dns_hostnames : true,
  )
  // Add dependencies state
  const [customDependencies, setCustomDependencies] = useState(initialData?.customDependencies || [])

  // Update the handleSubmit function to include dependencies
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a copy of the initial data to preserve the id
    const updatedResource = {
      ...(initialData || {}),
      type: "VPC",
      name,
      properties: {
        cidr_block: cidrBlock,
        subnet_cidr_mask: subnetCidrMask,
        enable_dns_support: enableDnsSupport,
        enable_dns_hostnames: enableDnsHostnames,
      },
      customDependencies,
      isFirstVPC, // Pass the flag to indicate if this is the first VPC
    }

    onSave(updatedResource)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            <CardTitle>VPC Network</CardTitle>
          </div>
          <CardDescription>Configure an Amazon VPC network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="main-vpc" required />
            <p className="text-sm text-muted-foreground">This will be used as the resource identifier in Terraform</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidr-block">CIDR Block</Label>
            <Input
              id="cidr-block"
              value={cidrBlock}
              onChange={(e) => setCidrBlock(e.target.value)}
              placeholder="10.0.0.0/16"
              required
            />
            <p className="text-sm text-muted-foreground">IP address range for the VPC in CIDR notation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subnet-cidr-mask">Subnet CIDR Mask</Label>
            <Input
              id="subnet-cidr-mask"
              value={subnetCidrMask}
              onChange={(e) => setSubnetCidrMask(e.target.value)}
              placeholder="24"
              required
            />
            <p className="text-sm text-muted-foreground">CIDR mask for subnets (e.g., 24 for /24 subnets)</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dns-support"
              checked={enableDnsSupport}
              onCheckedChange={(checked) => setEnableDnsSupport(checked as boolean)}
            />
            <Label htmlFor="dns-support">Enable DNS Support</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dns-hostnames"
              checked={enableDnsHostnames}
              onCheckedChange={(checked) => setEnableDnsHostnames(checked as boolean)}
            />
            <Label htmlFor="dns-hostnames">Enable DNS Hostnames</Label>
          </div>

          {/* Only show dependencies selector if this is not the first VPC in a new project */}
          {!isFirstVPC && (
            <div className="space-y-2">
              <Label>Custom Dependencies</Label>
              <DependencySelector
                resources={allResources}
                selectedDependencies={customDependencies}
                onChange={setCustomDependencies}
                currentResourceId={initialData?.id}
                resourceType="VPC"
              />
              <p className="text-sm text-muted-foreground">
                Select additional dependencies not automatically detected from code
              </p>
            </div>
          )}
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
