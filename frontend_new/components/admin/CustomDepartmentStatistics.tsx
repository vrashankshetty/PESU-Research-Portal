import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import type { DateRange } from "react-day-picker"

type Event = {
  id: string
  userId: string
  title: string
  durationStartDate: string
  durationEndDate: string
  documentLink: string | null
  year: string
  createdAt: string
  noOfParticipants?: number
}

type CustomStatisticsProps = {
  events: Event[]
  eventType: "attended" | "conducted"
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const CustomStatistics: React.FC<CustomStatisticsProps> = ({ events, eventType }) => {
  const [leftDateRange, setLeftDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  })
  const [rightDateRange, setRightDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  })
  const [leftChartType, setLeftChartType] = useState<"bar" | "line" | "pie">("line")
  const [rightChartType, setRightChartType] = useState<"bar" | "line" | "pie">("line")

  const getChartData = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to) return []

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.durationStartDate)
      return eventDate >= dateRange.from! && eventDate <= dateRange.to!
    })

    const data: { [key: string]: number } = {}
    filteredEvents.forEach((event) => {
      const year = new Date(event.durationStartDate).getFullYear().toString()
      data[year] = (data[year] || 0) + 1
    })

    return Object.entries(data)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year))
  }

  const leftChartData = getChartData(leftDateRange)
  const rightChartData = getChartData(rightDateRange)

  const renderChart = (data: any[], chartType: "bar" | "line" | "pie") => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ year, count }) => `${year}: ${count}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{eventType === "attended" ? "Attended" : "Conducted"} Events (Left Range)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <DatePickerWithRange date={leftDateRange} setDate={setLeftDateRange} />
            <Select value={leftChartType} onValueChange={(value: "bar" | "line" | "pie") => setLeftChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderChart(leftChartData, leftChartType)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{eventType === "attended" ? "Attended" : "Conducted"} Events (Right Range)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <DatePickerWithRange date={rightDateRange} setDate={setRightDateRange} />
            <Select value={rightChartType} onValueChange={(value: "bar" | "line" | "pie") => setRightChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderChart(rightChartData, rightChartType)}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomStatistics

