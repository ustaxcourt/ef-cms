import { state } from '@web-client/presenter/app.cerebral';

export const validateStatusOfMatterAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{ docketNumber: string; statusOfMatter: string }>) => {
  const { docketNumber, statusOfMatter } = props;

  const { worksheets } = get(state.submittedAndCavCases);

  const worksheet = worksheets.find(ws => ws.docketNumber === docketNumber) || {
    docketNumber,
  };

  const errors = await applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        ...worksheet,
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
