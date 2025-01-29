"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { backendUrl } from "@/config";
import Cookie from "js-cookie";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Spinner from "@/components/spinner";

type Conference = {
  teacherIds: string[];
  campus: string;
  dept: string;
  bookTitle: string;
  paperTitle: string;
  proceedings_conference_title: string;
  volumeNo: string;
  issueNo: string;
  year: string;
  pageNumber: number;
  issn: string;
  is_affiliating_institution_same: boolean;
  publisherName: string;
  impactFactor: string;
  core: string;
  link_of_paper: string;
  isCapstone: boolean;
  abstract: string;
  keywords: string[];
  domain: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function ConferenceDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>(
    []
  );
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [metric, setMetric] = useState<"campus" | "dept" | "year" | "core">(
    "campus"
  );
  const [yearRange, setYearRange] = useState({ start: "2000", end: "2024" });
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedCores, setSelectedCores] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const maxVisiblePages = 10;
  const [visiblePages, setVisiblePages] = useState(5);

  const getPageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisible: number,
    visiblePages: number
  ) => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let end = start + visiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - visiblePages + 1, 1);
    }

    const pages: (number | null)[] = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    if (start > 1) {
      pages.unshift(1);
      if (start > 2) {
        pages.splice(1, 0, null); // Add ellipsis
      }
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(null); // Add ellipsis
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("metric", metric);
    params.set("yearStart", yearRange.start);
    params.set("yearEnd", yearRange.end);
    params.set("campuses", selectedCampuses.join(","));
    params.set("depts", selectedDepts.join(","));
    params.set("cores", selectedCores.join(","));
    router.replace(`?${params.toString()}`);
  }, [
    chartType,
    metric,
    yearRange,
    selectedCampuses,
    selectedDepts,
    selectedCores,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        console.log("Cookies", Cookie.get("accessToken"));
        const response = await axios.get(`${backendUrl}/api/v1/conference`, {
          withCredentials: true,
        });
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };
    fetchConferences();
  }, []);

  useEffect(() => {
    setChartType(
      (searchParams.get("chartType") as "bar" | "line" | "pie") || "bar"
    );
    setMetric(
      (searchParams.get("metric") as "campus" | "dept" | "year" | "core") ||
        "campus"
    );
    setYearRange({
      start: searchParams.get("yearStart") || "2000",
      end: searchParams.get("yearEnd") || "2024",
    });
    setSelectedCampuses(
      searchParams.get("campuses")?.split(",").filter(Boolean) || []
    );
    setSelectedDepts(
      searchParams.get("depts")?.split(",").filter(Boolean) || []
    );
    setSelectedCores(
      searchParams.get("cores")?.split(",").filter(Boolean) || []
    );
  }, [searchParams]);

  useEffect(() => {
    const filtered = conferences.filter((conference) => {
      const yearInRange =
        Number.parseInt(conference.year) >= Number.parseInt(yearRange.start) &&
        Number.parseInt(conference.year) <= Number.parseInt(yearRange.end);
      const campusMatch =
        selectedCampuses.length === 0 ||
        selectedCampuses.includes(conference.campus);
      const deptMatch =
        selectedDepts.length === 0 || selectedDepts.includes(conference.dept);
      const coreMatch =
        selectedCores.length === 0 || selectedCores.includes(conference.core);
      return yearInRange && campusMatch && deptMatch && coreMatch;
    });
    setFilteredConferences(filtered);
    updateQueryParams();
  }, [
    conferences,
    yearRange,
    selectedCampuses,
    selectedDepts,
    selectedCores,
    updateQueryParams,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisiblePages(3);
      } else if (window.innerWidth < 768) {
        setVisiblePages(5);
      } else {
        setVisiblePages(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredConferences.forEach((conference) => {
      const key = conference[metric];
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  const renderChart = () => {
    const data = getChartData();

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-lg font-semibold">No Matching Data Available</p>
        </div>
      );
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
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
        );
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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "conference_chart.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
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
    ];
    const csvContent = [
      headers.join(","),
      ...filteredConferences.map((conference, index) =>
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
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "conference_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Conference Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={chartType}
              onValueChange={(value: "bar" | "line" | "pie") =>
                setChartType(value)
              }
            >
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
              onValueChange={(value: "campus" | "dept" | "year" | "core") =>
                setMetric(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campus">Campus</SelectItem>
                <SelectItem value="dept">Department</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="core">Core</SelectItem>
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
                onChange={(e) =>
                  setYearRange({ ...yearRange, start: e.target.value })
                }
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
                onChange={(e) =>
                  setYearRange({ ...yearRange, end: e.target.value })
                }
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
                        checked
                          ? [...selectedCampuses, campus]
                          : selectedCampuses.filter((c) => c !== campus)
                      );
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
                      setSelectedDepts(
                        checked
                          ? [...selectedDepts, dept]
                          : selectedDepts.filter((d) => d !== dept)
                      );
                    }}
                  />
                  <Label htmlFor={`dept-${dept}`}>{dept}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                        checked
                          ? [...selectedCores, core]
                          : selectedCores.filter((c) => c !== core)
                      );
                    }}
                  />
                  <Label htmlFor={`core-${core}`}>{core}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conference Analysis Chart</CardTitle>
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
          <CardTitle>Conference Details</CardTitle>
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
                      <th className="px-6 py-3">Serial No</th>
                      <th className="px-6 py-3">Paper Title</th>
                      <th className="px-6 py-3">Campus</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Conference Title</th>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Core</th>
                      <th className="px-6 py-3">Impact Factor</th>
                      <th className="px-6 py-3">Paper Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConferences
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((conference, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-6 py-4">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">{conference.paperTitle}</td>
                          <td className="px-6 py-4">{conference.campus}</td>
                          <td className="px-6 py-4">{conference.dept}</td>
                          <td className="px-6 py-4">
                            {conference.proceedings_conference_title}
                          </td>
                          <td className="px-6 py-4">{conference.year}</td>
                          <td className="px-6 py-4">{conference.core}</td>
                          <td className="px-6 py-4">
                            {conference.impactFactor}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={conference.link_of_paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers(
                    currentPage,
                    Math.ceil(filteredConferences.length / itemsPerPage),
                    maxVisiblePages,
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
                          Math.min(
                            Math.ceil(
                              filteredConferences.length / itemsPerPage
                            ),
                            prev + 1
                          )
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
                {filteredConferences
                  .slice(
                    (cardCurrentPage - 1) * cardsPerPage,
                    cardCurrentPage * cardsPerPage
                  )
                  .map((conference, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{conference.paperTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Serial No:</strong>{" "}
                          {(cardCurrentPage - 1) * cardsPerPage + index + 1}
                        </p>
                        <p>
                          <strong>Campus:</strong> {conference.campus}
                        </p>
                        <p>
                          <strong>Department:</strong> {conference.dept}
                        </p>
                        <p>
                          <strong>Conference Title:</strong>{" "}
                          {conference.proceedings_conference_title}
                        </p>
                        <p>
                          <strong>Year:</strong> {conference.year}
                        </p>
                        <p>
                          <strong>Core:</strong> {conference.core}
                        </p>
                        <p>
                          <strong>Impact Factor:</strong>{" "}
                          {conference.impactFactor}
                        </p>
                        <p>
                          <strong>Publisher:</strong> {conference.publisherName}
                        </p>
                        <p>
                          <strong>Capstone:</strong>{" "}
                          {conference.isCapstone ? "Yes" : "No"}
                        </p>
                        <a
                          href={conference.link_of_paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Paper
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCardCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers(
                    cardCurrentPage,
                    Math.ceil(filteredConferences.length / cardsPerPage),
                    maxVisiblePages,
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
                          Math.min(
                            Math.ceil(
                              filteredConferences.length / cardsPerPage
                            ),
                            prev + 1
                          )
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
    </div>
  );
}

export default function ConferenceAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <ConferenceDashboard />
    </Suspense>
  );
}
