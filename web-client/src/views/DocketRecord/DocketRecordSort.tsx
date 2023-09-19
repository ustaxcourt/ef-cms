import React from 'react';

export function DocketRecordSort({ name, onChange, value }) {
  return (
    <select
      aria-label="docket record sort direction"
      className="usa-select margin-top-0 sort"
      id="docket-record-sort"
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
          label: 'Oldest',
          value: 'byDate',
        },
        {
          label: 'Newest',
          value: 'byDateDesc',
        },
        {
          label: 'Entry Number (Ascending)',
          value: 'byIndex',
        },
        {
          label: 'Entry Number (Descending)',
          value: 'byIndexDesc',
        },
      ].map(item => (
        <option key={item.value} role="option" value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
