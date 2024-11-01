import { post } from '../requests';

export const setMessageAsReadInteractor = (
  applicationContext,
  { messageId },
) => {
  return post({
    applicationContext,
    endpoint: `/messages/${messageId}/read`,
  });
};
