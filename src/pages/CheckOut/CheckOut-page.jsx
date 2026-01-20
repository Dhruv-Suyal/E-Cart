import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { EachCartItem } from './cart-item-container'
import './checkout-header.css'
import './CheckOut-page.css'
import logoPng from '../../assets/images/logo.png'
import checkoutLockIcon from '../../assets/images/icons/checkout-lock-icon.png'

export function Checkout({ cart, loadCart }) {
  const [deliveryOption, setDeliveryOption] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const navigate = useNavigate();

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity = totalQuantity + cartItem.quantity
  });

  useEffect(()=>{
    const checkOutData = async ()=>{
      const Response = await  axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
      setDeliveryOption(Response.data);
    }
    checkOutData();
  }, []);

  useEffect(() => {
    const checkOutData = async ()=>{
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
                  <EachCartItem key={cartItem.id} cartItem={cartItem} loadCart={loadCart} selectedDeliveryOption={selectedDeliveryOption} deliveryOption={deliveryOption}/>
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

            <button className="place-order-button button-primary" onClick={async ()=>{
              await axios.post('/api/orders');
              await loadCart();
              navigate('/orders');
            }}>
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