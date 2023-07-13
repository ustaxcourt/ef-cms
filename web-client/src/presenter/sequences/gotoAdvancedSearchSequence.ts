import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAdvancedSearchSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    closeMobileMenuAction,
    defaultAdvancedSearchFormAction,
    parallel([
      [
        getUsersInSectionAction({ section: 'judge' }),
        setAllAndCurrentJudgesAction,
      ],
      [getOpinionTypesAction, setOpinionTypesAction],
    ]),
    setCurrentPageAction('AdvancedSearch'),
  ]);
