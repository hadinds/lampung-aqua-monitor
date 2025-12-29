import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockAreas } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on status
const createCustomIcon = (status: 'active' | 'maintenance' | 'inactive') => {
  const colors = {
    active: '#22c55e',
    maintenance: '#f59e0b',
    inactive: '#6b7280',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[status]};
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
};

const MapPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const statusColors = {
    active: 'bg-success',
    maintenance: 'bg-warning',
    inactive: 'bg-muted-foreground',
  };

  const statusLabels = {
    active: 'Aktif',
    maintenance: 'Pemeliharaan',
    inactive: 'Tidak Aktif',
  };

  // Center of Lampung province
  const lampungCenter: [number, number] = [-5.0, 105.0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Peta Irigasi</h2>
        <p className="text-muted-foreground mt-1">
          Visualisasi lokasi daerah irigasi dan infrastruktur
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px]">
                <MapContainer
                  center={lampungCenter}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mockAreas.map((area) => (
                    <Marker
                      key={area.id}
                      position={[area.lat, area.lng]}
                      icon={createCustomIcon(area.status)}
                      eventHandlers={{
                        click: () => setSelectedArea(area.id),
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-semibold text-sm">{area.name}</h3>
                          <p className="text-xs text-gray-600">{area.location}</p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>Luas: {area.totalArea.toLocaleString()} Ha</p>
                            <p>Saluran: {area.canalsCount}</p>
                            <p>Pintu Air: {area.gatesCount}</p>
                            <p className="flex items-center gap-1">
                              Status: 
                              <span className={cn(
                                'px-1.5 py-0.5 rounded text-white text-xs',
                                area.status === 'active' && 'bg-green-500',
                                area.status === 'maintenance' && 'bg-amber-500',
                                area.status === 'inactive' && 'bg-gray-500'
                              )}>
                                {statusLabels[area.status]}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
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
            <CardContent className="space-y-2">
              {mockAreas.map((area) => (
                <div
                  key={area.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors',
                    selectedArea === area.id && 'bg-primary/10 ring-1 ring-primary/30'
                  )}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <span className={cn('w-2.5 h-2.5 rounded-full', statusColors[area.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{area.name}</p>
                    <p className="text-xs text-muted-foreground">{area.location}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Klik pada marker di peta untuk melihat detail daerah irigasi dan data monitoring terkini.
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
