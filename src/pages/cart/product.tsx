import { useCart } from "react-use-cart";
import { Button } from "../../components/button";
import { toMoney } from "../../lib/util";

export const Product = ({
    description, id, name, price, quantity, image
}: Props) => {

    const { updateItemQuantity, getItem } = useCart();

    const Inc = () => {
        updateItemQuantity(id.toString(), quantity + 1)
    }

    const Dic = () => {
        updateItemQuantity(id.toString(), quantity - 1)
    }

    const totalPrice = getItem(id.toString())?.price *
        getItem(id.toString())?.quantity;

    return <li>
        <div className="flex items-center gap-10" >
            <div className="w-80 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-extrabold">
                    {name}
                </h3>

                <p className="text-base font-light">
                    {description}
                </p>

                <div className="flex gap-2 items-center">
                    <Button onClick={Inc} color="white">
                        +
                    </Button>

                    <big>{toMoney(price)}</big>

                    <Button onClick={Dic} color="white">
                        -
                    </Button>

                    <p>
                        Итого: {totalPrice}
                    </p>
                </div>
            </div>

        </div>
    </li>
}

interface Props {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
}