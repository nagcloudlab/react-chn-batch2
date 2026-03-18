
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'


function CartBadge() {
    const { cart } = useContext(CartContext)
    const count = cart.length;
    return (
        <div className="cart-badge">
            <i className="fa fa-shopping-cart"></i>
            <span className="badge bg-danger">{count}</span> item(s) in cart
        </div>
    )
}

export default CartBadge