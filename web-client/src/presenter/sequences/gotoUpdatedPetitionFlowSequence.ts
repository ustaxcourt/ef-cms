import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoUpdatedPetitionFlowSequence =
  startWebSocketConnectionSequenceDecorator([
    setStepIndicatorInfoForPetitionGeneratorAction,
    setupCurrentPageAction('UpdatedFilePetition'),
  ]);
