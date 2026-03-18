import { useState } from 'react'
import classNames from 'classnames'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'


function App() {
  return (
    <div className="container">
      <Navbar title="Shop IT" />
      <hr />
      <ProductList />
    </div>
  )



}

export default App