import { state } from 'cerebral';

/**
 * sets the state.caseDetailBackup which is used for diffing changes to caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetailBackup
 */
export const setCaseBackupAction = ({ props, store }) => {
  store.set(
    state.caseDetailBackup,
    JSON.parse(JSON.stringify(props.caseDetail)),
  );
};
