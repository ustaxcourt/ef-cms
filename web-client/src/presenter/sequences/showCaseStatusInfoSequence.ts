import { state } from '@web-client/presenter/app.cerebral';

export const showCaseStatusInfoSequence = [
  ({ props, store }: ActionProps) => {
    store.set(state.modal.showModal, 'CaseStatusInfoModal');
    store.set(state.modal.title, props.status);
  },
];
