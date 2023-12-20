import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { getPractitionerDocumentsAction } from '../actions/getPractitionerDocumentsAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerDocumentsAction } from '../actions/setPractitionerDocumentsAction';
import { setTabFromPropsAction } from '../actions/setTabFromPropsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPractitionerDocumentationSequence = [
  showProgressSequenceDecorator([
    startWebSocketConnectionSequenceDecorator([
      clearErrorAlertsAction,
      setTabFromPropsAction,
      getPractitionerDetailAction,
      setPractitionerDetailAction,
      getPractitionerDocumentsAction,
      setPractitionerDocumentsAction,
      setupCurrentPageAction('PractitionerInformation'),
    ]),
  ]),
];
