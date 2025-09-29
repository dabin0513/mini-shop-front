import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Edit, Plus, AlertTriangle, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  soldCount: number;
  status: 'active' | 'inactive';
}

interface InventoryManagementProps {
  products: Product[];
  onUpdateStock: (productId: number, newStock: number) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: () => void;
}

export function InventoryManagement({ 
  products, 
  onUpdateStock, 
  onUpdateProduct, 
  onAddProduct 
}: InventoryManagementProps) {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [editingStock, setEditingStock] = useState<{ [key: number]: number }>({});

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const activeProducts = products.filter(p => p.status === 'active');

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: '품절', variant: 'destructive' as const, icon: AlertTriangle };
    } else if (product.stock <= product.lowStockThreshold) {
      return { label: '부족', variant: 'secondary' as const, icon: AlertTriangle };
    } else {
      return { label: '정상', variant: 'default' as const, icon: Package };
    }
  };

  const handleStockUpdate = (productId: number) => {
    const newStock = editingStock[productId];
    if (newStock !== undefined && newStock >= 0) {
      onUpdateStock(productId, newStock);
      setEditingStock(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  const inventoryStats = {
    totalProducts: products.length,
    activeProducts: activeProducts.length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">재고 관리</h1>
        <Button onClick={onAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          상품 추가
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="products">전체 상품</TabsTrigger>
          <TabsTrigger value="low-stock">재고 부족</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{inventoryStats.totalProducts}</div>
                <div className="text-sm text-gray-600">전체 상품</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{inventoryStats.activeProducts}</div>
                <div className="text-sm text-gray-600">판매 중</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</div>
                <div className="text-sm text-gray-600">재고 부족</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
                <div className="text-sm text-gray-600">품절</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-600">
                  {inventoryStats.totalValue.toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">재고 가치</div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  재고 부족 경고
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="secondary">
                        재고: {product.stock}개
                      </Badge>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="text-sm text-gray-600">
                      외 {lowStockProducts.length - 5}개 상품이 더 있습니다.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>전체 상품 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상품</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>재고</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>판매량</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => {
                    const stockStatus = getStockStatus(product);
                    const Icon = stockStatus.icon;
                    const isEditing = editingStock[product.id] !== undefined;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price.toLocaleString()}원</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                value={editingStock[product.id]}
                                onChange={(e) => setEditingStock(prev => ({
                                  ...prev,
                                  [product.id]: parseInt(e.target.value) || 0
                                }))}
                                className="w-20"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleStockUpdate(product.id)}
                              >
                                저장
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span>{product.stock}개</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStock(prev => ({
                                  ...prev,
                                  [product.id]: product.stock
                                }))}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant} className="flex items-center gap-1 w-fit">
                            <Icon className="w-3 h-3" />
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.soldCount}개</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onUpdateProduct(product)}
                          >
                            수정
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                재고 부족 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">재고가 부족한 상품이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품</TableHead>
                      <TableHead>현재 재고</TableHead>
                      <TableHead>경고 기준</TableHead>
                      <TableHead>권장 발주량</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                            {product.stock}개
                          </Badge>
                        </TableCell>
                        <TableCell>{product.lowStockThreshold}개</TableCell>
                        <TableCell>
                          {Math.max(50, product.soldCount * 0.3).toFixed(0)}개
                        </TableCell>
                        <TableCell>
                          <Button size="sm">재고 보충</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 재고 현황</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock chart data */}
                <div className="space-y-4">
                  {['의류', '신발', '전자제품', '액세서리'].map(category => {
                    const categoryProducts = products.filter(p => p.category === category);
                    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                    
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span>{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (totalStock / 1000) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{totalStock}개</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>인기 상품 TOP 5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .sort((a, b) => b.soldCount - a.soldCount)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                          {index + 1}
                        </div>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.soldCount}개 판매</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}