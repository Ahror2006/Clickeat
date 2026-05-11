export const Routers = {
    home: "/restaurant",
    cart: "/restaurant/cart",
    restaurant: (type: "id" | "hook", id?: number) => type === "hook" ? "/restaurant/:id" : "/restaurant/" + id,
    login: "/restaurant/login"
}