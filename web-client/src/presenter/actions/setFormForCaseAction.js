import { state } from 'cerebral';
import moment from 'moment';

export default ({ get, store }) => {
  const caseDetail = get(state.caseDetail);
  const irsNoticeDate = moment(caseDetail.irsNoticeDate, 'YYYY/MM/DD');
  if (
    irsNoticeDate &&
    irsNoticeDate.toDate() instanceof Date &&
    !isNaN(irsNoticeDate.toDate())
  ) {
    store.set(state.form.irsMonth, irsNoticeDate.format('M'));
    store.set(state.form.irsDay, irsNoticeDate.format('D'));
    store.set(state.form.irsYear, irsNoticeDate.format('YYYY'));
  }

  const payGovDate = moment(caseDetail.payGovDate, 'YYYY/MM/DD');
  if (
    payGovDate &&
    payGovDate.toDate() instanceof Date &&
    !isNaN(payGovDate.toDate())
  ) {
    store.set(state.form.payGovMonth, payGovDate.format('M'));
    store.set(state.form.payGovDay, payGovDate.format('D'));
    store.set(state.form.payGovYear, payGovDate.format('YYYY'));
  }

  const yearAmounts = caseDetail.yearAmounts;
  if (!yearAmounts || !yearAmounts[0]) {
    yearAmounts.push({});
  }
};
