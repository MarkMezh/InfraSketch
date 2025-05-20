"use client"

import type React from "react"

import { useState } from "react"
import { Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DependencySelector } from "@/components/dependency-selector"

export function ResourceFormS3({
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
  const [name, setName] = useState(initialData?.name || "static-assets")
  const [bucketName, setBucketName] = useState(initialData?.properties?.bucket || "")
  const [acl, setAcl] = useState(initialData?.properties?.acl || "private")
  const [versioning, setVersioning] = useState(initialData?.properties?.versioning ? "enabled" : "disabled")
  const [customDependencies, setCustomDependencies] = useState(initialData?.customDependencies || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a copy of the initial data to preserve the id
    const updatedResource = {
      ...(initialData || {}),
      type: "S3",
      name,
      properties: {
        bucket: bucketName || undefined,
        acl,
        versioning: versioning === "enabled",
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
            <CardTitle>S3 Bucket</CardTitle>
          </div>
          <CardDescription>Configure an Amazon S3 storage bucket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="static-assets"
              required
            />
            <p className="text-sm text-muted-foreground">This will be used as the resource identifier in Terraform</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket-name">Bucket Name (Optional)</Label>
            <Input
              id="bucket-name"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              placeholder="my-unique-bucket-name"
            />
            <p className="text-sm text-muted-foreground">Leave empty to auto-generate a unique name</p>
          </div>

          <div className="space-y-2">
            <Label>Access Control</Label>
            <RadioGroup value={acl} onValueChange={setAcl}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="acl-private" />
                <Label htmlFor="acl-private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public-read" id="acl-public-read" />
                <Label htmlFor="acl-public-read">Public Read</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public-read-write" id="acl-public-read-write" />
                <Label htmlFor="acl-public-read-write">Public Read/Write</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Versioning</Label>
            <RadioGroup value={versioning} onValueChange={setVersioning}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enabled" id="versioning-enabled" />
                <Label htmlFor="versioning-enabled">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="versioning-disabled" />
                <Label htmlFor="versioning-disabled">Disabled</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Custom Dependencies</Label>
            <DependencySelector
              resources={allResources}
              selectedDependencies={customDependencies}
              onChange={setCustomDependencies}
              currentResourceId={initialData?.id}
              resourceType="S3"
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
