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
import { Plus, Search, Activity, Droplets, Gauge, Loader2, Video, ExternalLink } from 'lucide-react';
import { useMonitoringData, useGates } from '@/hooks/useIrrigationData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const conditionStyles = {
  normal: { label: 'Normal', class: 'status-badge-success' },
  warning: { label: 'Peringatan', class: 'status-badge-warning' },
  critical: { label: 'Kritis', class: 'status-badge-danger' },
};

const Monitoring: React.FC = () => {
  const { data, loading, createMonitoringData } = useMonitoringData();
  const { gates } = useGates();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredData = data.filter(
    (item) =>
      (item.gate_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const monitoringData = {
      gate_id: formData.get('gateId') as string,
      water_level: Number(formData.get('waterLevel')),
      discharge: Number(formData.get('discharge')),
      condition: formData.get('condition') as string,
      recorded_by: user?.id || null,
      notes: formData.get('notes') as string || null,
      video_url: formData.get('videoUrl') as string || null,
    };

    await createMonitoringData(monitoringData);
    setIsDialogOpen(false);
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                      {gates.map((gate) => (
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
                  <Label htmlFor="videoUrl">Link Video (Opsional)</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="pl-10"
                    />
                  </div>
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
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Simpan
                </Button>
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
                <p className="text-sm text-muted-foreground">Total Data</p>
                <p className="text-2xl font-heading font-bold">{data.length}</p>
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
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'Tidak ada data yang cocok' : 'Belum ada data monitoring'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pintu Air</TableHead>
                    <TableHead className="text-right">TMA (m)</TableHead>
                    <TableHead className="text-right">Debit (m³/s)</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.gate_name}</TableCell>
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
                      <TableCell>
                        {item.video_url ? (
                          <a 
                            href={item.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <Video className="w-4 h-4" />
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {item.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;
