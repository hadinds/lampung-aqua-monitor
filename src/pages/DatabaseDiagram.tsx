import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mermaid from "mermaid";

const diagramDefinition = `erDiagram
    irrigation_areas {
        uuid id PK
        text name
        text location
        numeric total_area
        numeric lat
        numeric lng
        text status
        timestamp created_at
        timestamp updated_at
    }
    
    canals {
        uuid id PK
        uuid area_id FK
        text name
        numeric length
        numeric width
        numeric capacity
        text status
        date last_inspection
        timestamp created_at
        timestamp updated_at
    }
    
    gates {
        uuid id PK
        uuid canal_id FK
        text name
        text type
        text status
        text condition
        date last_maintenance
        timestamp created_at
        timestamp updated_at
    }
    
    monitoring_data {
        uuid id PK
        uuid gate_id FK
        uuid recorded_by FK
        numeric water_level
        numeric discharge
        text condition
        text notes
        text video_url
        timestamp recorded_at
    }
    
    profiles {
        uuid id PK
        uuid user_id FK
        text name
        text username
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        app_role role
        timestamp created_at
    }
    
    alerts {
        uuid id PK
        text title
        text type
        text location
        boolean is_read
        timestamp created_at
    }
    
    auth_users {
        uuid id PK
        text email
    }
    
    irrigation_areas ||--o{ canals : "has many"
    canals ||--o{ gates : "has many"
    gates ||--o{ monitoring_data : "has many"
    auth_users ||--o| profiles : "has one"
    auth_users ||--o{ user_roles : "has many"
    auth_users ||--o{ monitoring_data : "records"`;

export default function DatabaseDiagram() {
  const navigate = useNavigate();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      er: {
        diagramPadding: 20,
        layoutDirection: "TB",
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        useMaxWidth: false,
      },
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render("database-er-diagram", diagramDefinition);
        setSvgContent(svg);
      } catch (error) {
        console.error("Error rendering mermaid diagram:", error);
      }
    };

    renderDiagram();
  }, []);

  const downloadAsSVG = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "database-diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsPNG = async () => {
    if (!svgContent) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
      }

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "database-diagram.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Database Schema Diagram</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entity Relationship Diagram</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadAsSVG}>
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
              <Button onClick={downloadAsPNG}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto bg-white rounded-lg p-4 border">
              <div
                ref={mermaidRef}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="min-w-[800px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Keterangan Relasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>irrigation_areas → canals:</strong> Satu daerah irigasi memiliki banyak saluran</p>
                <p><strong>canals → gates:</strong> Satu saluran memiliki banyak pintu air</p>
                <p><strong>gates → monitoring_data:</strong> Satu pintu air memiliki banyak data monitoring</p>
              </div>
              <div className="space-y-2">
                <p><strong>auth_users → profiles:</strong> Satu user memiliki satu profil</p>
                <p><strong>auth_users → user_roles:</strong> Satu user dapat memiliki banyak role</p>
                <p><strong>auth_users → monitoring_data:</strong> User mencatat data monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
