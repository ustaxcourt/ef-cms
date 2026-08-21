import { DocumentSearch } from '@web-api/business/entities/documents/DocumentSearch';

export const validateOrderAdvancedSearchInteractor = ({
  orderSearch,
}: {
  orderSearch: any;
}) => {
  const search = new DocumentSearch(orderSearch);

  return search.getFormattedValidationErrors();
};
