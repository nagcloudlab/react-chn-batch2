import { useReducer } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import CartTable from './components/CartTable'
import { CartContext } from './contexts/CartContext'
import cartReducer from './redurces/cart'


function App() {

  const [cart, dispatch] = useReducer(cartReducer, [])

  return (
    <div className="container">
      <CartContext.Provider value={{
        cart: cart,
        dispatch: dispatch
      }}>
        <Navbar title="Shop IT" />
        <CartTable />
        <hr />
        <ProductList />
      </CartContext.Provider>
    </div>
  )



}

export default App