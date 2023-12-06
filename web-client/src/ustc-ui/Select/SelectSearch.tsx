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
  onChange: (newValue: any, actionMeta: ActionMeta<any>) => void;
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

  function resetOptions() {
    setInputText('');
    setSelectOptions(options);
  }

  let sortedOptions = getSortedOptions(selectOptions, inputText);

  const aria = {
    'aria-describedby': props['aria-describedby'],
    'aria-disabled': disabled || props['aria-disabled'],
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
  };

  return (
    <div data-testid={props['data-testid']}>
      <ReactSelect
        {...aria}
        className={classNames('select-react-element', className)}
        classNamePrefix="select-react-element"
        id={id}
        isClearable={isClearable}
        isDisabled={disabled || props['aria-disabled']}
        name={name}
        options={sortedOptions}
        placeholder={placeholder}
        value={value}
        onBlur={resetOptions}
        onChange={(newValue, actionMeta) => {
          onChange(newValue, actionMeta);
          resetOptions();
        }}
        onInputChange={handleOnInputChange}
      />
    </div>
  );
};

SelectSearch.displayName = 'SelectSearch';
