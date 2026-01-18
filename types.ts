export interface Incident {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  sourceIp: string;
  target: string;
  timestamp: string;
  type: string;
}

export interface SystemMetrics {
  cpu: number;
  network: number;
  firewall: number;
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
}