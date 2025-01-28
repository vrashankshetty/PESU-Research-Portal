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
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

type Attended = {
  id: string;
  userId: string;
  programTitle: string;
  durationStartDate: string;
  durationEndDate: string;
  documentLink: string | null;
  year: string;
  createdAt: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function AttendedDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [attended, setAttended] = useState<Attended[]>([]);
  const [filteredAttended, setFilteredAttended] = useState<Attended[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAttended = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/departmentAttendedActivity`,
          {
            withCredentials: true,
          }
        );
        setAttended(response.data);
      } catch (error) {
        console.error("Error fetching attended events:", error);
      }
    };
    fetchAttended();
  }, []);

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("dateStart", dateRange?.from?.toISOString() || "");
    params.set("dateEnd", dateRange?.to?.toISOString() || "");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [chartType, dateRange, router, searchParams]);

  useEffect(() => {
    const filtered = attended.filter((event) => {
      const eventStartDate = new Date(event.durationStartDate);
      const eventEndDate = new Date(event.durationEndDate);

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

    setFilteredAttended(filtered);
    updateQueryParams();
  }, [attended, dateRange, updateQueryParams]);

  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredAttended.forEach((event) => {
      const monthYear = format(new Date(event.durationStartDate), "MMM yyyy");
      data[monthYear] = (data[monthYear] || 0) + 1;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
        link.download = "attended_chart.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
      "Serial No",
      "Year",
      "Program Title",
      "Duration Start",
      "Duration End",
      "Document Link",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredAttended.map((event, index) =>
        [
          index + 1,
          event.year,
          `"${event.programTitle.replace(/"/g, '""')}"`,
          event.durationStartDate,
          event.durationEndDate,
          event.documentLink,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "attended_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Attended Programs Analysis</h1>

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
          <CardTitle>Attended Programs Analysis Chart</CardTitle>
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
          <CardTitle>Attended Programs Details</CardTitle>
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
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Program Title</th>
                      <th className="px-6 py-3">Duration Start</th>
                      <th className="px-6 py-3">Duration End</th>
                      <th className="px-6 py-3">Document Link</th>
                      <th className="px-6 py-3">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttended.map((event, index) => (
                      <tr key={event.id} className="bg-white border-b">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{event.year}</td>
                        <td className="px-6 py-4">{event.programTitle}</td>
                        <td className="px-6 py-4">
                          {new Date(
                            event.durationStartDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(event.durationEndDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {event.documentLink ? (
                            <a
                              href={event.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            <div>N/A</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() =>
                              router.push(
                                `/department/attended/edit/${event.id}`
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
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttended.map((event, index) => (
                  <Card key={event.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{event.programTitle}</CardTitle>
                      <Button
                        onClick={() =>
                          router.push(`/department/attended/edit/${event.id}`)
                        }
                        variant="outline"
                        size="sm"
                      >
                        Edit
                        <Pencil className="h-4 w-4 ml-2" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Year:</strong> {event.year}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {new Date(event.durationStartDate).toLocaleDateString()}{" "}
                        to{" "}
                        {new Date(event.durationEndDate).toLocaleDateString()}
                      </p>
                      {event.documentLink && (
                        <a
                          href={event.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AttendedAnalyze() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendedDashboard />
    </Suspense>
  );
}
