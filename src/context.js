import React, { useState, useEffect } from 'react';
import { storeProducts, detailProduct } from './data'; 


const ProductContext = React.createContext();

export function ProductProvider(props) {

  const [state, setState] = useState({
    products: [],
    detailProduct: detailProduct,
    cart: []
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
    setState(prev => ({...prev, products: tempProducts, cart:[...prev.cart, product]}));
  }
  

  return (
    <ProductContext.Provider 
    value={{
      ...state,
      handleDetail,
      addToCart
    }}>
      {props.children}
    </ProductContext.Provider>

  )

}

export const ProductConsumer = ProductContext.Consumer;


