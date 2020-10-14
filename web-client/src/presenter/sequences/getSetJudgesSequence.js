import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';

export const getSetJudgesSequence = [
  getUsersInSectionAction({ section: 'judge' }),
  setAllAndCurrentJudgesAction,
];
