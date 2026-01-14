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
import { Plus, Search, Edit, Trash2, MapPin, Loader2 } from 'lucide-react';
import { useIrrigationAreas, DbIrrigationArea } from '@/hooks/useIrrigationData';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const statusStyles = {
  active: { label: 'Aktif', class: 'status-badge-success' },
  maintenance: { label: 'Pemeliharaan', class: 'status-badge-warning' },
  inactive: { label: 'Tidak Aktif', class: 'status-badge-danger' },
};

const Areas: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'kadis';
  
  const { areas, loading, createArea, updateArea, deleteArea } = useIrrigationAreas();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<DbIrrigationArea | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const areaData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      total_area: Number(formData.get('totalArea')),
      status: formData.get('status') as string,
      lat: editingArea?.lat || -5.0,
      lng: editingArea?.lng || 105.0,
    };

    if (editingArea) {
      await updateArea(editingArea.id, areaData);
    } else {
      await createArea(areaData);
    }

    setIsDialogOpen(false);
    setEditingArea(null);
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteArea(id);
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
          <h2 className="text-2xl font-heading font-bold text-foreground">Daerah Irigasi</h2>
          <p className="text-muted-foreground mt-1">
            Kelola data daerah irigasi PSDA Wilayah 2
          </p>
        </div>
        
        {canManage && (
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
                    defaultValue={editingArea?.total_area}
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
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
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
          {filteredAreas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'Tidak ada data yang cocok' : 'Belum ada data daerah irigasi'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Luas (Ha)</TableHead>
                    <TableHead>Status</TableHead>
                    {canManage && <TableHead className="text-right">Aksi</TableHead>}
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
                      <TableCell className="text-right">{area.total_area.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <span className={cn('status-badge', statusStyles[area.status as keyof typeof statusStyles]?.class || '')}>
                          {statusStyles[area.status as keyof typeof statusStyles]?.label || area.status}
                        </span>
                      </TableCell>
                      {canManage && (
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
                      )}
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

export default Areas;
