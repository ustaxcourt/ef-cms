import { state } from 'cerebral';
import { omit } from 'lodash';

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

  if (irsYear && irsMonth && irsDay) {
    form.irsNoticeDate = form.irsNoticeDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
    const irsNoticeDate = new Date(form.irsNoticeDate);
    if (irsNoticeDate instanceof Date && !isNaN(irsNoticeDate)) {
      form.irsNoticeDate = irsNoticeDate.toISOString();
    }
  } else {
    form.irsNoticeDate = null;
  }

  if (payGovYear && payGovMonth && payGovDay) {
    form.payGovDate = form.payGovDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
    const payGovDate = new Date(form.payGovDate).toISOString();
    if (payGovDate instanceof Date && !isNaN(payGovDate)) {
      form.payGovDate = payGovDate;
    }
  } else {
    form.payGovDate = null;
  }

  caseDetail.yearAmounts = ((caseDetail || {}).yearAmounts || []).map(
    yearAmount => {
      let yearToDate;
      try {
        yearToDate = new Date(`${yearAmount.year}-01-01`).toISOString();
      } catch (err) {
        yearToDate = null;
      }
      return {
        amount: `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
        year: yearAmount.year ? yearToDate : null,
      };
    },
  );

  return {
    combinedCaseDetailWithForm: { ...caseDetail, ...form },
  };
};
