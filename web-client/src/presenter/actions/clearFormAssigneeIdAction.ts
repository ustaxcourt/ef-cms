import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the value of state.<form>.assigneeId
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 */
export const clearFormAssigneeIdAction = ({ props, store }: ActionProps) => {
  store.set(state[props.form].assigneeId, '');
};
