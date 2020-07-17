import { connect } from '@cerebral/react';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../utils/useCerebralState';
import { props, sequences, state } from 'cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

export const BindedTextarea = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  function BindedTextarea({
    ariaLabel,
    bind,
    className,
    id,
    name,
    onChange,
    simpleSetter,
    value,
  }) {
    let textValue, setText;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [textValue, setText] = useCerebralState(bind);
    } else {
      [textValue, setText] = useState();
    }

    setText = decorateWithPostCallback(setText, onChange);

    return (
      <textarea
        aria-label={ariaLabel || name}
        className={classNames('usa-textarea', className)}
        id={id}
        name={name}
        value={textValue || ''}
        onChange={e => setText(e.target.value)}
      ></textarea>
    );
  },
);
