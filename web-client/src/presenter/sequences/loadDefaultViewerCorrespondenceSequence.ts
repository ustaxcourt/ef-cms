import { getDefaultViewerCorrespondenceToDisplayAction } from '../actions/getDefaultViewerCorrespondenceToDisplayAction';
import { setViewerCorrespondenceToDisplayAction } from '../actions/setViewerCorrespondenceToDisplayAction';

export const loadDefaultViewerCorrespondenceSequence = [
  getDefaultViewerCorrespondenceToDisplayAction,
  setViewerCorrespondenceToDisplayAction,
];
