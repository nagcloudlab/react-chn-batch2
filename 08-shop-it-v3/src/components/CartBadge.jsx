
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'


function CartBadge() {
    const { cart } = useContext(CartContext)
    const count = cart.length;
    return (
        <div className="d-inline-flex align-items-center gap-2 bg-light text-dark rounded-pill px-3 py-1 small">
            <i className="fa fa-shopping-cart text-primary"></i>
            <span className="badge bg-danger rounded-pill">{count}</span>
            <span className="fw-semibold">item(s) in cart</span>
        </div>
    )
}

export default CartBadge