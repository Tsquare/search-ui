import React, { ReactNode } from "react";

export type InputViewProps = {
  getAutocomplete: () => ReactNode;
  getButtonProps: (additionalProps?: any) => any;
  getInputProps: (additionalProps?: any) => any;
};

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps
}: InputViewProps) {
  return (
    <>
      <div className="sui-search-box__wrapper">
        <input {...getInputProps()} />
        {getAutocomplete()}
      </div>
      <input {...getButtonProps()} />
    </>
  );
}

export default SearchInput;
