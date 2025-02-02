"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import { backendUrl } from "@/config"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Pencil, Trash } from "lucide-react"
import Spinner from "@/components/spinner"
import CustomStatistics from "@/components/admin/CustomStudentStatistics"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Event = {
  [key: string]: any
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const eventTypes = ["CareerCounselling", "HigherStudies", "EntranceExam", "InterSports", "IntraSports"]

const fieldsByEventType = {
  HigherStudies: [
    { key: "year", label: "Year" },
    { key: "studentName", label: "Name of student" },
    { key: "programGraduatedFrom", label: "Program graduated from" },
    { key: "institutionAdmittedTo", label: "Name of institution admitted to" },
    { key: "programmeAdmittedTo", label: "Name of programme admitted to" },
  ],
  CareerCounselling: [
    { key: "year", label: "Year" },
    { key: "nameOfActivity", label: "Name of the Activity" },
    { key: "numberOfStudentsAttended", label: "Number of students attended" },
    { key: "documentLink", label: "Link to the relevant document" },
  ],
  EntranceExam: [
    { key: "year", label: "Year" },
    { key: "registrationNumber", label: "Registration number" },
    { key: "studentName", label: "Name of student selected" },
    { key: "qualifyingExamination", label: "Qualifying examination" },
    { key: "documentLink", label: "Link to the relevant document" },
  ],
  InterSports: [
    { key: "yearOfEvent", label: "Year" },
    { key: "nameOfAward", label: "Name of the award/ medal" },
    { key: "teamOrIndi", label: "Team / Individual" },
    { key: "level", label: "Inter-university / State / National / International" },
    { key: "nameOfEvent", label: "Name of the event" },
    { key: "nameOfStudent", label: "Name of the student" },
    { key: "link", label: "Link to the relevant document" },
  ],
  IntraSports: [
    { key: "yearOfEvent", label: "Year" },
    { key: "startDate", label: "Start Date of event/competition" },
    { key: "endDate", label: "End Date of event/competition" },
    { key: "event", label: "Name of the event/competition" },
    { key: "link", label: "Link to relevant documents" },
  ],
}

function StudentAnalysisDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventType, setEventType] = useState(eventTypes[0])
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const [startYear, setStartYear] = useState<number | undefined>(undefined)
  const [endYear, setEndYear] = useState<number | undefined>(undefined)
  const chartRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [cardCurrentPage, setCardCurrentPage] = useState(1)
  const itemsPerPage = 10
  const cardsPerPage = 6
  const [visiblePages, setVisiblePages] = useState(5)
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteId,setDeleteId] = useState<string>("");

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set("eventType", eventType)
    params.set("chartType", chartType)
    params.set("startYear", startYear?.toString() || "")
    params.set("endYear", endYear?.toString() || "")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [eventType, chartType, startYear, endYear, router, searchParams])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `${backendUrl}/api/v1/${eventType == "InterSports" ? "interSports" : eventType == "IntraSports" ? "intraSports" : `student${eventType}`}`
        url += `?startYear=${startYear || ""}&endYear=${endYear || ""}`
        const response = await axios.get(url, { withCredentials: true })
        setEvents(response.data)
      } catch (error) {
        console.error(`Error fetching ${eventType} events:`, error)
      }
    }
    fetchEvents()
  }, [eventType, startYear, endYear])

  useEffect(() => {
    console.log("searchParams", searchParams.get("eventType"))
    setEventType(searchParams.get("eventType") || eventTypes[0])
    setChartType((searchParams.get("chartType") as "bar" | "line" | "pie") || "bar")
    const start = searchParams.get("startYear")
    const end = searchParams.get("endYear")
    if (start) setStartYear(Number.parseInt(start))
    if (end) setEndYear(Number.parseInt(end))
  }, [])

  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventYear = Number.parseInt(event.year)
      if (startYear && endYear) {
        return eventYear >= startYear && eventYear <= endYear
      }
      if (startYear) {
        return eventYear >= startYear
      }
      if (endYear) {
        return eventYear <= endYear
      }
      return true
    })
    setFilteredEvents(filtered)
    updateQueryParams()
  }, [events, startYear, endYear, updateQueryParams])

  const getChartData = () => {
    const data: { [key: string]: number } = {}
    filteredEvents.forEach((event) => {
      let year = null;
      if(event.year){
        year = event.year
      }else{
        year = event.yearOfEvent
      }
      data[year] = (data[year] || 0) + 1
    })
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const renderChart = () => {
    const data = getChartData()

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-lg font-semibold">No Matching Data Available</p>
        </div>
      )
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps} barSize={24} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a")
        link.download = `${eventType}_chart.png`
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  const getFieldsForEventType = (type: string) => {
    return fieldsByEventType[type as keyof typeof fieldsByEventType] || []
  }

  const renderTableHeader = () => {
    const fields = getFieldsForEventType(eventType)
    return (
      <tr>
        {fields.map((field) => (
          <th key={field.key} className="px-6 py-3">
            {field.label}
          </th>
        ))}
        <th className="px-6 py-3">Edit</th>
        <th className="px-6 py-3">Delete</th>
      </tr>
    )
  }

  const renderTableRow = (event: Event) => {
    const fields = getFieldsForEventType(eventType)
    return (
      <tr key={event.id} className="bg-white border-b">
        {fields.map((field) => (
          <td key={field.key} className="px-6 py-4">
            {field.key === "documentLink" || field.key === "link" && typeof event[field.key] === "string" ? (
              <a
                href={event[field.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Document
              </a>
            ) : field.key === "qualifyingExamination" && eventType === "EntranceExam" ? (
              renderQualifyingExams(event)
            ) :  field.key === "startDate" ||  field.key === "endDate" ? <>
             {event[field.key]?.slice(0,10)}
            </>:(
              event[field.key]
            )}
          </td>
        ))}
        <td className="px-6 py-4">
          <Button onClick={() => router.push(`/student/${eventType}/edit/${event.id}`)} variant="outline" size="sm">
            Edit
            <Pencil className="h-4 w-4 ml-2" />
          </Button>
        </td>
        <td className="px-6 py-4" key={event?.id}>
        <Button variant="outline" onClick={()=>{
            setIsDeleteDialogOpen(true)
            setDeleteId(event?.id)
        }}>
                <Trash className="h-4 w-4" />
        </Button>
        </td>
      </tr>
    )
  }

  const renderQualifyingExams = (event: Event) => {
    const exams = [
      event.isNET && "NET",
      event.isSLET && "SLET",
      event.isGATE && "GATE",
      event.isGMAT && "GMAT",
      event.isCAT && "CAT",
      event.isGRE && "GRE",
      event.isJAM && "JAM",
      event.isIELTS && "IELTS",
      event.isTOEFL && "TOEFL",
    ]
      .filter(Boolean)
      .join(", ")
    return exams
  }

  const downloadTableAsCSV = () => {
    const fields = getFieldsForEventType(eventType)
    const headers = fields.map((field) => field.label)
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map((event) =>
        fields
          .map((field) => {
            if (field.key === "qualifyingExamination" && eventType === "EntranceExam") {
              return `"${renderQualifyingExams(event)}"`
            }
            return `"${event[field.key]}"`
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${eventType}_data.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

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

  const handleDelete = async () => {
    if(!deleteId) return;
    try {
      let response
      switch (eventType) {
        case "CareerCounselling":
          response = await axios.delete(`${backendUrl}/api/v1/studentCareerCounselling/${deleteId}`, { withCredentials: true })
          break
        case "HigherStudies":
          response = await axios.delete(`${backendUrl}/api/v1/studentHigherStudies/${deleteId}`, { withCredentials: true })
          break
        case "EntranceExam":
          response = await axios.delete(`${backendUrl}/api/v1/studentEntranceExam/${deleteId}`, { withCredentials: true })
          break
        case "InterSports":
          response = await axios.delete(`${backendUrl}/api/v1/interSports/${deleteId}`, { withCredentials: true })
            break
        case "IntraSports":
          response = await axios.delete(`${backendUrl}/api/v1/intraSports/${deleteId}`, { withCredentials: true })
          break
        default:
          throw new Error("Invalid event type")
      }

      if (response.status === 200) {
        toast({
          title: "Success",
          variant: "mine",
          description: `Deleted successfully`,
        })
        setFilteredEvents(filteredEvents.filter((item) => item.id !== deleteId))
      } else {
        throw new Error("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${eventType}`,
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
    setDeleteId("");
  }


  return (
    <div className="container bg-black bg-opacity-80 mx-auto p-4 w-screen">
      <h1 className="text-3xl font-bold mb-6">Student Analysis Dashboard</h1>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <DialogContent className="sm:max-w-[525px] bg-white text-black">
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the item and remove
          its data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
          No
        </Button>
        <Button variant="destructive" onClick={() => handleDelete()}>
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
      </Dialog>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analysis Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-white bg-black bg-opacity-5 p-1 rounded-lg">
          <TabsTrigger
            value="general"
            className="transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-black data-[state=inactive]:bg-opacity-5"
          >
            General Statistics
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-black data-[state=inactive]:bg-opacity-5"
          >
            Custom Statistics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                <CardTitle>Date Range Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="startYear" className="block text-sm font-medium text-gray-700">
                      Start Year
                    </label>
                    <Input
                      id="startYear"
                      type="number"
                      value={startYear || ""}
                      onChange={(e) => setStartYear(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                      placeholder="Start Year"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endYear" className="block text-sm font-medium text-gray-700">
                      End Year
                    </label>
                    <Input
                      id="endYear"
                      type="number"
                      value={endYear || ""}
                      onChange={(e) => setEndYear(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                      placeholder="End Year"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{eventType} Analysis Chart</CardTitle>
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
              <CardTitle>{eventType} Details</CardTitle>
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
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">{renderTableHeader()}</thead>
                      <tbody>
                        {filteredEvents
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map(renderTableRow)}
                      </tbody>
                    </table>
                  </div>
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} />
                      </PaginationItem>
                      {getPageNumbers(currentPage, Math.ceil(filteredEvents.length / itemsPerPage), visiblePages).map(
                        (pageNumber, index) =>
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
                              Math.min(Math.ceil(filteredEvents.length / itemsPerPage), prev + 1),
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <Button onClick={downloadTableAsCSV} className="mt-4">
                    Download Table as CSV
                  </Button>
                </TabsContent>
                <TabsContent value="cards">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents
                      .slice((cardCurrentPage - 1) * cardsPerPage, cardCurrentPage * cardsPerPage)
                      .map((event) => (
                        <Card key={event.id}>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{event.nameOfStudent || event.nameOfActivity || `Event ${event.id}`}</CardTitle>
                            <Button
                              onClick={() => router.push(`/student/${eventType}/edit/${event.id}`)}
                              variant="outline"
                              size="icon"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {getFieldsForEventType(eventType).map((field) => (
                                <p key={field.key}>
                                  <strong>{field.label}:</strong>{" "}
                                  {field.key === "documentLink" && typeof event[field.key] === "string" ? (
                                    <a
                                      href={event[field.key]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : field.key === "qualifyingExamination" && eventType === "EntranceExam" ? (
                                    renderQualifyingExams(event)
                                  ) : (
                                    event[field.key]
                                  )}
                                </p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCardCurrentPage((prev) => Math.max(1, prev - 1))} />
                      </PaginationItem>
                      {getPageNumbers(
                        cardCurrentPage,
                        Math.ceil(filteredEvents.length / cardsPerPage),
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
                              Math.min(Math.ceil(filteredEvents.length / cardsPerPage), prev + 1),
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <CustomStatistics events={events} eventType={eventType} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function StudentAnalysis() {
  return (
    <Suspense fallback={<Spinner />}>
      <StudentAnalysisDashboard />
    </Suspense>
  )
}

