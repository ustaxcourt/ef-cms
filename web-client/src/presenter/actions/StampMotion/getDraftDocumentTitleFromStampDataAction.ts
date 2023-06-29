import { state } from '@web-client/presenter/app.cerebral';

/**
 * get the draft document title from stamp data
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} object containing the formatted draft document title
 */
export const getDraftDocumentTitleFromStampDataAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const stampMotionForm = get(state.form);

  const formattedDraftDocumentTitle = applicationContext
    .getUseCases()
    .setDocumentTitleFromStampDataInteractor({
      stampMotionForm,
    });

  return { formattedDraftDocumentTitle };
};
