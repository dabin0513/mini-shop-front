import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, Truck, CheckCircle, XCircle, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OrderItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onViewOrderDetail: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
}

export function OrderManagement({ orders, onViewOrderDetail, onCancelOrder }: OrderManagementProps) {
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: '결제 대기', variant: 'secondary' as const, icon: Package },
      confirmed: { label: '주문 확인', variant: 'default' as const, icon: CheckCircle },
      shipped: { label: '배송 중', variant: 'default' as const, icon: Truck },
      delivered: { label: '배송 완료', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: '주문 취소', variant: 'destructive' as const, icon: XCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return ['pending', 'confirmed', 'shipped'].includes(order.status);
    return order.status === selectedTab;
  });

  const getOrderStats = () => {
    return {
      all: orders.length,
      active: orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  const stats = getOrderStats();

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">주문 내역이 없습니다</h2>
          <p className="text-gray-600 mb-6">첫 주문을 시작해보세요</p>
          <Button onClick={() => window.history.back()}>
            쇼핑하러 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">주문 관리</h1>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.all}</div>
            <div className="text-sm text-gray-600">전체 주문</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600">진행 중</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">배송 완료</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">주문 취소</div>
          </CardContent>
        </Card>
      </div>

      {/* Order Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">전체 ({stats.all})</TabsTrigger>
          <TabsTrigger value="active">진행중 ({stats.active})</TabsTrigger>
          <TabsTrigger value="delivered">완료 ({stats.delivered})</TabsTrigger>
          <TabsTrigger value="cancelled">취소 ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">해당하는 주문이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <CardTitle className="text-lg">주문번호: {order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-500">{order.date}</div>
                    </div>
                    {order.trackingNumber && (
                      <div className="text-sm text-gray-600">
                        운송장번호: {order.trackingNumber}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="text-sm text-gray-500">{item.brand}</div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">
                                {item.price.toLocaleString()}원 × {item.quantity}개
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            외 {order.items.length - 2}개 상품
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>총 주문금액</span>
                          <span className="text-lg font-semibold text-primary">
                            {order.totalAmount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          배송지: {order.shippingAddress}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onViewOrderDetail(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                          
                          {order.status === 'pending' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => onCancelOrder(order.id)}
                            >
                              주문취소
                            </Button>
                          )}
                          
                          {order.status === 'shipped' && (
                            <Button variant="outline" size="sm">
                              배송조회
                            </Button>
                          )}
                          
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              재주문
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}