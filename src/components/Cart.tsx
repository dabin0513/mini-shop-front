import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: (items: CartItem[]) => void;
}

export function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>(cartItems.map(item => item.id));

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === cartItems.length ? [] : cartItems.map(item => item.id)
    );
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000;
  const finalTotal = totalPrice + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">장바구니가 비어있습니다</h2>
          <p className="text-gray-600 mb-6">원하는 상품을 장바구니에 담아보세요</p>
          <Button onClick={() => window.history.back()}>
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-primary"
              />
              <span className="font-medium">
                전체선택 ({selectedItems.length}/{cartItems.length})
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                selectedItems.forEach(id => onRemoveItem(id));
                setSelectedItems([]);
              }}
              disabled={selectedItems.length === 0}
            >
              선택삭제
            </Button>
          </div>

          {/* Cart Items List */}
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-4 h-4 text-primary"
                  />
                  
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500">{item.brand}</div>
                    <h3 className="font-medium truncate">{item.name}</h3>
                    
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex space-x-2 mt-1">
                        {item.selectedSize && (
                          <Badge variant="outline" className="text-xs">
                            {item.selectedSize}
                          </Badge>
                        )}
                        {item.selectedColor && (
                          <Badge variant="outline" className="text-xs">
                            {item.selectedColor}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-lg font-semibold text-primary mt-2">
                      {item.price.toLocaleString()}원
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>상품금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="text-sm">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">무료</span>
                  ) : (
                    `${deliveryFee.toLocaleString()}원`
                  )}
                </span>
              </div>
              
              {totalPrice > 0 && totalPrice < 50000 && (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  {(50000 - totalPrice).toLocaleString()}원 더 구매하시면 무료배송!
                </div>
              )}
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>총 결제금액</span>
                <span className="text-primary">{finalTotal.toLocaleString()}원</span>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => onCheckout(selectedCartItems)}
                disabled={selectedItems.length === 0}
              >
                주문하기 ({selectedItems.length}개)
              </Button>
              
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>• 결제 시 할인 및 적립 혜택이 적용됩니다</p>
                <p>• 50,000원 이상 구매 시 무료배송</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}