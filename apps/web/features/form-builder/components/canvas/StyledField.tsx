import React from "react";
import { Field } from "../../types";
import { cn } from "~/lib/utils";

interface StyledFieldProps {
  field: Field;
  children: React.ReactNode;
}

export const StyledField = ({ field, children }: StyledFieldProps) => {
  const {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    fontSize,
    textColor,
    textAlign
  } = field.props;

  const style: React.CSSProperties = {
    marginTop: marginTop ? `${marginTop}px` : undefined,
    marginBottom: marginBottom ? `${marginBottom}px` : undefined,
    marginLeft: marginLeft ? `${marginLeft}px` : undefined,
    marginRight: marginRight ? `${marginRight}px` : undefined,
    paddingTop: paddingTop ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom ? `${paddingBottom}px` : undefined,
    paddingLeft: paddingLeft ? `${paddingLeft}px` : undefined,
    paddingRight: paddingRight ? `${paddingRight}px` : undefined,
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const alignClass = textAlign ? alignClasses[textAlign as keyof typeof alignClasses] : "";
  const sizeClass = fontSize ? sizeClasses[fontSize as keyof typeof sizeClasses] : "";

  return (
    <div
      style={style}
      className={cn(
        "w-full transition-all",
        "[&_label]:!text-inherit [&_label]:!text-[length:inherit]",
        "[&_input]:!text-inherit [&_input]:!text-[length:inherit]",
        "[&_textarea]:!text-inherit [&_textarea]:!text-[length:inherit]",
        "[&_p]:!text-inherit [&_p]:!text-[length:inherit]",
        "[&_h1]:!text-inherit [&_h1]:!text-[length:inherit]",
        "[&_h2]:!text-inherit [&_h2]:!text-[length:inherit]",
        "[&_h3]:!text-inherit [&_h3]:!text-[length:inherit]",
        "[&_h4]:!text-inherit [&_h4]:!text-[length:inherit]",
        "[&_h5]:!text-inherit [&_h5]:!text-[length:inherit]",
        "[&_h6]:!text-inherit [&_h6]:!text-[length:inherit]",
        "[&_select]:!text-inherit [&_select]:!text-[length:inherit]",
        alignClass,
        sizeClass
      )}
    >
      {children}
    </div>
  );
};