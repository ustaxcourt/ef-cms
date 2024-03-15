import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const queue = get(state.workQueueToDisplay.queue);
  const box = get(state.workQueueToDisplay.box);
  const selectedSection = get(state.workQueueToDisplay.section);
  const user = applicationContext.getCurrentUser();
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();

  let judgeUser = get(state.judgeUser);
  if (!judgeUser && user.role === USER_ROLES.adc) {
    judgeUser = { name: CHIEF_JUDGE };
  }

  const recipient =
    queue === 'my'
      ? {
          group: 'user',
          identifier: applicationContext.getCurrentUser().userId,
        }
      : { group: 'section', identifier: selectedSection || user.section };

  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInteractor(applicationContext, {
      box,
      judgeUser,
      recipient,
    });

  return { workItems };
};
