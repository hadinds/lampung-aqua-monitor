import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useMonitoringData, useIrrigationAreas } from '@/hooks/useIrrigationData';
import { Loader2 } from 'lucide-react';

export const WaterLevelChart: React.FC = () => {
  const { data, loading } = useMonitoringData();

  // Group data by date and calculate average water level
  const chartData = React.useMemo(() => {
    if (!data.length) return [];
    
    const grouped: Record<string, { total: number; count: number }> = {};
    
    data.forEach((item) => {
      const date = new Date(item.recorded_at).toLocaleDateString('id-ID', { 
        day: '2-digit',
        month: 'short'
      });
      if (!grouped[date]) {
        grouped[date] = { total: 0, count: 0 };
      }
      grouped[date].total += Number(item.water_level);
      grouped[date].count += 1;
    });

    return Object.entries(grouped)
      .map(([date, val]) => ({
        date,
        level: Number((val.total / val.count).toFixed(2))
      }))
      .reverse()
      .slice(-10); // Last 10 entries
  }, [data]);

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">Tren Tinggi Muka Air (m)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-heading">Tren Tinggi Muka Air (m) - Realtime</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground">
            Belum ada data monitoring
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="level"
                name="TMA (m)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#waterGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export const DischargeChart: React.FC = () => {
  const { data, loading } = useMonitoringData();

  // Group data by date and calculate average discharge
  const chartData = React.useMemo(() => {
    if (!data.length) return [];
    
    const grouped: Record<string, { total: number; count: number }> = {};
    
    data.forEach((item) => {
      const date = new Date(item.recorded_at).toLocaleDateString('id-ID', { 
        day: '2-digit',
        month: 'short'
      });
      if (!grouped[date]) {
        grouped[date] = { total: 0, count: 0 };
      }
      grouped[date].total += Number(item.discharge);
      grouped[date].count += 1;
    });

    return Object.entries(grouped)
      .map(([date, val]) => ({
        date,
        discharge: Number((val.total / val.count).toFixed(1))
      }))
      .reverse()
      .slice(-7); // Last 7 entries
  }, [data]);

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">Debit Air (m³/s)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-heading">Debit Air (m³/s) - Realtime</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground">
            Belum ada data monitoring
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="discharge" 
                name="Debit (m³/s)"
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export const AreaDistributionChart: React.FC = () => {
  const { areas, loading } = useIrrigationAreas();

  // Calculate status distribution
  const chartData = React.useMemo(() => {
    if (!areas.length) return [];
    
    const statusCount: Record<string, number> = {
      active: 0,
      maintenance: 0,
      inactive: 0
    };

    areas.forEach((area) => {
      const status = area.status || 'inactive';
      if (statusCount[status] !== undefined) {
        statusCount[status] += 1;
      }
    });

    const colors: Record<string, string> = {
      active: 'hsl(142, 76%, 36%)',
      maintenance: 'hsl(38, 92%, 50%)',
      inactive: 'hsl(215, 16%, 47%)'
    };

    const labels: Record<string, string> = {
      active: 'Aktif',
      maintenance: 'Pemeliharaan',
      inactive: 'Tidak Aktif'
    };

    return Object.entries(statusCount)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: labels[status] || status,
        value: count,
        fill: colors[status] || colors.inactive
      }));
  }, [areas]);

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">Status Daerah Irigasi</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-heading">Status Daerah Irigasi - Realtime</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground">
            Belum ada data daerah irigasi
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
