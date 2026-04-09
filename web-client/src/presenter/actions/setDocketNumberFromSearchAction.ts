import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const sanitizeSearchTerm = (searchTerm: string): string => {
  if (!searchTerm) {
    return '';
  }

  // Keep only characters that are valid for docket-number searches.
  return searchTerm.replace(/[^0-9A-Za-z-]/g, '');
};

export const trimDocketNumberSearch = (
  applicationContext: ClientApplicationContext,
  searchTerm: string = '',
): string => {
  if (searchTerm === '') {
    return '';
  }

  const sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
  const suffixes = Object.values(DOCKET_NUMBER_SUFFIXES).join('|');
  const docketNumberMatcher = new RegExp(
    `^(\\d{3,6}-\\d{2})(${suffixes})?$`,
    'i',
  );

  const match = docketNumberMatcher.exec(sanitizedSearchTerm.trim());
  const docketNumber = match && match.length > 1 ? match[1] : sanitizedSearchTerm;
  return docketNumber;
};

/**
 * sets the docket number from the search form in props
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.header.searchTerm
 * @returns {object} the docketNumber provided in the search term
 */
export const setDocketNumberFromSearchAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const searchTerm = get(state.header.searchTerm);
  const docketNumber = trimDocketNumberSearch(
    applicationContext,
    searchTerm,
  );
  return {
    docketNumber,
  };
};
