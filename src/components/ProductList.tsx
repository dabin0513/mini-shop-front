import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

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

interface ProductListProps {
  products: Product[];
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onViewDetail, onAddToCart }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.reviews - a.reviews; // popular
    }
  });

  const getCategoryDisplayName = (category: string) => {
    const names: { [key: string]: string } = {
      'all': '전체',
      'clothing': '의류',
      'shoes': '신발',
      'electronics': '전자제품',
      'accessories': '액세서리'
    };
    return names[category] || category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">상품 목록</h1>
        <p className="text-gray-600">다양한 브랜드의 최신 상품을 만나보세요</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryDisplayName(category)}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 sm:ml-auto">
          <span className="text-sm text-gray-600">정렬:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="price-low">낮은 가격순</SelectItem>
              <SelectItem value="price-high">높은 가격순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          총 <span className="font-medium">{sortedProducts.length}</span>개의 상품
        </p>
        {selectedCategory !== 'all' && (
          <Badge variant="secondary">
            {getCategoryDisplayName(selectedCategory)} 필터링 중
          </Badge>
        )}
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">선택한 카테고리에 상품이 없습니다.</p>
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory('all')}
            className="mt-4"
          >
            전체 상품 보기
          </Button>
        </div>
      )}
    </div>
  );
}