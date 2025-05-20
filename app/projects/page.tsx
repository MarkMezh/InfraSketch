"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FolderPlus, Server, HardDrive, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Initial mock data for projects with environment types
const initialProjects = [
  {
    id: "1",
    name: "AWS Web Infrastructure",
    resources: [{ type: "VPC" }, { type: "EC2" }, { type: "S3" }, { type: "RDS" }],
    updatedAt: "2 hours ago",
    environment: "production",
  },
  {
    id: "2",
    name: "Database Cluster",
    resources: [{ type: "VPC" }, { type: "RDS" }, { type: "RDS" }],
    updatedAt: "1 day ago",
    environment: "staging",
  },
  {
    id: "3",
    name: "Static Website",
    resources: [{ type: "VPC" }, { type: "S3" }],
    updatedAt: "3 days ago",
    environment: "development",
  },
  {
    id: "4",
    name: "Dev Environment",
    resources: [
      { type: "VPC" },
      { type: "EC2" },
      { type: "S3" },
      { type: "RDS" },
      { type: "EC2" },
      { type: "EC2" },
      { type: "S3" },
      { type: "S3" },
    ],
    updatedAt: "1 week ago",
    environment: "development",
  },
  {
    id: "5",
    name: "Monitoring Stack",
    resources: [{ type: "VPC" }, { type: "EC2" }, { type: "EC2" }, { type: "S3" }],
    updatedAt: "2 weeks ago",
    environment: "production",
  },
]

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

// Function to count resource types
const countResourceTypes = (projects: any[]) => {
  let ec2Count = 0
  let vpcCount = 0
  let s3Count = 0
  let rdsCount = 0
  let totalCount = 0

  // Count built-in project resources
  for (const projectId in mockResources) {
    const resources = mockResources[projectId as keyof typeof mockResources]
    resources.forEach((resource) => {
      totalCount++
      switch (resource.type) {
        case "EC2":
          ec2Count++
          break
        case "VPC":
          vpcCount++
          break
        case "S3":
          s3Count++
          break
        case "RDS":
          rdsCount++
          break
      }
    })
  }

  // Count custom project resources
  projects.forEach((project) => {
    if (!["1", "2", "3", "4", "5"].includes(project.id) && project.resources) {
      project.resources.forEach((resource: any) => {
        totalCount++
        switch (resource.type) {
          case "EC2":
            ec2Count++
            break
          case "VPC":
            vpcCount++
            break
          case "S3":
            s3Count++
            break
          case "RDS":
            rdsCount++
            break
        }
      })
    }
  })

  return {
    ec2: ec2Count,
    vpc: vpcCount,
    s3: s3Count,
    rds: rdsCount,
    total: totalCount,
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [resourceCounts, setResourceCounts] = useState({
    ec2: 8,
    vpc: 5,
    s3: 6,
    rds: 3,
    total: 22,
  })
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  // Load projects from localStorage on component mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem("terraformProjects")
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects)

        // Merge with initial projects for demo purposes
        const combinedProjects = [...initialProjects]

        // Add stored projects that aren't already in the initial list
        parsedProjects.forEach((storedProject: any) => {
          if (!combinedProjects.some((p) => p.id === storedProject.id)) {
            combinedProjects.push(storedProject)
          }
        })

        setProjects(combinedProjects)

        // Update resource counts
        setResourceCounts(countResourceTypes(combinedProjects))
      }
    } catch (error) {
      console.error("Failed to parse stored projects:", error)
    }
  }, [])

  // Function to delete a project
  const handleDeleteProject = (projectId: string) => {
    try {
      // Check if this is a built-in project
      const isBuiltInProject = ["1", "2", "3", "4", "5"].includes(projectId)

      if (isBuiltInProject) {
        alert("Cannot delete built-in projects. Please create and delete your own projects.")
        return
      }

      // Remove the project from the list
      const updatedProjects = projects.filter((project) => project.id !== projectId)
      setProjects(updatedProjects)

      // Update localStorage
      const storedProjects = JSON.parse(localStorage.getItem("terraformProjects") || "[]")
      const updatedStoredProjects = storedProjects.filter((project: any) => project.id !== projectId)
      localStorage.setItem("terraformProjects", JSON.stringify(updatedStoredProjects))

      // Update resource counts
      setResourceCounts(countResourceTypes(updatedProjects))

      console.log("Project deleted:", projectId)

      // Reset state
      setProjectToDelete(null)
      setDeleteAlertOpen(false)
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project. Please try again.")
    }
  }

  return (
    <div className="flex flex-col h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
          <p className="text-muted-foreground">Manage your Terraform projects and resources</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-4 font-medium">
          <div>Type</div>
          <div>Name</div>
          <div>Resources</div>
          <div>Last Updated</div>
          <div>Actions</div>
        </div>
        {projects.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full ${getEnvironmentColor(project.environment)}`}
                title={project.environment.charAt(0).toUpperCase() + project.environment.slice(1)}
              ></div>
            </div>
            <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
              {project.name}
            </Link>
            <div>
              {project.id && ["1", "2", "3", "4", "5"].includes(project.id)
                ? mockResources[project.id as keyof typeof mockResources]?.length || 0
                : project.resources?.length || 0}
            </div>
            <div className="text-muted-foreground">{project.updatedAt}</div>
            <div>
              <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setProjectToDelete(project.id)
                      setDeleteAlertOpen(true)
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the project "{project.name}"? This action cannot be undone.
                      {["1", "2", "3", "4", "5"].includes(project.id) && (
                        <div className="mt-2 font-semibold text-amber-500">
                          Note: Built-in projects cannot be deleted.
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setProjectToDelete(null)
                        setDeleteAlertOpen(false)
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (projectToDelete) {
                          handleDeleteProject(projectToDelete)
                        }
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Resource Tracker</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">EC2 Instances</CardTitle>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                <Server className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceCounts.ec2}</div>
              <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${(resourceCounts.ec2 / resourceCounts.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VPC Networks</CardTitle>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <HardDrive className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceCounts.vpc}</div>
              <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(resourceCounts.vpc / resourceCounts.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">S3 Buckets</CardTitle>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <Database className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceCounts.s3}</div>
              <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${(resourceCounts.s3 / resourceCounts.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RDS Databases</CardTitle>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                <Database className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceCounts.rds}</div>
              <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${(resourceCounts.rds / resourceCounts.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
