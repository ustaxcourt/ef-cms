jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock('@web-api/dispatchers/sqs/rescheduleLambda', () => ({
  rescheduleLambda: jest.fn(),
}));
jest.mock(
  '@web-api/business/useCases/checkForReadyForTrialCasesInteractor',
  () => ({
    checkForReadyForTrialCasesInteractor: jest.fn(),
  }),
);

import { checkForReadyForTrialCasesInteractor as checkForReadyForTrialCasesInteractorMock } from '@web-api/business/useCases/checkForReadyForTrialCasesInteractor';
import { checkForReadyForTrialCasesLambda } from './checkForReadyForTrialCasesLambda';
import { rescheduleLambda as rescheduleLambdaMock } from '@web-api/dispatchers/sqs/rescheduleLambda';

const rescheduleLambda = jest.mocked(rescheduleLambdaMock);
const checkForReadyForTrialCasesInteractor = jest.mocked(
  checkForReadyForTrialCasesInteractorMock,
);

describe('checkForReadyForTrialCasesLambda', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;
  const event = { some: 'event' };

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
  });

  it('runs the interactor when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await checkForReadyForTrialCasesLambda(event);

    expect(checkForReadyForTrialCasesInteractor).toHaveBeenCalled();
    expect(rescheduleLambda).not.toHaveBeenCalled();
  });

  it('reschedules itself with a 180-second delay and skips the interactor when in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'true';

    await checkForReadyForTrialCasesLambda(event);

    expect(rescheduleLambda).toHaveBeenCalledWith(
      expect.anything(),
      { event },
      180,
    );
    expect(checkForReadyForTrialCasesInteractor).not.toHaveBeenCalled();
  });
});
