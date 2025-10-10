"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePosts } from "@/hooks/use-posts"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"

export function MyReports() {
  const { posts, deletePost } = usePosts()
  const mine = posts.filter((p) => p.isMine)
  const { toast } = useToast()
  const [pendingId, setPendingId] = useState<string | null>(null)

  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold">Your Complaints</h2>
      {mine.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven’t posted any complaints yet.</p>
      ) : (
        mine.map((p) => (
          <Card key={p.id} className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Submitted {p.time}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <p className="text-sm line-clamp-3">{p.text}</p>
              <p className="text-xs text-muted-foreground">
                {p.location} • {p.pincode}
              </p>

              <div className="mt-2">
                <Dialog open={pendingId === p.id} onOpenChange={(open) => !open && setPendingId(null)}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setPendingId(p.id)}>
                      Delete Complaint
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete complaint?</DialogTitle>
                      <DialogDescription>
                        This will remove your complaint from the feed. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPendingId(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (pendingId) {
                            deletePost(pendingId)
                            toast({ title: "Deleted", description: "Your complaint has been removed." })
                            setPendingId(null)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </section>
  )
}
