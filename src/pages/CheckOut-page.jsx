import axios from 'axios'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import './checkout-header.css'
import './CheckOut-page.css'
import logoPng from '../assets/images/logo.png'
import checkoutLockIcon from '../assets/images/icons/checkout-lock-icon.png'

export function Checkout({ cart, loadCart }) {
  const [deliveryOption, setDeliveryOption] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity = totalQuantity + cartItem.quantity
  });

  useEffect(() => {
    const checkOutData = async ()=>{
      const Response = await  axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
      setDeliveryOption(Response.data);
      const res = await axios.get('/api/payment-summary');
      setPaymentSummary(res.data);
    }
    checkOutData();

  }, [cart])
  
  return (
    <>
      <title>Checkout</title>
      <link rel="icon" href="cart-favicon.png" />

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src={logoPng} />
              <img className="mobile-logo" src={logoPng} />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (<a className="return-to-home-link"
              href="/">{totalQuantity} items</a>)
          </div>

          <div className="checkout-header-right-section">
            <img src={checkoutLockIcon} />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {
               deliveryOption.length > 0 && cart.map((cartItem) => {
                const selectedDeliveryOption = deliveryOption.find((deliveryOption) => {
                  return deliveryOption.id === cartItem.deliveryOptionId
                })
                return (
                  <div key={cartItem.id} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                    </div>

                    <div className="cart-item-details-grid">
                      <img className="product-image"
                        src={cartItem.product.image} />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          ${(cartItem.product.priceCents / 100).toFixed(2)}
                        </div>
                        <div className="product-quantity">
                          <span>
                            Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                          </span>
                          <span className="update-quantity-link link-primary">
                            Update
                          </span>
                          <span className="delete-quantity-link link-primary">
                            Delete
                          </span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        {
                          deliveryOption.map((deliveryOption) => {
                            return (
                              <div key={deliveryOption.id} className="delivery-option" onClick={async ()=>{
                                await axios.put(`/api/cart-items/${cartItem.productId}`, {
                                  deliveryOptionId:deliveryOption.id
                                })
                                await loadCart();
                              }}>
                                <input type="radio" checked={deliveryOption.id === cartItem.deliveryOptionId}
                                  className="delivery-option-input"
                                  name={`delivery-option-${cartItem.productId}`} />
                                <div>
                                  <div className="delivery-option-date">
                                    {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                                  </div>
                                  <div className="delivery-option-price">
                                    {deliveryOption.priceCents <= 0 ? 'FREE Shipping' : `$${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                )
              })

            }

          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">
              Payment Summary
            </div>
            {paymentSummary && 
            (
              <>
               <div className="payment-summary-row">
              <div>Items ({paymentSummary.totalItems}):</div>
              <div className="payment-summary-money">${(paymentSummary.productCostCents /100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">${(paymentSummary.shippingCostCents /100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">${(paymentSummary.totalCostBeforeTaxCents /100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">${(paymentSummary.taxCents /100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">${(paymentSummary.totalCostCents /100).toFixed(2)}</div>
            </div>

            <button className="place-order-button button-primary">
              Place your order
            </button>
              </>
            )
            }
          </div>
        </div>
      </div>
    </>
  )
}