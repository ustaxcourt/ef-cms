import { connect } from '@cerebral/react';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../utils/useCerebralState';
import { props, sequences, state } from 'cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

export const BindedSelect = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  function BindedSelect({
    ariaDescribedBy,
    ariaLabel,
    bind,
    children,
    className,
    id,
    name,
    onChange,
    simpleSetter,
    value,
  }) {
    let activeOption, setSelect;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [activeOption, setSelect] = useCerebralState(bind);
    } else {
      [activeOption, setSelect] = useState();
    }

    setSelect = decorateWithPostCallback(setSelect, onChange);

    return (
      <select
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel || name}
        className={classNames('usa-select', className)}
        id={id}
        name={name}
        value={activeOption || ''}
        onChange={e => setSelect(e.target.value)}
      >
        {children}
      </select>
    );
  },
);
