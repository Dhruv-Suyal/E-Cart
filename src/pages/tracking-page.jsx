import axios from 'axios'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Header } from '../components/Header'
import './tracking-page.css'

export function Tracking({cart}){
    const {orderId, productId} = useParams();
    const [order, setOrder] = useState(null);

    useEffect(()=>{
      const trackingData = async ()=>{
        const Response = await axios.get(`/api/orders/${orderId}?expand=products`);
        setOrder(Response.data);
      }
      trackingData();
    }, [orderId])

    console.log(order);

    if(!order){
      return null;
    }

    const orderProduct = order.products.find((orderProduct)=>{
          return orderProduct.productId === productId;
    })
    const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
    const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
    const progress = ((timePassedMs /totalDeliveryTimeMs)*100) >100 ? 100 : ((timePassedMs /totalDeliveryTimeMs)*100);
    let isPreparing = false;
    let isShipped = false;
    let isDelivered = false;
    if(progress < 33){
      isPreparing = true;
    }
    else if(progress>=33 && progress<100){
      isShipped = true;
    }
    else if(progress === 100){
      isDelivered = true;
    }
    console.log(totalDeliveryTimeMs, timePassedMs, progress)

    return (
        <>
            <title>Tracking</title>
             <link rel="icon" href="tracking-favicon.png" />
            <Header cart={cart}/>
            <div className="tracking-page">
      <div className="order-tracking">
        <a className="back-to-orders-link link-primary" href="/orders">
          View all orders
        </a>
        <div className="delivery-date">
          {progress >=100 ? 'Delivered on' : 'Arriving on'} {dayjs(orderProduct.estimatedDeliveryTimeMs).format('D MMMM')}
        </div>

        <div className="product-info">
          {orderProduct.product.name}
        </div>

        <div className="product-info">
          Quantity: {orderProduct.product.quantity}
        </div>

        <img className="product-image" src={orderProduct.product.image} />

        <div className="progress-labels-container">
          <div className={`progress-label ${isPreparing && 'current-status'}`}>
            Preparing
          </div>
          <div className={`progress-label ${isShipped && 'current-status'}`}>
            Shipped
          </div>
          <div className={`progress-label ${isDelivered && 'current-status'}`}>
            Delivered
          </div>
        </div>

        <div className="progress-bar-container">
          <div style={{width: `${progress}%`}} className="progress-bar"></div>
        </div>
      </div>
            </div>
        </>
    )
}