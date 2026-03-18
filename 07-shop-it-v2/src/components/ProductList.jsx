
import Product from "./Product";

function ProductList({ onBuy, cart }) {

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
    ]

    function renderProducts() {
        return products.map(product => {
            return (
                <div key={product.id} className="list-group-item">
                    <Product product={product} onBuy={onBuy} cart={cart} />
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