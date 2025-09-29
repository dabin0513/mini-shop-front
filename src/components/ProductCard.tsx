import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail, onAddToCart }: ProductCardProps) {
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div onClick={() => onViewDetail(product)}>
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {discountPercent > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
          {product.stock < 10 && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              재고 부족
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">{product.brand}</div>
          <h3 className="font-medium line-clamp-2 leading-tight">{product.name}</h3>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>⭐</span>
            <span>{product.rating}</span>
            <span>({product.reviews.toLocaleString()})</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString()}원
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetail(product)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              상세보기
            </Button>
            <Button 
              size="sm" 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.stock === 0 ? '품절' : '장바구니'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}