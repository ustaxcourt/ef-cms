import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.messageDetail from props.messageDetail
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.messageDetail
 * @param {object} providers.store the cerebral store used for setting the state.messageDetail
 */
export const setMessageAction = ({ props, store }: ActionProps) => {
  store.set(state.messageDetail, props.messageDetail);
};
