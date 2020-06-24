import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setupSignOrder } from './gotoSignOrderSequence';

export const gotoSignOrderForMessageSequence = [
  ...setupSignOrder,
  setParentMessageIdAction,
  setCurrentPageAction('SignOrderForMessage'),
];
