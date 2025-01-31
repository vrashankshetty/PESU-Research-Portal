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

type Journal = {
  id: string;
  title: string;
  teacherIds: string[];
  campus: string;
  dept: string;
  journalName: string;
  month: string;
  year: string;
  volumeNo: string;
  issueNo: string;
  issn: string;
  websiteLink?: string;
  articleLink?: string;
  isUGC: boolean;
  isScopus: boolean;
  isWOS: boolean;
  qNo: string;
  impactFactor?: string;
  isCapstone: boolean;
  isAffiliating: boolean;
  pageNumber: number;
  abstract: string;
  keywords: string[];
  domain: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function JournalDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [metric, setMetric] = useState<"campus" | "dept" | "year" | "qNo">(
    "campus"
  );
  const [yearRange, setYearRange] = useState({
    start: "2000",
    end: String(new Date().getFullYear()),
  });
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedQNos, setSelectedQNos] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cardsPerPage = 6;
  const [visiblePages, setVisiblePages] = useState(5);

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("metric", metric);
    params.set("yearStart", yearRange.start);
    params.set("yearEnd", yearRange.end);
    params.set("campuses", selectedCampuses.join(","));
    params.set("depts", selectedDepts.join(","));
    params.set("qNos", selectedQNos.join(","));
    router.replace(`?${params.toString()}`);
  }, [
    chartType,
    metric,
    yearRange,
    selectedCampuses,
    selectedDepts,
    selectedQNos,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/journal`, {
          withCredentials: true,
        });
        setJournals(response.data);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };
    fetchJournals();
  }, []);

  useEffect(() => {
    setChartType(
      (searchParams.get("chartType") as "bar" | "line" | "pie") || "bar"
    );
    setMetric(
      (searchParams.get("metric") as "campus" | "dept" | "year" | "qNo") ||
        "campus"
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
    setSelectedQNos(searchParams.get("qNos")?.split(",").filter(Boolean) || []);
  }, [searchParams]);

  useEffect(() => {
    const filtered = journals.filter((journal) => {
      const yearInRange =
        Number.parseInt(journal.year) >= Number.parseInt(yearRange.start) &&
        Number.parseInt(journal.year) <= Number.parseInt(yearRange.end);
      const campusMatch =
        selectedCampuses.length === 0 ||
        selectedCampuses.includes(journal.campus);
      const deptMatch =
        selectedDepts.length === 0 || selectedDepts.includes(journal.dept);
      const qNoMatch =
        selectedQNos.length === 0 || selectedQNos.includes(journal.qNo);
      return yearInRange && campusMatch && deptMatch && qNoMatch;
    });
    setFilteredJournals(filtered);
    updateQueryParams();
  }, [
    journals,
    yearRange,
    selectedCampuses,
    selectedDepts,
    selectedQNos,
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
    filteredJournals.forEach((journal) => {
      const key = journal[metric];
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

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
        link.download = "journal_chart.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
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
    ];
    const csvContent = [
      headers.join(","),
      ...filteredJournals.map((journal) =>
        [
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
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "journal_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Journal Analysis Dashboard</h1>

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
              onValueChange={(value: "campus" | "dept" | "year" | "qNo") =>
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
                <SelectItem value="qNo">Q Number</SelectItem>
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
                      setSelectedQNos(
                        checked
                          ? [...selectedQNos, qNo]
                          : selectedQNos.filter((q) => q !== qNo)
                      );
                    }}
                  />
                  <Label htmlFor={`qNo-${qNo}`}>{qNo}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Journal Analysis Chart</CardTitle>
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
          <CardTitle>Journal Details</CardTitle>
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
                      <th className="px-6 py-3">Journal Name</th>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Q No</th>
                      <th className="px-6 py-3">Impact Factor</th>
                      <th className="px-6 py-3">Article Link</th>
                      <th className="px-6 py-3">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJournals
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((journal, index) => (
                        <tr key={journal.id} className="bg-white border-b">
                          <td className="px-6 py-4">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">{journal.title}</td>
                          <td className="px-6 py-4">{journal.campus}</td>
                          <td className="px-6 py-4">{journal.dept}</td>
                          <td className="px-6 py-4">{journal.journalName}</td>
                          <td className="px-6 py-4">{journal.year}</td>
                          <td className="px-6 py-4">{journal.qNo}</td>
                          <td className="px-6 py-4">
                            {journal.impactFactor || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {journal.articleLink ? (
                              <a
                                href={journal.articleLink}
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
                                  `/research/journals/edit/${journal.id}`
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
                    Math.ceil(filteredJournals.length / itemsPerPage),
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
                            Math.ceil(filteredJournals.length / itemsPerPage),
                            prev + 1
                          )
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJournals
                  .slice(
                    (cardCurrentPage - 1) * cardsPerPage,
                    cardCurrentPage * cardsPerPage
                  )
                  .map((journal, index) => (
                    <Card key={journal.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="max-w-[80%]">
                          {journal.title}
                        </CardTitle>
                        <Pencil
                          className="size-6"
                          onClick={() =>
                            router.push(`/research/journals/edit/${journal.id}`)
                          }
                        />
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Serial No:</strong> {index + 1}
                        </p>
                        <p>
                          <strong>Campus:</strong> {journal.campus}
                        </p>
                        <p>
                          <strong>Department:</strong> {journal.dept}
                        </p>
                        <p>
                          <strong>Journal Name:</strong> {journal.journalName}
                        </p>
                        <p>
                          <strong>Year:</strong> {journal.year}
                        </p>
                        <p>
                          <strong>Q No:</strong> {journal.qNo}
                        </p>
                        <p>
                          <strong>Impact Factor:</strong>{" "}
                          {journal.impactFactor || "N/A"}
                        </p>
                        <p>
                          <strong>UGC:</strong> {journal.isUGC ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Scopus:</strong>{" "}
                          {journal.isScopus ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>WOS:</strong> {journal.isWOS ? "Yes" : "No"}
                        </p>
                        {journal.articleLink && (
                          <a
                            href={journal.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Article
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
                      onClick={() =>
                        setCardCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers(
                    cardCurrentPage,
                    Math.ceil(filteredJournals.length / cardsPerPage),
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
                            Math.ceil(filteredJournals.length / cardsPerPage),
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

export default function JournalAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <JournalDashboard />
    </Suspense>
  );
}
