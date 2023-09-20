import {
  aggregatePetitionerErrors,
  aggregateStatisticsErrors,
} from './validatePetitionFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseDetailAction = ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const form = get(state.form);

  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();

  const findDocumentByType = type => {
    return form.docketEntries.find(document => document.documentType === type);
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
  if (form.isPaper) {
    errors = applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor(applicationContext, {
        petition: {
          ...form,
          ...initialDocumentFormFiles,
        },
      });
  } else {
    errors = applicationContext
      .getUseCases()
      .validateCaseDetailInteractor(applicationContext, {
        caseDetail: form,
      });
  }

  errors = aggregatePetitionerErrors({ errors });

  store.set(state.validationErrors, errors);

  if (!errors) {
    return path.success({
      form,
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
