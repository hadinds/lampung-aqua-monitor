import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Database,
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
          Kelola pengaturan sistem aplikasi
        </p>
      </div>

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
