import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Berhasil',
      description: 'Pengaturan berhasil disimpan',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Pengaturan</h2>
        <p className="text-muted-foreground mt-1">
          Kelola pengaturan sistem dan preferensi pengguna
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Profil Pengguna</CardTitle>
              <CardDescription>Kelola informasi akun Anda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue="Administrator" />
            </div>
            <div className="input-group">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@psda.lampung.go.id" />
            </div>
            <div className="input-group">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" defaultValue="0721-123456" />
            </div>
            <div className="input-group">
              <Label htmlFor="position">Jabatan</Label>
              <Input id="position" defaultValue="Administrator Sistem" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Notifikasi</CardTitle>
              <CardDescription>Atur preferensi notifikasi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifikasi Email</p>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi peringatan via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Peringatan Kritis</p>
              <p className="text-sm text-muted-foreground">
                Notifikasi instan untuk kondisi kritis
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Laporan Harian</p>
              <p className="text-sm text-muted-foreground">
                Kirim ringkasan laporan setiap hari
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Keamanan</CardTitle>
              <CardDescription>Pengaturan keamanan akun</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div></div>
            <div className="input-group">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="input-group">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Database className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Sistem</CardTitle>
              <CardDescription>Pengaturan sistem aplikasi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Backup Otomatis</p>
              <p className="text-sm text-muted-foreground">
                Backup data setiap hari pukul 00:00
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode Offline</p>
              <p className="text-sm text-muted-foreground">
                Simpan data untuk akses offline
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
};

export default Settings;
