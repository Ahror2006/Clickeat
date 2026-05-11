import type { ComponentProps } from "react"

export const Button = ({
    children,
    className,
    type,
    color,
    ...props
}: Props) => {

    const classNames = color === "blue" ? "bg-blue-500 text-white border-blue-500" : "border-gray-500 bg-white text-black";

    return <button
        type={type}
        className={"inline-flex gap-[4px] py-[8px] px-[16px] rounded-[2px] border items-center " + classNames + " " + className}
        {...props}
    >
        {children}
    </button>
}

interface Props extends ComponentProps<"button"> {
    color: "white" | "blue"
}