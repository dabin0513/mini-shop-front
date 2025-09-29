import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bell, Package, Truck, ShoppingCart, AlertTriangle, X, Check } from "lucide-react";

interface Notification {
  id: number;
  type: 'order' | 'shipping' | 'promotion' | 'inventory' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: number) => void;
}

export function NotificationPanel({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification 
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<string>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap = {
      order: ShoppingCart,
      shipping: Truck,
      promotion: Bell,
      inventory: Package,
      system: AlertTriangle
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'text-red-600';
    
    const colorMap = {
      order: 'text-blue-600',
      shipping: 'text-green-600',
      promotion: 'text-purple-600',
      inventory: 'text-yellow-600',
      system: 'text-gray-600'
    };
    return colorMap[type] || 'text-gray-600';
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const priorityConfig = {
      low: { label: '낮음', variant: 'secondary' as const },
      medium: { label: '보통', variant: 'default' as const },
      high: { label: '높음', variant: 'destructive' as const }
    };
    return priorityConfig[priority];
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={onMarkAllAsRead}>
            모두 읽음으로 표시
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          전체 ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          읽지 않음 ({unreadCount})
        </Button>
        <Button
          variant={filter === 'order' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('order')}
        >
          주문
        </Button>
        <Button
          variant={filter === 'shipping' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('shipping')}
        >
          배송
        </Button>
        <Button
          variant={filter === 'promotion' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('promotion')}
        >
          프로모션
        </Button>
        <Button
          variant={filter === 'inventory' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('inventory')}
        >
          재고
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">알림이 없습니다</h2>
          <p className="text-gray-600">새로운 알림이 있으면 여기에 표시됩니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => {
            const Icon = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type, notification.priority);
            const priorityBadge = getPriorityBadge(notification.priority);

            return (
              <Card 
                key={notification.id} 
                className={`${!notification.read ? 'border-l-4 border-l-primary bg-blue-50/30' : ''} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1 ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={priorityBadge.variant} className="text-xs">
                            {priorityBadge.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'} mb-3`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            읽음으로 표시
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteNotification(notification.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3 mr-1" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}