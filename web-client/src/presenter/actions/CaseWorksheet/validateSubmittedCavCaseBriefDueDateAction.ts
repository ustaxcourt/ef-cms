import { state } from '@web-client/presenter/app.cerebral';

export const validateSubmittedCavCaseBriefDueDateAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, statusOfMatter } = props;

  const { submittedAndCavCasesByJudge } = get(state.judgeActivityReportData);
  const caseToValidate = submittedAndCavCasesByJudge.find(
    aCase => aCase.docketNumber === docketNumber,
  );

  let computedDate;
  if (finalBriefDueDate) {
    const [month, day, year] = finalBriefDueDate.split('/');
    computedDate = `${year}-${month}-${day}`;
  }

  const errors = await applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        ...caseToValidate,
        finalBriefDueDate: computedDate,
        statusOfMatter,
      },
      useCaseEntity: true,
    });

  if (!errors) {
    return path.success({ finalBriefDueDate: computedDate });
  }

  return path.error({
    errors,
  });
};
