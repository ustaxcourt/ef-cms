import { omit } from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

/**
 * properly casts a variety of inputs to a UTC ISOString
 * directly using the moment library rather than date functions from the applicationContext
 * because this function is extremely well-tested.
 *
 * @param {string} dateString the date string to cast to an ISO string
 * @returns {string} the ISO string.
 */
export const castToISO = dateString => {
  if (dateString === '') {
    return null;
  }
  dateString = dateString
    .split('-')
    .map(segment => segment.padStart(2, '0'))
    .join('-');
  if (moment.utc(`${dateString}-01-01`, 'YYYY-MM-DD', true).isValid()) {
    return moment.utc(`${dateString}-01-01`, 'YYYY-MM-DD', true).toISOString();
  } else if (moment.utc(dateString, 'YYYY-MM-DD', true).isValid()) {
    return moment.utc(dateString, 'YYYY-MM-DD', true).toISOString();
  } else if (
    moment.utc(dateString, 'YYYY-MM-DDT00:00:00.000Z', true).isValid()
  ) {
    return moment
      .utc(dateString, 'YYYY-MM-DDT00:00:00.000Z', true)
      .toISOString();
  } else {
    return '-1';
  }
};

/**
 * checks if the new date contains all expected parts; otherwise, it returns the originalDate
 *
 * @param {string} updatedDateString the new date string to verify
 * @param {string} originalDate the original date to return if the updatedDateString is bad
 * @returns {string} the updatedDateString if everything is correct.
 */
export const checkDate = (updatedDateString, originalDate) => {
  const hasAllDateParts = /.+-.+-.+/;
  if (updatedDateString.replace(/[-,undefined]/g, '') === '') {
    updatedDateString = null;
  } else {
    if (
      updatedDateString.indexOf('undefined') === -1 &&
      hasAllDateParts.test(updatedDateString)
    ) {
      updatedDateString = castToISO(updatedDateString);
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
export const getFormCombinedWithCaseDetailAction = ({ get, props }) => {
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

  form.irsNoticeDate = checkDate(form.irsNoticeDate, caseDetail.irsNoticeDate);
  form.payGovDate = checkDate(form.payGovDate, caseDetail.payGovDate);
  form.receivedAt = checkDate(form.receivedAt, caseDetail.receivedAt);

  // cannot store empty strings in persistence
  if (caseDetail.preferredTrialCity === '') {
    delete caseDetail.preferredTrialCity;
  }

  caseDetail.yearAmounts = caseDetail.yearAmounts
    .map(yearAmount => ({
      amount: !yearAmount.amount
        ? null
        : `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
      year: castToISO(yearAmount.year),
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
