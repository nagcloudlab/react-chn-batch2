
function CartTable({ cart, onRemove, onClearCart, onCheckout, onIncrementQty, onDecrementQty }) {

    if (cart.length === 0) {
        return <div className="text-center">Cart is empty</div>
    }

    return (
        <table className="table table-stripped">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {cart.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>&#8377;{item.price.toFixed(2)}</td>
                        <td>
                            <div className="d-flex justify-content-around">
                                <button className="btn btn-sm btn-secondary" onClick={() => onDecrementQty(item.id)}>
                                    <i className="fa fa-minus"></i>
                                </button>
                                {item.qty}
                                <button className="btn btn-sm btn-secondary" onClick={() => onIncrementQty(item.id)}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </td>
                        <td>&#8377;{item.total.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="3" className="text-end">Grand Total:</td>
                    <td>&#8377;{cart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={onClearCart}>Clear Cart</button></td>
                </tr>
            </tfoot>
        </table>
    )

}

export default CartTable;