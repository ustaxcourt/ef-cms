import {
  US_STATES,
  US_STATES_OTHER,
  US_STATES_SORTED,
} from '@shared/business/entities/EntityConstants';

export const getGroupedStateOptions = (): {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[] => {
  const otherOptions = [
    ...Object.entries(US_STATES_OTHER).map(([value, label]) => ({
      label,
      value,
    })),
    { label: 'Other', value: 'Other' },
  ];
  return [
    { label: '', options: [{ label: 'N/A', value: 'N/A' }] },
    {
      label: 'States',
      options: US_STATES_SORTED.map(value => ({
        label: US_STATES[value],
        value,
      })),
    },
    {
      label: 'Other',
      options: otherOptions,
    },
  ];
};
