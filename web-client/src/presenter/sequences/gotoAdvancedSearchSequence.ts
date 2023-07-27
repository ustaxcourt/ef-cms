import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAdvancedSearchSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
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
    setupCurrentPageAction('AdvancedSearch'),
  ]);
