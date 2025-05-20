"use client"

import { useState } from "react"
import Link from "next/link"
import { FileCode, Download, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample Terraform code for preview with dependencies
const mainTfCode = `# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_instance" "web_server" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  
  # Define dependency on VPC
  depends_on = [aws_vpc.main_vpc]
  
  tags = {
    Name = "web-server"
    Environment = "production"
  }
}

resource "aws_s3_bucket" "static_assets" {
  bucket = "static-assets-\${random_id.bucket_suffix.hex}"
  acl    = "private"
  
  tags = {
    Name = "static-assets"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 8
}`

const variablesTfCode = `# variables.tf
variable "environment" {
  description = "Environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "instance_count" {
  description = "Number of EC2 instances to create"
  type        = number
  default     = 2
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr_mask" {
  description = "CIDR mask for subnets"
  type        = number
  default     = 24
}`

const outputsTfCode = `# outputs.tf
output "instance_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web_server.public_ip
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main_vpc.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.static_assets.bucket
}

output "database_endpoint" {
  description = "Endpoint of the RDS database"
  value       = aws_db_instance.database.endpoint
}`

const readmeMdCode = `# AWS Web Infrastructure

This Terraform project sets up a basic web infrastructure on AWS.

## Resources

- VPC for networking
- EC2 instance for web server
- S3 bucket for static assets
- RDS database for data storage

## Resource Dependencies

The following dependencies are defined:
- EC2 instance depends on VPC
- RDS database depends on VPC

## Deployment Instructions

1. Install Terraform (v1.0.0 or newer)
2. Initialize the Terraform configuration:
   \`\`\`
   terraform init
   \`\`\`
3. Review the planned changes:
   \`\`\`
   terraform plan
   \`\`\`
4. Apply the configuration:
   \`\`\`
   terraform apply
   \`\`\`
5. When finished, you can destroy the infrastructure:
   \`\`\`
   terraform destroy
   \`\`\`

## Variables

You can customize the deployment by setting variables in a \`terraform.tfvars\` file or via command line.

Example:
\`\`\`
environment = "staging"
instance_count = 1
vpc_cidr = "10.1.0.0/16"
subnet_cidr_mask = 24
\`\`\`
`

export default function ProjectPreviewPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href={`/projects/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <FileCode className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Code Preview</h1>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download All Files
        </Button>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">main.tf</TabsTrigger>
          <TabsTrigger value="variables">variables.tf</TabsTrigger>
          <TabsTrigger value="outputs">outputs.tf</TabsTrigger>
          <TabsTrigger value="readme">README.md</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="mt-6">
          <div className="relative">
            <Button
              variant="ghost"\
