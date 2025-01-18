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

// 1. Update Type Definition
type Attended = {
  year: string;
  numberOfParticipants: number;
  teacherName: string;
  programTitle: string;
  durationFrom: string;
  durationTo: string;
  documentLink: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function AttendedDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [attended, setAttended] = useState<Attended[]>([]);
  const [filteredAttended, setFilteredAttended] = useState<Attended[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [metric, setMetric] = useState<"year" | "numberOfParticipants">("year"); // 2. Modify Metrics
  const [yearRange, setYearRange] = useState({ start: "2000", end: "2024" });
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // 1. Add State for Participants Filtering
  const [minParticipants, setMinParticipants] = useState<number | "">("");
  const [maxParticipants, setMaxParticipants] = useState<number | "">("");

  const chartRef = useRef<HTMLDivElement>(null);

  // 3. Change API Endpoint
  useEffect(() => {
    const fetchAttended = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/attended`,
          { withCredentials: true }
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
    params.set("metric", metric);
    params.set("yearStart", yearRange.start);
    params.set("yearEnd", yearRange.end);
    params.set("years", selectedYears.join(","));
    params.set("minParticipants", minParticipants.toString());
    params.set("maxParticipants", maxParticipants.toString());
    router.push(`?${params.toString()}`);
  }, [
    chartType,
    metric,
    yearRange,
    selectedYears,
    minParticipants,
    maxParticipants,
    router,
    searchParams,
  ]);

  // 4. Update Filtering Logic
  useEffect(() => {
    const filtered = attended.filter((event) => {
      const yearInRange =
        parseInt(event.year) >= parseInt(yearRange.start) &&
        parseInt(event.year) <= parseInt(yearRange.end);
      const yearMatch =
        selectedYears.length === 0 || selectedYears.includes(event.year);

      // 2. Update Participants Filtering
      const minMatch =
        minParticipants === "" || event.numberOfParticipants >= minParticipants;
      const maxMatch =
        maxParticipants === "" || event.numberOfParticipants <= maxParticipants;

      return yearInRange && yearMatch && minMatch && maxMatch;
    });
    setFilteredAttended(filtered);
    updateQueryParams();
  }, [
    attended,
    yearRange,
    selectedYears,
    minParticipants,
    maxParticipants,
    updateQueryParams,
  ]);

  // 5. Adjust Chart Metrics
  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredAttended.forEach((event) => {
      const key =
        metric === "year" ? event.year : event.numberOfParticipants.toString();
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
      "Number of Participants",
      "Teacher Name",
      "Program Title",
      "Duration From",
      "Duration To",
      "Document Link",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredAttended.map((event, index) =>
        [
          index + 1,
          event.year,
          event.numberOfParticipants,
          `"${event.teacherName.replace(/"/g, '""')}"`,
          `"${event.programTitle.replace(/"/g, '""')}"`,
          event.durationFrom,
          event.durationTo,
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
              onValueChange={(value: "year" | "numberOfParticipants") =>
                setMetric(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="numberOfParticipants">
                  Number of Participants
                </SelectItem>
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
                min="2000"
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
                min="2000"
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
            <CardTitle>Year Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Array.from(new Set(attended.map((event) => event.year))).map(
                (year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox
                      id={`year-${year}`}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={(checked) => {
                        setSelectedYears(
                          checked
                            ? [...selectedYears, year]
                            : selectedYears.filter((y) => y !== year)
                        );
                      }}
                    />
                    <Label htmlFor={`year-${year}`}>{year}</Label>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. Replace Participants Filter with Min/Max Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Participants Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="minParticipants">Minimum Participants</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  min="0"
                  value={minParticipants}
                  onChange={(e) =>
                    setMinParticipants(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="0"
                  value={maxParticipants}
                  onChange={(e) =>
                    setMaxParticipants(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  placeholder="e.g., 100"
                />
              </div>
            </div>
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
                      <th className="px-6 py-3">Participants</th>
                      <th className="px-6 py-3">Teacher Name</th>
                      <th className="px-6 py-3">Program Title</th>
                      <th className="px-6 py-3">Duration From</th>
                      <th className="px-6 py-3">Duration To</th>
                      <th className="px-6 py-3">Document Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttended.map((event, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{event.year}</td>
                        <td className="px-6 py-4">
                          {event.numberOfParticipants}
                        </td>
                        <td className="px-6 py-4">{event.teacherName}</td>
                        <td className="px-6 py-4">{event.programTitle}</td>
                        <td className="px-6 py-4">{event.durationFrom}</td>
                        <td className="px-6 py-4">{event.durationTo}</td>
                        <td className="px-6 py-4">
                          <a
                            href={event.documentLink}
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
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttended.map((event, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{event.programTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Serial No:</strong> {index + 1}
                      </p>
                      <p>
                        <strong>Year:</strong> {event.year}
                      </p>
                      <p>
                        <strong>Participants:</strong>{" "}
                        {event.numberOfParticipants}
                      </p>
                      <p>
                        <strong>Teacher Name:</strong> {event.teacherName}
                      </p>
                      <p>
                        <strong>Duration From:</strong> {event.durationFrom}
                      </p>
                      <p>
                        <strong>Duration To:</strong> {event.durationTo}
                      </p>
                      <a
                        href={event.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
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
