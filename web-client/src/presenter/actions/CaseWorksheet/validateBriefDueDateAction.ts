import { state } from '@web-client/presenter/app.cerebral';

export const validateBriefDueDateAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{ docketNumber: string; finalBriefDueDate: string }>) => {
  const { docketNumber, finalBriefDueDate } = props;

  const { worksheets } = get(state.submittedAndCavCases);

  const worksheet = worksheets.find(ws => ws.docketNumber === docketNumber) || {
    docketNumber,
  };

  let computedDate = '';
  if (finalBriefDueDate) {
    const [month, day, year] = finalBriefDueDate.split('/');
    computedDate = `${year}-${month}-${day}`;
  }

  const errors = await applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        ...worksheet!,
        finalBriefDueDate: computedDate,
      },
    });

  if (!errors) {
    return path.success({
      finalBriefDueDate: computedDate,
      validationKey: 'finalBriefDueDate',
    });
  }

  return path.error({
    errors,
  });
};
