import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { setTodaysOrdersCurrentPaginationPageAction } from '../../actions/Public/setTodaysOrdersCurrentPaginationPageAction';
import { setTodaysOrdersPageForFetchAction } from '../../actions/Public/setTodaysOrdersPageForFetchAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const setTodaysOrdersCurrentPaginationPageSequence =
  showProgressSequenceDecorator([
    setTodaysOrdersCurrentPaginationPageAction,
    setTodaysOrdersPageForFetchAction,
    getTodaysOrdersAction,
    setTodaysOrdersAction,
  ]) as unknown as (props: { currentPaginationPage: number }) => void;
