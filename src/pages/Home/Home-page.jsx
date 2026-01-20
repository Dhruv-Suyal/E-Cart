import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import './Home-page.css'
import { Header } from '../../components/Header'
import { EachProductContainer } from './Each-product-container'

export function HomePage({ cart, loadCart }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search')
  console.log(search);
  const [products, setProducts] = useState([]);
 
  useEffect(() => {
    const homeData = async () => {
      if(search){
        const Response = await axios.get(`/api/products?search=${search}`);
      setProducts(Response.data);
      }else{
      const Response = await axios.get('/api/products');
      setProducts(Response.data);
      }
    }
    homeData();
  }, [search]);

  return (
    <>
      <link rel="icon" href="home-favicon.png" />
      <Header cart={cart} />

      <div className="home-page">
        <div className="products-grid">
          {
            products.map((product) => {
              return (
                <EachProductContainer key={product.id} product={product} loadCart={loadCart} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}