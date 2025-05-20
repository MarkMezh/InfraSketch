import Link from "next/link"
import { ArrowRight, FileCode, Server, Database, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <span className="font-bold">Terraform Composer</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Terraform Project Composer
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Create, configure, and download Terraform projects with ease. No cloud credentials required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <Server className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">EC2 Instances</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Configure and deploy EC2 instances with ease
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <HardDrive className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">VPC Networks</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Set up secure VPC networks for your infrastructure
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <Database className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">S3 Buckets</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Create and configure S3 storage buckets
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <Database className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">RDS Databases</h3>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Set up managed database services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
              <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform simplifies Terraform project creation without requiring cloud credentials
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create a Project</h3>
                <p className="text-gray-500 dark:text-gray-400">Start by creating a new project and giving it a name</p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Add Resources</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select from pre-built modules like EC2, VPC, S3, and RDS
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Download & Deploy</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Download the generated Terraform code and deployment instructions
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left dark:text-gray-400">
            © 2025 Terraform Composer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
