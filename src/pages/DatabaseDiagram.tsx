import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { useRef } from "react";

const DatabaseDiagram = () => {
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (diagramRef.current) {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(diagramRef.current!, {
          backgroundColor: '#ffffff',
          scale: 2,
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'database-er-diagram.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      });
    }
  };

  const tables = [
    {
      name: 'irrigation_areas',
      color: 'bg-blue-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'name', type: 'TEXT', key: '' },
        { name: 'location', type: 'TEXT', key: '' },
        { name: 'total_area', type: 'NUMERIC', key: '' },
        { name: 'lat', type: 'NUMERIC', key: '' },
        { name: 'lng', type: 'NUMERIC', key: '' },
        { name: 'status', type: 'TEXT', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
    {
      name: 'canals',
      color: 'bg-green-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'name', type: 'TEXT', key: '' },
        { name: 'area_id', type: 'UUID', key: 'FK → irrigation_areas' },
        { name: 'length', type: 'NUMERIC', key: '' },
        { name: 'width', type: 'NUMERIC', key: '' },
        { name: 'capacity', type: 'NUMERIC', key: '' },
        { name: 'status', type: 'TEXT', key: '' },
        { name: 'last_inspection', type: 'DATE', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
    {
      name: 'gates',
      color: 'bg-purple-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'name', type: 'TEXT', key: '' },
        { name: 'canal_id', type: 'UUID', key: 'FK → canals' },
        { name: 'type', type: 'TEXT', key: '' },
        { name: 'status', type: 'TEXT', key: '' },
        { name: 'condition', type: 'TEXT', key: '' },
        { name: 'last_maintenance', type: 'DATE', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
    {
      name: 'monitoring_data',
      color: 'bg-orange-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'gate_id', type: 'UUID', key: 'FK → gates' },
        { name: 'water_level', type: 'NUMERIC', key: '' },
        { name: 'discharge', type: 'NUMERIC', key: '' },
        { name: 'condition', type: 'TEXT', key: '' },
        { name: 'notes', type: 'TEXT', key: '' },
        { name: 'video_url', type: 'TEXT', key: '' },
        { name: 'recorded_at', type: 'TIMESTAMPTZ', key: '' },
        { name: 'recorded_by', type: 'UUID', key: 'FK → auth.users' },
      ]
    },
    {
      name: 'profiles',
      color: 'bg-teal-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'user_id', type: 'UUID', key: 'FK → auth.users' },
        { name: 'name', type: 'TEXT', key: '' },
        { name: 'username', type: 'TEXT', key: '' },
        { name: 'avatar_url', type: 'TEXT', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
    {
      name: 'user_roles',
      color: 'bg-red-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'user_id', type: 'UUID', key: 'FK → auth.users' },
        { name: 'role', type: 'APP_ROLE', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
    {
      name: 'alerts',
      color: 'bg-amber-600',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK' },
        { name: 'title', type: 'TEXT', key: '' },
        { name: 'type', type: 'TEXT', key: '' },
        { name: 'location', type: 'TEXT', key: '' },
        { name: 'is_read', type: 'BOOLEAN', key: '' },
        { name: 'created_at', type: 'TIMESTAMPTZ', key: '' },
      ]
    },
  ];

  const TableCard = ({ table }: { table: typeof tables[0] }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[280px]">
      <div className={`${table.color} text-white px-4 py-2 font-bold text-sm flex items-center gap-2`}>
        <Database className="w-4 h-4" />
        {table.name}
      </div>
      <div className="divide-y divide-gray-100">
        {table.columns.map((col, idx) => (
          <div key={idx} className="px-4 py-1.5 flex items-center text-xs">
            <span className="font-medium text-gray-800 w-32">{col.name}</span>
            <span className="text-gray-500 w-28">{col.type}</span>
            {col.key && (
              <span className={`text-xs px-2 py-0.5 rounded ${
                col.key === 'PK' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {col.key}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database ER Diagram</h1>
            <p className="text-gray-600 mt-1">SIMONI - Sistem Informasi Monitoring Irigasi</p>
          </div>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </div>

        <div ref={diagramRef} className="bg-white p-8 rounded-xl shadow-sm">
          {/* Main Flow: irrigation_areas -> canals -> gates -> monitoring_data */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              🌊 Alur Data Irigasi (irrigation_areas → canals → gates → monitoring_data)
            </h2>
            <div className="flex flex-wrap gap-6 items-start">
              <TableCard table={tables[0]} />
              <div className="flex items-center text-2xl text-gray-400 self-center">→</div>
              <TableCard table={tables[1]} />
              <div className="flex items-center text-2xl text-gray-400 self-center">→</div>
              <TableCard table={tables[2]} />
              <div className="flex items-center text-2xl text-gray-400 self-center">→</div>
              <TableCard table={tables[3]} />
            </div>
          </div>

          {/* User Management */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              👤 Manajemen User (profiles & user_roles)
            </h2>
            <div className="flex flex-wrap gap-6 items-start">
              <TableCard table={tables[4]} />
              <TableCard table={tables[5]} />
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              🔔 Notifikasi (alerts)
            </h2>
            <div className="flex flex-wrap gap-6 items-start">
              <TableCard table={tables[6]} />
            </div>
          </div>

          {/* Relationships Legend */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-700 mb-3">📊 Relasi Antar Tabel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• <strong>irrigation_areas</strong> 1 ─ ∞ <strong>canals</strong> (area_id)</div>
              <div>• <strong>canals</strong> 1 ─ ∞ <strong>gates</strong> (canal_id)</div>
              <div>• <strong>gates</strong> 1 ─ ∞ <strong>monitoring_data</strong> (gate_id)</div>
              <div>• <strong>auth.users</strong> 1 ─ 1 <strong>profiles</strong> (user_id)</div>
              <div>• <strong>auth.users</strong> 1 ─ ∞ <strong>user_roles</strong> (user_id)</div>
              <div>• <strong>auth.users</strong> 1 ─ ∞ <strong>monitoring_data</strong> (recorded_by)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDiagram;
