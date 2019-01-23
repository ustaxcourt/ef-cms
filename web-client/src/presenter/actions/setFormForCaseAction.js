import { state } from 'cerebral';
import moment from 'moment';

export default ({ get, store }) => {
  const caseDetail = get(state.caseDetail);

  const irsNoticeDate = moment(caseDetail.irsNoticeDate, 'YYYY/MM/DD');
  if (irsNoticeDate) {
    store.set(state.form.irsMonth, irsNoticeDate.format('M'));
    store.set(state.form.irsDay, irsNoticeDate.format('D'));
    store.set(state.form.irsYear, irsNoticeDate.format('YYYY'));
  } else {
    store.set(state.form.irsMonth, '');
    store.set(state.form.irsDay, '');
    store.set(state.form.irsYear, '');
  }

  const payGovDate = moment(caseDetail.payGovDate, 'YYYY/MM/DD');
  if (payGovDate) {
    store.set(state.form.payGovMonth, payGovDate.format('M'));
    store.set(state.form.payGovDay, payGovDate.format('D'));
    store.set(state.form.payGovYear, payGovDate.format('YYYY'));
  } else {
    store.set(state.form.payGovMonth, '');
    store.set(state.form.payGovDay, '');
    store.set(state.form.payGovYear, '');
  }

  const yearAmounts = caseDetail.yearAmounts;
  if (!yearAmounts || !yearAmounts[0]) {
    yearAmounts.push({ year: '', amount: 0 });
  }
};
