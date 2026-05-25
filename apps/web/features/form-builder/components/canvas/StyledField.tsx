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
    placeholderColor,
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
    color: textColor || undefined,
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

  const id = `field-wrapper-${field.id}`;

  return (
    <div
      id={id}
      style={style}
      className={cn(
        "w-full transition-all relative",
        "[&_label]:!text-inherit [&_label]:!text-[length:inherit]",
        "[&_input]:!text-inherit [&_input]:!text-[length:inherit]",
        "[&_textarea]:!text-inherit [&_textarea]:!text-[length:inherit]",
        field.type !== "sectionHeader" && "[&_p]:!text-inherit [&_p]:!text-[length:inherit]",
        "[&_select]:!text-inherit [&_select]:!text-[length:inherit]",
        alignClass,
        sizeClass
      )}
    >
      {placeholderColor && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${id} input::placeholder, #${id} textarea::placeholder {
              color: ${placeholderColor} !important;
              opacity: 1 !important;
            }
          `
        }} />
      )}
      {children}
    </div>
  );
};