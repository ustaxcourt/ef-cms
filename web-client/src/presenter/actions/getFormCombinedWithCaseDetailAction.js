import { state } from 'cerebral';
import { omit } from 'lodash';
import moment from 'moment';

export const castToISO = dateString => {
  dateString = dateString
    .split('-')
    .map(segment => segment.padStart(2, '0'))
    .join('-');
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

  form.irsNoticeDate = castToISO(form.irsNoticeDate);
  form.payGovDate = castToISO(form.payGovDate);

  if ([irsYear, irsMonth, irsDay].join('') === '') {
    form.irsNoticeDate = null;
  }

  if ([payGovYear, payGovMonth, payGovDay].join('') === '') {
    form.payGovDate = null;
  }

  caseDetail.yearAmounts = ((caseDetail || {}).yearAmounts || []).map(
    yearAmount => ({
      amount: `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
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
