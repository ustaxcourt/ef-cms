import NumberFormat from 'react-number-format';
import React from 'react';

export const DollarsInput = props => {
  return (
    <NumberFormat
      {...props}
      decimalScale="2"
      fixedDecimalScale={true}
      isNumericString={true}
      prefix="$"
      thousandSeparator={true}
    />
  );
};
