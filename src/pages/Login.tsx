import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Lock, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('field_officer');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang di Sistem Informasi Monitoring Irigasi',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Gagal',
          description: 'Email atau password tidak valid',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md animate-slide-up shadow-elevated border-border/50">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading font-bold text-foreground">
              SIMONI
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Sistem Informasi Monitoring Irigasi
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              PSDA Wilayah 2 Provinsi Lampung
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="input-group">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@psda.lampung.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="field_officer">Petugas Lapangan</SelectItem>
                    <SelectItem value="manager">Kepala Bidang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo: Gunakan password minimal 4 karakter
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
