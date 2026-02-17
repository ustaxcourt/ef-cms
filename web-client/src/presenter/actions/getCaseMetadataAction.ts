import { state } from '@web-client/presenter/app.cerebral';

export const getCaseMetadataAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  const caseMetadata = await applicationContext
    .getUseCases()
    .getCaseMetadataInteractor(applicationContext, {
      docketNumber,
    });

  return { caseMetadata };
};
