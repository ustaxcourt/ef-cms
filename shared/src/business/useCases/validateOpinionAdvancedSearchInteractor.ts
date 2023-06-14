import { DocumentSearch } from '../entities/documents/DocumentSearch';

export const validateOpinionAdvancedSearchInteractor = ({
  opinionSearch,
}: {
  opinionSearch: any;
}) => {
  const search = new DocumentSearch(opinionSearch);

  return search.getFormattedValidationErrors();
};
