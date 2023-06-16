/* eslint-disable import/named */
import { getSortedOptions } from '../../ustc-ui/Utils/selectSearchHelper';
import React, { useState } from 'react';
import ReactSelect, {
  ActionMeta,
  GroupBase,
  OptionsOrGroups,
} from 'react-select';
import classNames from 'classnames';

export const SelectSearch = ({
  className,
  disabled,
  id,
  isClearable = true,
  name,
  onChange,
  onInputChange,
  options,
  placeholder = '- Select -',
  searchableOptions,
  value,
  ...props
}: {
  className?: string;
  disabled?: boolean;
  id?: string;
  isClearable?: boolean;
  name?: string;
  onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
  onInputChange?: Function;
  options?: OptionsOrGroups<any, GroupBase<any>> | undefined;
  placeholder?: string;
  searchableOptions?: OptionsOrGroups<any, GroupBase<any>> | undefined;
  value?: any;
}) => {
  const [inputText, setInputText] = useState('');
  const [selectOptions, setSelectOptions] = useState(options);

  function handleOnInputChange(newInputText, { action }) {
    if (action === 'input-change') {
      setInputText(newInputText);
      if (newInputText === '') {
        setSelectOptions(options);
      } else if (searchableOptions) {
        setSelectOptions(searchableOptions);
      }
    }
    if (typeof onInputChange === 'function') {
      onInputChange(newInputText, action);
    }
  }

  let sortedOptions = getSortedOptions(selectOptions, inputText);

  return (
    <ReactSelect
      className={classNames('select-react-element', className)}
      classNamePrefix="select-react-element"
      id={id}
      isClearable={isClearable}
      isDisabled={disabled || props['aria-disabled']}
      name={name}
      options={sortedOptions}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInputChange={handleOnInputChange}
    />
  );
};

SelectSearch.displayName = 'SelectSearch';
