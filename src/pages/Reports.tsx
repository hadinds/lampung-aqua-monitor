import React from 'react';
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
import { FileText, FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { toast } = useToast();

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'Mengunduh Laporan',
      description: `Laporan dalam format ${format.toUpperCase()} sedang diproses...`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: 'Berhasil',
        description: `Laporan ${format.toUpperCase()} berhasil diunduh`,
      });
    }, 1500);
  };

  const reportTypes = [
    {
      id: 'daily',
      title: 'Laporan Harian',
      description: 'Data monitoring harian tinggi muka air dan debit',
      icon: FileText,
    },
    {
      id: 'weekly',
      title: 'Laporan Mingguan',
      description: 'Ringkasan kondisi irigasi selama satu minggu',
      icon: FileText,
    },
    {
      id: 'monthly',
      title: 'Laporan Bulanan',
      description: 'Laporan lengkap bulanan dengan analisis tren',
      icon: FileText,
    },
    {
      id: 'maintenance',
      title: 'Laporan Pemeliharaan',
      description: 'Daftar pemeliharaan dan kondisi aset',
      icon: FileSpreadsheet,
    },
    {
      id: 'performance',
      title: 'Laporan Kinerja',
      description: 'Analisis kinerja sistem irigasi',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Laporan</h2>
        <p className="text-muted-foreground mt-1">
          Generate dan unduh laporan dalam format PDF atau Excel
        </p>
      </div>

      {/* Date Range Filter */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="input-group">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                defaultValue="2024-01-01"
              />
            </div>
            <div className="input-group">
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                defaultValue="2024-01-31"
              />
            </div>
            <div className="input-group">
              <Label htmlFor="area">Daerah Irigasi</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih daerah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Daerah</SelectItem>
                  <SelectItem value="1">DI Way Sekampung</SelectItem>
                  <SelectItem value="2">DI Way Seputih</SelectItem>
                  <SelectItem value="3">DI Batang Hari Kanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="input-group">
              <Label>&nbsp;</Label>
              <Button className="w-full">
                Terapkan Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport('pdf')}
                        className="gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport('excel')}
                        className="gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Downloads */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">Unduhan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Laporan_Harian_2024-01-15.pdf', date: '15 Jan 2024, 14:30', size: '1.2 MB' },
              { name: 'Laporan_Mingguan_W2-2024.xlsx', date: '14 Jan 2024, 09:15', size: '856 KB' },
              { name: 'Laporan_Pemeliharaan_Jan-2024.pdf', date: '10 Jan 2024, 16:45', size: '2.1 MB' },
            ].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.date} • {file.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
