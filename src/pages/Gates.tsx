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
import { Plus, Search, Edit, Trash2, DoorOpen } from 'lucide-react';
import { mockGates, mockCanals } from '@/data/mockData';
import { Gate } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const [gates, setGates] = useState<Gate[]>(mockGates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGate, setEditingGate] = useState<Gate | null>(null);
  const { toast } = useToast();

  const filteredGates = gates.filter(
    (gate) =>
      gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gate.canalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const canalId = formData.get('canalId') as string;
    const canal = mockCanals.find((c) => c.id === canalId);

    const newGate: Gate = {
      id: editingGate?.id || String(Date.now()),
      name: formData.get('name') as string,
      canalId: canalId,
      canalName: canal?.name || '',
      type: formData.get('type') as Gate['type'],
      status: formData.get('status') as Gate['status'],
      condition: formData.get('condition') as Gate['condition'],
      lastMaintenance: editingGate?.lastMaintenance || new Date().toISOString().split('T')[0],
    };

    if (editingGate) {
      setGates(gates.map((g) => (g.id === editingGate.id ? newGate : g)));
      toast({ title: 'Berhasil', description: 'Data pintu air berhasil diperbarui' });
    } else {
      setGates([...gates, newGate]);
      toast({ title: 'Berhasil', description: 'Pintu air baru berhasil ditambahkan' });
    }

    setIsDialogOpen(false);
    setEditingGate(null);
  };

  const handleDelete = (id: string) => {
    setGates(gates.filter((g) => g.id !== id));
    toast({ title: 'Berhasil', description: 'Data pintu air berhasil dihapus' });
  };

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
                  <Select name="canalId" defaultValue={editingGate?.canalId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih saluran" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCanals.map((canal) => (
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
                <Button type="submit">Simpan</Button>
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
                    <TableCell className="text-muted-foreground">{gate.canalName}</TableCell>
                    <TableCell>{typeLabels[gate.type]}</TableCell>
                    <TableCell>
                      <span className={cn('status-badge', statusStyles[gate.status].class)}>
                        {statusStyles[gate.status].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn('status-badge', conditionStyles[gate.condition].class)}>
                        {conditionStyles[gate.condition].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{gate.lastMaintenance}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Gates;
