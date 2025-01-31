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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import Spinner from "@/components/spinner"
import CustomStatistics from "@/components/admin/CustomStatistics"

type Journal = {
  title: string
  teacherIds: string[]
  campus: string
  dept: string
  journalName: string
  month: string
  year: string
  volumeNo: string
  issueNo: string
  issn: string
  websiteLink?: string
  articleLink?: string
  isUGC: boolean
  isScopus: boolean
  isWOS: boolean
  qNo: string
  impactFactor?: string
  isCapstone: boolean
  isAffiliating: boolean
  pageNumber: number
  abstract: string
  keywords: string[]
  domain: string
}

type Conference = {
  teacherIds: string[]
  campus: string
  dept: string
  bookTitle: string
  paperTitle: string
  proceedings_conference_title: string
  volumeNo: string
  issueNo: string
  year: string
  pageNumber: number
  issn: string
  is_affiliating_institution_same: boolean
  publisherName: string
  impactFactor: string
  core: string
  link_of_paper: string
  isCapstone: boolean
  abstract: string
  keywords: string[]
  domain: string
}

type Patent = {
  // Add patent type definition here
  title: string
  teacherIds: string[]
  campus: string
  dept: string
  year: string
  // Add other relevant fields
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

function IntegratedDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [analysisType, setAnalysisType] = useState<"journal" | "conference" | "patent">("journal")
  const [journals, setJournals] = useState<Journal[]>([])
  const [conferences, setConferences] = useState<Conference[]>([])
  const [patents, setPatents] = useState<Patent[]>([])
  const [filteredData, setFilteredData] = useState<(any)[]>([])
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const [metric, setMetric] = useState<"campus" | "dept" | "year" | "qNo" | "core">("campus")
  const [yearRange, setYearRange] = useState({ start: "2000", end: "2024" })
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([])
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [selectedQNos, setSelectedQNos] = useState<string[]>([])
  const [selectedCores, setSelectedCores] = useState<string[]>([])
  const chartRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [cardCurrentPage, setCardCurrentPage] = useState(1)
  const itemsPerPage = 10
  const cardsPerPage = 6
  const [visiblePages, setVisiblePages] = useState(5)

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set("analysisType", analysisType)
    params.set("chartType", chartType)
    params.set("metric", metric)
    params.set("yearStart", yearRange.start)
    params.set("yearEnd", yearRange.end)
    params.set("campuses", selectedCampuses.join(","))
    params.set("depts", selectedDepts.join(","))
    params.set("qNos", selectedQNos.join(","))
    params.set("cores", selectedCores.join(","))
    router.replace(`?${params.toString()}`)
  }, [
    analysisType,
    chartType,
    metric,
    yearRange,
    selectedCampuses,
    selectedDepts,
    selectedQNos,
    selectedCores,
    router,
    searchParams,
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journalResponse = await axios.get(`${backendUrl}/api/v1/journal`, { withCredentials: true })
        setJournals(journalResponse.data)

        const conferenceResponse = await axios.get(`${backendUrl}/api/v1/conference`, { withCredentials: true })
        setConferences(conferenceResponse.data)

        // Fetch patents data when the API is available
        const patentResponse = await axios.get(`${backendUrl}/api/v1/patent`, { withCredentials: true })
        setPatents(patentResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setAnalysisType((searchParams.get("analysisType") as "journal" | "conference" | "patent") || "journal")
    setChartType((searchParams.get("chartType") as "bar" | "line" | "pie") || "bar")
    setMetric((searchParams.get("metric") as "campus" | "dept" | "year" | "qNo" | "core") || "campus")
    setYearRange({
      start: searchParams.get("yearStart") || "2000",
      end: searchParams.get("yearEnd") || "2024",
    })
    setSelectedCampuses(searchParams.get("campuses")?.split(",").filter(Boolean) || [])
    setSelectedDepts(searchParams.get("depts")?.split(",").filter(Boolean) || [])
    setSelectedQNos(searchParams.get("qNos")?.split(",").filter(Boolean) || [])
    setSelectedCores(searchParams.get("cores")?.split(",").filter(Boolean) || [])
  }, [searchParams])

  useEffect(() => {
    let dataToFilter: (Journal | Conference | Patent)[] = []
    switch (analysisType) {
      case "journal":
        dataToFilter = journals
        break
      case "conference":
        dataToFilter = conferences
        break
      case "patent":
        dataToFilter = patents
        break
    }

    const filtered = dataToFilter.filter((item) => {
      const yearInRange =
        Number.parseInt(item.year) >= Number.parseInt(yearRange.start) &&
        Number.parseInt(item.year) <= Number.parseInt(yearRange.end)
      const campusMatch = selectedCampuses.length === 0 || selectedCampuses.includes(item.campus)
      const deptMatch = selectedDepts.length === 0 || selectedDepts.includes(item.dept)
      let qNoMatch = true
      let coreMatch = true

      if (analysisType === "journal") {
        qNoMatch = selectedQNos.length === 0 || selectedQNos.includes((item as Journal).qNo)
      } else if (analysisType === "conference") {
        coreMatch = selectedCores.length === 0 || selectedCores.includes((item as Conference).core)
      }

      return yearInRange && campusMatch && deptMatch && qNoMatch && coreMatch
    })

    setFilteredData(filtered)
    updateQueryParams()
  }, [analysisType, journals, conferences, patents, yearRange, selectedCampuses, selectedDepts, selectedQNos, selectedCores, updateQueryParams])

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

  const getChartData = () => {
    const data: { [key: string]: number } = {}
    filteredData.forEach((item) => {
      const key = item[metric]
      data[key] = (data[key] || 0) + 1
    })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
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

  const renderChart = () => {
    const data = getChartData()

    if (data.length === 0) {
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
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
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
                dataKey="value"
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
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
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
        link.download = `${analysisType}_chart.png`
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  const downloadTableAsCSV = () => {
    let headers: string[] = []
    let csvContent: string = ""

    switch (analysisType) {
      case "journal":
        headers = [
          "Serial No",
          "Title",
          "Teacher IDs",
          "Campus",
          "Department",
          "Journal Name",
          "Month",
          "Year",
          "Volume No",
          "Issue No",
          "ISSN",
          "Website Link",
          "Article Link",
          "UGC",
          "Scopus",
          "WOS",
          "Q No",
          "Impact Factor",
          "Capstone",
          "Affiliating",
          "Page Number",
          "Abstract",
          "Keywords",
          "Domain",
        ]
        csvContent = [
          headers.join(","),
          ...filteredData.map((journal: Journal, index) =>
            [
              index + 1,
              `"${journal.title.replace(/"/g, '""')}"`,
              `"${journal.teacherIds.join(";")}"`,
              journal.campus,
              journal.dept,
              `"${journal.journalName.replace(/"/g, '""')}"`,
              journal.month,
              journal.year,
              journal.volumeNo,
              journal.issueNo,
              journal.issn,
              journal.websiteLink || "",
              journal.articleLink || "",
              journal.isUGC ? "Yes" : "No",
              journal.isScopus ? "Yes" : "No",
              journal.isWOS ? "Yes" : "No",
              journal.qNo,
              journal.impactFactor || "",
              journal.isCapstone ? "Yes" : "No",
              journal.isAffiliating ? "Yes" : "No",
              journal.pageNumber,
              `"${journal.abstract.replace(/"/g, '""')}"`,
              `"${journal.keywords.join(";")}"`,
              journal.domain,
            ].join(",")
          ),
        ].join("\n")
        break
      case "conference":
        headers = [
          "Serial No",
          "Teacher IDs",
          "Campus",
          "Department",
          "Book Title",
          "Paper Title",
          "Proceedings Conference Title",
          "Volume No",
          "Issue No",
          "Year",
          "Page Number",
          "ISSN",
          "Affiliating Institution Same",
          "Publisher Name",
          "Impact Factor",
          "Core",
          "Link of Paper",
          "Capstone",
          "Abstract",
          "Keywords",
          "Domain",
        ]
        csvContent = [
          headers.join(","),
          ...filteredData.map((conference: Conference, index) =>
            [
              index + 1,
              `"${conference.teacherIds.join(";")}"`,
              conference.campus,
              conference.dept,
              `"${conference.bookTitle.replace(/"/g, '""')}"`,
              `"${conference.paperTitle.replace(/"/g, '""')}"`,
              `"${conference.proceedings_conference_title.replace(/"/g, '""')}"`,
              conference.volumeNo,
              conference.issueNo,
              conference.year,
              conference.pageNumber,
              conference.issn,
              conference.is_affiliating_institution_same ? "Yes" : "No",
              `"${conference.publisherName.replace(/"/g, '""')}"`,
              conference.impactFactor,
              conference.core,
              conference.link_of_paper,
              conference.isCapstone ? "Yes" : "No",
              `"${conference.abstract.replace(/"/g, '""')}"`,
              `"${conference.keywords.join(";")}"`,
              conference.domain,
            ].join(",")
          ),
        ].join("\n")
        break
      case "patent":
        // Add patent CSV export logic when available
        break
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${analysisType}_data.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container bg-black bg-opacity-80 mx-auto p-4 w-screen">
      <h1 className="text-3xl font-bold mb-6">Research Analysis Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analysis Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={analysisType}
            onValueChange={(value: "journal" | "conference" | "patent") => setAnalysisType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="journal">Journal</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="patent">Patent</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="w-full p-2 rounded-lg">
        {/* <TabsList className="grid w-full grid-cols-2 text-white bg-black bg-opacity-5">
          <TabsTrigger value="general" className="bg-black bg-opacity-80">General Statistics</TabsTrigger>
          <TabsTrigger value="custom" className="bg-black bg-opacity-80 ">Custom Statistics</TabsTrigger>
        </TabsList> */}
         <TabsList className="grid w-full grid-cols-2 text-white  bg-black bg-opacity-5 p-1 rounded-lg">
          <TabsTrigger
            value="general"
            className="transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-black data-[state=inactive]:bg-opacity-5"
          >
            General Statistics
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="transition-all data-[state=active]:bg-white data-[state=active]:text-black  data-[state=inactive]:bg-black data-[state=inactive]:bg-opacity-5"
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
                <CardTitle>Analysis Metric</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={metric}
                  onValueChange={(value: "campus" | "dept" | "year" | "qNo" | "core") => setMetric(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campus">Campus</SelectItem>
                    <SelectItem value="dept">Department</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    {analysisType === "journal" && <SelectItem value="qNo">Q Number</SelectItem>}
                    {analysisType === "conference" && <SelectItem value="core">Core</SelectItem>}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year Range</CardTitle>
              </CardHeader>
              <CardContent className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="yearStart">Start</Label>
                  <Input
                    id="yearStart"
                    type="number"
                    min="1990"
                    max="2099"
                    value={yearRange.start}
                    onChange={(e) => setYearRange({ ...yearRange, start: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="yearEnd">End</Label>
                  <Input
                    id="yearEnd"
                    type="number"
                    min="1990"
                    max="2099"
                    value={yearRange.end}
                    onChange={(e) => setYearRange({ ...yearRange, end: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Campus Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {["EC", "RR", "HSN"].map((campus) => (
                    <div key={campus} className="flex items-center space-x-2">
                      <Checkbox
                        id={`campus-${campus}`}
                        checked={selectedCampuses.includes(campus)}
                        onCheckedChange={(checked) => {
                          setSelectedCampuses(
                            checked ? [...selectedCampuses, campus] : selectedCampuses.filter((c) => c !== campus)
                          )
                        }}
                      />
                      <Label htmlFor={`campus-${campus}`}>{campus}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {["EC", "CSE"].map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={selectedDepts.includes(dept)}
                        onCheckedChange={(checked) => {
                          setSelectedDepts(checked ? [...selectedDepts, dept] : selectedDepts.filter((d) => d !== dept))
                        }}
                      />
                      <Label htmlFor={`dept-${dept}`}>{dept}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {analysisType === "journal" && (
              <Card>
                <CardHeader>
                  <CardTitle>Q Number Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {["Q1", "Q2", "Q3", "Q4", "NA"].map((qNo) => (
                      <div key={qNo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`qNo-${qNo}`}
                          checked={selectedQNos.includes(qNo)}
                          onCheckedChange={(checked) => {
                            setSelectedQNos(checked ? [...selectedQNos, qNo] : selectedQNos.filter((q) => q !== qNo))
                          }}
                        />
                        <Label htmlFor={`qNo-${qNo}`}>{qNo}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisType === "conference" && (
              <Card>
                <CardHeader>
                  <CardTitle>Core Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {["coreA", "coreB", "coreC", "scopus", "NA"].map((core) => (
                      <div key={core} className="flex items-center space-x-2">
                        <Checkbox
                          id={`core-${core}`}
                          checked={selectedCores.includes(core)}
                          onCheckedChange={(checked) => {
                            setSelectedCores(
                              checked ? [...selectedCores, core] : selectedCores.filter((c) => c !== core)
                            )
                          }}
                        />
                        <Label htmlFor={`core-${core}`}>{core}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Chart</CardTitle>
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
              <CardTitle>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Details</CardTitle>
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
                          <th className="px-6 py-3">S No.</th>
                          <th className="px-6 py-3">Title</th>
                          <th className="px-6 py-3">Campus</th>
                          <th className="px-6 py-3">Department</th>
                          <th className="px-6 py-3">
                            {analysisType === "journal"
                              ? "Journal Name"
                              : analysisType === "conference"
                              ? "Conference Title"
                              : "Patent Title"}
                          </th>
                          <th className="px-6 py-3">Year</th>
                          <th className="px-6 py-3">{analysisType === "journal" ? "Q No" : "Core"}</th>
                          <th className="px-6 py-3">Impact Factor</th>
                          <th className="px-6 py-3">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((item, index) => (
                            <tr key={index} className="bg-white border-b">
                              <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                              <td className="px-6 py-4">
                                {analysisType === "journal"
                                  ? (item as Journal).title
                                  : analysisType === "conference"
                                  ? (item as Conference).paperTitle
                                  : (item as Patent).title}
                              </td>
                              <td className="px-6 py-4">{item.campus}</td>
                              <td className="px-6 py-4">{item.dept}</td>
                              <td className="px-6 py-4">
                                {analysisType === "journal"
                                  ? (item as Journal).journalName
                                  : analysisType === "conference"
                                  ? (item as Conference).proceedings_conference_title
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4">{item.year}</td>
                              <td className="px-6 py-4">
                                {analysisType === "journal"
                                  ? (item as Journal).qNo
                                  : analysisType === "conference"
                                  ? (item as Conference).core
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                {analysisType === "journal"
                                  ? (item as Journal).impactFactor
                                  : analysisType === "conference"
                                  ? (item as Conference).impactFactor
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                {analysisType === "journal" ?
                                  (item as Journal).articleLink ? (
                                    <a
                                      href={(item as Journal).articleLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    "N/A"
                                  )
                                : analysisType === "conference" ? (
                                  <a
                                    href={(item as Conference).link_of_paper}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        />
                      </PaginationItem>
                      {getPageNumbers(
                        currentPage,
                        Math.ceil(filteredData.length / itemsPerPage),
                        visiblePages
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
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(Math.ceil(filteredData.length / itemsPerPage), prev + 1)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TabsContent>
                <TabsContent value="cards">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData
                      .slice((cardCurrentPage - 1) * cardsPerPage, cardCurrentPage * cardsPerPage)
                      .map((item, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>
                              {analysisType === "journal"
                                ? (item as Journal).title
                                : analysisType === "conference"
                                ? (item as Conference).paperTitle
                                : (item as Patent).title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>
                              <strong>Serial No:</strong> {(cardCurrentPage - 1) * cardsPerPage + index + 1}
                            </p>
                            <p>
                              <strong>Campus:</strong> {item.campus}
                            </p>
                            <p>
                              <strong>Department:</strong> {item.dept}
                            </p>
                            <p>
                              <strong>
                                {analysisType === "journal"
                                  ? "Journal Name"
                                  : analysisType === "conference"
                                  ? "Conference Title"
                                  : "Patent Title"}
                                :
                              </strong>{" "}
                              {analysisType === "journal"
                                ? (item as Journal).journalName
                                : analysisType === "conference"
                                ? (item as Conference).proceedings_conference_title
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Year:</strong> {item.year}
                            </p>
                            <p>
                              <strong>{analysisType === "journal" ? "Q No" : "Core"}:</strong>{" "}
                              {analysisType === "journal"
                                ? (item as Journal).qNo
                                : analysisType === "conference"
                                ? (item as Conference).core
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Impact Factor:</strong>{" "}
                              {analysisType === "journal"
                                ? (item as Journal).impactFactor
                                : analysisType === "conference"
                                ? (item as Conference).impactFactor
                                : "N/A"}
                            </p>
                            {analysisType === "journal" && (item as Journal).articleLink && (
                              <a
                                href={(item as Journal).articleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Article
                              </a>
                            )}
                            {analysisType === "conference" && (
                              <a
                                href={(item as Conference).link_of_paper}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Paper
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCardCurrentPage((prev) => Math.max(1, prev - 1))}
                        />
                      </PaginationItem>
                      {getPageNumbers(
                        cardCurrentPage,
                        Math.ceil(filteredData.length / cardsPerPage),
                        visiblePages
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
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCardCurrentPage((prev) =>
                              Math.min(Math.ceil(filteredData.length / cardsPerPage), prev + 1)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TabsContent>
              </Tabs>
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <CustomStatistics data={filteredData} analysisType={analysisType} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function IntegratedAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <IntegratedDashboard />
    </Suspense>
  )
}
