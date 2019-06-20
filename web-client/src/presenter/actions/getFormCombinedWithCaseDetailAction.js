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
 * checks if the new date contains all expected parts; otherwise, it returns the originalDate
 *
 * @param {object} applicationContext the application context*
 * @param {string} updatedDateString the new date string to verify
 * @param {string} originalDate the original date to return if the updatedDateString is bad
 * @returns {string} the updatedDateString if everything is correct.
 */
export const checkDate = (
  applicationContext,
  updatedDateString,
  originalDate,
) => {
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
      if (originalDate) {
        updatedDateString = originalDate;
      } else {
        updatedDateString = null;
      }
    }
  }
  return updatedDateString;
};

/**
 * combines the dates in the form with the caseDetails
 *
 * @param {object} providers the cerebral providers
 * @param {Function} providers.get the cerebral get function for getting the state.caseDetail
 * @param {object} providers.props the cerebral props object
 * @returns {object} the combinedCaseDetailWithForm
 */
export const getFormCombinedWithCaseDetailAction = ({
  applicationContext,
  get,
  props,
}) => {
  const caseDetail = { ...get(state.caseDetail) };
  let caseCaption = props.caseCaption;
  const {
    irsYear,
    irsMonth,
    irsDay,
    payGovYear,
    payGovMonth,
    payGovDay,
    receivedAtYear,
    receivedAtMonth,
    receivedAtDay,
  } = {
    ...get(state.form),
  };

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${irsYear}-${irsMonth}-${irsDay}`,
      payGovDate: `${payGovYear}-${payGovMonth}-${payGovDay}`,
      receivedAt: `${receivedAtYear}-${receivedAtMonth}-${receivedAtDay}`,
    },
    [
      'irsYear',
      'irsMonth',
      'irsDay',
      'payGovYear',
      'payGovMonth',
      'payGovDay',
      'receivedAtYear',
      'receivedAtMonth',
      'receivedAtDay',
      'trialCities',
    ],
  );

  form.irsNoticeDate = checkDate(
    applicationContext,
    form.irsNoticeDate,
    caseDetail.irsNoticeDate,
  );
  form.payGovDate = checkDate(
    applicationContext,
    form.payGovDate,
    caseDetail.payGovDate,
  );
  form.receivedAt = checkDate(
    applicationContext,
    form.receivedAt,
    caseDetail.receivedAt,
  );

  // cannot store empty strings in persistence
  if (caseDetail.preferredTrialCity === '') {
    delete caseDetail.preferredTrialCity;
  }

  caseDetail.yearAmounts = caseDetail.yearAmounts
    .map(yearAmount => ({
      amount: !yearAmount.amount
        ? null
        : `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
      year: castToISO(applicationContext, yearAmount.year),
    }))
    .filter(yearAmount => yearAmount.year || yearAmount.amount);

  if (caseCaption && (caseCaption = caseCaption.trim())) {
    caseDetail.caseCaption = caseCaption;
  }

  return {
    combinedCaseDetailWithForm: {
      ...caseDetail,
      ...form,
      payGovId: caseDetail.payGovId === '' ? null : caseDetail.payGovId,
    },
  };
};
