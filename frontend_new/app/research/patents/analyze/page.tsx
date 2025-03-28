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
import { Pencil } from "lucide-react";
import { CAMPUS, DEPARTMENTS } from "@/lib/types";

type Patent = {
  id: string;
  teacherAdminId: string;
  teachers: string[];
  campus: string;
  dept: string;
  patentNumber: string;
  patentTitle: string;
  isCapstone: boolean;
  year: string;
  documentLink: string;
};

interface Teacher {
  id: string;
  empId: string;
  password: string;
  name: string;
  phno: string;
  dept: string;
  campus: string;
  panNo: string;
  qualification: string;
  designation: string;
  expertise: string;
  dateofJoining: string;
  totalExpBfrJoin: string;
  googleScholarId: string;
  sId: string;
  oId: string;
  profileImg?: string;
  createdAt: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function ImprovedPatentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patents, setPatents] = useState<Patent[]>([]);
  const [filteredPatents, setFilteredPatents] = useState<Patent[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [metric, setMetric] = useState<"campus" | "dept" | "year">("campus");
  const [yearRange, setYearRange] = useState({
    start: "2000",
    end: String(new Date().getFullYear()),
  });
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cardsPerPage = 6;
  const [visiblePages, setVisiblePages] = useState(5);

  const getFilteredTeachers = () => {
    console.log(
      filteredPatents,
      teachers.filter((teacher) =>
        filteredPatents.some((patent) => patent.teacherAdminId === teacher.id)
      )
    );
    return teachers.filter((teacher) =>
      filteredPatents.some((patent) => patent.teacherAdminId === teacher.id)
    );
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user/multiselect`, {
          withCredentials: true,
        });
        console.log(response.data);
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    setFilteredTeachers(getFilteredTeachers());
  }, [teachers, filteredPatents]);

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("metric", metric);
    params.set("yearStart", yearRange.start);
    params.set("yearEnd", yearRange.end);
    params.set("campuses", selectedCampuses.join(","));
    params.set("depts", selectedDepts.join(","));
    router.replace(`?${params.toString()}`);
  }, [
    chartType,
    metric,
    yearRange,
    selectedCampuses,
    selectedDepts,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/patent`, {
          withCredentials: true,
        });
        console.log(response);
        setPatents(response.data);
      } catch (error) {
        console.error("Error fetching patents:", error);
      }
    };
    fetchPatents();
  }, []);

  useEffect(() => {
    setChartType(
      (searchParams.get("chartType") as "bar" | "line" | "pie") || "bar"
    );
    setMetric(
      (searchParams.get("metric") as "campus" | "dept" | "year") || "campus"
    );
    setYearRange({
      start: searchParams.get("yearStart") || "2000",
      end: searchParams.get("yearEnd") || String(new Date().getFullYear()),
    });
    setSelectedCampuses(
      searchParams.get("campuses")?.split(",").filter(Boolean) || []
    );
    setSelectedDepts(
      searchParams.get("depts")?.split(",").filter(Boolean) || []
    );
  }, [searchParams]);

  useEffect(() => {
    const filtered = patents.filter((patent) => {
      const yearInRange =
        Number.parseInt(patent.year) >= Number.parseInt(yearRange.start) &&
        Number.parseInt(patent.year) <= Number.parseInt(yearRange.end);
      const campusMatch =
        selectedCampuses.length === 0 ||
        selectedCampuses.includes(patent.campus);
      const deptMatch =
        selectedDepts.length === 0 || selectedDepts.includes(patent.dept);
      return yearInRange && campusMatch && deptMatch;
    });
    setFilteredPatents(filtered);
    updateQueryParams();
  }, [patents, yearRange, selectedCampuses, selectedDepts, updateQueryParams]);

  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredPatents.forEach((patent) => {
      const key = patent[metric];
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
        );
    }
  };

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "patent_chart.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
      "Serial No",
      "Faculty",
      "Campus",
      "Department",
      "Patent Number",
      "Patent Title",
      "Year",
      "Capstone",
      "Document Link",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredPatents.map((patent, index) =>
        [
          index + 1,
          `"${patent.teachers.join(";")}"`,
          patent.campus,
          patent.dept,
          patent.patentNumber,
          `"${patent.patentTitle.replace(/"/g, '""')}"`,
          patent.year,
          patent.isCapstone ? "Yes" : "No",
          patent.documentLink,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "patent_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  const getPageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisible: number
  ) => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages: (number | null)[] = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    if (start > 1) {
      pages.unshift(1);
      if (start > 2) {
        pages.splice(1, 0, null);
      }
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(null);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Patent Analysis Dashboard</h1>

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
              onValueChange={(value: "campus" | "dept" | "year") =>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Campus Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {CAMPUS.map((campus) => (
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
              {DEPARTMENTS.map((dept) => (
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
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Patent Analysis Chart</CardTitle>
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
          <CardTitle>Patent Details</CardTitle>
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
                      <th className="px-6 py-3">Faculty</th>
                      <th className="px-6 py-3">Patent Number</th>
                      <th className="px-6 py-3">Patent Title</th>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Capstone</th>
                      <th className="px-6 py-3">Document</th>
                      <th className="px-6 py-3">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatents
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((patent, index) => {
                        const teacher = filteredTeachers.find(
                          (t) => t.id === patent.teacherAdminId
                        );
                        console.log(patent.teacherAdminId, filteredTeachers);

                        return (
                          <tr key={index} className="bg-white border-b">
                            <td className="px-6 py-4">
                              {patent.teachers.join(", ")}
                            </td>
                            <td className="px-6 py-4">{patent.patentNumber}</td>
                            <td className="px-6 py-4">{patent.patentTitle}</td>
                            <td className="px-6 py-4">{patent.year}</td>
                            <td className="px-6 py-4">
                              {patent.isCapstone ? "Yes" : "No"}
                            </td>
                            <td className="px-6 py-4">
                              {patent.documentLink ? (
                                <a
                                  href={patent.documentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View
                                </a>
                              ) : (
                                <div>NA</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                onClick={() =>
                                  router.push(
                                    `/research/patents/edit/${patent.id}`
                                  )
                                }
                                variant="outline"
                                size="sm"
                              >
                                Edit
                                <Pencil className="h-4 w-4 ml-2" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
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
                      Math.ceil(filteredPatents.length / itemsPerPage),
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
                              Math.ceil(filteredPatents.length / itemsPerPage),
                              prev + 1
                            )
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatents
                  .slice(
                    (cardCurrentPage - 1) * cardsPerPage,
                    cardCurrentPage * cardsPerPage
                  )
                  .map((patent, index) => {
                    const teacher = filteredTeachers.find(
                      (t) => t.id === patent.teacherAdminId
                    );

                    return (
                      <Card key={patent.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="max-w-[80%]">
                            {patent.patentTitle}
                          </CardTitle>
                          <Pencil
                            className="size-6"
                            onClick={() =>
                              router.push(`/research/patents/edit/${patent.id}`)
                            }
                          />
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Faculty:</strong>{" "}
                            {patent.teachers.join(", ")}
                          </p>
                          <p>
                            <strong>Campus:</strong> {patent.campus}
                          </p>
                          <p>
                            <strong>Department:</strong> {patent.dept}
                          </p>
                          <p>
                            <strong>Patent Number:</strong>{" "}
                            {patent.patentNumber}
                          </p>
                          <p>
                            <strong>Year:</strong> {patent.year}
                          </p>
                          <p>
                            <strong>Capstone:</strong>{" "}
                            {patent.isCapstone ? "Yes" : "No"}
                          </p>
                          {patent.documentLink && (
                            <a
                              href={patent.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
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
                    Math.ceil(filteredPatents.length / cardsPerPage),
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
                            Math.ceil(filteredPatents.length / cardsPerPage),
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

export default function PatentAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <ImprovedPatentDashboard />
    </Suspense>
  );
}
