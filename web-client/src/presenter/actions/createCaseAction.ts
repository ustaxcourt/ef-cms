import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: FileUploadProgressMapType;
}>) => {
  const { fileUploadProgressMap } = props;
  const petitionMetadata = get(state.form);

  const form = omit(petitionMetadata, 'trialCities');

  const user = applicationContext.getCurrentUser();
  form.contactPrimary.email = user.email;

  let filePetitionResult;
  try {
    filePetitionResult = await applicationContext
      .getUseCases()
      .filePetitionInteractor(applicationContext, {
        atpUploadProgress: fileUploadProgressMap.attachmentToPetition,
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionMetadata: form,
        petitionUploadProgress: fileUploadProgressMap.petition,
        stinUploadProgress: fileUploadProgressMap.stin,
      });
  } catch (err) {
    return path.error();
  }
  const { caseDetail, stinFileId } = filePetitionResult;

  const addCoversheet = docketEntryId => {
    return applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber: caseDetail.docketNumber,
      });
  };

  const documentsThatNeedCoverSheet = caseDetail.docketEntries
    .filter(d => d.isFileAttached)
    .map(d => d.docketEntryId);

  // for security reasons, the STIN is not in the API response, but we already know the docketEntryId
  documentsThatNeedCoverSheet.push(stinFileId);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  return path.success({
    caseDetail,
  });
};
