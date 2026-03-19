
function cartReducer(cart = [], action) {
    console.log("Cart Reducer called with action: ", action);
    let { type } = action;
    switch (type) {
        case "ADD_TO_CART":
            let { product } = action;
            return cart.some((item) => item.id === product.id)
                ? cart.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price }
                        : item
                )
                : [...cart, { ...product, qty: 1, total: product.price }];
        case "REMOVE_FROM_CART":
            let { productId: id } = action;
            return cart.filter(p => p.id !== id);
        case "INCREMENT_QTY":
            let { productId: incId } = action;
            return cart.map((item) =>
                item.id === incId
                    ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price }
                    : item
            );
        case "DECREMENT_QTY":
            let { productId: decId } = action;
            return cart.map((item) => {
                if (item.id !== decId || item.qty <= 1) {
                    return item;
                }
                const qty = item.qty - 1;
                return { ...item, qty, total: qty * item.price };
            });
        case "CLEAR_CART":
            return [];
        default:
            return cart;
    }



}

export default cartReducer;