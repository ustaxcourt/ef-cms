import { state } from '@web-client/presenter/app.cerebral';

export const getCaseAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber,
    });

  return { caseDetail };
};
