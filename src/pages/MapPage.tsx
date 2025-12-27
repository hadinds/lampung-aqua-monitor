import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, Info } from 'lucide-react';
import { mockAreas } from '@/data/mockData';
import { cn } from '@/lib/utils';

const MapPage: React.FC = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showMap, setShowMap] = useState(false);

  const statusColors = {
    active: 'bg-success',
    maintenance: 'bg-warning',
    inactive: 'bg-muted-foreground',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Peta Irigasi</h2>
        <p className="text-muted-foreground mt-1">
          Visualisasi lokasi daerah irigasi dan infrastruktur
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Placeholder / Token Input */}
        <div className="lg:col-span-3">
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-0">
              {!showMap ? (
                <div className="h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <MapIcon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    Integrasi Peta
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Masukkan Mapbox Public Token untuk menampilkan peta interaktif dengan lokasi daerah irigasi.
                  </p>
                  <div className="w-full max-w-md space-y-4">
                    <div className="input-group">
                      <Label htmlFor="mapboxToken">Mapbox Public Token</Label>
                      <Input
                        id="mapboxToken"
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                        placeholder="pk.eyJ1Ijo..."
                      />
                    </div>
                    <Button 
                      onClick={() => setShowMap(true)} 
                      className="w-full"
                      disabled={!mapboxToken}
                    >
                      Tampilkan Peta
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Dapatkan token gratis di{' '}
                      <a 
                        href="https://mapbox.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        mapbox.com
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[500px] bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Peta akan ditampilkan di sini dengan token yang valid
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowMap(false)}
                    >
                      Ubah Token
                    </Button>
                  </div>
                </div>
              )}
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
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
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
