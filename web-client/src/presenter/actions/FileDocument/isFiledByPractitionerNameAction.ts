import { state } from '@web-client/presenter/app.cerebral';

export const isFiledByPractitionerNameAction = ({ get, path }: ActionProps) => {
  const { eventCode, secondaryDocument } = get(state.form);
  if (
    eventCode === 'NOTW' ||
    eventCode === 'M112' ||
    secondaryDocument?.eventCode === 'M112'
  ) {
    return path.yes();
  }
  return path.no();
};
