import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { DbIrrigationArea } from '@/hooks/useIrrigationData';

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [areas, setAreas] = useState<DbIrrigationArea[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColors: Record<string, string> = {
    active: 'bg-success',
    maintenance: 'bg-warning',
    inactive: 'bg-muted-foreground',
  };

  const statusLabels: Record<string, string> = {
    active: 'Aktif',
    maintenance: 'Pemeliharaan',
    inactive: 'Tidak Aktif',
  };

  const markerColors: Record<string, string> = {
    active: '#22c55e',
    maintenance: '#f59e0b',
    inactive: '#6b7280',
  };

  // Center of Lampung province
  const lampungCenter: [number, number] = [-5.0, 105.0];

  // Fetch areas from database
  const fetchAreas = async () => {
    const { data, error } = await supabase
      .from('irrigation_areas')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setAreas(data as DbIrrigationArea[]);
    }
    setLoading(false);
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(lampungCenter, 8);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch data initially
  useEffect(() => {
    fetchAreas();
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('irrigation_areas_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'irrigation_areas',
        },
        () => {
          fetchAreas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update markers when areas change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    areas.forEach((area) => {
      if (area.lat && area.lng) {
        const color = markerColors[area.status] || markerColors.inactive;
        
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });

        const marker = L.marker([area.lat, area.lng], { icon: customIcon }).addTo(mapInstanceRef.current!);
        
        const statusBgColor = markerColors[area.status] || markerColors.inactive;
        const statusLabel = statusLabels[area.status] || 'Tidak Aktif';
        
        marker.bindPopup(`
          <div style="padding: 4px; min-width: 180px;">
            <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0;">${area.name}</h3>
            <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${area.location}</p>
            <div style="font-size: 12px; line-height: 1.6;">
              <p style="margin: 0;">Luas: ${area.total_area.toLocaleString()} Ha</p>
              <p style="margin: 4px 0 0 0; display: flex; align-items: center; gap: 4px;">
                Status: 
                <span style="
                  background-color: ${statusBgColor};
                  color: white;
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-size: 11px;
                ">${statusLabel}</span>
              </p>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedArea(area.id);
        });

        markersRef.current.push(marker);
      }
    });
  }, [areas]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Peta Irigasi</h2>
        <p className="text-muted-foreground mt-1">
          Visualisasi lokasi daerah irigasi dan infrastruktur (Realtime)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div 
                ref={mapRef} 
                className="h-[500px] w-full"
                style={{ zIndex: 1 }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Legend & Areas List */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-heading">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm">Aktif</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm">Pemeliharaan</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-sm">Tidak Aktif</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-heading">Daerah Irigasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : areas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada data daerah irigasi
                </p>
              ) : (
                areas.map((area) => (
                  <div
                    key={area.id}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors',
                      selectedArea === area.id && 'bg-primary/10 ring-1 ring-primary/30'
                    )}
                    onClick={() => {
                      setSelectedArea(area.id);
                      if (mapInstanceRef.current && area.lat && area.lng) {
                        mapInstanceRef.current.setView([area.lat, area.lng], 12);
                      }
                    }}
                  >
                    <span className={cn('w-2.5 h-2.5 rounded-full', statusColors[area.status] || 'bg-muted-foreground')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{area.name}</p>
                      <p className="text-xs text-muted-foreground">{area.location}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Klik pada marker di peta untuk melihat detail daerah irigasi. Data diperbarui secara realtime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;