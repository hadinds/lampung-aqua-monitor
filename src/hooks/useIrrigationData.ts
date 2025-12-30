import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Database types - simplified to avoid nested type issues
export interface DbIrrigationArea {
  id: string;
  name: string;
  location: string;
  total_area: number;
  status: string;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
}

export interface DbCanal {
  id: string;
  area_id: string;
  name: string;
  length: number;
  width: number;
  capacity: number;
  status: string;
  last_inspection: string | null;
  created_at: string;
  updated_at: string;
  area_name?: string;
}

export interface DbGate {
  id: string;
  canal_id: string;
  name: string;
  type: string;
  status: string;
  condition: string;
  last_maintenance: string | null;
  created_at: string;
  updated_at: string;
  canal_name?: string;
}

export interface DbMonitoringData {
  id: string;
  gate_id: string;
  water_level: number;
  discharge: number;
  condition: string;
  recorded_by: string | null;
  notes: string | null;
  recorded_at: string;
  gate_name?: string;
}

export interface DbAlert {
  id: string;
  type: string;
  title: string;
  location: string;
  is_read: boolean;
  created_at: string;
}

// Hook for Irrigation Areas
export function useIrrigationAreas() {
  const [areas, setAreas] = useState<DbIrrigationArea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('irrigation_areas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Gagal memuat data daerah irigasi', variant: 'destructive' });
    } else {
      setAreas((data as DbIrrigationArea[]) || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const createArea = async (area: Omit<DbIrrigationArea, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('irrigation_areas')
      .insert(area)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Gagal menambah daerah irigasi', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Berhasil', description: 'Daerah irigasi berhasil ditambahkan' });
    setAreas([data as DbIrrigationArea, ...areas]);
    return data;
  };

  const updateArea = async (id: string, area: Partial<DbIrrigationArea>) => {
    const { data, error } = await supabase
      .from('irrigation_areas')
      .update(area)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Gagal memperbarui daerah irigasi', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Berhasil', description: 'Daerah irigasi berhasil diperbarui' });
    setAreas(areas.map(a => a.id === id ? data as DbIrrigationArea : a));
    return data;
  };

  const deleteArea = async (id: string) => {
    const { error } = await supabase
      .from('irrigation_areas')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Gagal menghapus daerah irigasi', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Berhasil', description: 'Daerah irigasi berhasil dihapus' });
    setAreas(areas.filter(a => a.id !== id));
    return true;
  };

  return { areas, loading, fetchAreas, createArea, updateArea, deleteArea };
}

// Hook for Canals
export function useCanals() {
  const [canals, setCanals] = useState<DbCanal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCanals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('canals')
      .select('*, irrigation_areas(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Gagal memuat data saluran', variant: 'destructive' });
    } else {
      const mapped = (data || []).map((c: any) => ({
        ...c,
        area_name: c.irrigation_areas?.name || '',
        irrigation_areas: undefined
      })) as DbCanal[];
      setCanals(mapped);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchCanals();
  }, [fetchCanals]);

  const createCanal = async (canal: { area_id: string; name: string; length: number; width: number; capacity: number; status: string; last_inspection: string | null }) => {
    const { data, error } = await supabase.from('canals').insert(canal).select('*, irrigation_areas(name)').single();
    if (error) { toast({ title: 'Error', description: 'Gagal menambah saluran', variant: 'destructive' }); return null; }
    toast({ title: 'Berhasil', description: 'Saluran berhasil ditambahkan' });
    const newCanal = { ...(data as any), area_name: (data as any).irrigation_areas?.name || '' } as DbCanal;
    setCanals([newCanal, ...canals]);
    return newCanal;
  };

  const updateCanal = async (id: string, canal: Partial<DbCanal>) => {
    const { data, error } = await supabase.from('canals').update(canal).eq('id', id).select('*, irrigation_areas(name)').single();
    if (error) { toast({ title: 'Error', description: 'Gagal memperbarui saluran', variant: 'destructive' }); return null; }
    toast({ title: 'Berhasil', description: 'Saluran berhasil diperbarui' });
    const updated = { ...(data as any), area_name: (data as any).irrigation_areas?.name || '' } as DbCanal;
    setCanals(canals.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCanal = async (id: string) => {
    const { error } = await supabase.from('canals').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: 'Gagal menghapus saluran', variant: 'destructive' }); return false; }
    toast({ title: 'Berhasil', description: 'Saluran berhasil dihapus' });
    setCanals(canals.filter(c => c.id !== id));
    return true;
  };

  return { canals, loading, fetchCanals, createCanal, updateCanal, deleteCanal };
}

