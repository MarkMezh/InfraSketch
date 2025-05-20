"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Server, Database, HardDrive, FileCode } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ResourceFormEC2 } from "@/components/resource-form-ec2"
import { ResourceFormVPC } from "@/components/resource-form-vpc"
import { ResourceFormS3 } from "@/components/resource-form-s3"
import { ResourceFormRDS } from "@/components/resource-form-rds"
import { CustomResourceForm } from "@/components/custom_resource_form"

// Mock data for existing resources (fallback for built-in projects)
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

export default function AddResourcePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [resources, setResources] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      // Check if this is one of the built-in projects (1-5)
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(unwrappedParams.id)

      if (isBuiltInProject) {
        // Use mock data for built-in projects
        const mockProjectResources = mockResources[unwrappedParams.id as keyof typeof mockResources] || []
        setResources(mockProjectResources)
        setProject({
          id: unwrappedParams.id,
          resources: mockProjectResources,
        })
        setLoading(false)
        return
      }

      // For custom projects, load from localStorage
      const storedProjects = localStorage.getItem("terraformProjects")
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects)
        const foundProject = parsedProjects.find((p: any) => p.id === unwrappedParams.id)

        if (foundProject) {
          setProject(foundProject)
          setResources(foundProject.resources || [])
        } else {
          setError("Project not found. Please return to the projects page and try again.")
        }
      } else {
        setError("No projects found. Please create a project first.")
      }
    } catch (err) {
      console.error("Error loading project:", err)
      setError("Failed to load project data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [unwrappedParams.id])

  const handleSave = (data: any) => {
    if (!project) {
      alert("Project not found. Please try again.")
      return
    }

    try {
      const newResource = {
        ...data,
        id: "resource-" + Date.now().toString(),
        dependencies: data.dependencies || [],
        customDependencies: data.customDependencies || [],
      }

      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(unwrappedParams.id)

      if (isBuiltInProject) {
        router.push(`/projects/${unwrappedParams.id}`)
        return
      }

      const storedProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      const projectIndex = storedProjects.findIndex((p: any) => p.id === unwrappedParams.id)

      if (projectIndex !== -1) {
        const updatedResources = [...(storedProjects[projectIndex].resources || []), newResource]
        storedProjects[projectIndex].resources = updatedResources
        storedProjects[projectIndex].updatedAt = "Just now"

        localStorage.setItem("terraformProjects", JSON.stringify(storedProjects))
        console.log("Resource added:", newResource)

        router.push(`/projects/${unwrappedParams.id}`)
      } else {
        alert("Project not found. Please try again.")
      }
    } catch (error) {
      console.error("Error adding resource:", error)
      alert("Failed to add resource. Please try again.")
    }
  }

  const handleCancel = () => {
    if (selectedType) {
      setSelectedType(null)
    } else {
      router.back()
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href={`/projects/${unwrappedParams.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add Resource</h1>
        </div>
        <div className="flex items-center justify-center p-12">
          <p>Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href={`/projects/${unwrappedParams.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add Resource</h1>
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

  return (
    <div className="container max-w-4xl py-10 h-screen">
      <div className="flex items-center gap-2 mb-8">
        <Link href={`/projects/${unwrappedParams.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add Resource</h1>
      </div>

      {!selectedType ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedType("ec2")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-4">
                <Server className="h-8 w-8 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">EC2 Instance</h2>
              <p className="text-center text-muted-foreground">Virtual server in the AWS cloud</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedType("vpc")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                <HardDrive className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">VPC Network</h2>
              <p className="text-center text-muted-foreground">Isolated virtual network in AWS</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedType("s3")}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                <Database className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">S3 Bucket</h2>
              <p className="text-center text-muted-foreground">Object storage for files and static assets</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedType("rds")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
                <Database className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">RDS Database</h2>
              <p className="text-center text-muted-foreground">Managed relational database service</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedType("custom")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-full mb-4">
                <FileCode className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Custom Resource</h2>
              <p className="text-center text-muted-foreground">Upload your own Terraform resource code</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          {selectedType === "ec2" && (
            <ResourceFormEC2 onSave={handleSave} onCancel={handleCancel} allResources={resources} />
          )}
          {selectedType === "vpc" && (
            <ResourceFormVPC onSave={handleSave} onCancel={handleCancel} allResources={resources} />
          )}
          {selectedType === "s3" && (
            <ResourceFormS3 onSave={handleSave} onCancel={handleCancel} allResources={resources} />
          )}
          {selectedType === "rds" && (
            <ResourceFormRDS onSave={handleSave} onCancel={handleCancel} allResources={resources} />
          )}
          {selectedType === "custom" && (
            <CustomResourceForm onSave={handleSave} onCancel={handleCancel} allResources={resources} />
          )}
        </div>
      )}
    </div>
  )
}
