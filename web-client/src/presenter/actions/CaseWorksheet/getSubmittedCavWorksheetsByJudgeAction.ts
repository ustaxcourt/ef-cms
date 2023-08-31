import { state } from '@web-client/presenter/app.cerebral';

/**
 * Retrieves the cases with a status of CAV or Submitted by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} an array of case entities and a map containing consolidated cases group counts
 */
export const getSubmittedCavWorksheetsByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps<{
  selectedPage: number;
}>) => {
  const { name } = get(state.judgeUser);

  const { worksheets } = await applicationContext
    .getUseCases()
    .getCaseWorksheetInfoInteractor(applicationContext, {
      judges: [name],
    });

  console.log('worksheets', worksheets);

  return {
    worksheets,
  };
};
