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

interface IUpdateCaseAutomaticBlock {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
  }): any;
}

interface IRemoveCounselFromRemovedPetitioner {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
    petitionerContactId,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
    petitionerContactId: string;
  }): any;
}

interface IGetConsolidatedCasesForLeadCase {
  ({
    applicationContext: IApplicationContext,
    leadDocketNumber,
  }: {
    applicationContext: IApplicationContext;
    leadDocketNumber: string;
  }): Promise<TCase[]>;
}

interface IGetUnassociatedLeadCase {
  ({
    casesAssociatedWithUserOrLeadCaseMap,
    consolidatedCases,
    leadDocketNumber,
  }: {
    leadDocketNumber: string;
    casesAssociatedWithUserOrLeadCaseMap: any;
    consolidatedCases: TCase[];
  }): Promise<TCase[]>;
}

interface IFormatAndSortConsolidatedCases {
  ({
    consolidatedCases,
    leadDocketNumber,
    userAssociatedDocketNumbersMap,
  }: {
    leadDocketNumber: string;
    userAssociatedDocketNumbersMap: any;
    consolidatedCases: TCase[];
  }): Promise<TCase[]>;
}

interface IProcessUserAssociatedCases {
  (filteredOpenCases: TCase[]): any;
}

type TUseCaseHelpers = {
  [key: string]: any;
  updateCaseAndAssociations: IUpdateCaseAndAssociations;
  updateCaseAutomaticBlock: IUpdateCaseAutomaticBlock;
  removeCounselFromRemovedPetitioner: IRemoveCounselFromRemovedPetitioner;
  processUserAssociatedCases: IProcessUserAssociatedCases;
  getConsolidatedCasesForLeadCase: IGetConsolidatedCasesForLeadCase;
  getUnassociatedLeadCase: IGetUnassociatedLeadCase;
  formatAndSortConsolidatedCases: IFormatAndSortConsolidatedCases;
};
