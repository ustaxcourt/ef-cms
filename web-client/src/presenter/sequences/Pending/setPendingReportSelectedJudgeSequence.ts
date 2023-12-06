import { fetchPendingItemsAction } from '../../actions/PendingItems/fetchPendingItemsAction';
import { isJudgeSelectedAction } from '../../actions/PendingItems/isJudgeSelectedAction';
import { setPendingItemsAction } from '../../actions/PendingItems/setPendingItemsAction';
import { setPendingReportSelectedJudgeAction } from '../../actions/PendingItems/setPendingReportSelectedJudgeAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const setPendingReportSelectedJudgeSequence = [
  setPendingReportSelectedJudgeAction,
  isJudgeSelectedAction,
  {
    no: [],
    yes: [
      showProgressSequenceDecorator([
        fetchPendingItemsAction,
        setPendingItemsAction,
      ]),
    ],
  },
];
