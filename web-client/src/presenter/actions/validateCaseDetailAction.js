import { state } from 'cerebral';

export default ({ store, applicationContext, path, props }) => {
  const { combinedCaseDetailWithForm } = props;

  const errors = applicationContext.getUseCases().validateCaseDetail({
    caseDetail: combinedCaseDetailWithForm,
    applicationContext,
  });

  store.set(state.caseDetailErrors, errors);

  if (!errors) {
    return path.success({
      combinedCaseDetailWithForm,
    });
  } else {
    return path.error({ errors });
  }
};
