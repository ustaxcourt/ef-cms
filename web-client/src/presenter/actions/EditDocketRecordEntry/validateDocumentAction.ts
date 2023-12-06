import { isEmpty, omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the docket record.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateDocumentAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const formMetadata = get(state.form);
  const editType = get(state.screenMetadata.editType); // Document, CourtIssued, NoDocument

  let errors = applicationContext
    .getUseCases()
    .validateDocumentInteractor(applicationContext, {
      document: formMetadata,
    });

  let errorDisplayOrder = ['description', 'eventCode', 'filingDate', 'index'];

  if (editType === 'Document') {
    errors = omit(
      {
        ...errors,
        ...applicationContext.getUseCases().validateDocketEntryInteractor({
          entryMetadata: formMetadata,
        }),
      },
      ['receivedAt', 'filers'],
    );

    errorDisplayOrder = [
      ...errorDisplayOrder,
      'receivedAt',
      'eventCode',
      'freeText',
      'freeText2',
      'previousDocument',
      'serviceDate',
      'trialLocation',
      'ordinalValue',
      'otherIteration',
      'certificateOfServiceDate',
      'objections',
    ];
  }

  if (editType === 'CourtIssued') {
    errors = {
      ...errors,
      ...applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor({
          entryMetadata: formMetadata,
        }),
    };

    errorDisplayOrder = [
      ...errorDisplayOrder,
      'eventCode',
      'date',
      'judge',
      'freeText',
      'docketNumbers',
    ];
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
