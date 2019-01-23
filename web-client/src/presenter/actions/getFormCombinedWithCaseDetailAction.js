import { state } from 'cerebral';
import { omit } from 'lodash';
import moment from 'moment';

export const castToISO = dateString => {
  console.log('at the top', dateString);
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/g;

  if (moment(dateString, 'YYYY-MM-DD', true).isValid()) {
    console.log('isValid')
    return moment.utc(dateString, 'YYYY-MM-DD').toISOString();
  } else {
    return null;
  }
  // const formatted = moment(dateString, 'YYYY-MM-DD').format('YYYY-MM-DD');
  // if (formatted.indexOf('Invalid') === -1) {
  //   console.log(formatted)
  //   dateString = formatted;
  // }

  // if (dateRegex.test(dateString)) {
  //   console.log(dateString);
  //   const date = new Date(
  //     dateString
  //       .split('-')
  //       .map(segment => segment.padStart(2, '0'))
  //       .join('-'),
  //   );
  //   if (!isNaN(date)) {
  //     return date.toISOString();
  //   } else {
  //     return null;
  //   }
  // } else {
  //   return null;
  // }
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

  console.log('caseDetail.yearAmounts', caseDetail.yearAmounts);

  caseDetail.yearAmounts = ((caseDetail || {}).yearAmounts || []).map(
    yearAmount => ({
      amount: `${yearAmount.amount}`.replace(/,/g, '').replace(/\..*/g, ''),
      year: castToISO(`${yearAmount.year}-01-01`),
    }),
  );

  return {
    combinedCaseDetailWithForm: { ...caseDetail, ...form },
  };
};
