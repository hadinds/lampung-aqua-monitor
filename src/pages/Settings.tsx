import React, { useState } from 'react';
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
  Save,
  Key,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, updateCredentials } = useAuth();

  // Credential change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = () => {
    toast({
      title: 'Berhasil',
      description: 'Pengaturan berhasil disimpan',
    });
  };

  const handleCredentialUpdate = async () => {
    if (!currentPassword) {
      toast({
        title: 'Error',
        description: 'Masukkan password saat ini',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Password baru tidak cocok',
        variant: 'destructive',
      });
      return;
    }

    if (!newUsername && !newPassword) {
      toast({
        title: 'Error',
        description: 'Masukkan username baru atau password baru',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      const success = await updateCredentials(
        currentPassword,
        newUsername || undefined,
        newPassword || undefined
      );

      if (success) {
        toast({
          title: 'Berhasil',
          description: 'Kredensial berhasil diperbarui',
        });
        // Clear form
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({
          title: 'Gagal',
          description: 'Password saat ini salah atau username sudah digunakan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat memperbarui kredensial',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const roleLabels = {
    admin: 'Administrator',
    field_officer: 'Petugas Lapangan',
    manager: 'Kepala Dinas',
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
              <CardDescription>Informasi akun Anda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="input-group">
              <Label>Nama</Label>
              <Input value={user?.name || ''} disabled className="bg-muted" />
            </div>
            <div className="input-group">
              <Label>Username Saat Ini</Label>
              <Input value={user?.username || ''} disabled className="bg-muted" />
            </div>
            <div className="input-group">
              <Label>Role</Label>
              <Input value={user?.role ? roleLabels[user.role] : ''} disabled className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credential Change */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Key className="w-5 h-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Ubah Kredensial</CardTitle>
              <CardDescription>Ubah username atau password Anda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="input-group">
            <Label htmlFor="currentPassword">Password Saat Ini *</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Masukkan password saat ini"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <Separator />
          
          <div className="input-group">
            <Label htmlFor="newUsername">Username Baru (opsional)</Label>
            <Input
              id="newUsername"
              type="text"
              placeholder="Kosongkan jika tidak ingin mengubah"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <Label htmlFor="newPassword">Password Baru (opsional)</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!newPassword}
              />
            </div>
          </div>

          <Button 
            onClick={handleCredentialUpdate} 
            disabled={isUpdating}
            className="gap-2"
          >
            <Key className="w-4 h-4" />
            {isUpdating ? 'Memproses...' : 'Perbarui Kredensial'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Bell className="w-5 h-5 text-accent" />
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
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autentikasi Dua Faktor</p>
              <p className="text-sm text-muted-foreground">
                Tambah lapisan keamanan ekstra
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Riwayat Login</p>
              <p className="text-sm text-muted-foreground">
                Simpan riwayat aktivitas login
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
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
