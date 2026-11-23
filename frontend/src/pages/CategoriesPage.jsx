import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { CartDrawer } from '../components/common/CartDrawer';
import { WishlistDrawer } from '../components/common/WishlistDrawer';
import { getHomeCatalogue, getHomeCatalogueSnapshot } from '../services/productService';

const categoryFallbacks = {
  fashion: '/assets/cat_men_hi.jpg',
  men: '/assets/cat_men_hi.jpg',
  women: '/assets/cat_women_hi.jpg',
  accessories: '/assets/cat_women_hi.jpg',
  footwear: '/assets/cat_sports_hi.jpg',
  'home-living': '/assets/cat_home_living_hi.jpg',
  beauty: '/assets/cat_beauty_hi.jpg',
  electronics: '/assets/cat_electronics_hi.jpg',
  stationery: '/assets/cat_books_hi.jpg',
};

const flattenCategories = (rows) =>
  rows.flatMap((row) => [row, ...flattenCategories(row.children || [])]);

export function CategoriesPage({ onNavigate }) {
  const [catalogueSnapshot] = useState(getHomeCatalogueSnapshot);
  const [categories, setCategories] = useState(() => catalogueSnapshot?.categories || []);
  const [products, setProducts] = useState(() => catalogueSnapshot?.products || []);

  useEffect(() => {
    let alive = true;
    getHomeCatalogue()
      .then((snapshot) => {
        if (!alive) return;
        setCategories(snapshot.categories || []);
        setProducts(snapshot.products || []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const allCategories = flattenCategories(categories).filter(
    (cat) => cat.slug !== 'fashion'
  );

  const handleSelectCategory = (catName) => {
    onNavigate?.('home', catName);
  };

  return (
    <div className="fk-page-container fk-categories-page">
      <Header onNavigate={onNavigate} />

      <main className="fk-categories-page-container">
        <h1 className="fk-categories-page-title">All Categories</h1>
        <div className="fk-categories-page-grid">
          {allCategories.map((cat) => {
            const product = products.find((p) => p.category?.id === cat.id);
            const imgSrc =
              product?.images?.[0]?.url ||
              categoryFallbacks[cat.slug] ||
              '/assets/cat_home_living_hi.jpg';

            return (
              <div
                key={cat.id}
                id={`fk-cat-page-${cat.slug}`}
                className="fk-category-card-tile"
                onClick={() => handleSelectCategory(cat.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectCategory(cat.name);
                  }
                }}
                aria-label={`Browse ${cat.name}`}
              >
                <img
                  src={imgSrc}
                  alt={cat.name}
                  className="fk-category-tile-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/cat_home_living_hi.jpg';
                  }}
                />
                <span className="fk-category-tile-name">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </main>

      <CartDrawer onNavigate={onNavigate} />
      <WishlistDrawer onNavigate={onNavigate} />
    </div>
  );
}

export default CategoriesPage;
