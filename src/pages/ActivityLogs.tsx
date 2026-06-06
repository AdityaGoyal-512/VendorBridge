import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, User, CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';

const logs = [
  { id: 1, user: 'Jane Smith', action: 'Approved Purchase Order', target: 'PO-2026-004', time: '10 minutes ago', type: 'success' },
  { id: 2, user: 'John Doe', action: 'Created new RFQ', target: 'RFQ-2026-092', time: '1 hour ago', type: 'create' },
  { id: 3, user: 'System', action: 'Auto-flagged Invoice', target: 'INV-2026-894', time: '2 hours ago', type: 'alert' },
  { id: 4, user: 'Alice Johnson', action: 'Added new Vendor', target: 'Prime Manufacturing', time: 'Yesterday at 4:30 PM', type: 'create' },
  { id: 5, user: 'Bob Wilson', action: 'Approved Quotation', target: 'QT-2026-105', time: 'Yesterday at 2:15 PM', type: 'success' },
];

export default function ActivityLogs() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Audit trail of all system activities.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <History className="w-5 h-5 mr-2 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="relative mt-1">
                  <div className="absolute top-8 left-1/2 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></div>
                  {log.type === 'success' && <CheckCircle className="w-5 h-5 text-success bg-white" />}
                  {log.type === 'create' && <PlusCircle className="w-5 h-5 text-primary bg-white" />}
                  {log.type === 'alert' && <AlertCircle className="w-5 h-5 text-danger bg-white" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">{log.user}</span> {log.action} <span className="font-semibold text-primary">{log.target}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
