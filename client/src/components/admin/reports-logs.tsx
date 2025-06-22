import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatWalletAddress } from "@/lib/wallet-utils";
import type { AuditLog } from "@shared/schema";

export function ReportsLogs() {
  const [activeTab, setActiveTab] = useState<"audit" | "security" | "activity">("audit");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: auditLogs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/audit-logs"],
    refetchInterval: 30000
  });

  // Mock security alerts data
  const securityAlerts = [
    {
      id: 1,
      type: "suspicious_activity",
      user: "Player123",
      description: "Unusual win rate detected (95% over 100 games)",
      severity: "high",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: "investigating"
    },
    {
      id: 2,
      type: "multi_account",
      user: "Player456",
      description: "Multiple accounts from same IP address",
      severity: "medium",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "resolved"
    },
    {
      id: 3,
      type: "bot_activity",
      user: "Player789",
      description: "Automated betting patterns detected",
      severity: "high",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      status: "pending"
    }
  ];

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      type: "large_win",
      user: "WhalePlayer",
      amount: "127.8 SOL",
      game: "Crash",
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: 2,
      type: "mass_withdrawal",
      user: "Player999",
      amount: "50.0 SOL",
      game: "Multiple",
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    }
  ];

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.targetUser && log.targetUser.toLowerCase().includes(searchTerm.toLowerCase())) ||
    log.adminWallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600";
      case "medium": return "bg-orange-600";
      case "low": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-600";
      case "investigating": return "bg-blue-600";
      case "pending": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const downloadLogs = (format: "csv" | "json") => {
    // TODO: Implement log download functionality
    console.log(`Downloading logs in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Reports & Logs</h2>
          <p className="text-gray-400">Monitor system activity and security events</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => downloadLogs("csv")}
            variant="ghost"
            className="text-[var(--gold)] hover:bg-[var(--gold)]/20"
          >
            <i className="fas fa-download mr-2"></i>
            Download CSV
          </Button>
          
          <Button
            onClick={() => downloadLogs("json")}
            variant="ghost"
            className="text-[var(--gold)] hover:bg-[var(--gold)]/20"
          >
            <i className="fas fa-download mr-2"></i>
            Download JSON
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "audit" ? "default" : "ghost"}
            onClick={() => setActiveTab("audit")}
            className={activeTab === "audit" ? "bg-[var(--gold)] text-[var(--midnight)]" : "text-gray-400"}
          >
            <i className="fas fa-clipboard-list mr-2"></i>
            Audit Logs
          </Button>
          
          <Button
            variant={activeTab === "security" ? "default" : "ghost"}
            onClick={() => setActiveTab("security")}
            className={activeTab === "security" ? "bg-red-600 text-white" : "text-gray-400"}
          >
            <i className="fas fa-shield-alt mr-2"></i>
            Security Alerts
          </Button>
          
          <Button
            variant={activeTab === "activity" ? "default" : "ghost"}
            onClick={() => setActiveTab("activity")}
            className={activeTab === "activity" ? "bg-blue-600 text-white" : "text-gray-400"}
          >
            <i className="fas fa-activity mr-2"></i>
            Recent Activity
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder={`Search ${activeTab} logs...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>

        {/* Content */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
                <p className="text-gray-400 mt-2">Loading audit logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-clipboard-list text-gray-500 text-2xl"></i>
                <p className="text-gray-400 mt-2">No audit logs found</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className="bg-[var(--gold)] text-[var(--midnight)]">
                          {log.action.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Admin: {formatWalletAddress(log.adminWallet)}
                        </span>
                        {log.targetUser && (
                          <span className="text-sm text-gray-400">
                            Target: {log.targetUser}
                          </span>
                        )}
                      </div>
                      
                      {log.details && (
                        <p className="text-white mb-2">{log.details}</p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {log.timestamp ? formatTimeAgo(new Date(log.timestamp)) : 'Unknown time'}
                      </div>
                    </div>
                    
                    <i className="fas fa-clipboard-check text-[var(--gold)]"></i>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="bg-[var(--midnight)]/30 rounded-lg p-4 border-l-4 border-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        User: {alert.user}
                      </span>
                    </div>
                    
                    <p className="text-white mb-2">{alert.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-400/20">
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/20">
                      <i className="fas fa-check"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={activity.type === "large_win" ? "bg-green-600" : "bg-orange-600"}>
                        {activity.type.toUpperCase().replace("_", " ")}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        User: {activity.user}
                      </span>
                      <span className="text-sm text-gray-400">
                        Game: {activity.game}
                      </span>
                    </div>
                    
                    <p className="text-white mb-2">
                      Amount: <span className="text-[var(--gold)] font-bold">{activity.amount}</span>
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  
                  <i className={`fas ${activity.type === "large_win" ? "fa-trophy" : "fa-coins"} text-[var(--gold)]`}></i>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}