"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileCode, Plus, Server, Database, HardDrive, Trash2, Download, Eye, Edit, ArrowRight } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ResourceFormEC2 } from "@/components/resource-form-ec2"
import { ResourceFormVPC } from "@/components/resource-form-vpc"
import { ResourceFormS3 } from "@/components/resource-form-s3"
import { ResourceFormRDS } from "@/components/resource-form-rds"
import { CustomResourceForm } from "@/components/custom-resource-form"
import { DependencyGraph } from "@/components/dependency-graph"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for resources with dependencies (for built-in projects)
const mockResources = {
  "1": [
    {
      id: "1",
      type: "VPC",
      name: "main-vpc",
      properties: { cidr_block: "10.0.0.0/16", subnet_cidr_mask: "24" },
      dependencies: [],
      customDependencies: [],
      isFirstVPC: true,
    },
    {
      id: "2",
      type: "EC2",
      name: "web-server",
      properties: { instance_type: "t2.micro", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "3",
      type: "S3",
      name: "static-assets",
      properties: { acl: "private" },
      dependencies: [],
      customDependencies: [],
    },
    {
      id: "4",
      type: "RDS",
      name: "database",
      properties: {
        engine: "mysql",
        instance_class: "db.t3.micro",
        allocated_storage: 20,
      },
      dependencies: ["1"],
      customDependencies: [],
    },
  ],
  "2": [
    {
      id: "1",
      type: "VPC",
      name: "db-vpc",
      properties: { cidr_block: "10.1.0.0/16", subnet_cidr_mask: "24" },
      dependencies: [],
      customDependencies: [],
      isFirstVPC: true,
    },
    {
      id: "2",
      type: "RDS",
      name: "primary-db",
      properties: {
        engine: "postgres",
        instance_class: "db.t3.medium",
        allocated_storage: 50,
      },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "3",
      type: "RDS",
      name: "replica-db",
      properties: {
        engine: "postgres",
        instance_class: "db.t3.small",
        allocated_storage: 20,
      },
      dependencies: ["1", "2"],
      customDependencies: [],
    },
  ],
  "3": [
    {
      id: "1",
      type: "VPC",
      name: "web-vpc",
      properties: { cidr_block: "10.2.0.0/16", subnet_cidr_mask: "24" },
      dependencies: [],
      customDependencies: [],
      isFirstVPC: true,
    },
    {
      id: "2",
      type: "S3",
      name: "website-bucket",
      properties: { acl: "public-read" },
      dependencies: [],
      customDependencies: [],
    },
  ],
  "4": [
    {
      id: "1",
      type: "VPC",
      name: "dev-vpc",
      properties: { cidr_block: "10.3.0.0/16", subnet_cidr_mask: "24" },
      dependencies: [],
      customDependencies: [],
      isFirstVPC: true,
    },
    {
      id: "2",
      type: "EC2",
      name: "dev-server",
      properties: { instance_type: "t2.micro", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "3",
      type: "S3",
      name: "dev-assets",
      properties: { acl: "private" },
      dependencies: [],
      customDependencies: [],
    },
    {
      id: "4",
      type: "RDS",
      name: "dev-db",
      properties: {
        engine: "mysql",
        instance_class: "db.t3.micro",
        allocated_storage: 10,
      },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "5",
      type: "EC2",
      name: "test-server",
      properties: { instance_type: "t2.small", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "6",
      type: "EC2",
      name: "ci-server",
      properties: { instance_type: "t2.medium", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "7",
      type: "S3",
      name: "test-results",
      properties: { acl: "private" },
      dependencies: [],
      customDependencies: [],
    },
    {
      id: "8",
      type: "S3",
      name: "ci-artifacts",
      properties: { acl: "private" },
      dependencies: [],
      customDependencies: [],
    },
  ],
  "5": [
    {
      id: "1",
      type: "VPC",
      name: "monitoring-vpc",
      properties: { cidr_block: "10.4.0.0/16", subnet_cidr_mask: "24" },
      dependencies: [],
      customDependencies: [],
      isFirstVPC: true,
    },
    {
      id: "2",
      type: "EC2",
      name: "prometheus-server",
      properties: { instance_type: "t2.medium", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "3",
      type: "EC2",
      name: "grafana-server",
      properties: { instance_type: "t2.small", ami: "ami-12345678" },
      dependencies: ["1"],
      customDependencies: [],
    },
    {
      id: "4",
      type: "S3",
      name: "monitoring-logs",
      properties: { acl: "private" },
      dependencies: [],
      customDependencies: [],
    },
  ],
}

// Initial project data (for built-in projects)
const mockProjects = {
  "1": {
    name: "AWS Web Infrastructure",
    description: "A complete web infrastructure setup for AWS",
    provider: "aws",
    region: "us-east-1",
    environment: "production",
  },
  "2": {
    name: "Database Cluster",
    description: "PostgreSQL database cluster with primary and replica",
    provider: "aws",
    region: "us-east-1",
    environment: "staging",
  },
  "3": {
    name: "Static Website",
    description: "S3-hosted static website infrastructure",
    provider: "aws",
    region: "us-east-1",
    environment: "development",
  },
  "4": {
    name: "Dev Environment",
    description: "Complete development environment with CI/CD",
    provider: "aws",
    region: "us-east-1",
    environment: "development",
  },
  "5": {
    name: "Monitoring Stack",
    description: "Prometheus and Grafana monitoring infrastructure",
    provider: "aws",
    region: "us-east-1",
    environment: "production",
  },
}

// Remove the React.use() approach and go back to directly accessing params.id
// At the top of the file, keep the React import
// Replace the unwrapping of params with a direct access approach
export default function ProjectPage({ params }: { params: { id: string } }) {
  // Use params.id directly instead of unwrapping with React.use()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectEnvironment, setProjectEnvironment] = useState("production")
  const [projectProvider, setProjectProvider] = useState("aws")
  const [projectRegion, setProjectRegion] = useState("us-east-1")
  const [resources, setResources] = useState<any[]>([])
  const [editingResource, setEditingResource] = useState<any>(null)
  const [editFormType, setEditFormType] = useState<string | null>(null)
  const [showDependencyView, setShowDependencyView] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)

  // Continue using params.id directly in the useEffect and throughout the component
  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      // Check if this is one of the built-in projects (1-5)
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(params.id)

      if (isBuiltInProject) {
        // Use mock data for built-in projects
        const mockProjectData = mockProjects[params.id as keyof typeof mockProjects]
        const mockProjectResources = mockResources[params.id as keyof typeof mockResources] || []

        setProjectName(mockProjectData.name)
        setProjectDescription(mockProjectData.description)
        setProjectEnvironment(mockProjectData.environment)
        setProjectProvider(mockProjectData.provider)
        setProjectRegion(mockProjectData.region)
        setResources(mockProjectResources)
        setProject({
          id: params.id,
          ...mockProjectData,
          resources: mockProjectResources,
        })
      } else {
        // For custom projects, load from localStorage
        const storedProjects = localStorage.getItem("terraformProjects")
        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects)
          const foundProject = parsedProjects.find((p: any) => p.id === params.id)

          if (foundProject) {
            setProject(foundProject)
            setProjectName(foundProject.name)
            setProjectDescription(foundProject.description || "")
            setProjectEnvironment(foundProject.environment || "production")
            setProjectProvider(foundProject.provider || "aws")
            setProjectRegion(foundProject.region || "us-east-1")
            setResources(foundProject.resources || [])
          } else {
            setError("Project not found. Please return to the projects page.")
          }
        } else {
          setError("No projects found. Please create a project first.")
        }
      }
    } catch (err) {
      console.error("Error loading project:", err)
      setError("Failed to load project data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const handleEditResource = (resource: any) => {
    setEditingResource(resource)
    setEditFormType(resource.type)
  }

  // Update the handleUpdateResource function
  const handleUpdateResource = (updatedResource: any) => {
    try {
      // Check if editingResource is null or undefined
      if (!editingResource) {
        console.error("Error: No resource is currently being edited")
        alert("Error updating resource: No resource selected for editing")
        return
      }

      // Ensure the updated resource has the correct ID
      const resourceWithId = {
        ...updatedResource,
        id: editingResource.id,
      }

      // Update the resources array
      const updatedResources = resources.map((r) => (r.id === editingResource.id ? resourceWithId : r))

      setResources(updatedResources)

      // Only update localStorage for custom projects
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(params.id)
      if (!isBuiltInProject) {
        updateProjectInStorage(updatedResources)
      }

      // Clear the editing state
      setEditingResource(null)
      setEditFormType(null)
    } catch (error) {
      console.error("Error updating resource:", error)
      alert("Failed to update resource. Please try again.")
    }
  }

  // Update the handleDeleteResource function
  const handleDeleteResource = (resourceId: string) => {
    try {
      // Get the resource to check if it's the first VPC
      const resourceToDelete = resources.find((r) => r.id === resourceId)

      // Check if any resources depend on this one
      const hasDependents = resources.some(
        (r) =>
          (r.dependencies && r.dependencies.includes(resourceId)) ||
          (r.customDependencies && r.customDependencies.includes(resourceId)),
      )

      if (hasDependents) {
        alert("Cannot delete this resource because other resources depend on it. Remove those dependencies first.")
        return
      }

      if (resourceToDelete?.isFirstVPC) {
        alert("Cannot delete the main VPC. This is required for your project infrastructure.")
        return
      }

      // Check if this is a built-in project
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(params.id)

      // Remove the resource
      const updatedResources = resources.filter((r) => r.id !== resourceId)

      // Remove any dependencies on this resource
      const cleanedResources = updatedResources.map((resource) => ({
        ...resource,
        dependencies: resource.dependencies
          ? resource.dependencies.filter((depId: string) => depId !== resourceId)
          : [],
        customDependencies: resource.customDependencies
          ? resource.customDependencies.filter((depId: string) => depId !== resourceId)
          : [],
      }))

      // Update the state
      setResources(cleanedResources)

      // For custom projects, update localStorage
      if (!isBuiltInProject) {
        updateProjectInStorage(cleanedResources)
      }

      console.log("Resource deleted:", resourceId)

      // Close the delete alert dialog
      setDeleteAlertOpen(false)
      setResourceToDelete(null)
    } catch (error) {
      console.error("Error deleting resource:", error)
      alert("Failed to delete resource. Please try again.")
    }
  }

  // Update the handleUpdateProject function
  const handleUpdateProject = () => {
    try {
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(params.id)

      if (isBuiltInProject) {
        alert("Cannot update built-in project settings. Please create a new project instead.")
        return
      }

      const updatedProject = {
        ...(project || {}),
        id: params.id,
        name: projectName,
        description: projectDescription,
        environment: projectEnvironment,
        provider: projectProvider,
        region: projectRegion,
        resources: resources,
        updatedAt: "Just now",
      }

      // Update localStorage
      const storedProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      const projectIndex = storedProjects.findIndex((p: any) => p.id === params.id)

      if (projectIndex !== -1) {
        storedProjects[projectIndex] = updatedProject
      } else {
        storedProjects.push(updatedProject)
      }

      localStorage.setItem("terraformProjects", JSON.stringify(storedProjects))
      setProject(updatedProject)

      alert("Project settings updated successfully!")
    } catch (error) {
      console.error("Error updating project:", error)
      alert("Failed to update project settings. Please try again.")
    }
  }

  // Update the handleDeleteProject function
  const handleDeleteProject = () => {
    try {
      // Check if this is a built-in project
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(params.id)

      if (isBuiltInProject) {
        alert("Cannot delete built-in projects. Please create and delete your own projects.")
        return
      }

      // Delete project from localStorage
      const storedProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      const updatedProjects = storedProjects.filter((p: any) => p.id !== params.id)

      // Save the updated projects list
      localStorage.setItem("terraformProjects", JSON.stringify(updatedProjects))

      console.log("Project deleted:", params.id)

      // Redirect to projects page
      router.push("/projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project. Please try again.")
    }
  }

  // Update the helper function to use projectId
  const updateProjectInStorage = (updatedResources: any[]) => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      const projectIndex = storedProjects.findIndex((p: any) => p.id === params.id)

      if (projectIndex !== -1) {
        storedProjects[projectIndex].resources = updatedResources
        storedProjects[projectIndex].updatedAt = "Just now"
        localStorage.setItem("terraformProjects", JSON.stringify(storedProjects))
      }
    } catch (error) {
      console.error("Error updating project in storage:", error)
    }
  }

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case "EC2":
        return (
          <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full">
            <Server className="h-4 w-4 text-orange-500" />
          </div>
        )
      case "VPC":
        return (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
            <HardDrive className="h-4 w-4 text-blue-500" />
          </div>
        )
      case "S3":
        return (
          <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
            <Database className="h-4 w-4 text-green-500" />
          </div>
        )
      case "RDS":
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
            <Database className="h-4 w-4 text-purple-500" />
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-900/30 p-1.5 rounded-full">
            <FileCode className="h-4 w-4 text-gray-500" />
          </div>
        )
    }
  }

  const getResourceById = (id: string) => {
    return resources.find((resource) => resource.id === id)
  }

  // Add a function to get resource name by ID
  const getResourceNameById = (id: string) => {
    const resource = resources.find((r) => r.id === id)
    return resource ? resource.name : "Unknown"
  }

  // Add a function to get resources that depend on a given resource
  const getDependentResources = (resourceId: string) => {
    return resources.filter(
      (r) =>
        (r.dependencies && r.dependencies.includes(resourceId)) ||
        (r.customDependencies && r.customDependencies.includes(resourceId)),
    )
  }

  // Get all dependencies (both automatic and custom)
  const getAllDependencies = (resource: any) => {
    const allDeps = [...(resource.dependencies || []), ...(resource.customDependencies || [])]
    return [...new Set(allDeps)] // Remove duplicates
  }

  const renderDependencyView = () => {
    // Group dependencies by source resource
    const dependencyGroups: Record<string, string[]> = {}

    resources.forEach((resource) => {
      const allDeps = getAllDependencies(resource)
      if (allDeps.length > 0) {
        dependencyGroups[resource.id] = allDeps
      }
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resource Dependencies</h2>
          <Button variant="outline" onClick={() => setShowDependencyView(false)}>
            Show Resources
          </Button>
        </div>

        {Object.keys(dependencyGroups).length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No dependencies defined between resources</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(dependencyGroups).map(([resourceId, dependencies]) => {
              const resource = getResourceById(resourceId)
              if (!resource) return null

              return (
                <Card key={resourceId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      {renderResourceIcon(resource.type)}
                    </div>
                    <CardDescription>{resource.type} Resource</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-sm font-medium mb-2">Depends on:</h3>
                    <div className="flex flex-wrap gap-2">
                      {dependencies.map((depId) => {
                        const dependency = getResourceById(depId)
                        return dependency ? (
                          <Badge key={depId} variant="outline" className="flex items-center gap-1">
                            {dependency.name}
                            <span className="text-xs text-muted-foreground">({dependency.type})</span>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
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

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Loading Project...</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <p>Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Project Error</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/projects">
            <Button>Return to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Update the return JSX to use projectId instead of params.id
  return (
    <div className="container py-10 h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getEnvironmentColor(projectEnvironment)}`}></div>
          <FileCode className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{projectName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${params.id}/preview`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview Code
            </Button>
          </Link>
          <Link href={`/projects/${params.id}/download`}>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="settings">Project Settings</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-6">
          {showDependencyView ? (
            renderDependencyView()
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Project Resources</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDependencyView(true)}>
                    View Dependencies
                  </Button>
                  <Link href={`/projects/${params.id}/add-resource`}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Rest of the JSX remains the same, just update any instances of params.id to projectId */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    {/* Card content remains the same */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        {renderResourceIcon(resource.type)}
                      </div>
                      <CardDescription>{resource.type} Resource</CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="space-y-1.5">
                        {Object.entries(resource.properties || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-mono">{value as string}</span>
                          </div>
                        ))}

                        {/* Show dependencies */}
                        {getAllDependencies(resource).length > 0 && (
                          <div className="mt-3 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Dependencies:</p>
                            <div className="flex flex-wrap gap-1">
                              {getAllDependencies(resource).map((depId) => {
                                const dependency = getResourceById(depId)
                                if (!dependency) return null

                                return (
                                  <Badge
                                    key={depId}
                                    variant="outline"
                                    className="flex items-center gap-1 cursor-pointer hover:bg-muted"
                                    onClick={() => handleEditResource(dependency)}
                                  >
                                    <span className="text-xs">{dependency.name}</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Show dependent resources */}
                        {getDependentResources(resource.id).length > 0 && (
                          <div className="mt-3 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Used by:</p>
                            <div className="flex flex-wrap gap-1">
                              {getDependentResources(resource.id).map((depResource) => (
                                <Badge
                                  key={depResource.id}
                                  variant="secondary"
                                  className="flex items-center gap-1 cursor-pointer hover:bg-muted/70"
                                  onClick={() => handleEditResource(depResource)}
                                >
                                  <span className="text-xs">{depResource.name}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleEditResource(resource)
                              setDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Edit {resource.type} Resource</DialogTitle>
                            <DialogDescription>Update the configuration for this resource</DialogDescription>
                          </DialogHeader>

                          {editFormType === "EC2" && (
                            <ResourceFormEC2
                              initialData={editingResource}
                              onSave={(data) => {
                                handleUpdateResource(data)
                                setDialogOpen(false)
                              }}
                              onCancel={() => {
                                setEditingResource(null)
                                setEditFormType(null)
                                setDialogOpen(false)
                              }}
                              allResources={resources}
                            />
                          )}
                          {editFormType === "VPC" && (
                            <ResourceFormVPC
                              initialData={editingResource}
                              onSave={(data) => {
                                handleUpdateResource(data)
                                setDialogOpen(false)
                              }}
                              onCancel={() => {
                                setEditingResource(null)
                                setEditFormType(null)
                                setDialogOpen(false)
                              }}
                              allResources={resources}
                            />
                          )}
                          {editFormType === "S3" && (
                            <ResourceFormS3
                              initialData={editingResource}
                              onSave={(data) => {
                                handleUpdateResource(data)
                                setDialogOpen(false)
                              }}
                              onCancel={() => {
                                setEditingResource(null)
                                setEditFormType(null)
                                setDialogOpen(false)
                              }}
                              allResources={resources}
                            />
                          )}
                          {editFormType === "RDS" && (
                            <ResourceFormRDS
                              initialData={editingResource}
                              onSave={(data) => {
                                handleUpdateResource(data)
                                setDialogOpen(false)
                              }}
                              onCancel={() => {
                                setEditingResource(null)
                                setEditFormType(null)
                                setDialogOpen(false)
                              }}
                              allResources={resources}
                            />
                          )}
                          {editFormType !== "EC2" &&
                            editFormType !== "VPC" &&
                            editFormType !== "S3" &&
                            editFormType !== "RDS" &&
                            editingResource?.isCustom && (
                              <CustomResourceForm
                                initialData={editingResource}
                                onSave={(data) => {
                                  handleUpdateResource(data)
                                  setDialogOpen(false)
                                }}
                                onCancel={() => {
                                  setEditingResource(null)
                                  setEditFormType(null)
                                  setDialogOpen(false)
                                }}
                                allResources={resources}
                              />
                            )}
                        </DialogContent>
                      </Dialog>

                      {/* Only show delete button if it's NOT the first VPC AND it has no dependents */}
                      {!resource.isFirstVPC && getDependentResources(resource.id).length === 0 && (
                        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setResourceToDelete(resource.id)
                                setDeleteAlertOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this project? This action cannot be undone.
                                {["1", "2", "3", "4", "5"].includes(params.id) && (
                                  <div className="mt-2 font-semibold text-amber-500">
                                    Note: Built-in projects cannot be deleted.
                                  </div>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setResourceToDelete(null)
                                  setDeleteAlertOpen(false)
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (resourceToDelete) {
                                    handleDeleteResource(resourceToDelete)
                                  }
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                <Link href={`/projects/${params.id}/add-resource`} className="block">
                  <Card className="flex flex-col items-center justify-center p-8 border-dashed h-full transition-colors hover:border-primary hover:bg-muted/50">
                    <Plus className="h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Add Resource</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Add a new resource to your Terraform project
                    </p>
                  </Card>
                </Link>
              </div>

              {/* DependencyGraph component */}
              <div className="mt-8">
                <DependencyGraph
                  resources={resources.map((r) => ({
                    ...r,
                    dependencies: getAllDependencies(r),
                  }))}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage your project configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Cloud Provider</Label>
                <select
                  id="provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={projectProvider}
                  onChange={(e) => setProjectProvider(e.target.value)}
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
                  value={projectRegion}
                  onChange={(e) => setProjectRegion(e.target.value)}
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-1">US West (N. California)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <RadioGroup
                  value={projectEnvironment}
                  onValueChange={setProjectEnvironment}
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Project</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this project? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleUpdateProject}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Terraform Variables</CardTitle>
              <CardDescription>Define variables for your Terraform project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4 font-medium">
                  <div>Name</div>
                  <div>Value</div>
                  <div></div>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="font-medium">environment</div>
                  <div>{projectEnvironment}</div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="font-medium">instance_count</div>
                  <div>2</div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="font-medium">vpc_cidr</div>
                  <div>10.0.0.0/16</div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/50">
                  <div className="font-medium">subnet_cidr_mask</div>
                  <div>24</div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Variable
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
