import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedMessageDetail = (get, applicationContext) => {
  const messageDetail = get(state.messageDetail)[0]; //todo in later task

  const result = {
    ...messageDetail,
    createdAtFormatted: formatDateIfToday(
      messageDetail.createdAt,
      applicationContext,
    ),
  };

  return result;
};
