import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { mockAreas } from '@/data/mockData';
import { IrrigationArea } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  active: { label: 'Aktif', class: 'status-badge-success' },
  maintenance: { label: 'Pemeliharaan', class: 'status-badge-warning' },
  inactive: { label: 'Tidak Aktif', class: 'status-badge-danger' },
};

const Areas: React.FC = () => {
  const [areas, setAreas] = useState<IrrigationArea[]>(mockAreas);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<IrrigationArea | null>(null);
  const { toast } = useToast();

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newArea: IrrigationArea = {
      id: editingArea?.id || String(Date.now()),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      totalArea: Number(formData.get('totalArea')),
      status: formData.get('status') as IrrigationArea['status'],
      canalsCount: editingArea?.canalsCount || 0,
      gatesCount: editingArea?.gatesCount || 0,
      createdAt: editingArea?.createdAt || new Date().toISOString().split('T')[0],
      lat: editingArea?.lat || -5.0,
      lng: editingArea?.lng || 105.0,
    };

    if (editingArea) {
      setAreas(areas.map((a) => (a.id === editingArea.id ? newArea : a)));
      toast({ title: 'Berhasil', description: 'Data daerah irigasi berhasil diperbarui' });
    } else {
      setAreas([...areas, newArea]);
      toast({ title: 'Berhasil', description: 'Daerah irigasi baru berhasil ditambahkan' });
    }

    setIsDialogOpen(false);
    setEditingArea(null);
  };

  const handleDelete = (id: string) => {
    setAreas(areas.filter((a) => a.id !== id));
    toast({ title: 'Berhasil', description: 'Data daerah irigasi berhasil dihapus' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Daerah Irigasi</h2>
          <p className="text-muted-foreground mt-1">
            Kelola data daerah irigasi PSDA Wilayah 2
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArea(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Daerah
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>
                  {editingArea ? 'Edit Daerah Irigasi' : 'Tambah Daerah Irigasi'}
                </DialogTitle>
                <DialogDescription>
                  Isi data daerah irigasi di bawah ini
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="input-group">
                  <Label htmlFor="name">Nama Daerah Irigasi</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingArea?.name}
                    placeholder="Contoh: DI Way Sekampung"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingArea?.location}
                    placeholder="Contoh: Lampung Timur"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="totalArea">Luas Area (Ha)</Label>
                  <Input
                    id="totalArea"
                    name="totalArea"
                    type="number"
                    defaultValue={editingArea?.totalArea}
                    placeholder="Contoh: 15000"
                    required
                  />
                </div>
                <div className="input-group">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingArea?.status || 'active'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="maintenance">Pemeliharaan</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
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
            <CardTitle className="text-base font-heading">Daftar Daerah Irigasi</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari daerah..."
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
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="text-right">Luas (Ha)</TableHead>
                  <TableHead className="text-center">Saluran</TableHead>
                  <TableHead className="text-center">Pintu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{area.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{area.location}</TableCell>
                    <TableCell className="text-right">{area.totalArea.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-center">{area.canalsCount}</TableCell>
                    <TableCell className="text-center">{area.gatesCount}</TableCell>
                    <TableCell>
                      <span className={cn('status-badge', statusStyles[area.status].class)}>
                        {statusStyles[area.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingArea(area);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(area.id)}
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

export default Areas;
