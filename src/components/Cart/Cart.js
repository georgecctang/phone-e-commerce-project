import Title from '../Title';
import CartColumns from './CartColumns';
import EmptyCart   from './EmptyCart';
import CartList from './CartList';
import CartTotals from './CartTotals';
import { ProductConsumer } from '../../context';

export default function Cart() {
  return (
    <ProductConsumer>
      {value => {
        const {cart} = value;
        if (cart.length) {
          return (
            <>
              <Title name="your" title="cart" />
              <CartColumns />
              <CartList value={value} />
              <CartTotals value={value}/>
            </>
          );
        }
        return  <EmptyCart />;
      }
    }
    </ProductConsumer>
  )

} 