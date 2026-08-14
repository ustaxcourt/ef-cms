import { state } from '@web-client/presenter/app.cerebral';

export const getMessagePageAction = ({ get, path }: ActionProps) => {
  const currentPage = get(state.currentPage);

  if (currentPage === 'MessageDetail') {
    return path.detail();
  }

  if (currentPage === 'DocketClerkReport') {
    return path.docketClerkReport();
  }

  return path.inbox();
};
