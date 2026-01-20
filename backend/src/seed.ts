
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const RawMaterialSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, default: 0 }
}, { timestamps: true });

const RecipeItemSchema = new mongoose.Schema({
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
    quantity: { type: Number, required: true, min: 0 }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    recipe: { type: [RecipeItemSchema], required: true },
    category: { type: String, required: true, default: 'Hot Dishes' },
    image: { type: String }
}, { timestamps: true });

const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);
const Product = mongoose.model('Product', ProductSchema);

const seed = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pos-system';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Clear existing data
        await RawMaterial.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Seed Raw Materials
        const materialsData = [
            { name: 'Chicken Breast', unit: 'kg', quantity: 50, minStockLevel: 5 },
            { name: 'Beef Slice', unit: 'kg', quantity: 40, minStockLevel: 5 },
            { name: 'Noodles', unit: 'kg', quantity: 100, minStockLevel: 10 },
            { name: 'Rice', unit: 'kg', quantity: 200, minStockLevel: 20 },
            { name: 'Onion', unit: 'kg', quantity: 30, minStockLevel: 5 },
            { name: 'Garlic', unit: 'kg', quantity: 20, minStockLevel: 2 },
            { name: 'Chili Paste', unit: 'kg', quantity: 15, minStockLevel: 2 },
            { name: 'Soy Sauce', unit: 'l', quantity: 50, minStockLevel: 5 },
            { name: 'Seafood Mix', unit: 'kg', quantity: 25, minStockLevel: 5 },
            { name: 'Mushroom', unit: 'kg', quantity: 20, minStockLevel: 3 },
            { name: 'Tomato', unit: 'kg', quantity: 30, minStockLevel: 5 },
            { name: 'Potato', unit: 'kg', quantity: 60, minStockLevel: 10 },
        ];

        const materials = await RawMaterial.insertMany(materialsData);
        console.log(`Seeded ${materials.length} raw materials`);

        // Helper to find material ID
        const getMaterialId = (name: string) => materials.find(m => m.name === name)?._id;

        // Seed Products
        const productsData = [
            {
                name: 'Spicy Seasoned Seafood Noodles',
                price: 2.29,
                category: 'Hot Dishes',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768910388/pos-products/b09rbn6tuflvybty0jz5.jpg',
                recipe: [
                    { material: getMaterialId('Noodles'), quantity: 0.2 },
                    { material: getMaterialId('Seafood Mix'), quantity: 0.1 },
                    { material: getMaterialId('Chili Paste'), quantity: 0.05 },
                ]
            },
            {
                name: 'Salted Pasta with Mushroom Sauce',
                price: 2.69,
                category: 'Hot Dishes',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768902758/pos-products/jj1n4af1znsoyfhfftqn.jpg',
                recipe: [
                    { material: getMaterialId('Noodles'), quantity: 0.2 },
                    { material: getMaterialId('Mushroom'), quantity: 0.1 },
                ]
            },
            {
                name: 'Beef Dumpling in Hot and Sour Soup',
                price: 2.99,
                category: 'Soup',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768910388/pos-products/b09rbn6tuflvybty0jz5.jpg',
                recipe: [
                    { material: getMaterialId('Beef Slice'), quantity: 0.15 },
                    { material: getMaterialId('Onion'), quantity: 0.05 },
                    { material: getMaterialId('Soy Sauce'), quantity: 0.05 },
                ]
            },
            {
                name: 'Healthy Noodle with Spinach Leaf',
                price: 3.29,
                category: 'Cold Dishes',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768903785/pos-products/j4n9bifb18lmwsqc6ydi.webp',
                recipe: [
                    { material: getMaterialId('Noodles'), quantity: 0.2 },
                    { material: getMaterialId('Garlic'), quantity: 0.01 },
                ]
            },
            {
                name: 'Hot Spicy Fried Rice with Omelet',
                price: 3.49,
                category: 'Hot Dishes',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768902856/pos-products/fialykrv0s6meim7jfmj.jpg',
                recipe: [
                    { material: getMaterialId('Rice'), quantity: 0.25 },
                    { material: getMaterialId('Chili Paste'), quantity: 0.05 },
                ]
            },
            {
                name: 'Spicy Instant Noodle with Special Omelette',
                price: 3.59,
                category: 'Hot Dishes',
                image: 'https://res.cloudinary.com/dtaic2exv/image/upload/v1768903238/pos-products/zqqp1bwl5fnsl8qvahew.jpg',
                recipe: [
                    { material: getMaterialId('Noodles'), quantity: 0.2 },
                    { material: getMaterialId('Chili Paste'), quantity: 0.05 },
                ]
            },
        ];

        const products = await Product.insertMany(productsData);
        console.log(`Seeded ${products.length} products`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
