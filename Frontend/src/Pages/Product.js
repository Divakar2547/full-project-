import React, { useState, useMemo } from "react";
import "../Styles/Product.css";

const products = [
  // Maintenance
  // Maintenance
  { id: 1,  name: 'Synthetic Engine Oil 5W-30', price: 799,  originalPrice: 999,  category: 'Maintenance', rating: 4.5, reviews: 128, stock: 'In Stock',    brand: 'Castrol',      image: 'https://s3-ap-southeast-2.amazonaws.com/mytyresite-images/news/P0rqvBNxgn_engine_oil_change.webp',                            description: 'Full synthetic oil for petrol & diesel engines. Reduces friction and extends engine life.', specs: ['5W-30 Grade', '1 Litre', 'API SN Certified'] },
  { id: 2,  name: 'Coolant / Antifreeze',       price: 349,  originalPrice: 449,  category: 'Maintenance', rating: 4.3, reviews: 74,  stock: 'In Stock',    brand: 'Prestone',     image: 'https://m.media-amazon.com/images/I/61z5xnFJFHL._AC_UF1000,1000_QL80_.jpg',                            description: 'Prevents overheating and corrosion. Compatible with all radiator types.', specs: ['Ready to Use', '1 Litre', 'All Season'] },
  { id: 3,  name: 'Brake Fluid DOT 4',          price: 249,  originalPrice: 299,  category: 'Maintenance', rating: 4.4, reviews: 56,  stock: 'In Stock',    brand: 'Bosch',        image: 'https://m.media-amazon.com/images/I/51w3YDKFPNL._AC_UF1000,1000_QL80_.jpg',                            description: 'High-performance brake fluid for disc and drum brakes. Prevents vapor lock.', specs: ['DOT 4 Standard', '500ml', 'High Boiling Point'] },

  // Parts
  { id: 4,  name: 'Air Filter',                 price: 299,  originalPrice: 399,  category: 'Parts',       rating: 4.2, reviews: 93,  stock: 'In Stock',    brand: 'K&N',          image: 'https://tgpindia.com/wp-content/uploads/2024/08/Tata-truck-air-filter.png',                            description: 'High-flow air filter for improved engine breathing and fuel efficiency.', specs: ['Universal Fit', 'Washable', 'Reusable'] },
  { id: 5,  name: 'Oil Filter',                 price: 199,  originalPrice: 249,  category: 'Parts',       rating: 4.1, reviews: 61,  stock: 'In Stock',    brand: 'Bosch',        image: 'https://m.media-amazon.com/images/I/71Ry5JzFKGL._AC_UF1000,1000_QL80_.jpg',                            description: 'Premium oil filter that removes contaminants and protects engine components.', specs: ['Multi-Vehicle', 'Anti-Drain Valve', '10,000 km Life'] },
  { id: 6,  name: 'Fuel Injector Cleaner',      price: 449,  originalPrice: 549,  category: 'Parts',       rating: 4.0, reviews: 42,  stock: 'Low Stock',   brand: 'STP',          image: 'https://m.media-amazon.com/images/I/61Ry5JzFKGL._AC_UF1000,1000_QL80_.jpg',                            description: 'Cleans fuel injectors and carburetors. Improves throttle response and mileage.', specs: ['250ml Bottle', 'Petrol Engines', 'One Tank Treatment'] },

  // Safety
  { id: 7,  name: 'Ceramic Brake Pads',         price: 1499, originalPrice: 1899, category: 'Safety',      rating: 4.7, reviews: 215, stock: 'In Stock',    brand: 'Brembo',       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBHynRHalLhwGJxvyKICpfBTnARpoLt51YYw&s',                            description: 'Low-dust ceramic brake pads for smooth, quiet and powerful braking performance.', specs: ['Front Axle', 'Ceramic Compound', 'Low Dust'] },
  { id: 8,  name: 'Wiper Blades (Pair)',         price: 699,  originalPrice: 899,  category: 'Safety',      rating: 4.3, reviews: 88,  stock: 'In Stock',    brand: 'Bosch',        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTyf9bVxDuEYd06RhFz3ELL3TnjfOai6yTw&s',                            description: 'All-weather wiper blades with aerodynamic design for streak-free visibility.', specs: ['24" + 16"', 'All Weather', 'Easy Fit'] },
  { id: 9,  name: 'Tyre Puncture Repair Kit',   price: 599,  originalPrice: 749,  category: 'Safety',      rating: 4.5, reviews: 103, stock: 'In Stock',    brand: 'Slime',        image: 'https://m.media-amazon.com/images/I/71Ry5JzFKGL._AC_UF1000,1000_QL80_.jpg',                            description: 'Emergency tyre sealant and inflator. Fix flat tyres without removing the wheel.', specs: ['500ml Sealant', 'Compressor Included', 'Tubeless Tyres'] },

  // Electrical
  { id: 10, name: 'Car Battery 35Ah',           price: 5499, originalPrice: 6499, category: 'Electrical',  rating: 4.6, reviews: 176, stock: 'In Stock',    brand: 'Amaron',       image: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg',                            description: 'Maintenance-free battery with high cranking power. Ideal for hatchbacks and sedans.', specs: ['35Ah', '18 Month Warranty', 'Maintenance Free'] },
  { id: 11, name: 'Iridium Spark Plugs (Set 4)',price: 899,  originalPrice: 1199, category: 'Electrical',  rating: 4.4, reviews: 134, stock: 'In Stock',    brand: 'NGK',          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVsRJc21ZqNmjNhh0zc2ght1FHGVJxT25Qg&s',                            description: 'Iridium tip spark plugs for better ignition, fuel economy and longer service life.', specs: ['Set of 4', 'Iridium Tip', '60,000 km Life'] },
  { id: 12, name: 'LED Headlight Bulbs (Pair)', price: 1299, originalPrice: 1699, category: 'Electrical',  rating: 4.5, reviews: 97,  stock: 'In Stock',    brand: 'Philips',      image: 'https://m.media-amazon.com/images/I/61z5xnFJFHL._AC_UF1000,1000_QL80_.jpg',                            description: '6000K white LED headlights. 3x brighter than halogen with plug-and-play fitment.', specs: ['H4 Base', '6000K White', 'IP67 Waterproof'] },

  // Tools
  { id: 13, name: 'Digital Tyre Pressure Gauge',price: 399,  originalPrice: 499,  category: 'Tools',       rating: 4.2, reviews: 67,  stock: 'In Stock',    brand: 'Michelin',     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AsjbGF2G_tNdF1itm7ig_kg3knRu-RO1iQ&s',                            description: 'Accurate digital gauge with backlit display. Measures 0–100 PSI with ±1% accuracy.', specs: ['0-100 PSI', 'Digital Display', 'Auto Off'] },
  { id: 14, name: 'Jump Starter 12000mAh',      price: 3499, originalPrice: 4299, category: 'Tools',       rating: 4.8, reviews: 241, stock: 'In Stock',    brand: 'NOCO',         image: 'https://m.media-amazon.com/images/I/81qQjUKZr9L._AC_UF1000,1000_QL80_.jpg',                            description: 'Portable jump starter with USB power bank. Starts petrol engines up to 3.0L.', specs: ['12000mAh', 'USB Power Bank', 'LED Torch'] },
  { id: 15, name: 'Torque Wrench 1/2"',         price: 1899, originalPrice: 2299, category: 'Tools',       rating: 4.6, reviews: 58,  stock: 'Low Stock',   brand: 'Stanley',      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AsjbGF2G_tNdF1itm7ig_kg3knRu-RO1iQ&s',                            description: 'Click-type torque wrench for precise tightening. Essential for wheel nuts and engine bolts.', specs: ['28-210 Nm', '1/2" Drive', 'Chrome Vanadium'] },

  // Interior
  { id: 16, name: '7D Car Floor Mats',          price: 1199, originalPrice: 1599, category: 'Interior',    rating: 4.4, reviews: 112, stock: 'In Stock',    brand: 'AutoFit',      image: 'https://m.media-amazon.com/images/I/81qQjUKZr9L._AC_UF1000,1000_QL80_.jpg',                            description: 'Custom-fit 7D mats with anti-slip backing. Waterproof and easy to clean.', specs: ['Full Set (5 pcs)', 'Waterproof', 'Anti-Slip'] },
  { id: 17, name: 'Seat Cover Set',             price: 2499, originalPrice: 3199, category: 'Interior',    rating: 4.3, reviews: 89,  stock: 'In Stock',    brand: 'AutoFit',      image: 'https://m.media-amazon.com/images/I/81qQjUKZr9L._AC_UF1000,1000_QL80_.jpg',                            description: 'Premium leatherette seat covers with side airbag compatibility. Universal fit.', specs: ['Full Set', 'Leatherette', 'Airbag Safe'] },
  { id: 18, name: 'Car Vacuum Cleaner 12V',     price: 999,  originalPrice: 1299, category: 'Interior',    rating: 4.1, reviews: 73,  stock: 'In Stock',    brand: 'Black+Decker', image: 'https://m.media-amazon.com/images/I/61z5xnFJFHL._AC_UF1000,1000_QL80_.jpg',                            description: 'Compact 12V car vacuum with HEPA filter. Plugs into cigarette lighter socket.', specs: ['12V DC', 'HEPA Filter', '5m Cord'] },
];

const CATEGORIES = ['All', 'Maintenance', 'Parts', 'Safety', 'Electrical', 'Tools', 'Interior'];
const TAX_RATE   = 0.18;

const Stars = ({ rating }) => {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  );
};

const Products = () => {
  const [cart, setCart]           = useState([]);
  const [showCart, setShowCart]   = useState(false);
  const [bill, setBill]           = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('default');

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      return existing
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax      = Math.round(subtotal * TAX_RATE);
  const total    = subtotal + tax;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleBuy = () => {
    setBill({ orderId: 'ORD' + Date.now(), date: new Date().toLocaleString('en-IN'), items: [...cart], subtotal, tax, total });
    setCart([]);
    setShowCart(false);
  };

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, search, sortBy]);

  const discount = (orig, price) => Math.round(((orig - price) / orig) * 100);

  return (
    <div className="products-page">

      {/* ── Bill Receipt Modal ── */}
      {bill && (
        <div className="bill-overlay">
          <div className="bill-modal">
            <div className="bill-header">
              <div className="bill-logo">🔧 AutoParts Store</div>
              <h2>Payment Receipt</h2>
              <p className="bill-meta">Order ID: <strong>{bill.orderId}</strong></p>
              <p className="bill-meta">{bill.date}</p>
            </div>
            <div className="bill-items">
              <div className="bill-row bill-row-head">
                <span>Item</span><span>Brand</span><span>Qty</span><span>Price</span><span>Amount</span>
              </div>
              {bill.items.map(item => (
                <div className="bill-row" key={item.id}>
                  <span>{item.name}</span>
                  <span>{item.brand}</span>
                  <span>{item.quantity}</span>
                  <span>₹{item.price.toLocaleString('en-IN')}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bill-summary">
              <div className="bill-summary-row"><span>Subtotal</span><span>₹{bill.subtotal.toLocaleString('en-IN')}</span></div>
              <div className="bill-summary-row"><span>GST (18%)</span><span>₹{bill.tax.toLocaleString('en-IN')}</span></div>
              <div className="bill-summary-row bill-total"><span>Total Paid</span><span>₹{bill.total.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="bill-footer">
              <div className="bill-success-icon">✓</div>
              <p>Payment Successful</p>
              <span>Thank you for your purchase! Your order will be delivered in 3–5 business days.</span>
              <button className="btn-close-bill" onClick={() => setBill(null)}>Continue Shopping</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="products-hero">
        <div className="products-hero-text">
          <h1>Vehicle Parts & Accessories</h1>
          <p>Genuine parts from trusted brands — delivered to your doorstep</p>
        </div>
        <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {/* ── Search & Sort ── */}
      <div className="products-toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search products or brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* ── Category Filter ── */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            <span className="cat-count">
              {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Cart Panel ── */}
      {showCart && (
        <div className="cart-panel">
          <div className="cart-panel-header">
            <h3>🛒 Shopping Cart</h3>
            <button className="cart-close" onClick={() => setShowCart(false)}>✕</button>
          </div>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span>🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} className="cart-item-img"
                    onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/52x52/eef2ff/4f46e5?text=${encodeURIComponent(item.name[0])}`; }}
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-brand">{item.brand}</span>
                    <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')} each</span>
                  </div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                    <span className="cart-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑</button>
                  </div>
                </div>
              ))}
              <div className="cart-footer">
                <div className="cart-totals">
                  <div className="cart-total-row"><span>Subtotal ({cartCount} items)</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="cart-total-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                  <div className="cart-total-row cart-grand-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <button className="btn-buy" onClick={handleBuy}>✓ Place Order · ₹{total.toLocaleString('en-IN')}</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Results Count ── */}
      <div className="results-info">
        Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
        {search && <> for "<strong>{search}</strong>"</>}
      </div>

      {/* ── Product Grid ── */}
      {filtered.length === 0 ? (
        <div className="no-results">
          <span>🔍</span>
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(product => {
            const inCart = cart.find(i => i.id === product.id);
            const disc   = discount(product.originalPrice, product.price);
            return (
              <div className="product-card" key={product.id}>
                {disc > 0 && <span className="discount-badge">-{disc}%</span>}
                {product.stock === 'Low Stock' && <span className="stock-badge low">Low Stock</span>}

                <div className="product-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/200x160/eef2ff/4f46e5?text=${encodeURIComponent(product.name)}`; }}
                  />
                </div>

                <div className="product-body">
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-brand">{product.brand}</span>
                  </div>

                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>

                  <div className="product-specs">
                    {product.specs.map((s, i) => <span key={i} className="spec-tag">{s}</span>)}
                  </div>

                  <Stars rating={product.rating} />
                  <span className="review-count">({product.reviews} reviews)</span>

                  <div className="price-row">
                    <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {inCart ? (
                    <div className="inline-qty">
                      <button onClick={() => updateQty(product.id, -1)}>−</button>
                      <span>{inCart.quantity}</span>
                      <button onClick={() => updateQty(product.id, +1)}>+</button>
                      <span className="in-cart-label">In Cart</span>
                    </div>
                  ) : (
                    <button
                      className={`add-to-cart-btn ${product.stock === 'Out of Stock' ? 'disabled' : ''}`}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 'Out of Stock'}
                    >
                      {product.stock === 'Out of Stock' ? 'Out of Stock' : '+ Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
