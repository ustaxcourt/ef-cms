import React from 'react';

export function DocketRecordSort({ name, onChange, value }) {
  return (
    <select
      aria-label="docket record sort direction"
      className="usa-select margin-top-0 sort"
      name={name}
      value={value}
      onChange={e => {
        onChange({
          key: e.target.name,
          value: e.target.value,
        });
      }}
    >
      {[
        {
          label: 'oldest',
          value: 'byDate',
        },
        {
          label: 'newest',
          value: 'byDateDesc',
        },
        {
          label: 'no. (ascending)',
          value: 'byIndex',
        },
        {
          label: 'no. (descending)',
          value: 'byIndexDesc',
        },
      ].map(item => (
        <option key={item.value} value={item.value}>
          Sort by {item.label}
        </option>
      ))}
    </select>
  );
}
