import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedMessageDetail = (get, applicationContext) => {
  const messageDetail = get(state.messageDetail);

  const result = {
    ...messageDetail,
    attachments: messageDetail.attachments || [],
    createdAtFormatted: formatDateIfToday(
      messageDetail.createdAt,
      applicationContext,
    ),
  };

  return result;
};
