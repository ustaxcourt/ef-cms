import { state } from 'cerebral';

/**
 * Determines if the document being uploaded requires an appended form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path to take depending on if the file was uploaded successfully or not
 * @param {object} providers.get the cerebral get method used for getting state
 * @returns {object} the next path based on if the file was successfully uploaded or not
 */
export const isDocumentRequiringAppendedForm = async ({
  applicationContext,
  get,
  path,
}) => {};
