import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';

export const getSetJudgesSequence = [
  getUsersInSectionAction({ section: 'judge' }),
  setUsersByKeyAction('judges'),
];
