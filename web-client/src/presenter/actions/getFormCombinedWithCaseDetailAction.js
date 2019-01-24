import { state } from 'cerebral';
import { omit } from 'lodash';
import moment from 'moment';

export const castToISO = dateString => {
  if (moment(`${dateString}-01-01`, 'YYYY-MM-DD', true).isValid()) {
    return moment.utc(`${dateString}-01-01`, 'YYYY-MM-DD', true).toISOString();
  } else if (moment(dateString, 'YYYY-MM-DD', true).isValid()) {
    return moment.utc(dateString, 'YYYY-MM-DD', true).toISOString();
  } else if (moment(dateString, 'YYYY-MM-DDT00:00:00.000Z', true).isValid()) {
    return moment
      .utc(dateString, 'YYYY-MM-DDT00:00:00.000Z', true)
      .toISOString();
  } else {
    return '-1';
  }
};

export const checkDate = (updatedDateString, originalDate) => {
  if (updatedDateString.replace(/[-,undefined]/g, '') === '') {
    updatedDateString = null;
  } else {
    const hasAllDateParts = /.+-.+-.+/;
    if (hasAllDateParts.test(updatedDateString)) {
      updatedDateString = castToISO(updatedDateString);
    } else {
      //partial date
      if (originalDate) {
        updatedDateString = originalDate;
      } else {
        updatedDateString = null;
      }
    }
  }
  return updatedDateString;
};

export default ({ get }) => {
  const caseDetail = { ...get(state.caseDetail) };
  const { irsYear, irsMonth, irsDay, payGovYear, payGovMonth, payGovDay } = {
    ...get(state.form),
  };

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${irsYear}-${irsMonth}-${irsDay}`,
      payGovDate: `${payGovYear}-${payGovMonth}-${payGovDay}`,
    },
    [
      'irsYear',
      'irsMonth',
      'irsDay',
      'payGovYear',
      'payGovMonth',
      'payGovDay',
      'trialCities',
    ],
  );

  form.irsNoticeDate = checkDate(form.irsNoticeDate, caseDetail.irsNoticeDate);
  form.payGovDate = checkDate(form.payGovDate, caseDetail.payGovDate);

  caseDetail.yearAmounts = ((caseDetail || {}).yearAmounts || []).map(
    yearAmount => ({
      amount: !yearAmount.amount
        ? null
        : `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
      year: castToISO(yearAmount.year),
    }),
  );

  return {
    combinedCaseDetailWithForm: {
      ...caseDetail,
      ...form,
      payGovId: caseDetail.payGovId === '' ? null : caseDetail.payGovId,
    },
  };
};
