"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import { backendUrl } from "@/config"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface EntranceExams {
  year: string
  registrationNumber: string
  studentName: string
  isNET: boolean
  isSLET: boolean
  isGATE: boolean
  isGMAT: boolean
  isCAT: boolean
  isGRE: boolean
  isJAM: boolean
  isIELTS: boolean
  isTOEFL: boolean
  documentLink: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

function EntranceExamsDashboard() {
  const [entranceExams, setEntranceExams] = useState<EntranceExams[] | null>(null)
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const [selectedExam, setSelectedExam] = useState<
    "NET" | "SLET" | "GATE" | "GMAT" | "CAT" | "GRE" | "JAM" | "IELTS" | "TOEFL" | ""
  >("")
  const [startYear, setStartYear] = useState<number>(2000)
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear())
  const chartRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [cardCurrentPage, setCardCurrentPage] = useState(1)
  const itemsPerPage = 10
  const cardsPerPage = 6
  const [visiblePages, setVisiblePages] = useState(5)

  useEffect(() => {
    const fetchHigherStudyDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/studentEntranceExam?startYear=${startYear}&endYear=${endYear}${selectedExam.length != 0 ? "&is" + selectedExam + "=true" : ""}`,
          { withCredentials: true },
        )
        setEntranceExams(response.data)
      } catch (error) {
        console.error("Error fetching career counsels:", error)
      }
    }
    fetchHigherStudyDetails()
  }, [startYear, endYear, selectedExam])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisiblePages(3)
      } else if (window.innerWidth < 768) {
        setVisiblePages(5)
      } else {
        setVisiblePages(10)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getPageNumbers = (currentPage: number, totalPages: number, maxVisible: number) => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1)
    let end = start + maxVisible - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(end - maxVisible + 1, 1)
    }

    const pages: (number | null)[] = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    if (start > 1) {
      pages.unshift(1)
      if (start > 2) {
        pages.splice(1, 0, null)
      }
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(null)
      }
      pages.push(totalPages)
    }

    return pages
  }

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a")
        link.download = "EntranceExams.png"
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  const downloadTableAsCSV = () => {
    if (entranceExams) {
      const headers = [
        "Year",
        "Registration number/roll number for the exam",
        "Name of student selected",
        "Examinations Passed",
        "Link to the relevant document",
      ]

      const csvContent = [
        headers.join(","),
        ...entranceExams.map((entry) => {
          const exams = [
            entry.isNET && "NET",
            entry.isSLET && "SLET",
            entry.isGATE && "GATE",
            entry.isGMAT && "GMAT",
            entry.isCAT && "CAT",
            entry.isGRE && "GRE",
            entry.isJAM && "JAM",
            entry.isIELTS && "IELTS",
            entry.isTOEFL && "TOEFL",
          ]
            .filter(Boolean)
            .join(" ")

          return [entry.year, entry.registrationNumber, entry.studentName, exams, entry.documentLink].join(",")
        }),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "EntranceExams.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const getChartData = () => {
    const yearCount: Record<string, number> = {}
    if (entranceExams) {
      entranceExams.forEach((entry) => {
        const year = entry.year
        yearCount[year] = (yearCount[year] || 0) + 1
      })

      return Object.entries(yearCount).map(([year, entries]) => ({
        year,
        entries,
      }))
    }
    return []
  }

  const renderChart = () => {
    const data = getChartData()

    if (data && data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-lg font-semibold">No Matching Data Available</p>
        </div>
      )
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} barSize={24} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar dataKey="entries" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Pie
                data={data}
                dataKey="entries"
                nameKey="year"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Entrance Exams Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={chartType} onValueChange={(value: "bar" | "line" | "pie") => setChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="yearStart">Start Year</Label>
              <Input
                id="yearStart"
                type="number"
                min="0"
                value={startYear}
                onChange={(e) => setStartYear(e.target.valueAsNumber)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="yearStart">End Year</Label>
              <Input
                id="yearStart"
                type="number"
                min="0"
                value={endYear}
                onChange={(e) => setEndYear(e.target.valueAsNumber)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select the Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedExam}
              onValueChange={(value: "NET" | "SLET" | "GATE" | "GMAT" | "CAT" | "GRE" | "JAM" | "IELTS" | "TOEFL") =>
                setSelectedExam(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NET">NET</SelectItem>
                <SelectItem value="SLET">SLET</SelectItem>
                <SelectItem value="GATE">GATE</SelectItem>
                <SelectItem value="GMAT">GMAT</SelectItem>
                <SelectItem value="CAT">CAT</SelectItem>
                <SelectItem value="GRE">GRE</SelectItem>
                <SelectItem value="JAM">JAM</SelectItem>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="TOEFL">TOEFL</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Entrance Exams Analysis Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[480px]">
          <div ref={chartRef}>{renderChart()}</div>
          <Button onClick={downloadChartAsPNG} className="mt-4">
            Download Chart as PNG
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entrance Exams Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Registration number/roll number for the exam</th>
                      <th className="px-6 py-3">Name of student selected</th>
                      <th className="px-6 py-3">Qualifying examination</th>
                      <th className="px-6 py-3">Link to the relevant document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entranceExams && entranceExams.length > 0 ? (
                      entranceExams
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((entry, index) => {
                          const exams = [
                            entry.isNET && "NET",
                            entry.isSLET && "SLET",
                            entry.isGATE && "GATE",
                            entry.isGMAT && "GMAT",
                            entry.isCAT && "CAT",
                            entry.isGRE && "GRE",
                            entry.isJAM && "JAM",
                            entry.isIELTS && "IELTS",
                            entry.isTOEFL && "TOEFL",
                          ]
                            .filter(Boolean)
                            .join(", ")

                          return (
                            <tr key={index}>
                              <td className="px-6 py-3">{entry.year}</td>
                              <td className="px-6 py-3">{entry.registrationNumber}</td>
                              <td className="px-6 py-3">{entry.studentName}</td>
                              <td className="px-6 py-3">{exams}</td>
                              <td className="px-6 py-3">
                                <a
                                  href={entry.documentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                >
                                  Document
                                </a>
                              </td>
                            </tr>
                          )
                        })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {entranceExams && entranceExams.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  
                      />
                    </PaginationItem>
                    {getPageNumbers(
                      currentPage,
                      Math.ceil((entranceExams?.length || 0) / itemsPerPage),
                      visiblePages,
                    ).map((pageNumber, index) =>
                      pageNumber === null ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(Math.ceil((entranceExams?.length || 0) / itemsPerPage), prev + 1),
                          )
                        }
                       
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {entranceExams && entranceExams.length > 0 ? (
                  entranceExams
                    .slice((cardCurrentPage - 1) * cardsPerPage, cardCurrentPage * cardsPerPage)
                    .map((entry, index) => {
                      const exams = [
                        entry.isNET && "NET",
                        entry.isSLET && "SLET",
                        entry.isGATE && "GATE",
                        entry.isGMAT && "GMAT",
                        entry.isCAT && "CAT",
                        entry.isGRE && "GRE",
                        entry.isJAM && "JAM",
                        entry.isIELTS && "IELTS",
                        entry.isTOEFL && "TOEFL",
                      ].filter(Boolean)

                      return (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{entry.studentName}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>
                              <strong>Year: </strong>
                              {entry.year}
                            </p>
                            <p>
                              <strong>Exam Roll number: </strong> {entry.registrationNumber}
                            </p>
                            <p>
                              <strong>Exams:</strong> {exams.join(", ")}
                            </p>
                            <a
                              href={entry.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Documents
                            </a>
                          </CardContent>
                        </Card>
                      )
                    })
                ) : (
                  <div>
                    <div className="text-center py-4">No data available</div>
                  </div>
                )}
              </div>
              {entranceExams && entranceExams.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCardCurrentPage((prev) => Math.max(1, prev - 1))}
                      
                      />
                    </PaginationItem>
                    {getPageNumbers(
                      cardCurrentPage,
                      Math.ceil((entranceExams?.length || 0) / cardsPerPage),
                      visiblePages,
                    ).map((pageNumber, index) =>
                      pageNumber === null ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCardCurrentPage(pageNumber)}
                            isActive={cardCurrentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCardCurrentPage((prev) =>
                            Math.min(Math.ceil((entranceExams?.length || 0) / cardsPerPage), prev + 1),
                          )
                        }
                       
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PatentAnalyze() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntranceExamsDashboard />
    </Suspense>
  )
}

