import Link from "next/link"
import { FolderPlus, Folder, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for projects with environment types
const recentProjects = [
  { id: "1", name: "AWS Web Infrastructure", resources: 5, updatedAt: "2 hours ago", environment: "production" },
  { id: "2", name: "Database Cluster", resources: 3, updatedAt: "1 day ago", environment: "staging" },
  { id: "3", name: "Static Website", resources: 2, updatedAt: "3 days ago", environment: "development" },
]

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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your Terraform projects and resources</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">+7 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EC2 Instances</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S3 Buckets</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="block">
              <Card className="h-full transition-colors hover:border-primary hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getEnvironmentColor(project.environment)}`}
                        title={project.environment.charAt(0).toUpperCase() + project.environment.slice(1)}
                      ></div>
                      {project.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {project.updatedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-sm">{project.resources} resources configured</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href="/projects/new" className="block">
            <Card className="flex h-full flex-col items-center justify-center p-8 border-dashed transition-colors hover:border-primary hover:bg-muted/50">
              <FolderPlus className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Create a new project</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start building your infrastructure with pre-built Terraform modules
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
