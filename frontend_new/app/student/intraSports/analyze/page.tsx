"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
import { useRouter } from "next/navigation";

interface IntraSports {
  id: string;
  event: string;
  startDate: string;
  endDate: string;
  link: string;
  yearOfEvent: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function IntraSportsDashboard() {
  const [intraSports, setIntraSports] = useState<IntraSports[] | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [startDate, setStartDate] = useState<string>("2000-01-01");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cardsPerPage = 6;
  const [visiblePages, setVisiblePages] = useState(5);
  const router = useRouter();

  useEffect(() => {
    console.log(
      `${backendUrl}/api/v1/intraSports?startDate=${startDate}&endDate=${endDate}`
    );
    const fetchIntraSports = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/intraSports?startDate=${startDate}&endDate=${endDate}`,
          {
            withCredentials: true,
          }
        );
        setIntraSports(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchIntraSports();
  }, [startDate, endDate]);

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

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "IntraSportsEvents.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    if (intraSports) {
      const headers = [
        "Year",
        "Date of event/competition",
        "Name of the event/competition",
        "Link to relevant documents",
      ];
      const csvContent = [
        headers.join(","),
        ...intraSports.map((cc) =>
          [
            cc.yearOfEvent,
            [cc.startDate.slice(0, 10), " to ", cc.endDate.slice(0, 10)].join(
              ""
            ),
            cc.event,
            cc.link,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "IntraSportsEvents.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const getChartData = () => {
    const yearCount: Record<string, number> = {};
    if (intraSports) {
      intraSports.forEach((counsel) => {
        const year = counsel.yearOfEvent;
        yearCount[year] = (yearCount[year] || 0) + 1;
      });

      return Object.entries(yearCount).map(([year, entries]) => ({
        year,
        entries,
      }));
    }
    return [];
  };

  const renderChart = () => {
    const data = getChartData();
    if (data && data.length === 0) {
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
        );
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
        );
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sports Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
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
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="yearStart">Start Year</Label>
              <Input
                id="yearStart"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="yearStart">End Year</Label>
              <Input
                id="yearStart"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sports Analysis Chart</CardTitle>
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
          <CardTitle>Sports Details</CardTitle>
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
                      <th className="px-6 py-3">
                        Start Date of event/competition
                      </th>
                      <th className="px-6 py-3">
                        End Date of event/competition
                      </th>
                      <th className="px-6 py-3">
                        Name of the event/competition
                      </th>
                      <th className="px-6 py-3">Link to relevant documents</th>
                      <th className="px-6 py-3">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intraSports && intraSports.length > 0 ? (
                      intraSports
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((counsel, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3">{counsel.yearOfEvent}</td>
                            <td className="px-6 py-3">
                              {counsel.startDate.slice(0, 10)}
                            </td>
                            <td className="px-6 py-3">
                              {counsel.endDate.slice(0, 10)}
                            </td>
                            <td className="px-6 py-3">{counsel.event}</td>
                            <td className="px-6 py-3">
                              <a
                                href={counsel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                View
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                onClick={() =>
                                  router.push(
                                    `/student/intraSports/edit/${counsel.id}`
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
                        ))
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
              {intraSports && intraSports.length > 0 && (
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
                      Math.ceil((intraSports?.length || 0) / itemsPerPage),
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
                                (intraSports?.length || 0) / itemsPerPage
                              ),
                              prev + 1
                            )
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
                {intraSports && intraSports.length > 0 ? (
                  intraSports
                    .slice(
                      (cardCurrentPage - 1) * cardsPerPage,
                      cardCurrentPage * cardsPerPage
                    )
                    .map((entry, index) => (
                      <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>{entry.event}</CardTitle>
                          <Button
                            onClick={() =>
                              router.push(
                                `/student/intraSports/edit/${entry.id}`
                              )
                            }
                            variant="outline"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Year: </strong>
                            {entry.yearOfEvent}
                          </p>
                          <p>
                            <strong>Name of the event: </strong> {entry.event}
                          </p>
                          <p>
                            <strong>Date of event: </strong>{" "}
                            {entry.startDate.slice(0, 10) +
                              " to " +
                              entry.endDate.slice(0, 10)}
                          </p>
                          <a
                            href={entry.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Documents
                          </a>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div>
                    <div className="text-center py-4">No data available</div>
                  </div>
                )}
              </div>
              {intraSports && intraSports.length > 0 && (
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
                      Math.ceil((intraSports?.length || 0) / cardsPerPage),
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
                                (intraSports?.length || 0) / cardsPerPage
                              ),
                              prev + 1
                            )
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
  );
}

export default function PatentAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <IntraSportsDashboard />
    </Suspense>
  );
}
