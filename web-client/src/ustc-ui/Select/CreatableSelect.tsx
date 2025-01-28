import { GroupBase, Props } from 'react-select';
import Creatable from 'react-select/creatable';
import React from 'react';
import classNames from 'classnames';

export function CreatableSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <div data-testid={props['data-testid']}>
      <Creatable
        {...props}
        className={classNames('select-react-element', props.className)}
        classNamePrefix={'select-react-element'}
        formatCreateLabel={inputValue => `Use "${inputValue}"`}
        placeholder={props.placeholder || '- Select -'}
      />
    </div>
  );
}

CreatableSelect.displayName = 'CreatableSelect';
