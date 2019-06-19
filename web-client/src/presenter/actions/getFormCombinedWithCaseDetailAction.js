import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * checks if the new date contains all expected parts; otherwise, it returns the originalDate
 *
 * @param {object} applicationContext the application context
 * @param {string} updatedDateString the new date string to verify
 * @param {string} originalDate the original date to return if the updatedDateString is bad
 * @returns {string} the updatedDateString if everything is correct.
 */
const determineDate = ({
  year,
  month,
  day,
  applicationContext,
  originalDate,
}) => {
  let result;
  const date = `${year}-${month}-${day}`;
  const validDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const hyphenatePattern = /^.+-.+-.+$/;
  const invalidDate =
    hyphenatePattern.test(date) && !validDatePattern.test(date);

  if (!year && !month && !day) {
    result = null;
  } else if (validDatePattern.test(date)) {
    // all is valid
    result = applicationContext
      .getUtilities()
      .createISODateString(date, 'YYYY-MM-DD');
  } else if (invalidDate) {
    result = '-1';
  } else {
    // at least one of year, month, or day is defined
    result = originalDate || null;
  }
  return result;
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
  let caption;
  if ((caption = (props.casecaption || '').trim())) {
    caseDetail.caseCaption = caption;
  }

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

  const irsNoticeDate = determineDate({
    applicationContext,
    day: irsDay,
    month: irsMonth,
    originalDate: caseDetail.irsNoticeDate,
    year: irsYear,
  });
  const payGovDate = determineDate({
    applicationContext,
    day: payGovDay,
    month: payGovMonth,
    originalDate: caseDetail.payGovDate,
    year: payGovYear,
  });
  const receivedAt = determineDate({
    applicationContext,
    day: receivedAtDay,
    month: receivedAtMonth,
    originalDate: caseDetail.receivedAt,
    year: receivedAtYear,
  });

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate,
      payGovDate,
      receivedAt,
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

  // cannot store empty strings in persistence
  if (caseDetail.preferredTrialCity === '') {
    delete caseDetail.preferredTrialCity;
  }

  const conditionalYear = year => {
    if (year == '') return null;
    if (/^\d{4}$/.test(year)) {
      return applicationContext
        .getUtilities()
        .createISODateString(`${year}-01-01`, 'YYYY-MM-DD');
    } else {
      return '-1'; // force validation failure
    }
  };

  caseDetail.yearAmounts = caseDetail.yearAmounts
    .map(yearAmount => ({
      amount: !yearAmount.amount
        ? null
        : `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
      year: conditionalYear(yearAmount.year),
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
