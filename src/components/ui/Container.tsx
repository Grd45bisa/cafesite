import React from "react";

export interface ContainerProps {
  as?: "div" | "section" | "article" | "header" | "footer";
  size?: "default" | "narrow" | "wide";
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Komponen UI Container dasar CafeSite (Server Component)
 * Menjaga lebar konten konsisten dan mencegah overflow horizontal di layar 375px
 */
export function Container({
  as: Component = "div",
  size = "default",
  children,
  className = "",
  id,
}: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };

  return (
    <Component
      id={id}
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
