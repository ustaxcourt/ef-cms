import { state } from '@web-client/presenter/app.cerebral';

export const validateBriefDueDateAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  console.log('validateBriefDueDateAction');
  const { docketNumber, finalBriefDueDate } = props;
  const { submittedAndCavCasesByJudge } = get(
    state.judgeActivityReport.judgeActivityReportData,
  );
  const caseToValidate = submittedAndCavCasesByJudge!.find(
    aCase => aCase.docketNumber === docketNumber,
  );

  console.log('caseToValidate', caseToValidate);

  let computedDate = '';
  if (finalBriefDueDate) {
    const [month, day, year] = finalBriefDueDate.split('/');
    computedDate = `${year}-${month}-${day}`;
  }

  console.log('computedDate', computedDate);
  console.log('caseToValidate.caseType', caseToValidate?.caseType);


	//TODO: create new interactor to validate new entity to be saved in DB
		//biref due date
		//status of matter
		//primary issue
  const errors = await applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        ...caseToValidate,
        finalBriefDueDate: computedDate,
      },
      useCaseEntity: true,
    });

  console.log('errors', errors);

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
