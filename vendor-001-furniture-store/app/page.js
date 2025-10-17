'use client';

import { useState, useEffect } from 'react';
import BTABClient from '../lib/btab-sdk';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorInfo, setVendorInfo] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const client = new BTABClient(process.env.NEXT_PUBLIC_BTAB_API_KEY);

        // Get vendor's selected products
        const vendorProducts = await client.getVendorProducts();
        setProducts(vendorProducts.products || []);

        // Get vendor info
        const info = await client.getVendorInfo();
        setVendorInfo(info);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {vendorInfo?.name || 'Vendor Store'}
            </h1>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="/products" className="text-gray-700 hover:text-gray-900">Products</a>
              <a href="/about" className="text-gray-700 hover:text-gray-900">About</a>
              <a href="/contact" className="text-gray-700 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Our Store
            </h2>
            <p className="text-xl mb-8">
              Discover amazing products at great prices
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add products through your vendor dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    {product.product.image_url ? (
                      <img
                        src={product.product.image_url}
                        alt={product.product.name}
                        className="h-48 w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {product.product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${((product.custom_retail_price_cents || product.product.retail_price_cents) / 100).toFixed(2)}
                      </span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                Your trusted partner for quality products and excellent service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/products" className="hover:text-white">All Products</a></li>
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: support@vendorstore.com<br/>
                Phone: 1-800-VENDOR<br/>
                Hours: Mon-Fri 9AM-5PM
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 {vendorInfo?.name || 'Vendor Store'}. Powered by BTAB Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}