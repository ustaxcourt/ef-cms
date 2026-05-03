import { state } from '@web-client/presenter/app.cerebral';

export const isNoticeOfWithdrawalAction = ({ get, path }: ActionProps) => {
  const { eventCode } = get(state.form);
  if (eventCode === 'NOTW') {
    return path.yes();
  } else {
    return path.no();
  }
};
