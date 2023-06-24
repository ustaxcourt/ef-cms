import { DeadlineSearch } from '../entities/deadlines/DeadlineSearch';

export const validateSearchDeadlinesInteractor = ({
  deadlineSearch,
}: {
  deadlineSearch: any;
}) => {
  const search = new DeadlineSearch(deadlineSearch);

  return search.getFormattedValidationErrors();
};
