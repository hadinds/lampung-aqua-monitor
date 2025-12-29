export type UserRole = 'admin' | 'field_officer' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface IrrigationArea {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  status: 'active' | 'maintenance' | 'inactive';
  canalsCount: number;
  gatesCount: number;
  createdAt: string;
  lat: number;
  lng: number;
}

export interface Canal {
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  length: number;
  width: number;
  capacity: number;
  status: 'good' | 'needs_repair' | 'critical';
  lastInspection: string;
}

export interface Gate {
  id: string;
  name: string;
  canalId: string;
  canalName: string;
  type: 'intake' | 'distribution' | 'drainage';
  status: 'open' | 'closed' | 'partial';
  condition: 'good' | 'fair' | 'poor';
  lastMaintenance: string;
}

export interface MonitoringData {
  id: string;
  gateId: string;
  gateName: string;
  waterLevel: number;
  discharge: number;
  condition: 'normal' | 'warning' | 'critical';
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export interface DashboardStats {
  totalAreas: number;
  totalCanals: number;
  totalGates: number;
  activeMonitoring: number;
  criticalAlerts: number;
  waterVolume: number;
}
