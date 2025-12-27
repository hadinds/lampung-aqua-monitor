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
import { Plus, Search, Edit, Trash2, Waves } from 'lucide-react';
import { mockCanals, mockAreas } from '@/data/mockData';
import { Canal } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  good: { label: 'Baik', class: 'status-badge-success' },
  needs_repair: { label: 'Perlu Perbaikan', class: 'status-badge-warning' },
  critical: { label: 'Kritis', class: 'status-badge-danger' },
};

const Canals: React.FC = () => {
  const [canals, setCanals] = useState<Canal[]>(mockCanals);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCanal, setEditingCanal] = useState<Canal | null>(null);
  const { toast } = useToast();

  const filteredCanals = canals.filter(
    (canal) =>
      canal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      canal.areaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const areaId = formData.get('areaId') as string;
    const area = mockAreas.find((a) => a.id === areaId);

    const newCanal: Canal = {
      id: editingCanal?.id || String(Date.now()),
      name: formData.get('name') as string,
      areaId: areaId,
      areaName: area?.name || '',
      length: Number(formData.get('length')),
      width: Number(formData.get('width')),
      capacity: Number(formData.get('capacity')),
      status: formData.get('status') as Canal['status'],
      lastInspection: editingCanal?.lastInspection || new Date().toISOString().split('T')[0],
    };

    if (editingCanal) {
      setCanals(canals.map((c) => (c.id === editingCanal.id ? newCanal : c)));
      toast({ title: 'Berhasil', description: 'Data saluran berhasil diperbarui' });
    } else {
      setCanals([...canals, newCanal]);
      toast({ title: 'Berhasil', description: 'Saluran baru berhasil ditambahkan' });
    }

    setIsDialogOpen(false);
    setEditingCanal(null);
  };

  const handleDelete = (id: string) => {
    setCanals(canals.filter((c) => c.id !== id));
    toast({ title: 'Berhasil', description: 'Data saluran berhasil dihapus' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Saluran Irigasi</h2>
          <p className="text-muted-foreground mt-1">
            Kelola data saluran primer, sekunder, dan tersier
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCanal(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Saluran
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>
                  {editingCanal ? 'Edit Saluran' : 'Tambah Saluran'}
                </DialogTitle>
                <DialogDescription>
                  Isi data saluran irigasi di bawah ini
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="input-group">
                  <Label htmlFor="name">Nama Saluran</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingCanal?.name}
                    placeholder="Contoh: Saluran Primer SP-01"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="areaId">Daerah Irigasi</Label>
                  <Select name="areaId" defaultValue={editingCanal?.areaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih daerah irigasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <Label htmlFor="length">Panjang (m)</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      defaultValue={editingCanal?.length}
                      placeholder="12500"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <Label htmlFor="width">Lebar (m)</Label>
                    <Input
                      id="width"
                      name="width"
                      type="number"
                      step="0.1"
                      defaultValue={editingCanal?.width}
                      placeholder="8.5"
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <Label htmlFor="capacity">Kapasitas (m³/s)</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingCanal?.capacity}
                    placeholder="25000"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="status">Kondisi</Label>
                  <Select name="status" defaultValue={editingCanal?.status || 'good'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Baik</SelectItem>
                      <SelectItem value="needs_repair">Perlu Perbaikan</SelectItem>
                      <SelectItem value="critical">Kritis</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-heading">Daftar Saluran</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari saluran..."
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Daerah Irigasi</TableHead>
                  <TableHead className="text-right">Panjang (m)</TableHead>
                  <TableHead className="text-right">Lebar (m)</TableHead>
                  <TableHead className="text-right">Kapasitas</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCanals.map((canal) => (
                  <TableRow key={canal.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-accent" />
                        <span className="font-medium">{canal.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{canal.areaName}</TableCell>
                    <TableCell className="text-right">{canal.length.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{canal.width}</TableCell>
                    <TableCell className="text-right">{canal.capacity.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <span className={cn('status-badge', statusStyles[canal.status].class)}>
                        {statusStyles[canal.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCanal(canal);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(canal.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Canals;
