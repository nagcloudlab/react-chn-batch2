import { useEffect, useState } from "react";
import classNames from "classnames";
import Review from "./Review";

import { useContext } from "react"
import { CartContext } from "../contexts/CartContext"

import {
    getReviews
} from '../api/products'

function Product({ product }) {

    const { cart, dispatch } = useContext(CartContext)

    const [currentTab, setCurrentTab] = useState(1)
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        if (currentTab === 3) {
            getReviews(product.id)
                .then(reviews => setReviews(reviews))
                .catch(error => console.error("Error fetching reviews:", error))
        }
    }, [currentTab])

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
                    <button disabled={isInCart} className="btn btn-primary" onClick={() => dispatch({ type: 'ADD_TO_CART', product: { id: product.id, name: product.name, price: product.price } })}>Add to Cart</button>
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