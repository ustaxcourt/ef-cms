import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';
import { extractedPendingMessagesFromCaseDetail as extractPendingMessagesFromCaseDetailComputed } from './extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractPendingMessagesFromCaseDetailComputed,
  {
    ...applicationContext,
    getCurrentUser: () => ({
      role: User.ROLES.petitionsClerk,
    }),
    getUtilities: () => {
      return {
        createISODateString,
        formatDateString,
        formatNow,
        prepareDateFromString,
      };
    },
  },
);

const baseState = {
  constants: { STATUS_TYPES: Case.STATUS_TYPES, USER_ROLES: User.ROLES },
};

describe('extractPendingMessagesFromCaseDetail', () => {
  it('should not fail if work items is not defined', () => {
    const result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        ...baseState,
        caseDetail: {
          documents: [{}],
        },
      },
    });
    expect(result).toMatchObject([]);
  });

  it('should not fail if documents is not defined', () => {
    const result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        ...baseState,
        caseDetail: {},
      },
    });
    expect(result).toMatchObject([]);
  });

  it('sorts the workQueue by the latest currentMessage for each work item', () => {
    const result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        ...baseState,
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  caseStatus: 'new',
                  document: {
                    createdAt: '2018-03-02T05:00:00.000Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-03-01T05:00:00.000Z',
                      message: 'there',
                      messageId: 'gl',
                    },
                    {
                      createdAt: '2018-03-02T05:00:00.000Z',
                      message: 'is',
                      messageId: 'a',
                    },
                    {
                      createdAt: '2018-03-03T05:00:00.000Z',
                      message: 'no',
                      messageId: 'b',
                    },
                    {
                      createdAt: '2018-03-04T05:00:00.000Z',
                      message: 'level',
                      messageId: 'c',
                    },
                  ],
                  workItemId: '1',
                },
                {
                  caseStatus: 'new',
                  document: {
                    createdAt: '2018-03-02T05:00:00.000Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-02-01T05:00:00.000Z',
                      message: 'yup',
                      messageId: '1',
                    },
                    {
                      createdAt: '2018-03-01T05:00:00.000Z',
                      message: 'nope',
                      messageId: '2',
                    },
                    {
                      createdAt: '2018-04-01T05:00:00.000Z',
                      message: 'gg',
                      messageId: '3',
                    },
                  ],
                  workItemId: '2',
                },
              ],
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([
      {
        currentMessage: {
          message: 'gg',
        },
        workItemId: '2',
      },
      {
        currentMessage: {
          message: 'level',
        },
        workItemId: '1',
      },
    ]);
  });

  it('should filter out the batched for IRS messages', () => {
    const result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        ...baseState,
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  caseStatus: 'new',
                  document: {
                    createdAt: '2018-03-02T00:00:00.000Z',
                  },
                  messages: [
                    {
                      message: 'batched for IRS',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([]);
  });
});
