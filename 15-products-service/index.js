


import express from "express";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.get("/products", (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Laptop',
            price: 100000.00,
            description: 'A high-performance laptop for all your computing needs.',
            imageUrl: 'images/Laptop.png'
        },
        {
            id: 2,
            name: 'Mobile',
            price: 10000.00,
            description: 'A high-performance mobile for all your communication needs.',
            imageUrl: 'images/Mobile.png'
        }
    ]);
});
app.get("/products/:id/reviews", (req, res) => {
    const { id } = req.params;
    res.json([
        {
            id: 1,
            productId: id,
            reviewer: 'John Doe',
            rating: 5,
            comment: 'Excellent product! Highly recommend it.'
        },
        {
            id: 2,
            productId: id,
            reviewer: 'Jane Smith',
            rating: 4,
            comment: 'Good value for the price. Satisfied with the purchase.'
        }
    ]);
});
app.post("/products/:id/reviews", (req, res) => { });

app.listen(3000, () => {
    console.log("Products service is running on port 3000");
});