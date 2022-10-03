import { NumericFormat } from 'react-number-format';
import React from 'react';

export const DollarsInput = props => {
  return (
    <NumericFormat
      {...props}
      decimalScale="2"
      fixedDecimalScale={true}
      isNumericString={true}
      prefix="$"
    />
  );
};
