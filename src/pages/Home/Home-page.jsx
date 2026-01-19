import axios from 'axios'
import { useEffect, useState } from 'react'
import './Home-page.css'
import { Header } from '../../components/Header'
import { EachProductContainer } from './Each-product-container'

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
 
  useEffect(() => {
    const homeData = async () => {
      const Response = await axios.get('/api/products');
      setProducts(Response.data);
    }
    homeData();
  }, []);

  return (
    <>
      <link rel="icon" href="home-favicon.png" />
      <Header cart={cart} />

      <div className="home-page">
        <div className="products-grid">
          {
            products.map((product) => {
              return (
                <EachProductContainer product={product} loadCart={loadCart} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}