
function CartTable({ cart }) {

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
                        <td>{item.quantity || 1}</td>
                        <td>&#8377;{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

}

export default CartTable;