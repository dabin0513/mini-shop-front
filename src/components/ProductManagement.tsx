import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
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
  lowStockThreshold: number;
  soldCount: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
  description?: string;
  features?: string[];
}

interface ProductFormData {
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  stock: string;
  lowStockThreshold: string;
  status: 'active' | 'inactive';
  description: string;
  features: string;
}

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'soldCount' | 'rating' | 'reviews'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

export function ProductManagement({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'clothing',
    stock: '',
    lowStockThreshold: '',
    status: 'active',
    description: '',
    features: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'clothing',
      stock: '',
      lowStockThreshold: '',
      status: 'active',
      description: '',
      features: ''
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      image: formData.image || 'https://images.unsplash.com/photo-1627342229908-71efbac25f08',
      category: formData.category,
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      status: formData.status,
      description: formData.description,
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : []
    };
    
    onAddProduct(newProduct);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      brand: formData.brand,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      status: formData.status,
      description: formData.description,
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : []
    };
    
    onUpdateProduct(updatedProduct);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      status: product.status,
      description: product.description || '',
      features: product.features?.join(', ') || ''
    });
    setIsEditDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const getStatusBadge = (status: Product['status']) => {
    return status === 'active' ? (
      <Badge variant="default">활성</Badge>
    ) : (
      <Badge variant="secondary">비활성</Badge>
    );
  };

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

  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={isEdit ? handleEditProduct : handleAddProduct} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">상품명 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="상품명을 입력하세요"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">브랜드 *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            placeholder="브랜드명을 입력하세요"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">판매가격 *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="0"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="originalPrice">정가</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
            placeholder="할인 전 가격 (선택사항)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">카테고리 *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clothing">의류</SelectItem>
              <SelectItem value="shoes">신발</SelectItem>
              <SelectItem value="electronics">전자제품</SelectItem>
              <SelectItem value="accessories">액세서리</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">재고 수량 *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            placeholder="0"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">재고 경고 기준</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
            placeholder="10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">이미지 URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">상품 설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="상품에 대한 상세 설명을 입력하세요"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="features">주요 특징</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({...formData, features: e.target.value})}
          placeholder="특징을 쉼표로 구분하여 입력하세요 (예: 고품질 소재, 내구성 우수, 세탁 가능)"
          rows={2}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            resetForm();
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingProduct(null);
            } else {
              setIsAddDialogOpen(false);
            }
          }}
        >
          취소
        </Button>
        <Button type="submit">
          {isEdit ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">상품 관리</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              상품 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 상품 추가</DialogTitle>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="상품명 또는 브랜드로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            상품 목록 ({filteredProducts.length}개)
          </CardTitle>
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
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(product => (
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
                    <TableCell>{getCategoryDisplayName(product.category)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.price.toLocaleString()}원</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()}원
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${product.stock <= product.lowStockThreshold ? 'text-red-600' : ''}`}>
                        {product.stock}개
                      </div>
                      {product.stock <= product.lowStockThreshold && (
                        <div className="text-xs text-red-500">재고 부족</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>{product.soldCount}개</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>상품 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                '{product.name}' 상품을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 수정</DialogTitle>
          </DialogHeader>
          <ProductForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}