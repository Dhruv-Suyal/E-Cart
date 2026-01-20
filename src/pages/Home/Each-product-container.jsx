import axios from "axios";
import { useState } from "react";
import checkMarkPng from '../../assets/images/icons/checkmark.png'

export function EachProductContainer({product, loadCart}){
     const [quantity, setQuantity] = useState(1);
     let [IsAddedToCart, setIsAddedToCart] = useState(false);

    if(IsAddedToCart){
      setTimeout(()=>{
        setIsAddedToCart(false);
     }, 2000);
    }

    return (
        <div className="product-container">
                  <div className="product-image-container">
                    <img className="product-image"
                      src={product.image} />
                  </div>

                  <div className="product-name limit-text-to-2-lines">
                    {product.name}
                  </div>

                  <div className="product-rating-container">
                    <img className="product-rating-stars"
                      src={`images/ratings/rating-${(product.rating.stars) * 10}.png`} />
                    <div className="product-rating-count link-primary">
                      {product.rating.count}
                    </div>
                  </div>

                  <div className="product-price">
                    ${(product.priceCents / 100).toFixed(2)}
                  </div>

                  <div className="product-quantity-container">
                    <select value={quantity} onChange={(event)=>{
                      setQuantity(Number(event.target.value))
                    }}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>

                  <div className="product-spacer"></div>

                  <div className="added-to-cart" style={{opacity: IsAddedToCart ? 1 : 0}}>
                    <img src={checkMarkPng} />
                    Added
                  </div>

                  <button onClick={async () => {
                    await axios.post('/api/cart-items', {
                      productId: product.id,
                      quantity: quantity
                    })
                    await loadCart();
                    setIsAddedToCart(true);
                  }} className="add-to-cart-button button-primary">
                    Add to Cart
                  </button>
                </div>
    )
}