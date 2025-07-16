import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateDocketEntryAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const entryMetadata = get(state.form);
  const { AMICUS_BRIEF_EVENT_CODE } = applicationContext.getConstants();

  let errors = applicationContext.getUseCases().validateDocketEntryInteractor({
    entryMetadata,
  });

  if (
    entryMetadata.eventCode === AMICUS_BRIEF_EVENT_CODE &&
    isEmpty(entryMetadata.otherFilingParty)
  ) {
    if (!errors) {
      errors = {};
    }
    errors.otherFilingParty = 'Enter the name of the amicus curiae';
  }

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'documentTitle',
      'primaryDocumentFile',
      'dateReceived',
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
      'filers',
      'partyIrsPractitioner',
      'otherFilingParty',
    ];

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
