import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';

export const setCaseDetailPageTabSequence = [
  setCaseDetailPageTabActionGenerator(),
  setIsPrimaryTabAction,
];
