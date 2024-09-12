'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from '../styles/ProductList.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SkeletonCard = () => (
  <div className={`${styles.productCard} ${styles.skeleton}`}>
    <div className={`${styles.productImage} ${styles.skeletonImage}`}></div>
    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div className={`${styles.skeletonText} ${styles.skeletonTitle}`}></div>
        <div className={`${styles.skeletonText} ${styles.skeletonDescription}`}></div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.priceSection}>
          <div className={`${styles.skeletonText} ${styles.skeletonPrice}`}></div>
        </div>
        <button className={`${styles.buyButton} ${styles.skeletonButton}`} disabled>Buy Now</button>
      </div>
    </div>
  </div>
);

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const productsWithMetadata = data.filter(product => product.price && product.image);
        setProducts(productsWithMetadata);
        setFilteredProducts(productsWithMetadata);

        const metadataFields = new Set(['All']);
        productsWithMetadata.forEach(product => {
          if (product.metadata) {
            Object.keys(product.metadata).forEach(key => metadataFields.add(key));
          }
        });
        setFilters(Array.from(metadataFields));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.metadata && product.metadata.hasOwnProperty(filter)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
        setError(error.message);
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <div className={styles.subNav}>
        <span>{loading ? '0' : filteredProducts.length} Classes</span>
        <button
          onClick={() => handleFilterClick('All')}
          className={`${styles.filterButton} ${activeFilter === 'All' ? styles.active : ''}`}
        >
          All ({loading ? '0' : products.length})
        </button>
        {!loading && filters.slice(1).map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} ({products.filter(p => p.metadata && p.metadata.hasOwnProperty(filter)).length})
          </button>
        ))}
      </div>
      <div className={styles.productGrid}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredProducts.length === 0 ? (
          <div>No products available.</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <h3>{product.name}</h3>
                  {product.description && <p>{product.description}</p>}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.priceSection}>
                    <span className={styles.price}>
                      {product.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: product.currency,
                      })}
                    </span>
                    <span className={styles.perWeek}>/ Week</span>
                  </div>
                  {product.compare_at_price && (
                    <span className={styles.comparePrice}>
                      {product.compare_at_price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: product.currency,
                      })}
                    </span>
                  )}
                  {product.discount && (
                    <span className={styles.discount}>-{product.discount}%</span>
                  )}
                  <button className={styles.buyButton} onClick={() => handleBuyNow(product.id)}>Buy Now</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}