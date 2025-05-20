"use client"

import { Label } from "@/components/ui/label"
import { DependencySelector } from "@/components/dependency-selector"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function ResourceDependencyForm({
  resources,
  selectedDependencies = [],
  onChange,
  currentResourceId,
  resourceType,
}: {
  resources: any[]
  selectedDependencies: string[]
  onChange: (dependencies: string[]) => void
  currentResourceId?: string
  resourceType?: string
}) {
  // Get automatic dependencies based on resource type
  const getAutomaticDependencies = () => {
    if (!resourceType) return []

    // This would be derived from Terraform code analysis in a real app
    const automaticDeps: Record<string, string[]> = {
      EC2: ["VPC", "SecurityGroup"],
      RDS: ["VPC", "SubnetGroup"],
      Lambda: ["IAMRole"],
      S3: [],
    }

    return automaticDeps[resourceType as keyof typeof automaticDeps] || []
  }

  const automaticDependencies = getAutomaticDependencies()

  return (
    <div className="space-y-4">
      <Tabs defaultValue="custom">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Dependencies</TabsTrigger>
          <TabsTrigger value="automatic">Automatic Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-4 pt-4">
          <div>
            <Label className="text-base">Custom Dependencies</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Define additional dependencies not automatically detected from your Terraform code
            </p>
            <Separator className="my-4" />
            <DependencySelector
              resources={resources}
              selectedDependencies={selectedDependencies}
              onChange={onChange}
              currentResourceId={currentResourceId}
              resourceType={resourceType}
            />
          </div>
        </TabsContent>

        <TabsContent value="automatic" className="space-y-4 pt-4">
          <div>
            <Label className="text-base">Automatic Dependencies</Label>
            <p className="text-sm text-muted-foreground mb-2">
              These dependencies are automatically detected from your Terraform code
            </p>
            <Separator className="my-4" />

            {automaticDependencies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {automaticDependencies.map((dep) => (
                  <Badge key={dep} variant="secondary">
                    {dep}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No automatic dependencies detected</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
