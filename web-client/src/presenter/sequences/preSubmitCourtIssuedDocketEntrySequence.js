import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { submitCourtIssuedDocketEntrySequence } from './submitCourtIssuedDocketEntrySequence';

export const preSubmitCourtIssuedDocketEntrySequence = [
  // if part of consolidated AND is unservable entry, open modal, otherwise, submit
  // TODO: refactor to stand alone action
  ({ path }) => {
    return path.openModal();
    // return path.submit();
  },
  {
    openModal: [setShowModalFactoryAction('ConfirmInitiateServiceModal')],
    submit: [submitCourtIssuedDocketEntrySequence],
  },
];
