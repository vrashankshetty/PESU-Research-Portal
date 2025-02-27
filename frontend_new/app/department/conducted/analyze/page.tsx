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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { backendUrl } from "@/config";
import type { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
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

type ConductedEvent = {
  id: string;
  userId: string;
  nameOfProgram: string;
  noOfParticipants: number;
  durationStartDate: string;
  durationEndDate: string;
  documentLink: string;
  year: string;
  createdAt: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function ConductedEventDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<ConductedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ConductedEvent[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cardsPerPage = 6;
  const [visiblePages, setVisiblePages] = useState(5);

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("dateStart", dateRange?.from?.toISOString() || "");
    params.set("dateEnd", dateRange?.to?.toISOString() || "");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [chartType, dateRange, router, searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/departmentConductedActivity`,
          {
            withCredentials: true,
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching conducted events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    setChartType(
      (searchParams.get("chartType") as "bar" | "line" | "pie") || "bar"
    );
    const startDate = searchParams.get("dateStart");
    const endDate = searchParams.get("dateEnd");

    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventStartDate = new Date(event.durationStartDate);
      const eventEndDate = new Date(event.durationEndDate);
      // console.log(eventStartDate, dateRange.from, eventEndDate, dateRange.to);
      if (dateRange?.from && dateRange?.to) {
        return eventStartDate >= dateRange.from && eventEndDate <= dateRange.to;
      }
      if (dateRange?.from) {
        return eventStartDate >= dateRange.from;
      }
      if (dateRange?.to) {
        return eventEndDate <= dateRange.to;
      }
      return true;
    });
    setFilteredEvents(filtered);
    updateQueryParams();
  }, [events, dateRange, updateQueryParams]);

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

  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredEvents.forEach((event) => {
      const key = new Date(event.durationStartDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
        }
      );
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data)
      .sort((a, b) => (new Date(a[0]) > new Date(b[0]) ? 1 : -1))
      .map(([name, value]) => ({ name, value }));
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
        link.download = "conducted_event_chart.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
      "Year",
      "Program Name",
      "Participants",
      "Start Date",
      "End Date",
      "Document Link",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map((event) =>
        [
          event.year,
          `"${event.nameOfProgram.replace(/"/g, '""')}"`,
          event.noOfParticipants,
          new Date(event.durationStartDate).toLocaleDateString(),
          new Date(event.durationEndDate).toLocaleDateString(),
          event.documentLink,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "conducted_events_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Conducted Events Analysis Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <CardTitle>Date Range Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conducted Events Analysis Chart</CardTitle>
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
          <CardTitle>Conducted Events Details</CardTitle>
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
                      <th className="px-6 py-3">Program Name</th>
                      <th className="px-6 py-3">Participants</th>
                      <th className="px-6 py-3">Start Date</th>
                      <th className="px-6 py-3">End Date</th>
                      <th className="px-6 py-3">Document</th>
                      <th className="px-6 py-3">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((event, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-6 py-4">{event.year}</td>
                          <td className="px-6 py-4">{event.nameOfProgram}</td>
                          <td className="px-6 py-4">
                            {event.noOfParticipants}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(
                              event.durationStartDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(
                              event.durationEndDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={event.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/department/conducted/edit/${event.id}`
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
                    Math.ceil(filteredEvents.length / itemsPerPage),
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
                            Math.ceil(filteredEvents.length / itemsPerPage),
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
                {filteredEvents
                  .slice(
                    (cardCurrentPage - 1) * cardsPerPage,
                    cardCurrentPage * cardsPerPage
                  )
                  .map((event, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{event.nameOfProgram}</CardTitle>
                        <Button
                          onClick={() =>
                            router.push(
                              `/department/conducted/edit/${event.id}`
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
                          <strong>Year:</strong> {event.year}
                        </p>
                        <p>
                          <strong>Participants:</strong>{" "}
                          {event.noOfParticipants}
                        </p>
                        <p>
                          <strong>Start Date:</strong>{" "}
                          {new Date(
                            event.durationStartDate
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End Date:</strong>{" "}
                          {new Date(event.durationEndDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Document:</strong>{" "}
                          <a
                            href={event.documentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        </p>
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
                    Math.ceil(filteredEvents.length / cardsPerPage),
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
                            Math.ceil(filteredEvents.length / cardsPerPage),
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

export default function ConductedAnalyze() {
  return (
    <Suspense fallback={<Spinner />}>
      <ConductedEventDashboard />
    </Suspense>
  );
}
