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
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Pencil } from "lucide-react"
import Spinner from "@/components/spinner"
import CustomStatistics from "@/components/admin/CustomStudentStatistics"

type Event = {
  id: string
  year: string
  [key: string]: any
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const eventTypes = ["CareerCounselling", "HigherStudies", "EntranceExam", "InterSports", "IntraSports"]

function StudentAnalysisDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventType, setEventType] = useState(eventTypes[0])
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const chartRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [cardCurrentPage, setCardCurrentPage] = useState(1)
  const itemsPerPage = 10
  const cardsPerPage = 6
  const [visiblePages, setVisiblePages] = useState(5)

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set("eventType", eventType)
    params.set("chartType", chartType)
    params.set("dateStart", dateRange?.from?.toISOString() || "")
    params.set("dateEnd", dateRange?.to?.toISOString() || "")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [eventType, chartType, dateRange, router, searchParams])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `${backendUrl}/api/v1/${eventType=='InterSports'?'interSports':eventType=='IntraSports'?'intraSports':`student${eventType}`}`
        if (eventType === "interSports" || eventType === "intraSports") {
          url += `?startDate=${dateRange?.from?.toISOString()}&endDate=${dateRange?.to?.toISOString()}`
        } else {
          url += `?startYear=${dateRange?.from?.getFullYear()}&endYear=${dateRange?.to?.getFullYear()}`
        }
        const response = await axios.get(url, { withCredentials: true })
        setEvents(response.data)
      } catch (error) {
        console.error(`Error fetching ${eventType} events:`, error)
      }
    }
    fetchEvents()
  }, [eventType, dateRange])

  useEffect(() => {
    setEventType(searchParams.get("eventType") || eventTypes[0])
    setChartType((searchParams.get("chartType") as "bar" | "line" | "pie") || "bar")
    const startDate = searchParams.get("dateStart")
    const endDate = searchParams.get("dateEnd")
    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      })
    }
  }, [searchParams])

  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.year)
      if (dateRange?.from && dateRange?.to) {
        return eventDate >= dateRange.from && eventDate <= dateRange.to
      }
      if (dateRange?.from) {
        return eventDate >= dateRange.from
      }
      if (dateRange?.to) {
        return eventDate <= dateRange.to
      }
      return true
    })
    setFilteredEvents(filtered)
    updateQueryParams()
  }, [events, dateRange, updateQueryParams])

  const getChartData = () => {
    const data: { [key: string]: number } = {}
    filteredEvents.forEach((event) => {
      const year = event.year
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

  const downloadTableAsCSV = () => {
    const headers = Object.keys(filteredEvents[0] || {})
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map((event) => headers.map((header) => event[header]).join(",")),
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

  return (
    <div className="container bg-black bg-opacity-80 mx-auto p-4 w-screen">
      <h1 className="text-3xl font-bold mb-6">Student Analysis Dashboard</h1>

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
                <CardTitle>Date Range Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          {Object.keys(filteredEvents[0] || {}).map((header) => (
                            <th key={header} className="px-6 py-3">
                              {header}
                            </th>
                          ))}
                          <th className="px-6 py-3">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((event, index) => (
                            <tr key={event.id} className="bg-white border-b">
                              {Object.values(event).map((value, idx) => (
                                <td key={idx} className="px-6 py-4">
                                  {typeof value === "string" && value.startsWith("http") ? (
                                    <a
                                      href={value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    value
                                  )}
                                </td>
                              ))}
                              <td className="px-6 py-4">
                                <Button
                                  onClick={() => router.push(`/student/${eventType}/edit/${event.id}`)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Edit
                                  <Pencil className="h-4 w-4 ml-2" />
                                </Button>
                              </td>
                            </tr>
                          ))}
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
                            <CardTitle>{event.name || event.title || `Event ${event.id}`}</CardTitle>
                            <Button
                              onClick={() => router.push(`/student/${eventType}/edit/${event.id}`)}
                              variant="outline"
                              size="icon"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            {Object.entries(event).map(([key, value]) => (
                              <p key={key}>
                                <strong>{key}:</strong>{" "}
                                {typeof value === "string" && value.startsWith("http") ? (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View
                                  </a>
                                ) : (
                                  value
                                )}
                              </p>
                            ))}
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