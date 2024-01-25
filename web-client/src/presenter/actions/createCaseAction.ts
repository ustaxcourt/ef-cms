import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';
/**
 * invokes the filePetition useCase.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {object} providers.path the next object in the path
 * @param {object} providers.store the cerebral store object
 * @returns {object} the next path based on if creation was successful or error
 */
export const createCaseAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const { atipFiles, corporateDisclosureFile, petitionFile, stinFile } = get(
    state.form,
  );

  const form = omit(
    {
      ...get(state.form),
    },
    'trialCities',
  );

  const user = applicationContext.getCurrentUser();
  form.contactPrimary.email = user.email;

  // loop through each atp file and create a new object with each atp(key number ) and file

  const resultObject = {};

  atipFiles.forEach((obj, index) => {
    // Convert the index to a string and use it as the key
    let key = `atp${index}`;

    // Assign the object from the array to the key in the result object
    resultObject[key] = obj;
  });

  const progressFunctions = setupPercentDone(
    {
      // TODO: add ATP files
      // get all the atp files and pass them to setupPercentDone function
      ...resultObject,
      corporate: corporateDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
    },
    store,
  );

  let filePetitionResult;
  try {
    filePetitionResult = await applicationContext
      .getUseCases()
      .filePetitionInteractor(applicationContext, {
        corporateDisclosureFile,
        corporateDisclosureUploadProgress: progressFunctions.corporate,
        petitionFile,
        petitionMetadata: form,
        petitionUploadProgress: progressFunctions.petition,
        stinFile,
        stinUploadProgress: progressFunctions.stin,
        //TODO: atpUploadProgress: progressFunctions.atpFiles
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
