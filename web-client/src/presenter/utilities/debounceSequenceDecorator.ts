import { debounce } from 'cerebral/factories';

export const debounceSequenceDecorator = (
  debounceTime: number,
  actionsList: any[],
) => {
  return [debounce(debounceTime), { continue: actionsList, discard: [] }];
};
