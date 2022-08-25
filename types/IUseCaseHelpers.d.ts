interface IUpdateCaseAndAssociations {
  ({
    applicationContext,
    caseToUpdate,
  }: {
    applicationContext: IApplicationContext;
    caseToUpdate: any;
  }): Promise<TCase>;
}

interface IUpdateCaseAutomaticBlock {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
  }): any;
}

type TUseCaseHelpers = {
  [key: string]: any;
  updateCaseAndAssociations: IUpdateCaseAndAssociations;
  updateCaseAutomaticBlock: IUpdateCaseAutomaticBlock;
};
