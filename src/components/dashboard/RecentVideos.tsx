import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ExternalLink, Clock } from "lucide-react";
import { useMonitoringData } from "@/hooks/useIrrigationData";

const RecentVideos: React.FC = () => {
  const { data, loading } = useMonitoringData();

  const videos = React.useMemo(() => {
    return data
      .filter((d) => !!d.video_url)
      .slice(0, 5);
  }, [data]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-heading">Video Monitoring Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Memuat...</div>
        ) : videos.length === 0 ? (
          <div className="text-sm text-muted-foreground">Belum ada link video pada data monitoring.</div>
        ) : (
          <div className="space-y-3">
            {videos.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.gate_name || "Pintu"}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(item.recorded_at).toLocaleString("id-ID")}
                  </p>
                </div>

                <a
                  href={item.video_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Video className="h-4 w-4" />
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentVideos;
