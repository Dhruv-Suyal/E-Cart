import axios from 'axios'
import dayjs from 'dayjs'
import './orders-page.css'
import { useState, useEffect, Fragment } from 'react'
import { Header } from '../components/Header'
import buyAgainPng from '../assets/images/icons/buy-again.png'

export function Orders({ cart, loadCart }) {

  const [order, setOrder] = useState([]);

  useEffect(() => {
    const orderData = async ()=>{
      const Response = await axios.get('/api/orders?expand=products');
      setOrder(Response.data)
    }
    orderData();
  }, [])

  return (
    <>
      <link rel="icon" href="orders-favicon.png" />
      <title>Orders</title>
      <Header cart={cart} />
      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">

          {order.map((order) => {
            return (
              <Fragment key={order.id} >
                <div className="order-container">

                  <div className="order-header">
                    <div className="order-header-left-section">
                      <div className="order-date">
                        <div className="order-header-label">Order Placed:</div>
                        <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                      </div>
                      <div className="order-total">
                        <div className="order-header-label">Total:</div>
                        <div>${(order.totalCostCents / 100).toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="order-header-right-section">
                      <div className="order-header-label">Order ID:</div>
                      <div>{order.id}</div>
                    </div>
                  </div>

                  <div className="order-details-grid">
                    {order.products.map((orderProducts) => {
                      return (
                      <Fragment key={orderProducts.productId}>
                      <div className="product-image-container">
                      <img src={orderProducts.product.image} />
                    </div>

                    <div className="product-details">
                      <div className="product-name">
                        {orderProducts.product.name}
                      </div>
                      <div className="product-delivery-date">
                        Arriving on: {dayjs(orderProducts.estimatedDeliveryTimeMs).format('MMMM D')}
                      </div>
                      <div className="product-quantity">
                        Quantity: {orderProducts.quantity}
                      </div>
                      <button className="buy-again-button button-primary">
                        <img className="buy-again-icon" src={buyAgainPng} />
                        <span className="buy-again-message" onClick={async ()=>{
                          await axios.post('/api/cart-items', {
                          productId: orderProducts.productId,
                          quantity: 1
                          })
                          await loadCart();
                        }
                        } >Add to Cart</span>
                      </button>
                    </div>

                    <div className="product-actions">
                      <a href={`/tracking/${order.id}/${orderProducts.productId}`}>
                        <button className="track-package-button button-secondary">
                          Track package
                        </button>
                      </a>
                    </div>
                    </Fragment>
                      )
                    })}
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </>
  )
}