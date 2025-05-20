"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceFormVPC } from "@/components/resource-form-vpc"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    provider: "aws",
    region: "us-east-1",
    environment: "development", // Default environment
  })

  async function onSubmitProjectDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStep(2)
  }

  function handleVpcSave(vpcData: any) {
    // In a real app, you would save the project and VPC to a database
    setIsLoading(true)

    // Create a new project with the entered details and the VPC
    const newProject = {
      id: Date.now().toString(), // Generate a unique ID
      name: projectData.name,
      description: projectData.description,
      provider: projectData.provider,
      region: projectData.region,
      environment: projectData.environment,
      updatedAt: "Just now",
      resources: [
        {
          id: "vpc-" + Date.now().toString(), // Generate a unique ID for the VPC
          ...vpcData,
          isFirstVPC: true, // Mark as first VPC
        },
      ],
    }

    // In a real app, you would save this to a database
    // For now, we'll store it in localStorage to simulate persistence
    try {
      const existingProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      existingProjects.push(newProject)
      localStorage.setItem("terraformProjects", JSON.stringify(existingProjects))
      console.log("Project saved:", newProject)

      // Redirect to the new project page
      setTimeout(() => {
        router.push(`/projects/${newProject.id}`)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Failed to create project. Please try again.")
      setIsLoading(false)
    }
  }

  // Function to get environment color
  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "development":
        return "bg-blue-500"
      case "staging":
        return "bg-amber-500"
      case "production":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex items-center gap-2 mb-8">
        <FileCode className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Create New Project</h1>
      </div>

      {step === 1 ? (
        <Card>
          <form onSubmit={onSubmitProjectDetails}>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Provide basic information about your Terraform project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  placeholder="My Terraform Project"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  placeholder="Describe the purpose of this project"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <RadioGroup
                  value={projectData.environment}
                  onValueChange={(value) => setProjectData({ ...projectData, environment: value })}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="development" id="env-dev" />
                    <div className={`w-3 h-3 rounded-full bg-blue-500 mr-1`}></div>
                    <Label htmlFor="env-dev">Development</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staging" id="env-staging" />
                    <div className={`w-3 h-3 rounded-full bg-amber-500 mr-1`}></div>
                    <Label htmlFor="env-staging">Staging</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="production" id="env-prod" />
                    <div className={`w-3 h-3 rounded-full bg-emerald-500 mr-1`}></div>
                    <Label htmlFor="env-prod">Production</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Cloud Provider</Label>
                <select
                  id="provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={projectData.provider}
                  onChange={(e) => setProjectData({ ...projectData, provider: e.target.value })}
                >
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">Google Cloud</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Default Region</Label>
                <select
                  id="region"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={projectData.region}
                  onChange={(e) => setProjectData({ ...projectData, region: e.target.value })}
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-1">US West (N. California)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-6">Configure Main VPC</h2>
          <p className="text-muted-foreground mb-6">
            Every project starts with a VPC. Configure the main VPC for your project.
          </p>
          <ResourceFormVPC
            onSave={handleVpcSave}
            onCancel={() => setStep(1)}
            isFirstVPC={true} // Pass flag to indicate this is the first VPC
          />
        </div>
      )}
    </div>
  )
}
