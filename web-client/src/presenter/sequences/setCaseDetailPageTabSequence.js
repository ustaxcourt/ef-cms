import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';

export const setCaseDetailPageTabSequence = [
  setCaseDetailPageTabAction,
  setIsPrimaryTabAction,
];
