import { ShoppingCart, Bell, User, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  user: any;
  cartItems: number;
  notifications: number;
  onLogout: () => void;
}

export function Header({ 
  isLoggedIn, 
  user, 
  cartItems, 
  notifications,
  onLogout 
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate("/products")}
            >
              SHOPMATE
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="상품을 검색해보세요..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/products"
              className={`${
                currentPage === "/products"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-700 hover:text-primary"
              } pb-4 px-1 transition-colors`}
            >
              상품
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/orders"
                  className={`${
                    currentPage === "/orders"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  } pb-4 px-1 transition-colors`}
                >
                  주문관리
                </Link>
                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/products"
                      className={`${
                        currentPage === "/admin/products"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-700 hover:text-primary"
                      } pb-4 px-1 transition-colors`}
                    >
                      상품관리
                    </Link>
                    <Link
                      to="/admin/inventory"
                      className={`${
                        currentPage === "/admin/inventory"
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-700 hover:text-primary"
                      } pb-4 px-1 transition-colors`}
                    >
                      재고관리
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <button 
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 text-gray-700 hover:text-primary"
                >
                  <Bell className="w-6 h-6" />
                  {notifications > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                      {notifications > 9 ? "9+" : notifications}
                    </Badge>
                  )}
                </button>

                {/* Cart */}
                <button 
                  onClick={() => navigate("/cart")}
                  className="relative p-2 text-gray-700 hover:text-primary"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                      {cartItems > 9 ? "9+" : cartItems}
                    </Badge>
                  )}
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}>
                로그인
              </Button>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
