const { getCaseByCaseId } = require('../../dynamo/cases/getCaseByCaseId');

exports.updateWorkItemsUsingCases = async ({
  applicationContext,
  workItems,
}) => {
  for (let workItem of workItems) {
    const caseEntity = await getCaseByCaseId({
      applicationContext,
      caseId: workItem.caseId,
    });
    workItem.docketNumber = caseEntity.docketNumber;
    workItem.caseStatus = caseEntity.status;
  }

  return workItems;
};
