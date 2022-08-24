interface IUpdateCaseAndAssociations {
  ({
    applicationContext,
    caseToUpdate,
  }: {
    applicationContext: IApplicationContext;
    caseToUpdate: any;
  }): Promise<any>;
}

type TUseCaseHelpers = {
  [key: string]: any;
  updateCaseAndAssociations: IUpdateCaseAndAssociations;
};
