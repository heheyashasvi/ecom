export const MOCK_PRODUCTS = [
    {
        _id: "mock1",
        name: "Wireless Headphones",
        description: "High quality noise cancelling headphones",
        price: 199.99,
        stock: 45,
        category: "Electronics",
        status: "active",
        sku: "WH-001",
        images: ["/placeholder.svg"],
        createdAt: new Date().toISOString(),
    },
    {
        _id: "mock2",
        name: "Ergonomic Chair",
        description: "Comfortable office chair",
        price: 350.00,
        stock: 12,
        category: "Furniture",
        status: "active",
        sku: "EC-002",
        images: ["/placeholder.svg"],
        createdAt: new Date().toISOString(),
    },
    {
        _id: "mock3",
        name: "Mechanical Keyboard",
        description: "Tactile switches",
        price: 120.50,
        stock: 0,
        category: "Electronics",
        status: "archived",
        sku: "MK-003",
        images: ["/placeholder.svg"],
        createdAt: new Date().toISOString(),
    }
];

export const MOCK_ORDERS = [
    {
        _id: "order1",
        customerName: "Alice Smith",
        email: "alice@example.com",
        totalAmount: 199.99,
        status: "delivered",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        orderItems: []
    },
    {
        _id: "order2",
        customerName: "Bob Jones",
        email: "bob@example.com",
        totalAmount: 350.00,
        status: "processing",
        createdAt: new Date().toISOString(),
        orderItems: []
    }
];
