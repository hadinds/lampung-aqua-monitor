import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Edit, Trash2, DoorOpen, Loader2 } from 'lucide-react';
import { useGates, useCanals, DbGate } from '@/hooks/useIrrigationData';
import { cn } from '@/lib/utils';

const statusStyles = {
  open: { label: 'Terbuka', class: 'bg-success/15 text-success' },
  closed: { label: 'Tertutup', class: 'bg-muted text-muted-foreground' },
  partial: { label: 'Sebagian', class: 'bg-warning/15 text-warning' },
};

const conditionStyles = {
  good: { label: 'Baik', class: 'status-badge-success' },
  fair: { label: 'Cukup', class: 'status-badge-warning' },
  poor: { label: 'Buruk', class: 'status-badge-danger' },
};

const typeLabels = {
  intake: 'Intake',
  distribution: 'Distribusi',
  drainage: 'Drainase',
};

const Gates: React.FC = () => {
  const { gates, loading, createGate, updateGate, deleteGate } = useGates();
  const { canals } = useCanals();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGate, setEditingGate] = useState<(DbGate & { canal_name?: string }) | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredGates = gates.filter(
    (gate) =>
      gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gate.canal_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const gateData = {
      name: formData.get('name') as string,
      canal_id: formData.get('canalId') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      condition: formData.get('condition') as string,
      last_maintenance: editingGate?.last_maintenance || null,
    };

    if (editingGate) {
      await updateGate(editingGate.id, gateData);
    } else {
      await createGate(gateData);
    }

    setIsDialogOpen(false);
    setEditingGate(null);
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteGate(id);
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
          <h2 className="text-2xl font-heading font-bold text-foreground">Pintu Air</h2>
          <p className="text-muted-foreground mt-1">
            Kelola data pintu air intake, distribusi, dan drainase
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGate(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pintu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>
                  {editingGate ? 'Edit Pintu Air' : 'Tambah Pintu Air'}
                </DialogTitle>
                <DialogDescription>
                  Isi data pintu air di bawah ini
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="input-group">
                  <Label htmlFor="name">Nama Pintu</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingGate?.name}
                    placeholder="Contoh: Pintu Air Utama PA-01"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="canalId">Saluran</Label>
                  <Select name="canalId" defaultValue={editingGate?.canal_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih saluran" />
                    </SelectTrigger>
                    <SelectContent>
                      {canals.map((canal) => (
                        <SelectItem key={canal.id} value={canal.id}>
                          {canal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <Label htmlFor="type">Tipe</Label>
                    <Select name="type" defaultValue={editingGate?.type || 'intake'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Intake</SelectItem>
                        <SelectItem value="distribution">Distribusi</SelectItem>
                        <SelectItem value="drainage">Drainase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="input-group">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingGate?.status || 'closed'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Terbuka</SelectItem>
                        <SelectItem value="closed">Tertutup</SelectItem>
                        <SelectItem value="partial">Sebagian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="input-group">
                  <Label htmlFor="condition">Kondisi</Label>
                  <Select name="condition" defaultValue={editingGate?.condition || 'good'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Baik</SelectItem>
                      <SelectItem value="fair">Cukup</SelectItem>
                      <SelectItem value="poor">Buruk</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-heading">Daftar Pintu Air</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pintu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'Tidak ada data yang cocok' : 'Belum ada data pintu air'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Saluran</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Terakhir Dipelihara</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGates.map((gate) => (
                    <TableRow key={gate.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium">{gate.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{gate.canal_name}</TableCell>
                      <TableCell>{typeLabels[gate.type as keyof typeof typeLabels] || gate.type}</TableCell>
                      <TableCell>
                        <span className={cn('status-badge', statusStyles[gate.status as keyof typeof statusStyles]?.class || '')}>
                          {statusStyles[gate.status as keyof typeof statusStyles]?.label || gate.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn('status-badge', conditionStyles[gate.condition as keyof typeof conditionStyles]?.class || '')}>
                          {conditionStyles[gate.condition as keyof typeof conditionStyles]?.label || gate.condition}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{gate.last_maintenance || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingGate(gate);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(gate.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
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

export default Gates;
