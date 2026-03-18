import { useReducer } from 'react';
import cartReducer from '../../reducers/cart';

function ReducerDemo() {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const product = { id: 1, name: 'iPhone 16 Pro Max', price: 120000 };

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <section id="reducer">
      <h2>useReducer</h2>
      <p className="lead">
        <code>useReducer</code> manages complex state with a reducer function. It accepts
        actions and returns predictable new state &mdash; ideal for state with multiple sub-values.
      </p>
      <ul>
        <li><strong>Reducer function</strong> &mdash; pure function: <code>(state, action) =&gt; newState</code></li>
        <li><strong>dispatch</strong> &mdash; sends actions to the reducer</li>
        <li><strong>Action types</strong> &mdash; describe what happened (ADD, REMOVE, INCREMENT, etc.)</li>
        <li><strong>Immutable updates</strong> &mdash; always return a new state object/array</li>
      </ul>

      <div className="card demo-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <strong>Shopping Cart</strong> &mdash; managed by <code>useReducer</code>
          </div>
          <span className="badge bg-primary rounded-pill">{cart.length} item(s)</span>
        </div>
        <div className="card-body">
          {cart.length === 0 ? (
            <p className="text-muted text-center py-3">Cart is empty. Add an item to get started.</p>
          ) : (
            <table className="table table-sm table-hover mb-3">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="text-center">
                      <span className="badge bg-secondary">{p.qty}</span>
                    </td>
                    <td className="text-end">
                      <span className="badge bg-success">&#8377; {p.total.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {cart.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-end fw-bold">Grand Total</td>
                    <td className="text-end">
                      <span className="badge bg-dark">&#8377; {grandTotal.toLocaleString()}</span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}

          <div className="d-flex gap-2 flex-wrap">
            <button
              onClick={() => dispatch({ type: 'ADD_TO_CART', product })}
              className="btn btn-sm btn-primary"
            >
              Add To Cart
            </button>
            <button
              onClick={() => dispatch({ type: 'INCREMENT_QTY', productId: 1 })}
              className="btn btn-sm btn-success"
              disabled={cart.length === 0}
            >
              + Qty
            </button>
            <button
              onClick={() => dispatch({ type: 'DECREMENT_QTY', productId: 1 })}
              className="btn btn-sm btn-warning"
              disabled={cart.length === 0}
            >
              - Qty
            </button>
            <button
              onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: 1 })}
              className="btn btn-sm btn-danger"
              disabled={cart.length === 0}
            >
              Remove
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="btn btn-sm btn-outline-secondary"
              disabled={cart.length === 0}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="code-snippet">
        <code>const [cart, dispatch] = useReducer(cartReducer, [])</code> &bull;{' '}
        <code>dispatch({'{ type: "ADD_TO_CART", product }'})</code>
      </div>
    </section>
  );
}

export default ReducerDemo;
