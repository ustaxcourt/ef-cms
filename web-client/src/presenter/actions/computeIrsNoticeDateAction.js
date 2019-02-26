import { state } from 'cerebral';

/**
 *
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 */
export const computeIrsNoticeDateAction = ({ get, store }) => {
  let form = get(state.form);

  if (form.hasIrsNotice) {
    form.irsNoticeDate = `${get(state.form.year)}-${get(
      state.form.month,
    )}-${get(state.form.day)}`;

    form.irsNoticeDate = form.irsNoticeDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');

    store.set(state.form.irsNoticeDate, form.irsNoticeDate);
  } else {
    store.set(state.form.irsNoticeDate, undefined);
  }
};
