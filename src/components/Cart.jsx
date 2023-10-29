import { useContext, useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import AppContext from "../context/AppContext";
import MyOrders from "../containers/MyOrders";

const Cart = () => {
  const [toggleOrders, setToggleOrders] = useState(false);
  const { totalItemQuantity } = useContext(AppContext);

  return (
    <>
      <BiShoppingBag
        className="iconCart"
        onClick={() => setToggleOrders(!toggleOrders)}
      ></BiShoppingBag>

      {totalItemQuantity() !== 0 && (
        <div className="count">{totalItemQuantity()}</div>
      )}
      {toggleOrders && <MyOrders />}
    </>
  );
};
export default Cart;
