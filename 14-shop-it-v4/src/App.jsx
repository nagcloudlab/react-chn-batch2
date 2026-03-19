import { useReducer, useState } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import CartTable from './components/CartTable'
import { CartContext } from './contexts/CartContext'
import cartReducer from './redurces/cart'
import { Route, Routes } from 'react-router-dom'

import Home from './components/Home'


function App() {

  const [cart, dispatch] = useReducer(cartReducer, [])

  return (
    <div className="container">
      <CartContext.Provider value={{
        cart,
        dispatch
      }}>
        <Navbar title="Shop IT" />
        <hr />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/cart' element={<CartTable />} />
        </Routes>

      </CartContext.Provider>
    </div>
  )



}

export default App