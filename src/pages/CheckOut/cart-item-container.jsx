import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import './CheckOut-page.css'


export function EachCartItem({ cartItem, selectedDeliveryOption, loadCart, deliveryOption }) {
    const [isUpdateClick, setIsUpdateClick] = useState(false);
    const [quantity, setQuantity] = useState(cartItem.quantity);

    async function updateButtonClick() {
        if (isUpdateClick) {
            await axios.put(`/api/cart-items/${cartItem.productId}`, {
                quantity: quantity
            })
            await loadCart();
            setIsUpdateClick(false)
        } else {
            setIsUpdateClick(true)
        }
    }

    async function keyDown(event){
        if(event.key === 'Enter'){
            await updateButtonClick();
        }
        else if(event.key === 'Escape'){
            setQuantity(cartItem.quantity);
            setIsUpdateClick(false);
        }
    }

    return (
        <>
            <div className="cart-item-container">
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

                            {isUpdateClick ?
                                <input className='updateInputBox' type="text" onKeyDown={keyDown} onChange={(event) => {
                                    setQuantity(Number(event.target.value))
                                }} /> :
                                <span >
                                    Quantity: <span className="quantity-label">{quantity}</span>
                                </span>

                            }

                            <span className="update-quantity-link link-primary" onClick={updateButtonClick}>
                                Update
                            </span>
                            <span className="delete-quantity-link link-primary" onClick={async () => {
                                await axios.delete(`/api/cart-items/${cartItem.productId}`);
                                await loadCart();
                            }}>
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
                                    <div key={deliveryOption.id} className="delivery-option" onClick={async () => {
                                        await axios.put(`/api/cart-items/${cartItem.productId}`, {
                                            deliveryOptionId: deliveryOption.id
                                        })
                                        await loadCart();
                                    }}>
                                        <input type="radio" checked={deliveryOption.id === cartItem.deliveryOptionId}
                                            className="delivery-option-input"
                                            name={`delivery-option-${cartItem.productId}`} onChange={() => { }} />
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
        </>
    )
}