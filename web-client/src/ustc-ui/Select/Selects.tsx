import React from 'react';

export function Select({ defaultValue, name, onChange, options, value }) {
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
          if (option.value) {
            return (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            );
          } else if (option.options) {
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
