import { state } from 'cerebral';

/**
 * validates the court-issued docket entry form
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCourtIssuedDocketEntryAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { EVENT_CODES_REQUIRING_SIGNATURE } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const entryMetadata = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validateCourtIssuedDocketEntryInteractor({
      entryMetadata,
    });

  if (entryMetadata.year && entryMetadata.year.toString().length !== 4) {
    if (!errors) {
      errors = {};
    }

    errors.date = errors.date || 'Enter a four-digit year';
  }

  if (
    entryMetadata.filingDateYear &&
    entryMetadata.filingDateYear.toString().length !== 4
  ) {
    if (!errors) {
      errors = {};
    }

    errors.filingDate = errors.filingDate || 'Enter a four-digit year';
  }

  // Additional validation to determine if the signature required warning should be displayed
  if (EVENT_CODES_REQUIRING_SIGNATURE.includes(entryMetadata.eventCode)) {
    const document = caseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    if (!document?.signedAt) {
      if (!errors) {
        errors = {};
      }

      errors.documentType = 'Signature required for this document.';
    }
  }

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'eventCode',
      'date',
      'judge',
      'freeText',
      'docketNumbers',
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
