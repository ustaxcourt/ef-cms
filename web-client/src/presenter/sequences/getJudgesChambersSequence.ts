import { getJudgesChambersAction } from '@web-client/presenter/actions/getJudgesChambersAction';
import { setJudgesChambersAction } from '@web-client/presenter/actions/setJudgesChambersAction';

export const getJudgesChambersSequence = [
  getJudgesChambersAction,
  setJudgesChambersAction,
];
