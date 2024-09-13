import {
  CreatedCaseType,
  FileUploadProgressType,
  FileUploadProgressValueType,
} from '@shared/business/entities/EntityConstants';
import { ElectronicCreatedCaseType } from '@web-api/business/useCases/createCaseInteractor';
import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

// updated-petition-flow: can be removed when flag is removed

export const createCaseAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressValueType>;
}>) => {
  const { fileUploadProgressMap } = props;
  const petitionMetadata: CreatedCaseType = get(state.form);

  const form: ElectronicCreatedCaseType = omit(petitionMetadata, 'trialCities');

  const user = get(state.user);
  form.contactPrimary.email = user.email;

  let caseDetail;
  let stinFile;

  const attachmentToPetitionUploadProgress =
    fileUploadProgressMap.attachmentToPetition
      ? ([
          fileUploadProgressMap.attachmentToPetition,
        ] as FileUploadProgressType[])
      : undefined;

  try {
    const {
      attachmentToPetitionFileIds,
      corporateDisclosureFileId,
      petitionFileId,
      stinFileId,
    } = await applicationContext.getUseCases().generateDocumentIds(
      applicationContext,
      {
        attachmentToPetitionUploadProgress,
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure as FileUploadProgressType,
        petitionUploadProgress:
          fileUploadProgressMap.petition as FileUploadProgressType,
        stinUploadProgress:
          fileUploadProgressMap.stin as FileUploadProgressType,
      },
      user,
    );

    stinFile = stinFileId;

    caseDetail = await applicationContext
      .getUseCases()
      .createCaseInteractor(applicationContext, {
        attachmentToPetitionFileIds,
        corporateDisclosureFileId,
        petitionFileId,
        petitionMetadata: form,
        stinFileId: stinFile,
      });
  } catch (err) {
    return path.error();
  }

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
  documentsThatNeedCoverSheet.push(stinFile);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  return path.success({
    caseDetail,
  });
};
