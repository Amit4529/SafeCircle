"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePosts } from "@/hooks/use-posts"

function getAnonFromPost(post: { id: string; anonId?: string }) {
  if (post.anonId) return post.anonId
  let sum = 0
  for (let i = 0; i < post.id.length; i++) sum += post.id.charCodeAt(i)
  const num = (sum % 9000) + 1000
  return `Anon-${num}`
}

const samplePosts = [
  {
    id: "p1",
    name: "Anonymous",
    mediaUrl: "/placeholder.jpg",
    mediaAlt: "Street photo",
    text: "This man on Janpath Street was being creepy.",
    location: "Janpath Street, New Delhi",
    pincode: "110001",
    time: "5 min ago",
    votes: 10,
  },
  {
    id: "p2",
    name: "Riya S.",
    text: "Received threatening messages online.",
    location: "South Extension, New Delhi",
    pincode: "110049",
    time: "22 min ago",
    votes: 5,
  },
  {
    id: "p3",
    name: "Anonymous",
    mediaUrl: "/placeholder-user.jpg",
    mediaAlt: "Snapshot of area",
    text: "Harassment reported near metro station.",
    location: "Rajiv Chowk, New Delhi",
    pincode: "110001",
    time: "1 hr ago",
    votes: 8,
  },
]

export function Feed() {
  const { posts, updatePost } = usePosts()
  const [voteState, setVoteState] = useState<Record<string, { userVote: -1 | 0 | 1 }>>({})

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="rounded-xl shadow-sm">
          <CardContent className="p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{getAnonFromPost(post)}</p>
              <span className="text-xs text-muted-foreground">{post.time}</span>
            </div>
            {post.mediaUrl ? (
              <div className="overflow-hidden rounded-lg border">
                <Image
                  src={post.mediaUrl || "/placeholder.svg?height=400&width=600&query=incident media"}
                  alt={post.mediaAlt || "Incident media"}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}
            <p className="text-sm leading-relaxed">{post.text}</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={voteState[post.id]?.userVote === 1 ? "default" : "outline"}
                aria-pressed={voteState[post.id]?.userVote === 1}
                onClick={() =>
                  setVoteState((prev) => {
                    const curr = prev[post.id]?.userVote ?? 0
                    const nextVote = curr === 1 ? 0 : 1
                    const delta = nextVote - curr
                    updatePost(post.id, (p) => ({ ...p, votes: (p.votes ?? 0) + delta }))
                    return { ...prev, [post.id]: { userVote: nextVote as 0 | 1 } }
                  })
                }
              >
                Upvote
              </Button>
              <Button
                size="sm"
                variant={voteState[post.id]?.userVote === -1 ? "default" : "outline"}
                aria-pressed={voteState[post.id]?.userVote === -1}
                onClick={() =>
                  setVoteState((prev) => {
                    const curr = prev[post.id]?.userVote ?? 0
                    const nextVote = curr === -1 ? 0 : -1
                    const delta = nextVote - curr
                    updatePost(post.id, (p) => ({ ...p, votes: (p.votes ?? 0) + delta }))
                    return { ...prev, [post.id]: { userVote: nextVote as 0 | -1 } }
                  })
                }
              >
                Downvote
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="truncate">
                <span className="font-medium text-foreground">{post.location}</span>
              </div>
              <Link className="underline" href="/report">
                Report similar
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
