import React, { useState } from 'react';

import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { isNumber } from 'lodash';

export default connect(function Counter(props) {
  let { get, bind, onClick } = props;

  let count, setCount;
  onClick = onClick || (() => {});

  if (bind) {
    count = get(state[bind]);
    setCount = newCount => {
      get(sequences.uswdsUiSetStateSequence)({
        key: bind,
        value: newCount,
      });
    };
    if (!isNumber(count)) {
      setCount((count = 0));
    }
  } else {
    [count, setCount] = useState(0);
  }

  setCount = (setterFn => {
    return (...args) => {
      setterFn(...args);
      onClick(...args);
    };
  })(setCount);

  return (
    <div>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Stuff
      </button>
    </div>
  );
});
