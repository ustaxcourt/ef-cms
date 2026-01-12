import { connect } from '@web-client/presenter/shared.cerebral';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../Utils/useCerebralState';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

type BindedSelectProps = {
  children: React.ReactNode;
  bind?: string,
  className?: string;
  onChange?: ((value: any) => void) | Function;
  id?: string;
  name?: string;
  style?: any;
  placeholder?: string;
  value?: any;
  disabled?: boolean
};

export const BindedSelect: React.FC<BindedSelectProps> = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props`bind`],
  },
  function BindedSelect(componentProps: {
    bind: string;
    simpleSetter: Function;
    value: unknown;
    children?: React.ReactNode;
    className?: string;
    onChange?: ((value: string) => void) | Function;
    [key: string]: unknown;
  }) {
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

BindedSelect.displayName = 'BindedSelect';
