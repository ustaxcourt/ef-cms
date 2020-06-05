import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedMessageDetail = (get, applicationContext) => {
  const messageDetail = get(state.messageDetail);

  const formattedMessageDetail = {
    ...messageDetail,
    createdAtFormatted: formatDateIfToday(
      messageDetail.createdAt,
      applicationContext,
    ),
  };

  return formattedMessageDetail;
};
