"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { usePosts } from "@/hooks/use-posts"

export function ReportForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { addPost } = usePosts()

  const [incidentType, setIncidentType] = useState<string>("Harassment")
  const [incidentLocation, setIncidentLocation] = useState<string>("")
  const [pincode, setPincode] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [captchaInput, setCaptchaInput] = useState<string>("")

  const [open, setOpen] = useState(false)
  const pincodeValid = /^\d{6}$/.test(pincode)
  const captchaValid = captchaInput.trim().toLowerCase() === "safe"

  const canSubmit = incidentLocation.trim().length > 0 && pincodeValid && description.trim().length > 0 && captchaValid

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!canSubmit) return
    setOpen(true)
  }

  function confirmShare() {
    setOpen(false)
    const newPost = {
      id: `p${Date.now()}`,
      text: description,
      location: incidentLocation,
      pincode,
      time: "just now",
      isMine: true as const,
      votes: 0,
    }
    addPost(newPost)
    toast({
      title: "Report shared",
      description: "Your report has been posted publicly to the feed.",
    })
    router.push("/home")
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Report an Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label className="text-sm font-medium">Incident Type</Label>
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Cyber Bullying/Threatening">Cyber Bullying/Threatening</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="incident-location" className="text-sm font-medium">
              Incident Location
            </Label>
            <Input
              id="incident-location"
              placeholder="Area, street, landmark"
              value={incidentLocation}
              onChange={(e) => setIncidentLocation(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pincode" className="text-sm font-medium">
              Pincode
            </Label>
            <Input
              id="pincode"
              inputMode="numeric"
              placeholder="6-digit PIN"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
            />
            {!pincodeValid && pincode.length > 0 ? (
              <p className="text-xs text-destructive">Enter a valid 6-digit pincode.</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="desc"
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="media" className="text-sm font-medium">
              Upload Photo/Video
            </Label>
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
            />
            {mediaFile ? <p className="text-xs text-muted-foreground">Selected: {mediaFile.name}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="captcha" className="text-sm font-medium">
              Captcha
            </Label>
            <div className="text-xs text-muted-foreground">
              Please type <span className="font-semibold text-foreground">SAFE</span> to confirm you are human.
            </div>
            <Input
              id="captcha"
              placeholder='Type "SAFE"'
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              aria-invalid={!captchaValid}
              aria-describedby="captcha-help"
            />
            {!captchaValid && captchaInput.length > 0 ? (
              <p id="captcha-help" className="text-xs text-destructive">
                Captcha does not match. Please type SAFE.
              </p>
            ) : null}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="submit" className="bg-accent text-accent-foreground" disabled={!canSubmit}>
                Submit Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm sharing</DialogTitle>
                <DialogDescription>
                  {
                    "Your report will be shared publicly on the feed with your description and uploaded media. Authorities may be notified if necessary."
                  }
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmShare} className="bg-accent text-accent-foreground">
                  Confirm &amp; Share
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </CardContent>
    </Card>
  )
}
