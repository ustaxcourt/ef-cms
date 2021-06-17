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
  function BindedSelect(componentProps) {
    const { bind, children, className, onChange, simpleSetter, value } =
      componentProps;
    let activeOption, setSelect;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [activeOption, setSelect] = useCerebralState(bind);
    } else {
      [activeOption, setSelect] = useState();
    }

    setSelect = decorateWithPostCallback(setSelect, onChange);

    const prohibitedKeysOnSelect = [
      'bind',
      'children',
      'get',
      'reaction',
      'simpleSetter',
    ];
    const selectProps = {
      ...componentProps,
      className: classNames('usa-select', className),
      onChange: e => setSelect(e.target.value),
      value: activeOption || '',
    };
    prohibitedKeysOnSelect.forEach(attr => delete selectProps[attr]);

    return <select {...selectProps}>{children}</select>;
  },
);
