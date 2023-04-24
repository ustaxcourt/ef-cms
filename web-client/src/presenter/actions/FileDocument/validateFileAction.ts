import { state } from 'cerebral';

/**
 * validates the document info form.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateFileAction = async ({ applicationContext, get, path }) => {
  const { primaryDocumentFile } = get(state.form);

  try {
    await applicationContext.getUseCases().validateFileInteractor({
      primaryDocumentFile,
    });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'File is borked.',
      },
      errors,
    });
  }

  return path.success();
};
