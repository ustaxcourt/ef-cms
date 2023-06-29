import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateOrderAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);

  const errors = applicationContext
    .getUseCases()
    .validateOrderAdvancedSearchInteractor({
      orderSearch,
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
