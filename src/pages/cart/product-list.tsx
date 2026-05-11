import { useCart } from "react-use-cart"
import { Container } from "../../widgets/container"
import { Product } from "./product";
import { useAuth } from "../../stores/auth.store";
import { Button } from "../../components/button";

export const ProductList = () => {
    const { isEmpty, totalUniqueItems, items, setItems } = useCart();

    const user = useAuth(state => state.user);

    const handleBuy = () => {
        const conf = confirm("Вы дейтвительно хотите заказать?");

        if (conf) {
            alert("Успешно")
            setItems([]);
        }
    }

    if (user.email === "" || user.password === "") {
        return <section className="py-16 min-h-[70vh] flex items-center justify-center">
            Пользователь не авторизован
        </section>
    }

    if (isEmpty) {
        return <section className="py-16 min-h-[70vh] flex items-center justify-center">
            Корзинка пустая
        </section>
    }

    return <section className="py-16">
        <Container>
            <h2 className="text-2xl font-bold">
                Корзинка ({totalUniqueItems})
            </h2>

            <ul className="pt-10 mb-5">
                {
                    items.map(item => <Product
                        key={item.id}
                        description={item?.description ?? ""}
                        id={Number(item.id)}
                        image={item?.image ?? ""}
                        name={item?.name ?? ""}
                        price={item.price}
                        quantity={item.quantity ?? 0}
                    />)
                }
            </ul>

            <Button
                color="blue"
                onClick={handleBuy}
                disabled={!items.length}
            >
                Оформить
            </Button>
        </Container>
    </section>
}