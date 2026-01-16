import {Routes, Route} from 'react-router'
import { HomePage } from "./pages/Home-page"
import { Checkout } from './pages/CheckOut-page'
import { Orders } from './pages/order-page'
import { Tracking } from './pages/tracking-page'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/checkout' element={<Checkout></Checkout>}></Route>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/tracking' element={<Tracking/>}/>
      </Routes>
    </>
  )
}

export default App
