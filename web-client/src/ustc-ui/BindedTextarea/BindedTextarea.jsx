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
  function BindedTextarea(props) {
    const { bind, className, onChange, simpleSetter, value } = props;

    let textValue, setText;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [textValue, setText] = useCerebralState(bind);
    } else {
      [textValue, setText] = useState();
    }

    setText = decorateWithPostCallback(setText, onChange);

    const prohibitedKeysOnTextarea = [
      'bind',
      'children',
      'get',
      'reaction',
      'simpleSetter',
    ];
    const textAreaProps = {
      ...props,
      className: classNames('usa-textarea', className),
      onChange: e => setText(e.target.value),
      value: textValue || '',
    };
    prohibitedKeysOnTextarea.forEach(attr => delete textAreaProps[attr]);

    return <textarea {...textAreaProps}></textarea>;
  },
);
