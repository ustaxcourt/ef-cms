import React from 'react';
import ReactSelect, { GroupBase, Props } from 'react-select';
import classNames from 'classnames';

export function SelectSearch2<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <div data-testid={props['data-testid']}>
      <ReactSelect
        {...props}
        className={classNames('select-react-element', props.className)}
        classNamePrefix={'select-react-element'}
        placeholder={props.placeholder || '- Select -'}
      />
    </div>
  );
}

SelectSearch2.displayName = 'SelectSearch2';
