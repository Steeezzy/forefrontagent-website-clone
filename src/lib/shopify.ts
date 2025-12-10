import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('Missing Shopify Environment Variables');
}

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['write_script_tags', 'read_script_tags'],
    hostName: process.env.NEXT_PUBLIC_APP_URL.replace(/https?:\/\//, ''),
    apiVersion: ApiVersion.October24,
    isEmbeddedApp: false, // We are building a standalone app for now
});

export default shopify;
