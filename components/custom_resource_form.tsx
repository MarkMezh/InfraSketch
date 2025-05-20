"use client"

import type React from "react"
import { useState } from "react"
import { FileCode, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DependencySelector } from "@/components/dependency-selector"

export function CustomResourceForm({
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
  const [name, setName] = useState(initialData?.name || "")
  const [type, setType] = useState(initialData?.type || "EC2")
  const [code, setCode] = useState(initialData?.code || "")
  const [customDependencies, setCustomDependencies] = useState(initialData?.customDependencies || [])
  const [customParams, setCustomParams] = useState<Array<{ name: string; value: string }>>(
    initialData?.customParams || [{ name: "", value: "" }],
  )

  const handleAddParam = () => {
    setCustomParams([...customParams, { name: "", value: "" }])
  }

  const handleRemoveParam = (index: number) => {
    setCustomParams(customParams.filter((_, i) => i !== index))
  }

  const handleParamChange = (index: number, field: "name" | "value", value: string) => {
    const updatedParams = [...customParams]
    updatedParams[index][field] = value
    setCustomParams(updatedParams)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty parameters
    const filteredParams = customParams.filter((param) => param.name.trim() !== "" && param.value.trim() !== "")

    // Convert params array to properties object
    const properties: Record<string, string> = {}
    filteredParams.forEach((param) => {
      properties[param.name] = param.value
    })

    // Create a copy of the initial data to preserve the id
    const updatedResource = {
      ...(initialData || {}),
      type,
      name,
      code,
      properties,
      customDependencies,
      isCustom: true,
    }

    onSave(updatedResource)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <CardTitle>Custom Resource</CardTitle>
          </div>
          <CardDescription>Upload your own Terraform resource code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-custom-resource"
                required
              />
              <p className="text-sm text-muted-foreground">This will be used as the resource identifier</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="EC2">EC2 Instance</option>
                <option value="VPC">VPC Network</option>
                <option value="S3">S3 Bucket</option>
                <option value="RDS">RDS Database</option>
                <option value="Lambda">Lambda Function</option>
                <option value="DynamoDB">DynamoDB Table</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-sm text-muted-foreground">For resource tracking and visualization</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Terraform Code</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="resource 'aws_instance' 'example' {
  ami           = 'ami-12345678'
  instance_type = 't2.micro'
}"
              className="min-h-[200px] font-mono"
            />
            <p className="text-sm text-muted-foreground">Paste your Terraform resource code here</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Custom Parameters</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddParam}>
                <Plus className="h-4 w-4 mr-1" /> Add Parameter
              </Button>
            </div>

            {customParams.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Parameter name"
                  value={param.name}
                  onChange={(e) => handleParamChange(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleParamChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveParam(index)}
                  disabled={customParams.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Custom Dependencies</Label>
            <DependencySelector
              resources={allResources}
              selectedDependencies={customDependencies}
              onChange={setCustomDependencies}
              currentResourceId={initialData?.id}
              resourceType={type}
            />
            <p className="text-sm text-muted-foreground">Select resources that this custom resource depends on</p>
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
