import React, { useState, useEffect } from 'react';
import { storeProducts, detailProduct } from './data'; 


const ProductContext = React.createContext();

export function ProductProvider(props) {

  const [state, setState] = useState({
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  });

  useEffect(() => {
    // use this approach to ensure products (state) is not the same ref as storeProducts (data) 
    const tempProducts = [];
    storeProducts.forEach(item => {
      tempProducts.push({...item});
    });
    setState(prev => ({...prev, products: tempProducts}));
  }, [])

  const getItem = (id) => {
    const product = state.products.find(item => item.id === id);
    return product;
  }

  const handleDetail = (id) => {
    const product = getItem(id);
    setState((prev) => ({...prev, detailProduct: product}));
  }
  
  const addToCart = (id) => {
    // use this approach to avoid messing up the order of items 
    let tempProducts = [...state.products];
    const index = tempProducts.indexOf(getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    
    let tempCart = [...state.cart, product]; 
    const {subTotal, tax, total } = addTotals(tempCart)
    setState(prev => ({
      ...prev, 
      products: tempProducts, 
      cart: tempCart, 
      cartSubTotal: subTotal, 
      cartTax: tax, 
      cartTotal: total }));
  }
  
  const openModal = (id) => {
    const product = getItem(id);
    setState(prev => ({...prev, modalProduct: product, modalOpen: true}));
  }

  const closeModal = () => {
    setState((prev)=>({...prev, modalOpen: false}));
  }

  const increment = (id) => {
    const tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count += 1;
    product.total = product.price * product.count;
    const { subTotal, tax, total } = addTotals(tempCart);
    setState(prev => ({...prev, cart: tempCart, cartSubTotal: subTotal, cartTax: tax, cartTotal: total}));

  }
  const decrement = (id) => {
    const tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count -= 1;
    if (product.count === 0) {
      removeItem(id);
      return;
    }
    product.total = product.price * product.count;
    const { subTotal, tax, total } = addTotals(tempCart);
    setState(prev => ({...prev, cart: tempCart, cartSubTotal: subTotal, cartTax: tax, cartTotal: total}));
  }

  const removeItem = (id) => {
    const tempProducts = [...state.products];
    let tempCart = [...state.cart];

    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    const {subTotal, tax, total} = addTotals(tempCart);
    setState(prev => ({
      ...prev, 
      cart: tempCart, 
      products: tempProducts, 
      cartSubTotal: subTotal, 
      cartTax: tax, 
      cartTotal: total}));
  }

  const addTotals = (cart) => {
    let subTotal = 0;
    cart.forEach(item => {
      subTotal += item.total;
    });
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    console.log('addTotals: ', subTotal, tax, total)
    return {subTotal, tax, total};
  }

  const clearCart = () => {
    const tempProducts = [];
    storeProducts.forEach(item => {
      tempProducts.push({...item});
    });
    setState(prev => ({...prev, products: tempProducts, cartSubTotal: 0, cartTax: 0, cartTotal: 0, cart: []}));
    
  }

  return (
    <ProductContext.Provider 
    value={{
      ...state,
      handleDetail,
      addToCart,
      openModal,
      closeModal,
      increment,
      decrement,
      removeItem,
      clearCart
    }}>
      {props.children}
    </ProductContext.Provider>

  )

}

export const ProductConsumer = ProductContext.Consumer;


