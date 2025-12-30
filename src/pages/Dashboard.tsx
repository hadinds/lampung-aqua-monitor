import React from 'react';
import { MapPin, Waves, DoorOpen, Activity, AlertTriangle, Droplets, Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { WaterLevelChart, DischargeChart, AreaDistributionChart } from '@/components/dashboard/Charts';
import AlertsList from '@/components/dashboard/AlertsList';
import { useDashboardStats } from '@/hooks/useIrrigationData';

const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Selamat Datang di SIMONI
          </h2>
          <p className="text-muted-foreground mt-1">
            Sistem Informasi Monitoring Irigasi - PSDA Wilayah 2 Provinsi Lampung
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Daerah Irigasi"
          value={stats.totalAreas}
          subtitle="Total area terdaftar"
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Saluran"
          value={stats.totalCanals}
          subtitle="Saluran aktif"
          icon={Waves}
          variant="accent"
        />
        <StatCard
          title="Pintu Air"
          value={stats.totalGates}
          subtitle="Pintu terpasang"
          icon={DoorOpen}
          variant="default"
        />
        <StatCard
          title="Data Monitoring"
          value={stats.activeMonitoring}
          subtitle="Total pencatatan"
          icon={Activity}
          variant="success"
        />
        <StatCard
          title="Peringatan Kritis"
          value={stats.criticalAlerts}
          subtitle="Perlu penanganan"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Volume Air"
          value={`${(stats.waterVolume / 1000000).toFixed(2)} jt`}
          subtitle="m³ terdistribusi"
          icon={Droplets}
          variant="primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterLevelChart />
        <DischargeChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AreaDistributionChart />
        </div>
        <div className="lg:col-span-2">
          <AlertsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
