import axios from 'axios'
import { useEffect, useState } from 'react'
import {Routes, Route} from 'react-router'
import { HomePage } from "./pages/Home/Home-page"
import { Checkout } from './pages/CheckOut/CheckOut-page'
import { Orders } from './pages/order-page'
import { Tracking } from './pages/tracking-page'
import { ErrorPage } from './pages/404-page'
import './App.css'

function App() {
  const [cart, setCart] = useState([]);
  
  const loadCart = async ()=>{
      const Response = await axios.get('/api/cart-items?expand=product');
      setCart(Response.data);
  }

  useEffect(()=>{
    const appData = async ()=>
      {
        await loadCart();
      }
    appData();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage cart={cart} loadCart={loadCart} />}></Route>
        <Route path='/checkout' element={<Checkout cart={cart} loadCart={loadCart}></Checkout>}></Route>
        <Route path='/orders' element={<Orders cart={cart} loadCart={loadCart} />}/>
        <Route path='/tracking/:orderId/:productId' element={<Tracking cart={cart} />}/>
        <Route path='*' element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default App
