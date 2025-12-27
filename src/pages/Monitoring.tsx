import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Activity, Droplets, Gauge } from 'lucide-react';
import { mockMonitoringData, mockGates } from '@/data/mockData';
import { MonitoringData } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const conditionStyles = {
  normal: { label: 'Normal', class: 'status-badge-success' },
  warning: { label: 'Peringatan', class: 'status-badge-warning' },
  critical: { label: 'Kritis', class: 'status-badge-danger' },
};

const Monitoring: React.FC = () => {
  const [data, setData] = useState<MonitoringData[]>(mockMonitoringData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const filteredData = data.filter(
    (item) =>
      item.gateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recordedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gateId = formData.get('gateId') as string;
    const gate = mockGates.find((g) => g.id === gateId);

    const newData: MonitoringData = {
      id: String(Date.now()),
      gateId: gateId,
      gateName: gate?.name || '',
      waterLevel: Number(formData.get('waterLevel')),
      discharge: Number(formData.get('discharge')),
      condition: formData.get('condition') as MonitoringData['condition'],
      recordedAt: new Date().toLocaleString('id-ID'),
      recordedBy: user?.name || 'Unknown',
      notes: formData.get('notes') as string,
    };

    setData([newData, ...data]);
    toast({ title: 'Berhasil', description: 'Data monitoring berhasil disimpan' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Monitoring</h2>
          <p className="text-muted-foreground mt-1">
            Input dan pantau data tinggi muka air, debit, dan kondisi
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Input Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>Input Data Monitoring</DialogTitle>
                <DialogDescription>
                  Masukkan hasil pengukuran di lapangan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="input-group">
                  <Label htmlFor="gateId">Pintu Air</Label>
                  <Select name="gateId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pintu air" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGates.map((gate) => (
                        <SelectItem key={gate.id} value={gate.id}>
                          {gate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <Label htmlFor="waterLevel">Tinggi Muka Air (m)</Label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="waterLevel"
                        name="waterLevel"
                        type="number"
                        step="0.01"
                        placeholder="2.45"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <Label htmlFor="discharge">Debit (m³/s)</Label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="discharge"
                        name="discharge"
                        type="number"
                        step="0.1"
                        placeholder="15.8"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <Label htmlFor="condition">Kondisi</Label>
                  <Select name="condition" defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="warning">Peringatan</SelectItem>
                      <SelectItem value="critical">Kritis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="input-group">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Tambahkan catatan jika diperlukan..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Hari Ini</p>
                <p className="text-2xl font-heading font-bold">
                  {data.filter((d) => d.recordedAt.includes(new Date().toLocaleDateString('id-ID'))).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Activity className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peringatan</p>
                <p className="text-2xl font-heading font-bold">
                  {data.filter((d) => d.condition === 'warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Activity className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kritis</p>
                <p className="text-2xl font-heading font-bold">
                  {data.filter((d) => d.condition === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-heading">Riwayat Monitoring</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pintu Air</TableHead>
                  <TableHead className="text-right">TMA (m)</TableHead>
                  <TableHead className="text-right">Debit (m³/s)</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Petugas</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.gateName}</TableCell>
                    <TableCell className="text-right">{item.waterLevel.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.discharge.toFixed(1)}</TableCell>
                    <TableCell>
                      <span className={cn('status-badge', conditionStyles[item.condition].class)}>
                        {conditionStyles[item.condition].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.recordedAt}</TableCell>
                    <TableCell>{item.recordedBy}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {item.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;
