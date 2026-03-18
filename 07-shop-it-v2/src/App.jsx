import { useState } from 'react'
import classNames from 'classnames'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import CartTable from './components/CartTable'


function App() {

  const [cart, setCart] = useState([])

  // actions => buy-item | remove-item | clear-cart | checkout | increment-qty | decrement-qty

  /*
   cart = [
     {
       id: 1,
       name: 'iPhone 14 Pro',
       price: 999,
       qty: 2,
       total: 1998
     }
  ]
  */

  const handleBuy = (product) => {
    const index = cart.findIndex(item => item.id === product.id)
    if (index === -1) {
      // add new product to cart
      setCart([...cart, { ...product, qty: 1, total: product.price }])
    } else {
      // update existing product in cart
      const newCart = [...cart]
      newCart[index].qty += 1
      newCart[index].total = newCart[index].qty * newCart[index].price
      setCart(newCart)
    }
  }
  const handleRemove = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
  }
  const handleClearCart = () => {
    setCart([])
  }
  const handleCheckout = () => {
    alert('Checkout successful!')
    setCart([])
  }
  const handleIncrementQty = (productId) => {
    const index = cart.findIndex(item => item.id === productId)
    if (index !== -1) {
      const newCart = [...cart]
      newCart[index].qty += 1
      newCart[index].total = newCart[index].qty * newCart[index].price
      setCart(newCart)
    }
  }
  const handleDecrementQty = (productId) => {
    const index = cart.findIndex(item => item.id === productId)
    if (index !== -1 && cart[index].qty > 1) {
      const newCart = [...cart]
      newCart[index].qty -= 1
      newCart[index].total = newCart[index].qty * newCart[index].price
      setCart(newCart)
    }
  }

  return (
    <div className="container">
      <Navbar title="Shop IT" />
      <hr />
      <span className="badge bg-danger">{cart.length}</span> item(s) in cart
      <hr />
      <CartTable cart={cart}
        onRemove={handleRemove}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        onIncrementQty={handleIncrementQty}
        onDecrementQty={handleDecrementQty}
      />
      <hr />
      <ProductList onBuy={handleBuy} cart={cart} />
    </div>
  )



}

export default App