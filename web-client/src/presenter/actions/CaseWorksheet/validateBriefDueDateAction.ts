import { state } from '@web-client/presenter/app.cerebral';

export const validateBriefDueDateAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate } = props;
  const { submittedAndCavCasesByJudge } = get(state.judgeActivityReportData);
  const caseToValidate = submittedAndCavCasesByJudge.find(
    aCase => aCase.docketNumber === docketNumber,
  );

  let computedDate = '';
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
      },
      useCaseEntity: true,
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
