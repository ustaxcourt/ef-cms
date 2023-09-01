import { state } from '@web-client/presenter/app.cerebral';

export const validateStatusOfMatterAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, statusOfMatter } = props;
  const caseWorksheets = get(state.submittedAndCavCases.worksheets);

  const worksheet = caseWorksheets.find(
    ws => ws.docketNumber === docketNumber,
  ) || { docketNumber };

  const errors = await applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        ...worksheet!,
        statusOfMatter,
      },
    });

  if (!errors) {
    return path.success({ validationKey: 'statusOfMatter' });
  }

  return path.error({
    errors,
  });
};
