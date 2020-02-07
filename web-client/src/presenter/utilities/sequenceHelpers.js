import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

const showProgressSequenceDecorator = actionsList => {
  const wrappedActions = [
    setWaitingForResponseAction,
    ...actionsList,
    unsetWaitingForResponseAction,
  ];
  return wrappedActions;
};

module.exports = { showProgressSequenceDecorator };
