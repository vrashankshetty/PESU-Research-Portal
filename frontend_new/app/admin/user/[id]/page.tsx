"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { backendUrl } from "@/config"
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Spinner from "@/components/spinner"
import { useParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

type UserProfile = {
  empId: string
  name: string
  phno: string
  dept: string
  campus: string
  panNo: string
  qualification: string
  designation: string
  expertise: string
  dateofJoining: string
  totalExpBfrJoin: string
  googleScholarId: string
  sId: string
  oId: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user/${id}`, {
          withCredentials: true,
        })
        if (response.status == 200) {
          setUserData(response.data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        })
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast, id])

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      })
      return
    }

    try {
      await axios.post(
        `${backendUrl}/api/v1/user/${id}/changePassword`,
        { newPassword, confirmPassword },
        { withCredentials: true },
      )
      toast({
        title: "Success",
        variant: "mine",
        description: "Password changed successfully",
      })
      setIsChangePasswordOpen(false)
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password",
      })
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${backendUrl}/api/v1/user/${id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        toast({
          title: "Success",
          variant: "mine",
          description: "User deleted successfully",
        })
        router.replace("/admin/user")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete user",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      })
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!userData) {
    return <div>No user data available.</div>
  }

  return (
    <div className="flex items-center justify-center p-2">
      <Card className="lg:w-[900px] w-full max-w-6xl bg-white bg-opacity-95 text-sky-800">
        <CardHeader className="text-center">
          <CardTitle className="md:text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileField label="EMP ID" value={userData?.empId} />
            <ProfileField label="Name" value={userData?.name} />
            <ProfileField label="Phone Number" value={userData?.phno} />
            <ProfileField label="Department" value={userData?.dept} />
            <ProfileField label="Campus" value={userData?.campus} />
            <ProfileField label="PAN Number" value={userData?.panNo} />
            <ProfileField label="Qualification" value={userData?.qualification} />
            <ProfileField label="Designation" value={userData?.designation} />
            <ProfileField label="Expertise" value={userData?.expertise} />
            <ProfileField label="Date of Joining" value={userData?.dateofJoining?.slice(0,10)} />
            <ProfileField label="Total Experience Before Joining" value={userData?.totalExpBfrJoin} />
            <ProfileField label="Google Scholar ID" value={userData?.googleScholarId || "N/A"} />
            <ProfileField label="SID" value={userData?.sId} />
            <ProfileField label="OID" value={userData?.oId} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-sky-700 text-white hover:bg-sky-600">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>Enter your new password below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-password" className="text-right">
                    New Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirm-password" className="text-right">
                    Confirm Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleChangePassword} className="bg-sky-700 text-white hover:bg-sky-600">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the account and remove the data from our
                  servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  No
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{label}</h3>
      <p className="text-sm text-black">{value}</p>
    </div>
  )
}

