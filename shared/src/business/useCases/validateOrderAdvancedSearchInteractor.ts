import { DocumentSearch } from '../entities/documents/DocumentSearch';

export const validateOrderAdvancedSearchInteractor = ({
  orderSearch,
}: {
  orderSearch: any;
}) => {
  const search = new DocumentSearch(orderSearch);

  return search.getFormattedValidationErrors();
};
