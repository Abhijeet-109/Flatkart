import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { WishlistDrawer } from '../components/common/WishlistDrawer';
import { getHomeCatalogue, getHomeCatalogueSnapshot } from '../services/productService';
import { CategorySection } from '../components/home/CategorySection';

export function CategoriesPage({ onNavigate }) {
  const [catalogueSnapshot] = useState(getHomeCatalogueSnapshot);
  const [categories, setCategories] = useState(() => catalogueSnapshot?.categories || []);
  const [products, setProducts] = useState(() => catalogueSnapshot?.products || []);

  useEffect(() => {
    let alive = true;
    getHomeCatalogue().then((snapshot) => {
      if (!alive) return;
      setCategories(snapshot.categories || []);
      setProducts(snapshot.products || []);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const handleSelectCategory = (catName) => {
    onNavigate?.('home');
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="fk-page-container fk-categories-page">
      <Header onNavigate={onNavigate} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', minHeight: '60vh' }}>
        <CategorySection
          onSelectCategory={handleSelectCategory}
          categories={categories}
          products={products}
        />
      </main>
      <Footer onNavigate={onNavigate} />
      <CartDrawer onNavigate={onNavigate} />
      <WishlistDrawer onNavigate={onNavigate} />
    </div>
  );
}

export default CategoriesPage;
