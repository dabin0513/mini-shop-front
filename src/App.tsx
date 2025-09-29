import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { LoginForm } from "./components/LoginForm";
import { ProductList } from "./components/ProductList";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { OrderManagement } from "./components/OrderManagement";
import { InventoryManagement } from "./components/InventoryManagement";
import { ProductManagement } from "./components/ProductManagement";
import { NotificationPanel } from "./components/NotificationPanel";
import { Toaster, toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string; 
  category: string;
  stock: number;
  lowStockThreshold: number;
  soldCount: number;
  rating: number;
  reviews: number;
  status: "active" | "inactive";
  description?: string;
  features?: string[];
}

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
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
}

interface Notification {
  id: number;
  type: "order" | "shipping" | "promotion" | "inventory" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // mock
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "에센셜 화이트 티셔츠",
      brand: "UNIQLO",
      price: 19900,
      originalPrice: 29900,
      image: "https://images.unsplash.com/photo-1627342229908-71efbac25f08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NTkxMTM1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "clothing",
      stock: 45,
      lowStockThreshold: 10,
      soldCount: 156,
      rating: 4.5,
      reviews: 89,
      status: 'active'
    },
    {
      id: 2,
      name: "에어 맥스 270",
      brand: "NIKE",
      price: 159000,
      originalPrice: 179000,
      image: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NTkxMTYyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "shoes",
      stock: 23,
      lowStockThreshold: 15,
      soldCount: 234,
      rating: 4.8,
      reviews: 156,
      status: 'active'
    },
    {
      id: 3,
      name: "아이폰 15 Pro",
      brand: "Apple",
      price: 1550000,
      image: "https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTEwNjE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "electronics",
      stock: 12,
      lowStockThreshold: 5,
      soldCount: 89,
      rating: 4.9,
      reviews: 45,
      status: 'active'
    },
    {
      id: 4,
      name: "클래식 워치",
      brand: "CITIZEN",
      price: 280000,
      originalPrice: 350000,
      image: "https://images.unsplash.com/photo-1636289141131-389e44e981c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHN3YXRjaCUyMGx1eHVyeSUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTExNjIyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "accessories",
      stock: 8,
      lowStockThreshold: 10,
      soldCount: 67,
      rating: 4.6,
      reviews: 34,
      status: 'active'
    },
    {
      id: 5,
      name: "데님 재킷",
      brand: "LEVI'S",
      price: 89000,
      originalPrice: 129000,
      image: "https://images.unsplash.com/photo-1627342229908-71efbac25f08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NTkxMTM1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "clothing",
      stock: 0,
      lowStockThreshold: 5,
      soldCount: 123,
      rating: 4.7,
      reviews: 78,
      status: 'active'
    },
    {
      id: 6,
      name: "런닝화",
      brand: "ADIDAS",
      price: 120000,
      image: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NTkxMTYyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "shoes",
      stock: 34,
      lowStockThreshold: 20,
      soldCount: 189,
      rating: 4.4,
      reviews: 123,
      status: 'active'
    }
  ]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // mock
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      date: "2024-01-20",
      status: "delivered",
      items: [
        { id: 1, name: "에센셜 화이트 티셔츠", brand: "UNIQLO", price: 19900, quantity: 2, image: "https://images.unsplash.com/photo-1627342229908-71efbac25f08" }
      ],
      totalAmount: 42800,
      shippingAddress: "서울특별시 강남구 테헤란로 123",
      trackingNumber: "1234567890"
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-18",
      status: "shipped",
      items: [
        { id: 2, name: "에어 맥스 270", brand: "NIKE", price: 159000, quantity: 1, image: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942" }
      ],
      totalAmount: 159000,
      shippingAddress: "서울특별시 강남구 테헤란로 123",
      trackingNumber: "0987654321"
    }
  ]);

  // mock
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "order",
      title: "주문이 완료되었습니다",
      message: "주문번호 ORD-2024-001이 성공적으로 처리되었습니다.",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      priority: "medium"
    },
    {
      id: 2,
      type: "shipping",
      title: "상품이 배송 중입니다",
      message: "주문하신 상품이 배송을 시작했습니다. 운송장번호: 1234567890",
      timestamp: "2024-01-19T14:20:00Z",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "inventory",
      title: "재고 부족 알림",
      message: "데님 재킷의 재고가 부족합니다. 현재 재고: 0개",
      timestamp: "2024-01-18T09:15:00Z",
      read: true,
      priority: "high"
    },
    {
      id: 4,
      type: "promotion",
      title: "신규 할인 이벤트",
      message: "겨울 의류 30% 할인 이벤트가 시작되었습니다!",
      timestamp: "2024-01-17T12:00:00Z",
      read: false,
      priority: "low"
    }
  ]);


  const navigate = useNavigate();

  /** 로그인 */
  const handleLogin = (userData: User) => {
    setUser(userData);
    navigate("/products");
    toast.success(`안녕하세요, ${userData.name}님!`);
  };

  /** 로그아웃 */
  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    navigate("/login");
    toast.success("로그아웃되었습니다.");
  };

  /** 상품 상세 */
  const handleViewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
  };

  /** 장바구니 담기 */
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity,
      };
      setCartItems((prev) => [...prev, cartItem]);
    }
    toast.success(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  /** 장바구니 수량 변경 */
  const handleUpdateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  /** 장바구니 삭제 */
  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("상품이 장바구니에서 제거되었습니다.");
  };

  /** 주문하기 */
  const handleCheckout = (items: CartItem[]) => {
    if (!user) return;
    const newOrder: Order = {
      id: `ORD-2024-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 3000,
      shippingAddress: "서울특별시 강남구 테헤란로 123",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems((prev) => prev.filter((item) => !items.map((i) => i.id).includes(item.id)));
    setNotifications((prev) => [
      {
        id: notifications.length + 1,
        type: "order",
        title: "주문이 완료되었습니다",
        message: `주문번호 ${newOrder.id}이 성공적으로 처리되었습니다.`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
      ...prev,
    ]);
    navigate("/orders");
    toast.success("주문이 완료되었습니다!");
  };

  /** 주문 취소 */
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order))
    );
    toast.success("주문이 취소되었습니다.");
  };

  /** 재고 업데이트 */
  const handleUpdateStock = (productId: number, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    toast.success("재고가 업데이트되었습니다.");
  };

  /** 상품 수정 */
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    toast.success("상품 정보가 업데이트되었습니다.");
  };

  /** 상품 추가 */
  const handleAddProduct = (
    newProduct: Omit<Product, "id" | "soldCount" | "rating" | "reviews">
  ) => {
    const product: Product = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id)) + 1,
      soldCount: 0,
      rating: 0,
      reviews: 0,
    };
    setProducts((prev) => [...prev, product]);
    toast.success("새 상품이 추가되었습니다.");
  };

  /** 상품 삭제 */
  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("상품이 삭제되었습니다.");
  };

  /** 알림 제어 */
  const handleMarkNotificationAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("모든 알림을 읽음으로 표시했습니다.");
  };
  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("알림이 삭제되었습니다.");
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Header
          isLoggedIn={!!user}
          user={user}
          cartItems={cartItemsCount}
          notifications={unreadNotificationsCount}
          onLogout={handleLogout} currentPage={""} onPageChange={function (page: string): void {
            throw new Error("Function not implemented.");
          } }        />
      )}

      <main>
        <Routes>
          {/* 로그인 */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/products" /> : <LoginForm onLogin={handleLogin} />
            }
          />

          {/* 상품 목록 */}
          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                onViewDetail={handleViewProductDetail}
                onAddToCart={handleAddToCart}
              />
            }
          />

          {/* 상품 상세 */}
          <Route
            path="/products/:id"
            element={
              selectedProduct ? (
                <ProductDetail
                  product={selectedProduct}
                  onBack={() => navigate("/products")}
                  onAddToCart={handleAddToCart}
                />
              ) : (
                <Navigate to="/products" />
              )
            }
          />

          {/* 장바구니 */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            }
          />

          {/* 주문 관리 */}
          <Route
            path="/orders"
            element={
              <OrderManagement
                orders={orders}
                onViewOrderDetail={(order) => toast.info(`주문 상세: ${order.id}`)}
                onCancelOrder={handleCancelOrder}
              />
            }
          />

          {/* 상품 관리 (관리자 전용) */}
          <Route
            path="/admin/products"
            element={
              user?.role === "admin" ? (
                <ProductManagement
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              ) : (
                <Navigate to="/products" />
              )
            }
          />

          {/* 재고 관리 (관리자 전용) */}
          <Route
            path="/admin/inventory"
            element={
              user?.role === "admin" ? (
                <InventoryManagement
                  products={products}
                  onUpdateStock={handleUpdateStock}
                  onUpdateProduct={handleUpdateProduct}
                  onAddProduct={() => navigate("/admin/products")}
                />
              ) : (
                <Navigate to="/products" />
              )
            }
          />

          {/* 알림 */}
          <Route
            path="/notifications"
            element={
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onDeleteNotification={handleDeleteNotification}
              />
            }
          />

          {/* 기본 라우트 */}
          <Route path="*" element={<Navigate to={user ? "/products" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
