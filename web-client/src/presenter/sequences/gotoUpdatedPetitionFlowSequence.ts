import { setIrsNoticeUploadFormInfoAction } from '@web-client/presenter/actions/setIrsNoticeUploadFormInfoAction';
import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupPetitionStateAction } from '@web-client/presenter/actions/setupPetitionStateAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoUpdatedPetitionFlowSequence =
  startWebSocketConnectionSequenceDecorator([
    setIrsNoticeUploadFormInfoAction,
    setStepIndicatorInfoForPetitionGeneratorAction,
    setupPetitionStateAction,
    setupCurrentPageAction('UpdatedFilePetition'),
  ]);
