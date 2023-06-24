import { state } from '@web-client/presenter/app.cerebral';

/**
 * determines if the current url path is a case detail route and returns the appropriate path
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {path} the cerebral path object that contains the next path in the sequence
 * @returns {Function} the next path in the sequence
 */
export const getIsOnCaseDetailAction = ({ get, path }: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  let isOnCaseDetail = false;

  if (
    docketNumber &&
    window.location.pathname === `/case-detail/${docketNumber}`
  ) {
    isOnCaseDetail = true;
  }

  if (isOnCaseDetail) {
    return path.yes();
  } else {
    return path.no();
  }
};
