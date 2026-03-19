
import { useState, useEffect } from "react";
import Product from "./Product";

import { getProducts } from "../api/products";

function ProductList() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);



    function renderProducts() {
        return products.map(product => {
            return (
                <div key={product.id} className="list-group-item">
                    <Product product={product} />
                </div>
            )
        })
    }

    return (
        <div className="list-group">
            <hr />
            {renderProducts()}
        </div>
    )
}

export default ProductList;