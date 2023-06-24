import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.assigneeId and state.assigneeName based on the props.assigneeId and props.assigneeName passed in.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.assigneeId and state.assigneeName
 * @param {object} providers.props the cerebral props object used for passing the props.assigneeId and props.assigneeName
 */
export const setAssigneeIdAction = ({ props, store }: ActionProps) => {
  store.set(state.assigneeId, props.assigneeId);
  store.set(state.assigneeName, props.assigneeName);
};
