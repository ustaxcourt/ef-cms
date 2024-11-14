import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getBulkTrialSessionCopyNotesInteractor } from '@web-api/business/useCases/trialSessions/getBulkTrialSessionCopyNotesInteractor';

export const getBulkTrialSessionCopyNotesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { specialTrialSessions } = JSON.parse(event.body || '{}');
    return await getBulkTrialSessionCopyNotesInteractor(
      applicationContext,
      {
        specialTrialSessions,
      },
      authorizedUser,
    );
  });
