import type { ReactNode } from "react"

export const Container = ({children}:Props) => {
    return <div className="container mx-auto px-4">
        {children}
    </div>
}

interface Props {
    children: ReactNode
}