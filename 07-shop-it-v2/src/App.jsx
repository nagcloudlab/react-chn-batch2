import { useState } from 'react'
import classNames from 'classnames'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import CartTable from './components/CartTable'


function App() {

  const [cart, setCart] = useState([])

  const handleBuy = (product) => {
    setCart([...cart, product])
  }

  return (
    <div className="container">
      <Navbar title="Shop IT" />
      <hr />
      <span className="badge bg-danger">{cart.length}</span> item(s) in cart
      <hr />
      <CartTable cart={cart} />
      <hr />
      <ProductList onBuy={handleBuy} />
    </div>
  )



}

export default App