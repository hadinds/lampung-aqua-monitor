import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlerts } from '@/hooks/useIrrigationData';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

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
  const { alerts, loading } = useAlerts();

  const criticalCount = alerts.filter((a) => a.type === 'critical' && !a.is_read).length;

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading">Notifikasi Terkini</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-heading">Notifikasi Terkini</CardTitle>
        {criticalCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            {criticalCount} Kritis
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Tidak ada notifikasi
          </div>
        ) : (
          alerts.map((alert) => {
            const style = alertStyles[alert.type as keyof typeof alertStyles] || alertStyles.info;
            const Icon = style.icon;
            const timeAgo = formatDistanceToNow(new Date(alert.created_at), {
              addSuffix: true,
              locale: id,
            });

            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer',
                  style.bg,
                  style.border,
                  alert.is_read && 'opacity-60'
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
                  {timeAgo}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsList;