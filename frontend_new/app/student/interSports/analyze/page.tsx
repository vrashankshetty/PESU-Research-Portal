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

interface InterSports {
  nameOfStudent: string;
  nameOfEvent: string;
  link: string;
  nameOfUniv: string;
  yearOfEvent: string;
  teamOrIndi: string;
  level: string;
  nameOfAward: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function InterSportsDashboard() {
  const [interSports, setInterSports] = useState<InterSports[] | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cardsPerPage = 6;
  const [visiblePages, setVisiblePages] = useState(5);

  useEffect(() => {
    const fetchInterSports = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/interSports?startYearOfEvent=${startYear}&endYearOfEvent=${endYear}`,
          { withCredentials: true }
        );
        setInterSports(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchInterSports();
  }, [startYear, endYear]);

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
        link.download = "InterSportsEvents.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    if (interSports) {
      const headers = [
        "Year",
        "Name of the award/ medal",
        "Team / Individual",
        "Inter-university / State / National / International",
        "Name of the event",
        "Name of the student",
        "Link to the relevant document",
      ];
      const csvContent = [
        headers.join(","),
        ...interSports.map((cc) =>
          [
            cc.yearOfEvent,
            cc.nameOfAward,
            cc.teamOrIndi,
            cc.level,
            cc.nameOfEvent,
            cc.nameOfStudent,
            cc.link,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "InterSportsEvents.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const getChartData = () => {
    const yearCount: Record<string, number> = {};
    if (interSports) {
      interSports.forEach((counsel) => {
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
                      <th className="px-6 py-3">Name of the award/ medal</th>
                      <th className="px-6 py-3">Team / Individual</th>
                      <th className="px-6 py-3">
                        Inter-university / State / National / International
                      </th>
                      <th className="px-6 py-3">Name of the event</th>
                      <th className="px-6 py-3">Name of the student</th>
                      <th className="px-6 py-3">
                        Link to the relevant document
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {interSports && interSports.length > 0 ? (
                      interSports
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((counsel, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3">{counsel.yearOfEvent}</td>
                            <td className="px-6 py-3">{counsel.nameOfAward}</td>
                            <td className="px-6 py-3">{counsel.teamOrIndi}</td>
                            <td className="px-6 py-3">{counsel.level}</td>
                            <td className="px-6 py-3">{counsel.nameOfEvent}</td>
                            <td className="px-6 py-3">
                              {counsel.nameOfStudent}
                            </td>
                            <td className="px-6 py-3">
                              <a
                                href={counsel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                Document
                              </a>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {interSports && interSports.length > 0 && (
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
                      Math.ceil((interSports?.length || 0) / itemsPerPage),
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
                                (interSports?.length || 0) / itemsPerPage
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
                {interSports && interSports.length > 0 ? (
                  interSports
                    .slice(
                      (cardCurrentPage - 1) * cardsPerPage,
                      cardCurrentPage * cardsPerPage
                    )
                    .map((entry, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{entry.nameOfStudent}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Year: </strong>
                            {entry.yearOfEvent}
                          </p>
                          <p>
                            <strong>Name of the award: </strong>{" "}
                            {entry.nameOfAward}
                          </p>
                          <p>
                            <strong>Team / Individual: </strong>{" "}
                            {entry.teamOrIndi}
                          </p>
                          <p>
                            <strong>{entry.level}</strong>
                          </p>
                          <p>
                            <strong>Event name: </strong> {entry.nameOfEvent}
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
              {interSports && interSports.length > 0 && (
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
                      Math.ceil((interSports?.length || 0) / cardsPerPage),
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
                                (interSports?.length || 0) / cardsPerPage
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
      <InterSportsDashboard />
    </Suspense>
  );
}
