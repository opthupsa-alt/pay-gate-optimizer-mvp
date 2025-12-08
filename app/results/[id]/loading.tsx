import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ResultsLoading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <Skeleton className="h-9 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Actions */}
      <div className="mx-auto mb-8 flex max-w-4xl flex-wrap justify-center gap-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Result cards */}
      <div className="mx-auto max-w-4xl space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-7 w-32" />
                  </div>
                </div>
                <div className="text-end">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-8 w-40" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scores */}
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="text-center">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-6 w-10 mx-auto mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-px w-full" />

              {/* Reasons */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

