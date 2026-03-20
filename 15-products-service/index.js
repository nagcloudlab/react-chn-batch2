


import express from "express";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "*"
}));


const products = [
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
];

const reviews = {
    1: [
        {
            id: 1,
            productId: 1,
            reviewer: 'John Doe',
            rating: 5,
            comment: 'Excellent product! Highly recommend it.'
        },
        {
            id: 2,
            productId: 1,
            reviewer: 'Jane Smith',
            rating: 4,
            comment: 'Good value for the price. Satisfied with the purchase.'
        }
    ],
    2: [
        {
            id: 3,
            productId: 2,
            reviewer: 'Alice Johnson',
            rating: 4,
            comment: 'Great mobile with good features. Worth the price.'
        },
        {
            id: 4,
            productId: 2,
            reviewer: 'Bob Brown',
            rating: 3,
            comment: 'Decent mobile, but battery life could be better.'
        }
    ]
}

app.get("/products", (req, res) => {
    res.json(products);
});
app.get("/products/:id/reviews", (req, res) => {
    const { id } = req.params;
    res.json(reviews[Number.parseInt(id)] || []);
});
app.post("/products/:id/reviews", express.json(), (req, res) => {
    const { id } = req.params;
    const { reviewer, rating, comment } = req.body;
    const newReview = {
        id: Date.now(),
        productId: Number.parseInt(id),
        reviewer,
        rating,
        comment
    };
    if (!reviews[id]) {
        reviews[id] = [];
    }
    reviews[id].push(newReview);
    res.status(201).json(newReview);
});

app.listen(3000, () => {
    console.log("Products service is running on port 3000");
});