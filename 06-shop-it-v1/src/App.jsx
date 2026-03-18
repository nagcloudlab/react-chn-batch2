import { useState } from 'react'
import classNames from 'classnames'


function App() {

  const products = [
    {
      id: 1,
      name: 'Laptop',
      price: 100000.00,
      description: 'A high-performance laptop for all your computing needs.',
      imageUrl: 'images/Laptop.png'
    },
    {
      id: 2,
      name: 'Mobile',
      price: 10000.00,
      description: 'A high-performance mobile for all your communication needs.',
      imageUrl: 'images/Mobile.png'
    }
  ]

  const [currentTab, setCurrentTab] = useState(1)

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
  }
  const isTabSelected = (tab) => {
    return currentTab === tab;
  }

  function renderTabPanel(product) {
    switch (currentTab) {
      case 1:
        return <p>{product.description}</p>
      case 2:
        return (
          <ul>
            <li>spec-1</li>
            <li>spec-2</li>
            <li>spec-3</li>
          </ul>
        )
      case 3:
        return <div>No reviews yet.</div>
      default:
        return null
    }
  }

  function renderProducts() {
    return products.map(product => {
      return (
        <div key={product.id} className="list-group-item">
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
                  <a onClick={() => handleTabChange(1)} className={classNames({ 'nav-link': true, 'active': isTabSelected(1) })} href="#">Description</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => handleTabChange(2)} className={classNames({ 'nav-link': true, 'active': isTabSelected(2) })} href="#">Specification</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => handleTabChange(3)} className={classNames({ 'nav-link': true, 'active': isTabSelected(3) })} href="#">Reviews</a>
                </li>
              </ul>
              {renderTabPanel(product)}
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="container">
      <div className="display-1">shop-IT</div>
      <hr />
      <div className="list-group">
        {renderProducts()}
      </div>

    </div>
  )



}

export default App