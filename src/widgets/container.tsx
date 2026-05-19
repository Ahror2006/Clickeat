import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Container = ({ children, className = "" }: Props) => {
  return (
    <div
      className={`
        mx-auto
        w-full
        max-w-[1480px]
        px-4
        sm:px-6
        lg:px-8
        ${className}
      `}
    >
      {children}
    </div>
  );
};