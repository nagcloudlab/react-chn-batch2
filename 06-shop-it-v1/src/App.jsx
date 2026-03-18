


function App() {

  const product = {
    id: 1,
    name: 'Laptop',
    price: 100000.00,
    description: 'A high-performance laptop for all your computing needs.',
    imageUrl: 'images/Laptop.png'
  }

  return (
    <div className="container">
      <div className="display-1">shop-IT</div>
      <hr />
      <div className="list-group">
        <div className="list-group-item">
          <div className="row">
            <div className="col-4">
              <img src={product.imageUrl} className="img-fluid" alt={product.name} />
            </div>
            <div className="col-8">
              <div>{product.name}</div>
              <div>&#8377;{product.price}</div>
              <button className="btn btn-primary">Add to Cart</button>
              <ul className="mt-3 nav nav-tabs">
                <li className="nav-item">
                  <a className="nav-link" href="#">Description</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Specification</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link " href="#">Reviews</a>
                </li>
              </ul>

              <div>{product.description}</div>
              <div>Spec..</div>
              <div>Reviews...</div>


            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App