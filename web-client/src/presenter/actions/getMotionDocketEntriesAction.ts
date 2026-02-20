import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getMotionDocketEntriesAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  const { docketEntries } = await applicationContext
    .getUseCases()
    .getCaseDocketEntriesInteractor(applicationContext, {
      docketNumber,
      eventCodes: MOTION_EVENT_CODES,
      pageSize: 10000,
    });

  return { motionDocketEntries: docketEntries };
};
