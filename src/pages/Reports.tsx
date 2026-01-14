import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, FileSpreadsheet, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMonitoringData, useGates, useIrrigationAreas } from '@/hooks/useIrrigationData';
import { cn } from '@/lib/utils';

const conditionStyles = {
  normal: { label: 'Normal', class: 'status-badge-success' },
  warning: { label: 'Peringatan', class: 'status-badge-warning' },
  critical: { label: 'Kritis', class: 'status-badge-danger' },
};

const Reports: React.FC = () => {
  const { toast } = useToast();
  const { data: monitoringData, loading: monitoringLoading } = useMonitoringData();
  const { gates } = useGates();
  const { areas } = useIrrigationAreas();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedGate, setSelectedGate] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  const filteredData = useMemo(() => {
    return monitoringData.filter((item) => {
      // Filter by date range
      if (startDate) {
        const itemDate = new Date(item.recorded_at).toISOString().split('T')[0];
        if (itemDate < startDate) return false;
      }
      if (endDate) {
        const itemDate = new Date(item.recorded_at).toISOString().split('T')[0];
        if (itemDate > endDate) return false;
      }
      // Filter by gate
      if (selectedGate !== 'all' && item.gate_id !== selectedGate) return false;
      // Filter by condition
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;
      return true;
    });
  }, [monitoringData, startDate, endDate, selectedGate, selectedCondition]);

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast({ title: 'Tidak ada data', description: 'Tidak ada data untuk diexport', variant: 'destructive' });
      return;
    }

    const headers = ['Pintu Air', 'TMA (m)', 'Debit (m³/s)', 'Kondisi', 'Waktu', 'Catatan'];
    const rows = filteredData.map((item) => [
      item.gate_name || '-',
      Number(item.water_level).toFixed(2),
      Number(item.discharge).toFixed(1),
      conditionStyles[item.condition as keyof typeof conditionStyles]?.label || item.condition,
      new Date(item.recorded_at).toLocaleString('id-ID'),
      item.notes || '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_monitoring_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Berhasil', description: 'Laporan CSV berhasil diunduh' });
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast({ title: 'Tidak ada data', description: 'Tidak ada data untuk diexport', variant: 'destructive' });
      return;
    }

    // Create a simple HTML table for Excel export
    const headers = ['Pintu Air', 'TMA (m)', 'Debit (m³/s)', 'Kondisi', 'Waktu', 'Catatan'];
    const rows = filteredData.map((item) => [
      item.gate_name || '-',
      Number(item.water_level).toFixed(2),
      Number(item.discharge).toFixed(1),
      conditionStyles[item.condition as keyof typeof conditionStyles]?.label || item.condition,
      new Date(item.recorded_at).toLocaleString('id-ID'),
      item.notes || '-',
    ]);

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead><tr>${headers.map((h) => `<th style="background:#1e40af;color:white;font-weight:bold;">${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_monitoring_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Berhasil', description: 'Laporan Excel berhasil diunduh' });
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedGate('all');
    setSelectedCondition('all');
  };

  if (monitoringLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Laporan Monitoring</h2>
        <p className="text-muted-foreground mt-1">
          Export data monitoring dalam format CSV atau Excel
        </p>
      </div>

      {/* Filter Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="input-group">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Label htmlFor="gate">Pintu Air</Label>
              <Select value={selectedGate} onValueChange={setSelectedGate}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Pintu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pintu</SelectItem>
                  {gates.map((gate) => (
                    <SelectItem key={gate.id} value={gate.id}>
                      {gate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="input-group">
              <Label htmlFor="condition">Kondisi</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kondisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kondisi</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Peringatan</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="input-group">
              <Label>&nbsp;</Label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Data Monitoring ({filteredData.length} data)
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <FileText className="w-4 h-4" />
                Export CSV
              </Button>
              <Button onClick={exportToExcel} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data dengan filter yang dipilih
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pintu Air</TableHead>
                    <TableHead className="text-right">TMA (m)</TableHead>
                    <TableHead className="text-right">Debit (m³/s)</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 50).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.gate_name || '-'}</TableCell>
                      <TableCell className="text-right">{Number(item.water_level).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(item.discharge).toFixed(1)}</TableCell>
                      <TableCell>
                        <span className={cn('status-badge', conditionStyles[item.condition as keyof typeof conditionStyles]?.class || '')}>
                          {conditionStyles[item.condition as keyof typeof conditionStyles]?.label || item.condition}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.recorded_at).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {item.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredData.length > 50 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Menampilkan 50 dari {filteredData.length} data. Export untuk melihat semua data.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{filteredData.length}</p>
            <p className="text-sm text-muted-foreground">Total Data</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success">{filteredData.filter((d) => d.condition === 'normal').length}</p>
            <p className="text-sm text-muted-foreground">Normal</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-warning">{filteredData.filter((d) => d.condition === 'warning').length}</p>
            <p className="text-sm text-muted-foreground">Peringatan</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-destructive">{filteredData.filter((d) => d.condition === 'critical').length}</p>
            <p className="text-sm text-muted-foreground">Kritis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;