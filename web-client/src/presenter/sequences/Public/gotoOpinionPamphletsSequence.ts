import { getOpinionPamhpletsAction } from '../../actions/Public/getOpinionPamhpletsAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setOpinionPamhpletsAction } from '../../actions/Public/setOpinionPamhpletsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoOpinionPamphletsSequence = showProgressSequenceDecorator([
  getOpinionPamhpletsAction,
  setOpinionPamhpletsAction,
  setCurrentPageAction('OpinionPamphlets'),
]);
