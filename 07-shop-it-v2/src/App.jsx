import { useState } from 'react'
import classNames from 'classnames'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'


function App() {
  return (
    <div className="container">
      <Navbar title="Shop IT" />
      <hr />
      <span className="badge bg-danger">0</span> item(s) in cart
      <hr />
      <ProductList />
    </div>
  )



}

export default App