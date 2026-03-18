import { useState } from "react";
import classNames from "classnames";
import Review from "./Review";

function Product({ product, onBuy, cart }) {

    const [currentTab, setCurrentTab] = useState(1)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            reviewer: 'Nag',
            comment: 'Good product',
            rating: 4
        },
        {
            id: 2,
            reviewer: 'Ria',
            comment: 'Worth the price',
            rating: 5
        }
    ])

    const isInCart = cart.find(item => item.id === product.id) !== undefined
    const cartLineQty = isInCart ? cart.find(item => item.id === product.id).qty : 0

    const handleTabChange = (tab) => {
        setCurrentTab(tab)
    }
    const isTabSelected = (tab) => {
        return currentTab === tab;
    }
    function renderTabPanel(product) {
        switch (currentTab) {
            case 1:
                return <p>{product.description}</p>
            case 2:
                return (
                    <ul>
                        <li>spec-1</li>
                        <li>spec-2</li>
                        <li>spec-3</li>
                    </ul>
                )
            case 3:
                return (
                    <div>
                        {reviews.map(review => {
                            return (
                                <div key={review.id} className="mt-2">
                                    <Review review={review} />
                                </div>
                            )
                        })}
                    </div>
                )
            default:
                return null
        }
    }

    const handleBuy = () => {
        onBuy({
            id: product.id,
            name: product.name,
            price: product.price
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-4">
                    <img src={product.imageUrl} className="img-fluid" alt={product.name} />
                </div>
                <div className="col-8">
                    <div>{product.name}</div>
                    <div>&#8377;{product.price}</div>
                    <button disabled={isInCart} className="btn btn-primary" onClick={() => handleBuy()}>Add to Cart</button>
                    {isInCart && <div>Quantity in cart: {cartLineQty}</div>}
                    <ul className="mt-3 nav nav-tabs">
                        <li className="nav-item">
                            <a onClick={() => handleTabChange(1)} className={classNames({ 'nav-link': true, 'active': isTabSelected(1) })} href="#">Description</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => handleTabChange(2)} className={classNames({ 'nav-link': true, 'active': isTabSelected(2) })} href="#">Specification</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => handleTabChange(3)} className={classNames({ 'nav-link': true, 'active': isTabSelected(3) })} href="#">Reviews</a>
                        </li>
                    </ul>
                    {renderTabPanel(product)}
                </div>
            </div>
        </>
    )
}

export default Product;