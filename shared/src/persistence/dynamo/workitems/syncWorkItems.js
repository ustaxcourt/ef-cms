const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

const {
  deleteMappingRecord,
} = require('../../dynamo/helpers/deleteMappingRecord');

const client = require('../../dynamodbClientService');

const processNewWorkItem = async ({ workItem, applicationContext }) => {
  if (workItem.assigneeId) {
    await createMappingRecord({
      pkId: workItem.assigneeId,
      skId: workItem.workItemId,
      type: 'workItem',
      applicationContext,
    });
  }

  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  await client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: workItem.workItemId,
      sk: workItem.workItemId,
      ...workItem,
    },
  });
};

const syncChangedCaseStatus = async ({
  workItem,
  caseToSave,
  applicationContext,
  existing,
}) => {
  workItem.caseStatus = caseToSave.status;
  if (caseToSave.status === 'Batched for IRS' && workItem.isInitializeCase) {
    // TODO: this seems like business logic, refactor
    const batchedMessage = workItem.messages.find(
      message => message.message === 'Petition batched for IRS', // TODO: this probably shouldn't be hard coded
    );
    const { userId, createdAt } = batchedMessage;

    await createMappingRecord({
      applicationContext,
      item: {
        workItemId: existing.workItemId,
      },
      pkId: userId,
      skId: createdAt,
      type: 'sentWorkItem',
    });

    await createMappingRecord({
      applicationContext,
      item: {
        workItemId: existing.workItemId,
      },
      pkId: existing.section,
      skId: createdAt,
      type: 'sentWorkItem',
    });
  } else if (caseToSave.status === 'Recalled') {
    // TODO: this seems like business logic, refactor
    const batchedMessage = workItem.messages.find(
      message => message.message === 'Petition batched for IRS', // TODO: this probably shouldn't be hard coded
    );
    let userId, createdAt;
    if (batchedMessage) {
      userId = batchedMessage.userId;
      createdAt = batchedMessage.createdAt;

      await deleteMappingRecord({
        applicationContext,
        pkId: userId,
        skId: createdAt,
        type: 'sentWorkItem',
      });
      await deleteMappingRecord({
        applicationContext,
        pkId: 'petitions', // TODO: this probably shouldn't be hard coded
        skId: createdAt,
        type: 'sentWorkItem',
      });
    }
  }
  await exports.updateWorkItem({
    applicationContext,
    workItemToSave: workItem,
  });
};

const handleExistingWorkItem = async ({
  applicationContext,
  workItem,
  existing,
  caseToSave,
  currentCaseState,
}) => {
  if (workItem.assigneeId !== existing.assigneeId) {
    await exports.reassignWorkItem({
      applicationContext,
      existingWorkItem: existing,
      workItemToSave: workItem,
    });
  }

  if (existing.docketNumberSuffix !== workItem.docketNumberSuffix) {
    await exports.updateWorkItem({
      applicationContext,
      workItemToSave: workItem,
    });
  }

  if (!existing.completedAt && workItem.completedAt) {
    await createMappingRecord({
      applicationContext,
      item: {
        workItemId: existing.workItemId,
      },
      pkId: workItem.section,
      skId: workItem.completedAt,
      type: 'sentWorkItem',
    });
  }

  if (caseToSave.status !== currentCaseState.status) {
    syncChangedCaseStatus({
      workItem,
      caseToSave,
      applicationContext,
      existing,
    });
  }
};

const getCurrentWorkItems = ({ currentCaseState }) => {
  let currentWorkItems = [];
  ((currentCaseState || {}).documents || []).forEach(
    document =>
      (currentWorkItems = [...currentWorkItems, ...(document.workItems || [])]),
  );
  return currentWorkItems;
};

const getNewWorkItems = ({ caseToSave }) => {
  let newWorkItems = [];
  (caseToSave.documents || []).forEach(
    document =>
      (newWorkItems = [...newWorkItems, ...(document.workItems || [])]),
  );
  return newWorkItems;
};

exports.syncWorkItems = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  let currentWorkItems = getCurrentWorkItems({ currentCaseState });
  let newWorkItems = getNewWorkItems({ caseToSave });

  for (let workItem of newWorkItems) {
    const existing = currentWorkItems.find(
      item => item.workItemId === workItem.workItemId,
    );
    if (!existing) {
      await processNewWorkItem({
        workItem,
        applicationContext,
      });
    } else {
      await handleExistingWorkItem({
        applicationContext,
        workItem,
        existing,
        caseToSave,
        currentCaseState,
      });
    }
  }
};

exports.reassignWorkItem = async ({
  applicationContext,
  existingWorkItem,
  workItemToSave,
}) => {
  if (existingWorkItem.assigneeId) {
    await deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.assigneeId,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  if (existingWorkItem.section !== workItemToSave.section) {
    await deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.section,
      skId: existingWorkItem.workItemId,
      type: 'workItem',
    });

    await createMappingRecord({
      applicationContext,
      pkId: workItemToSave.section,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  await createMappingRecord({
    applicationContext,
    pkId: workItemToSave.assigneeId,
    skId: workItemToSave.workItemId,
    type: 'workItem',
  });
};

exports.updateWorkItem = async ({ applicationContext, workItemToSave }) => {
  await client.put({
    applicationContext,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
    TableName: `efcms-${applicationContext.environment.stage}`,
  });
};
