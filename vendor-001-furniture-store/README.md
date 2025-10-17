# BTAB Vendor Site Template

This is a Next.js template for creating custom vendor sites that integrate with the BTAB platform.

## Quick Start

### 1. Fork this template
Click "Use this template" on GitHub to create your own repository.

### 2. Clone your repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_VENDOR_SITE.git
cd YOUR_VENDOR_SITE
```

### 3. Install dependencies
```bash
npm install
```

### 4. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your vendor credentials:
```env
BTAB_API_KEY=your_api_key_here
VENDOR_ID=vendor-001
VENDOR_NAME="Your Store Name"
```

### 5. Update configuration
Edit `btab.config.json` with your vendor details:
```json
{
  "vendor": {
    "id": "vendor-001",
    "name": "Your Store Name",
    "domain": "your-store.com"
  }
}
```

### 6. Start development server
```bash
npm run dev
```

Visit http://localhost:3000 to see your site.

## Project Structure

```
vendor-site/
├── app/                    # Next.js app directory
│   ├── page.js            # Home page
│   ├── layout.js          # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Libraries and utilities
│   └── btab-sdk.js       # BTAB API client
├── public/               # Static assets
├── btab.config.json      # BTAB configuration
└── .env.local           # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## BTAB SDK Usage

The BTAB SDK provides easy integration with the platform API:

```javascript
import BTABClient from '../lib/btab-sdk';

// Initialize client
const client = new BTABClient(process.env.BTAB_API_KEY);

// Get products from main catalog
const products = await client.getProducts();

// Get vendor's selected products
const vendorProducts = await client.getVendorProducts();

// Add product to vendor catalog
await client.addToVendorCatalog(productId, customPrice);

// Create order
await client.createOrder({
  customer_email: 'customer@example.com',
  items: [{ product_id: 1, quantity: 2 }]
});
```

## Customization

### Styling
- Tailwind CSS is pre-configured
- Edit `tailwind.config.js` to customize theme
- Modify `app/globals.css` for global styles

### Pages
- Add new pages in the `app` directory
- Use Next.js app router conventions

### Components
- Create reusable components in `components/`
- Use the BTAB SDK for data fetching

## Deployment

### Automatic Deployment

Push to the `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update site"
git push origin main
```

The GitHub Actions workflow will:
1. Build your site
2. Run tests
3. Deploy to BTAB platform
4. Update DNS if needed

### Manual Deployment

You can also deploy manually:

```bash
npm run build
npm run deploy
```

## Environment Variables

### Required
- `BTAB_API_KEY` - Your vendor API key
- `VENDOR_ID` - Your vendor ID

### Optional
- `CUSTOM_DOMAIN` - Custom domain for your site
- `GA_TRACKING_ID` - Google Analytics ID
- `HOTJAR_ID` - Hotjar tracking ID

## Features

### Built-in Features
- Product catalog display
- Custom pricing support
- Responsive design
- SEO optimized
- Performance optimized

### Optional Features
Enable in `btab.config.json`:
- `catalog` - Show main catalog products
- `customProducts` - Add custom products
- `checkout` - Enable checkout flow
- `analytics` - Track user behavior
- `customPricing` - Set custom prices

## API Endpoints

Your site can access these BTAB API endpoints:

- `GET /products` - Main catalog
- `GET /my-products` - Vendor products
- `POST /my-products` - Add to vendor catalog
- `PUT /my-products/:id` - Update pricing
- `DELETE /my-products/:id` - Remove product
- `GET /orders` - Vendor orders
- `POST /orders` - Create order

## Support

### Documentation
- [BTAB Platform Docs](https://docs.btab.app)
- [Next.js Documentation](https://nextjs.org/docs)

### Getting Help
- Email: support@btab.app
- Slack: #vendor-support
- GitHub Issues: [Report bugs](https://github.com/btab-platform/issues)

## License

This template is provided under the MIT License. Your vendor site code remains your property.

## Examples

### Custom Product Card Component
```jsx
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${(product.price_cents / 100).toFixed(2)}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

### Fetch Products with SWR
```jsx
import useSWR from 'swr';
import { btabFetcher } from '../lib/btab-sdk';

function ProductList() {
  const { data, error } = useSWR(
    '/my-products',
    url => btabFetcher(url, process.env.BTAB_API_KEY)
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Changelog

### v1.0.0
- Initial template release
- Next.js 14 with App Router
- BTAB SDK integration
- Tailwind CSS styling
- GitHub Actions deployment