// Hook for Gates
export function useGates() {
  const [gates, setGates] = useState<DbGate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gates').select('*, canals(name)').order('created_at', { ascending: false });
    if (error) { toast({ title: 'Error', description: 'Gagal memuat data pintu air', variant: 'destructive' }); }
    else {
      const mapped = (data || []).map((g: any) => ({ ...g, canal_name: g.canals?.name || '', canals: undefined })) as DbGate[];
      setGates(mapped);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchGates(); }, [fetchGates]);

  const createGate = async (gate: { canal_id: string; name: string; type: string; status: string; condition: string; last_maintenance: string | null }) => {
    const { data, error } = await supabase.from('gates').insert(gate).select('*, canals(name)').single();
    if (error) { toast({ title: 'Error', description: 'Gagal menambah pintu air', variant: 'destructive' }); return null; }
    toast({ title: 'Berhasil', description: 'Pintu air berhasil ditambahkan' });
    const newGate = { ...(data as any), canal_name: (data as any).canals?.name || '' } as DbGate;
    setGates([newGate, ...gates]);
    return newGate;
  };

  const updateGate = async (id: string, gate: Partial<DbGate>) => {
    const { data, error } = await supabase.from('gates').update(gate).eq('id', id).select('*, canals(name)').single();
    if (error) { toast({ title: 'Error', description: 'Gagal memperbarui pintu air', variant: 'destructive' }); return null; }
    toast({ title: 'Berhasil', description: 'Pintu air berhasil diperbarui' });
    const updated = { ...(data as any), canal_name: (data as any).canals?.name || '' } as DbGate;
    setGates(gates.map(g => g.id === id ? updated : g));
    return updated;
  };

  const deleteGate = async (id: string) => {
    const { error } = await supabase.from('gates').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: 'Gagal menghapus pintu air', variant: 'destructive' }); return false; }
    toast({ title: 'Berhasil', description: 'Pintu air berhasil dihapus' });
    setGates(gates.filter(g => g.id !== id));
    return true;
  };

  return { gates, loading, fetchGates, createGate, updateGate, deleteGate };
}

// Hook for Monitoring Data
export function useMonitoringData() {
  const [data, setData] = useState<DbMonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: monitoringData, error } = await supabase.from('monitoring_data').select('*, gates(name)').order('recorded_at', { ascending: false }).limit(100);
    if (error) { toast({ title: 'Error', description: 'Gagal memuat data monitoring', variant: 'destructive' }); }
    else {
      const mapped = (monitoringData || []).map((m: any) => ({ ...m, gate_name: m.gates?.name || '', gates: undefined })) as DbMonitoringData[];
      setData(mapped);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createMonitoringData = async (monitoringData: { gate_id: string; water_level: number; discharge: number; condition: string; recorded_by: string | null; notes: string | null }) => {
    const { data: newData, error } = await supabase.from('monitoring_data').insert(monitoringData).select('*, gates(name)').single();
    if (error) { toast({ title: 'Error', description: 'Gagal menyimpan data monitoring', variant: 'destructive' }); return null; }
    toast({ title: 'Berhasil', description: 'Data monitoring berhasil disimpan' });
    const newItem = { ...(newData as any), gate_name: (newData as any).gates?.name || '' } as DbMonitoringData;
    setData([newItem, ...data]);
    return newItem;
  };

  return { data, loading, fetchData, createMonitoringData };
}

// Hook for Alerts
export function useAlerts() {
  const [alerts, setAlerts] = useState<DbAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) { toast({ title: 'Error', description: 'Gagal memuat notifikasi', variant: 'destructive' }); }
    else { setAlerts((data as DbAlert[]) || []); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);
  return { alerts, loading, fetchAlerts };
}

// Hook for Dashboard Stats
export function useDashboardStats() {
  const [stats, setStats] = useState({ totalAreas: 0, totalCanals: 0, totalGates: 0, activeMonitoring: 0, criticalAlerts: 0, waterVolume: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const [areasRes, canalsRes, gatesRes, monitoringRes, alertsRes] = await Promise.all([
      supabase.from('irrigation_areas').select('id', { count: 'exact', head: true }),
      supabase.from('canals').select('id', { count: 'exact', head: true }),
      supabase.from('gates').select('id', { count: 'exact', head: true }),
      supabase.from('monitoring_data').select('id', { count: 'exact', head: true }),
      supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('type', 'critical').eq('is_read', false)
    ]);
    setStats({ totalAreas: areasRes.count || 0, totalCanals: canalsRes.count || 0, totalGates: gatesRes.count || 0, activeMonitoring: monitoringRes.count || 0, criticalAlerts: alertsRes.count || 0, waterVolume: 2500000 });
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  return { stats, loading, fetchStats };
}
