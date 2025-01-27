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

interface HigherStudies {
  studentName: string;
  programGraduatedFrom: string;
  institutionAdmittedTo: string;
  programmeAdmittedTo: string;
  year: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function HigherStudiesDashboard() {
  const [higherStudies, setHigherStudies] = useState<HigherStudies[] | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHigherStudyDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/studentHigherStudies?startYear=${startYear}&endYear=${endYear}`,
          { withCredentials: true }
        );
        setHigherStudies(response.data);
      } catch (error) {
        console.error("Error fetching career counsels:", error);
      }
    };
    fetchHigherStudyDetails();
  }, [startYear, endYear]);

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "HigherStudies.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    if (higherStudies) {
      const headers = [
        "Year",
        "Name of student",
        "Program graduated from",
        "Name of institution admitted to",
        "Name of programme admitted to",
      ];
      const csvContent = [
        headers.join(","),
        ...higherStudies.map((hs) =>
          [hs.year,hs.studentName, hs.programGraduatedFrom, hs.institutionAdmittedTo, hs.programmeAdmittedTo].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "HigherStudies.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const getChartData = () => {
    const yearCount: Record<string, number> = {};
    if (higherStudies) {
        higherStudies.forEach((entry) => {
            const year = entry.year;
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>

          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Higher Studies Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={chartType}
              onValueChange={(value: "bar" | "line" | "pie") => setChartType(value)}
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
          <CardTitle>Higher Studies Analysis Chart</CardTitle>
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
          <CardTitle>Higher Studies Details</CardTitle>
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
                      <th className="px-6 py-3">Name of student</th>
                      <th className="px-6 py-3">Program graduated from</th>
                      <th className="px-6 py-3">Name of institution admitted to</th>
                      <th className="px-6 py-3">Name of programme admitted to</th>
                    </tr>
                  </thead>
                  <tbody>
                    {higherStudies && higherStudies.length > 0 ? (
                      higherStudies.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-6 py-3">{entry.year}</td>
                          <td className="px-6 py-3">{entry.studentName}</td>
                          <td className="px-6 py-3">{entry.programGraduatedFrom}</td>
                          <td className="px-6 py-3">{entry.institutionAdmittedTo}</td>
                          <td className="px-6 py-3">{entry.programmeAdmittedTo}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {higherStudies && higherStudies.length > 0 ? (
                    higherStudies.map((entry, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{entry.studentName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Year: </strong>{entry.year}
                          </p>
                          <p>
                            <strong>Institution of Admittance: </strong> {entry.institutionAdmittedTo}
                          </p>
                          <p>
                            <strong>Program of Admittance: </strong> {entry.programmeAdmittedTo}
                          </p>
                          <p>
                            <strong>Program graduated from: </strong> {entry.programGraduatedFrom}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                    <div>
                        <div className="text-center py-4">
                            No data available
                        </div>
                    </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PatentAnalyze() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HigherStudiesDashboard />
    </Suspense>
  );
}
