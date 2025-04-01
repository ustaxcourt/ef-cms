import {
  US_STATES,
  US_STATES_OTHER,
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
    {
      label: 'States',
      options: Object.entries(US_STATES).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      label: 'Other',
      options: otherOptions,
    },
  ];
};
