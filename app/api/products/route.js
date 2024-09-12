import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // Use the latest API version
});

export async function GET() {
  try {
    console.log('Attempting to fetch products from Stripe');
    const products = await stripe.products.list({
      expand: ['data.default_price'],
      active: true
    });
    console.log(`Successfully fetched ${products.data.length} products`);
    
    const formattedProducts = products.data
      .filter(product => product.default_price && product.images.length > 0)
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images[0],
        price: product.default_price.unit_amount / 100,
        currency: product.default_price.currency,
        metadata: product.metadata ,
        product:product
      }));
      console.log(products.data)
    return new Response(JSON.stringify(formattedProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Error fetching products', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}