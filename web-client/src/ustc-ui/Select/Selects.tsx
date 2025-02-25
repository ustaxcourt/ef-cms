import React from 'react';

type FlatOptionsStructure = {
  value: string;
  label: string;
};

type GroupedOptionsStructure = {
  label: string;
  options: FlatOptionsStructure[];
};

type SelectParamsType = {
  defaultValue: { label: string; value: string };
  name: string;
  onChange: (value: string) => void;
  options: (FlatOptionsStructure | GroupedOptionsStructure)[];
  value: string;
};

function isFlatOptionsStructure(obj: any): obj is FlatOptionsStructure {
  return !!obj.value && !!obj.label;
}

function isGroupedOptionsStructure(obj: any): obj is GroupedOptionsStructure {
  return !!obj.label && !!obj.options;
}

export function Select({
  defaultValue,
  name,
  onChange,
  options,
  value,
}: SelectParamsType) {
  return (
    <>
      <select
        className="usa-select margin-bottom-2"
        name={name}
        value={value || ''}
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        {defaultValue && (
          <option key={defaultValue.label} value={defaultValue.value}>
            {defaultValue.label}
          </option>
        )}

        {options.map(option => {
          if (isFlatOptionsStructure(option)) {
            return (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            );
          } else if (isGroupedOptionsStructure(option)) {
            return (
              <optgroup key={option.label} label={option.label}>
                {option.options.map(childOptions => {
                  return (
                    <option key={childOptions.label} value={childOptions.value}>
                      {childOptions.label}
                    </option>
                  );
                })}
              </optgroup>
            );
          }
        })}
      </select>
    </>
  );
}
