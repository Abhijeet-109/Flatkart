import React from 'react';
import './Skeleton.css';

export function ProductCardSkeleton() {
  return (
    <div className="fk-product-card fk-product-card-skeleton" aria-hidden="true">
      <div className="fk-product-img-box fk-skeleton-shimmer" />
      <div className="fk-product-details">
        <div className="fk-skeleton-line fk-skeleton-brand fk-skeleton-shimmer" />
        <div className="fk-skeleton-line fk-skeleton-name fk-skeleton-shimmer" />
        <div className="fk-skeleton-line fk-skeleton-subtext fk-skeleton-shimmer" />
        <div className="fk-skeleton-line fk-skeleton-price fk-skeleton-shimmer" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="fk-product-grid" aria-label="Loading products…">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;
