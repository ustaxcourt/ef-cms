import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseSearch = get(state.advancedSearchForm.caseSearchByName);
  const errors = applicationContext
    .getUseCases()
    .validateCaseAdvancedSearchInteractor({
      caseSearch,
    });

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        messages: Object.values(errors),
        title: 'Please correct the following errors:',
      },
      errors,
    });
  }
};
