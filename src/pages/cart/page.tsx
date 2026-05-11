import { Helmet } from "react-helmet"
import { ProductList } from "./product-list"

export const CartPage = () => {
    return <div className="bg-gradient-to-b from-white to-[#f5f5f5]">
        <Helmet>
            <title>Корзина</title>
        </Helmet>
        
        <ProductList />
    </div>
}