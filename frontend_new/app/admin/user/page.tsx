"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Plus, Search } from "lucide-react"
import { backendUrl } from "@/config"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<any[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user`, { withCredentials: true })
        if (response.status == 200) {
          if (Array.isArray(response.data)) {
            setTeachers(response.data)
            setFilteredTeachers(response.data)
          }
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
      }
    }
    fetchTeachers()
  }, [])

  useEffect(() => {
    const results = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.empId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTeachers(results)
    setCurrentPage(1)
  }, [searchTerm, teachers])

  const indexOfLastTeacher = currentPage * itemsPerPage
  const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher)

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="container mx-auto p-4 w-screen flex justify-center">
      <Card className="w-[80%]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">Teachers</CardTitle>
          <Button onClick={() => router.push("/register")} className="bg-sky-700">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search by name or employee ID"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {currentTeachers?.length === 0 && <div className="flex justify-center w-full">No Users Found</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTeachers?.map((teacher) => (
              <Link
                href={`/admin/user/${teacher.id}`}
                key={teacher.id}
                className="block hover:shadow-lg transition-shadow duration-200"
              >
                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <User className="h-8 w-8 text-gray-400" />
                    <CardTitle>{teacher.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{teacher.empId}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

