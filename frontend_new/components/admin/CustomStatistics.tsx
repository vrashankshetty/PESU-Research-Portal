import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type CustomStatisticsProps = {
  data: any[];
  analysisType: 'journal' | 'conference' | 'patent';
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomStatistics: React.FC<CustomStatisticsProps> = ({ data, analysisType }) => {
  const [leftYearRange, setLeftYearRange] = useState({ start: '2000', end: '2012' });
  const [rightYearRange, setRightYearRange] = useState({ start: '2013', end: '2024' });
  const [leftChartType, setLeftChartType] = useState<'bar' | 'line' | 'pie'>('line');
  const [rightChartType, setRightChartType] = useState<'bar' | 'line' | 'pie'>('line');

  const getChartData = (startYear: string, endYear: string) => {
    const filteredData = data.filter(item => item.year >= startYear && item.year <= endYear);
    const counts: { [key: string]: number } = {};
    
    filteredData.forEach(item => {
      counts[item.year] = (counts[item.year] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  };

  const leftChartData = getChartData(leftYearRange.start, leftYearRange.end);
  const rightChartData = getChartData(rightYearRange.start, rightYearRange.end);

  const renderChart = (data: any[], chartType: 'bar' | 'line' | 'pie') => {
    switch (chartType) {
      case 'bar':
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
        );
      case 'line':
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
        );
      case 'pie':
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
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}s {leftYearRange.start} - {leftYearRange.end}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <div>
              <Label htmlFor="leftYearStart">Start Year</Label>
              <Input
                id="leftYearStart"
                type="number"
                min="1990"
                max="2099"
                value={leftYearRange.start}
                onChange={(e) => setLeftYearRange({ ...leftYearRange, start: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="leftYearEnd">End Year</Label>
              <Input
                id="leftYearEnd"
                type="number"
                min="1990"
                max="2099"
                value={leftYearRange.end}
                onChange={(e) => setLeftYearRange({ ...leftYearRange, end: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="leftChartType">Chart Type</Label>
              <Select value={leftChartType} onValueChange={(value: 'bar' | 'line' | 'pie') => setLeftChartType(value)}>
                <SelectTrigger id="leftChartType">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {renderChart(leftChartData, leftChartType)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}s {rightYearRange.start} - {rightYearRange.end}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <div>
              <Label htmlFor="rightYearStart">Start Year</Label>
              <Input
                id="rightYearStart"
                type="number"
                min="1990"
                max="2099"
                value={rightYearRange.start}
                onChange={(e) => setRightYearRange({ ...rightYearRange, start: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rightYearEnd">End Year</Label>
              <Input
                id="rightYearEnd"
                type="number"
                min="1990"
                max="2099"
                value={rightYearRange.end}
                onChange={(e) => setRightYearRange({ ...rightYearRange, end: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rightChartType">Chart Type</Label>
              <Select value={rightChartType} onValueChange={(value: 'bar' | 'line' | 'pie') => setRightChartType(value)}>
                <SelectTrigger id="rightChartType">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {renderChart(rightChartData, rightChartType)}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomStatistics;
