import { state } from '@web-client/presenter/app.cerebral';

export const validateStatusOfMatterAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, statusOfMatter } = props;
  const { submittedAndCavCasesByJudge } = get(state.judgeActivityReportData);
  const caseToValidate = submittedAndCavCasesByJudge.find(
    aCase => aCase.docketNumber === docketNumber,
  );

  const errors = await applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        ...caseToValidate,
        statusOfMatter,
      },
      useCaseEntity: true,
    });

  if (!errors) {
    return path.success({ validationKey: 'statusOfMatter' });
  }

  return path.error({
    errors,
  });
};
