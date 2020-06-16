import { omit } from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

/**
 * properly casts a variety of inputs to a UTC ISOString
 * directly using the moment library to inspect the formatting of the input
 * before sending to application context functions to be transformed
 *
 * @param {object} applicationContext the application context
 * @param {string} dateString the date string to cast to an ISO string
 * @returns {string} the ISO string.
 */
export const castToISO = (applicationContext, dateString) => {
  if (dateString === '') {
    return null;
  }

  const formatDate = ds =>
    applicationContext.getUtilities().createISODateString(ds, 'YYYY-MM-DD');

  dateString = dateString
    .split('-')
    .map(segment => segment.padStart(2, '0'))
    .join('-');
  if (moment.utc(`${dateString}-01-01`, 'YYYY-MM-DD', true).isValid()) {
    return formatDate(`${dateString}-01-01`);
  } else if (moment.utc(dateString, 'YYYY-MM-DD', true).isValid()) {
    return formatDate(dateString);
  } else if (
    applicationContext.getUtilities().isStringISOFormatted(dateString)
  ) {
    return dateString;
  } else {
    return '-1';
  }
};

/**
 * checks if the new date contains all expected parts and returns date as an
 * ISO string; otherwise, it returns null
 *
 * @param {object} applicationContext the application context*
 * @param {string} updatedDateString the new date string to verify
 * @returns {string} the updatedDateString if everything is correct.
 */
export const checkDate = (applicationContext, updatedDateString) => {
  const hasAllDateParts = /.+-.+-.+/;
  if (updatedDateString.replace(/[-,undefined]/g, '') === '') {
    updatedDateString = null;
  } else {
    if (
      !updatedDateString.includes('undefined') &&
      hasAllDateParts.test(updatedDateString)
    ) {
      updatedDateString = castToISO(applicationContext, updatedDateString);
    } else {
      //xx-xx-undefined
      updatedDateString = null;
    }
  }
  return updatedDateString;
};

/**
 * combines the dates in the form with the caseDetails
 *
 * @param {object} providers the cerebral providers
 * @param {Function} providers.get the cerebral get function for getting the state.form
 * @returns {object} the formWithComputedDates
 */
export const getCaseDetailFormWithComputedDatesAction = ({
  applicationContext,
  get,
}) => {
  const {
    irsDay,
    irsMonth,
    irsYear,
    paymentDateDay,
    paymentDateMonth,
    paymentDateWaivedDay,
    paymentDateWaivedMonth,
    paymentDateWaivedYear,
    paymentDateYear,
    receivedAtDay,
    receivedAtMonth,
    receivedAtYear,
  } = {
    ...get(state.form),
  };

  const form = omit(
    {
      ...get(state.form),
    },
    [
      'irsYear',
      'irsMonth',
      'irsDay',
      'paymentDateYear',
      'paymentDateMonth',
      'paymentDateDay',
      'paymentDateWaivedYear',
      'paymentDateWaivedMonth',
      'paymentDateWaivedDay',
      'receivedAtYear',
      'receivedAtMonth',
      'receivedAtDay',
      'trialCities',
    ],
  );

  form.irsNoticeDate = checkDate(
    applicationContext,
    `${irsYear}-${irsMonth}-${irsDay}`,
  );
  form.petitionPaymentDate = checkDate(
    applicationContext,
    `${paymentDateYear}-${paymentDateMonth}-${paymentDateDay}`,
  );
  form.petitionPaymentWaivedDate = checkDate(
    applicationContext,
    `${paymentDateWaivedYear}-${paymentDateWaivedMonth}-${paymentDateWaivedDay}`,
  );
  form.receivedAt = checkDate(
    applicationContext,
    `${receivedAtYear}-${receivedAtMonth}-${receivedAtDay}`,
  );

  if (form.statistics) {
    form.statistics.forEach(statistic => {
      statistic.lastDateOfPeriod = checkDate(
        applicationContext,
        `${statistic.lastDateOfPeriodYear}-${statistic.lastDateOfPeriodMonth}-${statistic.lastDateOfPeriodDay}`,
      );
    });
  }

  return {
    formWithComputedDates: form,
  };
};
