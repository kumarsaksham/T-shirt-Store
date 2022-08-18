import { useEffect, useState } from "react";
import Base from "./Base";
import { loadCart } from "./helper/cartHelper";
import Menu from "./Menu";
import PaymentBT from "./PaymentBT";


const Checkout = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart())
    },[reload]);
    return (
        <Base title="Checkout Section" description="checkout">
            <PaymentBT products={products} setReload={setReload} />
        </Base>
    );
}
 
export default Checkout;