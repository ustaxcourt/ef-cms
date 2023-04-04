import { getOpinionPamphletsAction } from '../../actions/Public/getOpinionPamphletsAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setOpinionPamphletsAction } from '../../actions/Public/setOpinionPamphletsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoOpinionPamphletsSequence = showProgressSequenceDecorator([
  getOpinionPamphletsAction,
  setOpinionPamphletsAction,
  setCurrentPageAction('OpinionPamphlets'),
]);
