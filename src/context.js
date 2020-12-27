import React, {useState } from 'react';
import { storeProducts, detailProduct } from './data'; 


const ProductContext = React.createContext();

export function ProductProvider(props) {

  const [state, setState] = useState({products: storeProducts, detailProduct: detailProduct});

  const handleDetail = () => {
    console.log('hello from detail');
  }
  const addToCart = () => {
    console.log('hello from add to cart');
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


