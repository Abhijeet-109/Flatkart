import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/Skeleton';

export function ProductGrid({ products = [], onSelectProduct, loading = false, error = '', emptyMessage = 'No products found.' }) {
  if (loading) return <ProductGridSkeleton count={8} />;
  if (error) return <div role="alert" className="fk-catalog-state">{error}</div>;
  if (!products.length) return <div className="fk-catalog-state">{emptyMessage}</div>;
  return <div className="fk-products-grid">{products.map((product) => <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />)}</div>;
}

export default ProductGrid;
