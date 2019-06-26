import { state } from 'cerebral';

/**
 * validates the case detail form and sets state.caseDetailErrors when errors occur.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.caseDetailErrors when validation errors occur
 * @param {object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {object} providers.props the cerebral store used for getting the props.combinedCaseDetailWithForm
 * @returns {object} the alertSuccess and the generated docketNumber
 */
export const validateCaseDetailAction = ({
  applicationContext,
  path,
  props,
  store,
}) => {
  const { combinedCaseDetailWithForm } = props;

  const errors = applicationContext.getUseCases().validateCaseDetail({
    applicationContext,
    caseDetail: combinedCaseDetailWithForm,
  });

  store.set(state.caseDetailErrors, errors || {});

  if (!errors) {
    return path.success({
      combinedCaseDetailWithForm,
    });
  } else {
    return path.error({ errors });
  }
};
