import { state } from '@web-client/presenter/app.cerebral';

export const getCaseAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  if (!docketNumber) {
    throw new Error('Docket number is required to get case details');
  }

  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber,
    });

  return { caseDetail };
};
