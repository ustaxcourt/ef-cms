import {
  US_STATES,
  US_STATES_OTHER,
  US_STATES_OTHER_SORTED,
  US_STATES_SORTED,
} from '@shared/business/entities/EntityConstants';

export const getGroupedStateOptions = (): {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[] => {
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
      options: US_STATES_OTHER_SORTED.map(value => ({
        label: US_STATES_OTHER[value],
        value,
      })),
    },
  ];
};
