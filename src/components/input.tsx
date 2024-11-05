import React from "react";

export const Input = ({
  value = "",
  type = "text",
  onChange,
  renderIcon,
  maxLength = 32,
  ...props
}) => {
  return (
    <div className="flex justify-center">
      <div className={renderIcon && "relative w-fit"}>
        <input
          type={type}
          value={value}
          className="border border-solid border-blue rounded-md bg-white text-primary pl-2 pr-4 text-sm min-w-[220px] text-center"
          onChange={onChange}
          maxLength={maxLength ?? 50}
          {...props}
        />
        {renderIcon}
      </div>
    </div>
  );
};
