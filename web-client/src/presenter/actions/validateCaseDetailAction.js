import {
  aggregatePetitionerErrors,
  aggregateStatisticsErrors,
} from './validatePetitionFromPaperAction';
import { state } from 'cerebral';

/**
 * validates the case detail form and sets state.validationErrors when errors occur.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {object} providers.props the cerebral store used for getting the props.formWithComputedDates
 * @param {object} providers.store the cerebral store used for setting the state.validationErrors when validation errors occur
 * @returns {object} the alertSuccess and the generated docketNumber
 */
export const validateCaseDetailAction = ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  const { formWithComputedDates } = props;
  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();

  const findDocumentByType = type => {
    return formWithComputedDates.docketEntries.find(
      document => document.documentType === type,
    );
  };

  const initialDocumentFormFiles = {};
  Object.keys(INITIAL_DOCUMENT_TYPES_MAP).forEach(key => {
    const foundDocument = findDocumentByType(INITIAL_DOCUMENT_TYPES_MAP[key]);
    if (foundDocument) {
      initialDocumentFormFiles[key] = {};
      initialDocumentFormFiles[`${key}Size`] = 1;
    }
  });

  let errors;
  if (formWithComputedDates.isPaper) {
    errors = applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor(applicationContext, {
        petition: {
          ...formWithComputedDates,
          ...initialDocumentFormFiles,
        },
      });
  } else {
    errors = applicationContext
      .getUseCases()
      .validateCaseDetailInteractor(applicationContext, {
        caseDetail: formWithComputedDates,
      });
  }

  errors = aggregatePetitionerErrors({ errors });

  store.set(state.validationErrors, errors || {});

  if (!errors) {
    return path.success({
      formWithComputedDates,
    });
  } else {
    const errorDisplayMap = {
      statistics: 'Statistics',
    };

    const { errors: formattedErrors } = aggregateStatisticsErrors({
      errors,
      get,
    });

    return path.error({ errorDisplayMap, errors: formattedErrors });
  }
};
