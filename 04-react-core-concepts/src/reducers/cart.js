
/*

cart=[
{
  id:1,
  name:"iphone 14 pro max",
  price:120000,
  qty:1,
  total:120000
}
]
*/


function cartReducer(cart = [], action) {
    let { type } = action;
    switch (type) {
        case "ADD_TO_CART":
            let { product } = action;
            let index = cart.findIndex(p => p.id === product.id);
            if (index === -1) {
                cart.push({ ...product, qty: 1, total: product.price });
            } else {
                cart[index].qty++;
                cart[index].total = cart[index].qty * cart[index].price;
            }
            return [...cart];
        case "REMOVE_FROM_CART":
            let { productId: id } = action;
            cart = cart.filter(p => p.id !== id);
            return [...cart];
        case "INCREMENT_QTY":
            let { productId: incId } = action;
            let incIndex = cart.findIndex(p => p.id === incId);
            if (incIndex !== -1) {
                cart[incIndex].qty++;
                cart[incIndex].total = cart[incIndex].qty * cart[incIndex].price;
            }
            return [...cart];
        case "DECREMENT_QTY":
            let { productId: decId } = action;
            let decIndex = cart.findIndex(p => p.id === decId);
            if (decIndex !== -1 && cart[decIndex].qty > 1) {
                cart[decIndex].qty--;
                cart[decIndex].total = cart[decIndex].qty * cart[decIndex].price;
            }
            return [...cart];
        case "CLEAR_CART":
            return [];
        default:
            return cart;
    }



}

export default cartReducer;