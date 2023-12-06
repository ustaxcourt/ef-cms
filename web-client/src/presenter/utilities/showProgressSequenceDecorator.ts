import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const showProgressSequenceDecorator = (actionsList): any[] => {
  const wrappedActions = [
    setWaitingForResponseAction,
    ...actionsList,
    unsetWaitingForResponseAction,
  ];
  return wrappedActions;
};
