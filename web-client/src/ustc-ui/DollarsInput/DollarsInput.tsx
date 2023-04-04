import { NumericFormat } from 'react-number-format';
import React from 'react';

export const DollarsInput = props => {
  return (
    <NumericFormat
      {...props}
      decimalScale="2"
      fixedDecimalScale={true}
      prefix="$"
      thousandSeparator=","
      thousandsGroupStyle="thousand"
      valueIsNumericString={true}
    />
  );
};

DollarsInput.displayName = 'DollarsInput';
