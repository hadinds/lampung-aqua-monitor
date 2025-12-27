import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Tinggi muka air melebihi batas',
    location: 'PA-02, DI Way Seputih',
    time: '10 menit lalu',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Debit air menurun signifikan',
    location: 'PD-01, DI Way Sekampung',
    time: '1 jam lalu',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Jadwal inspeksi terlewat',
    location: 'SP-02, DI Way Seputih',
    time: '2 jam lalu',
  },
  {
    id: '4',
    type: 'info',
    title: 'Pemeliharaan terjadwal',
    location: 'DI Batang Hari Kanan',
    time: '5 jam lalu',
  },
];

const alertStyles = {
  critical: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: AlertCircle,
    iconColor: 'text-destructive',
    badgeVariant: 'destructive' as const,
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: AlertTriangle,
    iconColor: 'text-warning',
    badgeVariant: 'secondary' as const,
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: Info,
    iconColor: 'text-primary',
    badgeVariant: 'outline' as const,
  },
};

const AlertsList: React.FC = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-heading">Notifikasi Terkini</CardTitle>
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="w-3 h-3" />3 Kritis
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer',
                style.bg,
                style.border
              )}
            >
              <div className={cn('mt-0.5', style.iconColor)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.location}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {alert.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AlertsList;
