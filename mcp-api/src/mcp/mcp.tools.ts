export const MCP_TOOLS = {
  schema_version: '2025-03-26',
  auth: { type: 'oauth2-jwt', token_endpoint: '/auth/login' },
  tools: {
    listInventory: {
      params: { page: 'number', size: 'number' },
      returns: 'BookPage',
    },
    bookDetails: { params: { id: 'string' }, returns: 'Book' },
    authorDetails: { params: { id: 'string' }, returns: 'Author' },
    addToCart: { params: { bookId: 'string', qty: 'number' }, returns: 'Cart' },
    removeFromCart: { params: { bookId: 'string' }, returns: 'Cart' },
    viewCart: { params: {}, returns: 'Cart' },
    placeOrder: { params: {}, returns: 'Order' },
    listOrders: {
      params: { page: 'number', size: 'number' },
      returns: 'OrderPage',
    },
    orderDetails: { params: { id: 'string' }, returns: 'Order' },
  },
} as const;
