import { state } from 'cerebral';
import { omit } from 'lodash';

export default ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const { irsYear, irsMonth, irsDay, payGovYear, payGovMonth, payGovDay } = get(
    state.form,
  );

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
    form.irsNoticeDate = new Date(form.irsNoticeDate).toISOString();
  } else {
    form.irsNoticeDate = null;
  }

  if (payGovYear && payGovMonth && payGovDay) {
    form.payGovDate = form.payGovDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
    form.payGovDate = new Date(form.payGovDate).toISOString();
  } else {
    form.payGovDate = null;
  }

  let yearAmounts = [];
  if (form.yearAmounts && form.yearAmounts.length) {
    form.yearAmounts.forEach(yearAmount => {
      const year = `${yearAmount.year}-12-31`;
      const amount = yearAmount.amount.replace(/,/g, '');
      yearAmounts.push({ year, amount });
    });
  }

  return {
    combinedCaseDetailWithForm: { ...caseDetail, ...form, yearAmounts },
  };
};
