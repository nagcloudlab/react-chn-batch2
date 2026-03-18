import { useState } from "react";
import classNames from "classnames";

function Product({ product }) {

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

    return (
        <>
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
        </>
    )
}

export default Product;