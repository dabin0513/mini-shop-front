import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from "lucide-react";
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
  description?: string;
  features?: string[];
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['블랙', '화이트', '그레이', '네이비'];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const mockReviews = [
    { id: 1, user: '김**', rating: 5, comment: '정말 만족스러운 상품입니다. 품질이 좋아요!', date: '2024-01-15' },
    { id: 2, user: '이**', rating: 4, comment: '사이즈가 딱 맞고 디자인이 예뻐요', date: '2024-01-10' },
    { id: 3, user: '박**', rating: 5, comment: '배송도 빠르고 포장도 꼼꼼하게 되어있었습니다', date: '2024-01-08' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        상품 목록으로 돌아가기
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
            />
            {discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discountPercent}%
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-lg text-gray-600 mb-2">{product.brand}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews.toLocaleString()}개 리뷰)</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString()}원
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()}원
                </span>
              )}
            </div>
          </div>

          {/* Options */}
          {product.category === 'clothing' && (
            <>
              <div>
                <label className="block font-medium mb-3">사이즈</label>
                <div className="flex gap-2">
                  {sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-3">색상</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Quantity */}
          <div>
            <label className="block font-medium mb-3">수량</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </Button>
              <span className="text-sm text-gray-500 ml-4">
                재고: {product.stock}개
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? '품절' : '장바구니 담기'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            {product.stock > 10 ? (
              <p className="text-green-600">✅ 재고 충분</p>
            ) : product.stock > 0 ? (
              <p className="text-yellow-600">⚠️ 재고 얼마 남지 않음 ({product.stock}개)</p>
            ) : (
              <p className="text-red-600">❌ 품절</p>
            )}
          </div>
        </div>
      </div>

      {/* Product Description & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">상품 설명</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description || '고품질 소재로 제작된 프리미엄 상품입니다. 세련된 디자인과 뛰어난 기능성을 겸비하여 일상생활에서 실용적으로 사용하실 수 있습니다.'}
            </p>
            
            {product.features && (
              <>
                <h4 className="font-medium mb-3">주요 특징</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">고객 후기</h3>
            <div className="space-y-4">
              {mockReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                  <p className="text-gray-400 text-xs">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}