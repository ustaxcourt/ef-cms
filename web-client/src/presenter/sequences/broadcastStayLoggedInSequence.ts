import { broadcastStayLoggedInAction } from '../actions/broadcastStayLoggedInAction';
import { confirmStayLoggedInSequence } from './confirmStayLoggedInSequence';

export const broadcastStayLoggedInSequence = [
  broadcastStayLoggedInAction,
  confirmStayLoggedInSequence,
];
