// import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the status report order response form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} apply stamp form helper fields
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const orderResponseHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  // What we need:
  // is this the lead case in a consolidated group?
  //   - conditionally expose radio buttons to add just the case to the PDF or
  //   - to add all of the cases in the group to the PDF

  const caseDetail = get(state.caseDetail);

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;

  const { DATE_FORMATS } = applicationContext.getConstants();

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  return {
    isLeadCase,
    minDate,
  };
};
