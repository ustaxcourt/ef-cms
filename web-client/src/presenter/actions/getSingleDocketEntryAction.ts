import { state } from '@web-client/presenter/app.cerebral';

export const getSingleDocketEntryAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  const { docketEntryId } = props;

  const docketEntry = await applicationContext
    .getUseCases()
    .getSingleDocketEntryInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  return { docketEntry };
};
