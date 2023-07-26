interface ISubmittedCavCasesTableHelper {
  daysInStatusSortHandler: Function | undefined;
  getSubmittedOrCAVDate: Function | undefined;
}

export const submittedCavCasesTableHelper =
  (): ISubmittedCavCasesTableHelper => {
    const daysInStatusSortHandler = (
      caseA: { daysElapsedSinceLastStatusChange: number },
      caseB: { daysElapsedSinceLastStatusChange: number },
    ) => {
      if (
        caseA.daysElapsedSinceLastStatusChange <
        caseB.daysElapsedSinceLastStatusChange
      )
        return 1;
      if (
        caseA.daysElapsedSinceLastStatusChange >
        caseB.daysElapsedSinceLastStatusChange
      )
        return -1;
      return 0;
    };

    const getSubmittedOrCAVDate = (
      caseStatusHistory: { updatedCaseStatus: string; formattedDate: string }[],
    ): string | undefined => {
      return caseStatusHistory.find(statusHistory =>
        ['Submitted', 'CAV'].includes(statusHistory.updatedCaseStatus),
      )?.formattedDate;
    };

    return { daysInStatusSortHandler, getSubmittedOrCAVDate };
  };
