import {
  useReducer,
  useState,
} from 'react';

import Clock from './components/Clock';
import Message from './components/Message';

import cartReducer from './reducers/cart';
import A from './components/A';
import ColorContext from './contexts/ColorContext';


function App() {

  console.log("app rendered");

  const [message, setMessage] = useState("greetings");
  const [cart, dispatch] = useReducer(cartReducer, [])

  const handleGreeing = (m) => {
    setMessage(m); // trigger diffing and re-rendering
  }


  const handleBuy = () => {
    const action = {
      type: "ADD_TO_CART",
      product: {
        id: 1,
        name: "iphone 14 pro max",
        price: 120000
      }
    }
    dispatch(action);
  }

  const handleRemove = () => {
    const action = {
      type: "REMOVE_FROM_CART",
      productId: 1
    }
    dispatch(action);
  }

  const handleIncrement = () => {
    const action = {
      type: "INCREMENT_QTY",
      productId: 1
    }
    dispatch(action);
  }

  const handleDecrement = () => {
    const action = {
      type: "DECREMENT_QTY",
      productId: 1
    }
    dispatch(action);
  }

  const handleClear = () => {
    const action = {
      type: "CLEAR_CART"
    }
    dispatch(action);
  }




  return (
    <>
      <div className="container">
        <div className='card'>
          <div className='card-body'>
            <div className="display-1">react core conceps</div>
            <hr />
            <ColorContext.Provider value={"red"}>
              <A />
            </ColorContext.Provider>
            <hr />
            <ColorContext.Provider value={"green"}>
              <A />
            </ColorContext.Provider>
            <hr />
            <div className=''>Cart Items: {cart.length}</div>
            <div>
              {
                cart.map(p => <div key={p.id} className='d-flex justify-content-between align-items-center'>
                  <div>{p.name}</div>
                  <div>
                    <span className='badge bg-primary m-2'>{p.qty}</span>
                    <span className='badge bg-secondary m-2'>{p.total}</span>
                  </div>
                </div>)
              }
            </div>
            <hr />
            <div className='d-flex justify-content-around'>
              <button onClick={() => handleBuy()} className='btn btn-primary'>Add To Cart</button>
              <button onClick={() => handleRemove()} className='btn btn-danger'>Remove From Cart</button>
              <button onClick={() => handleIncrement()} className='btn btn-success'>Increment Qty</button>
              <button onClick={() => handleDecrement()} className='btn btn-warning'>Decrement Qty</button>
              <button onClick={() => handleClear()} className='btn btn-secondary'>Clear Cart</button>
            </div>

            <hr />

            <div className='d-flex justify-content-around'>
              <button onClick={e => handleGreeing("Good Morning")} className='btn btn-primary'>GM</button>
              <button onClick={e => handleGreeing("Good Noon")} className='btn btn-primary'>GN</button>
              <button onClick={e => handleGreeing("Good Evening")} className='btn btn-primary'>GE</button>
            </div>
            <hr />
            <Message message={message} />
            <hr />
            <div className='row'>
              <div className='col-4'>
                <Clock />
              </div>
              <div className='col-4'>
                <Clock timeZone="Asia/Dubai" />
              </div>
              <div className='col-4'>
                <Clock timeZone="America/New_York" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
