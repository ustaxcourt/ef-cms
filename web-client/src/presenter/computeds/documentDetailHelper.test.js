import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Correspondence } from '../../../../shared/src/business/entities/Correspondence';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  documentDetailHelper as documentDetailHelperComputed,
  formatDocumentWorkItems,
} from './documentDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const getDateISO = () => new Date().toISOString();

let globalUser;

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

const getBaseState = user => {
  globalUser = user;
  return {
    constants: { STATUS_TYPES: CASE_STATUS_TYPES, USER_ROLES: ROLES },
    permissions: getUserPermissions(user),
  };
};

describe('document detail helper', () => {
  describe('formatDocumentWorkItems', () => {
    it('should return filtered and formatted completedWorkItems, incompleteWorkItems, and qcWorkItem', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const workItems = [
        {
          assigneeId: user.userId,
          caseStatus: CASE_STATUS_TYPES.new,
          completedAt: '2018-12-21T20:49:28.192Z',
          createdAt: '2018-11-21T20:49:28.192Z',
          document: {
            documentId: 'abc',
            documentType: 'Proposed Stipulated Decision',
            receivedAt: '2018-11-21T20:49:28.192Z',
          },
          messages: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              message: 'Test',
            },
          ],
          workItemId: '1',
        },
        {
          assigneeId: user.userId,
          caseStatus: CASE_STATUS_TYPES.new,
          createdAt: '2018-11-22T20:49:28.192Z',
          document: {
            documentId: 'abc',
            documentType: 'Proposed Stipulated Decision',
            receivedAt: '2018-11-22T20:49:28.192Z',
          },
          messages: [
            {
              createdAt: '2018-11-22T20:49:28.192Z',
              message: 'Test',
            },
          ],
          workItemId: '2',
        },
        {
          assigneeId: user.userId,
          caseStatus: CASE_STATUS_TYPES.new,
          createdAt: '2018-11-23T20:49:28.192Z',
          document: {
            documentId: 'abc',
            documentType: 'Proposed Stipulated Decision',
            receivedAt: '2018-11-23T20:49:28.192Z',
          },
          isInternal: true,
          messages: [
            {
              createdAt: '2018-11-23T20:49:28.192Z',
              message: 'Test',
            },
          ],
          workItemId: '3',
        },
      ];
      applicationContext.getCurrentUser = () => {
        return user;
      };
      const result = formatDocumentWorkItems({ applicationContext, workItems });
      expect(result).toMatchObject({
        completedWorkItems: [{ workItemId: '1' }],
        incompleteWorkItems: [{ workItemId: '3' }, { workItemId: '2' }],
        qcWorkItem: { workItemId: '2' },
      });
    });

    it('should return empty arrays for completedWorkItems and incompleteWorkItems and undefined for qcWorkItem if the workItems param is undefined', () => {
      const result = formatDocumentWorkItems({ applicationContext });
      expect(result).toMatchObject({
        completedWorkItems: [],
        incompleteWorkItems: [],
        qcWorkItem: undefined,
      });
    });
  });

  it('showAction function should return true for complete for document Id abc', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketRecord: [],
          documents: [{ documentId: 'abc' }],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('should set showSignDocumentButton to true when user has COURT_ISSUED_DOCUMENT permission and there is a valid document to sign that is not already signed', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Proposed Stipulated Decision',
              workItems: [
                {
                  assigneeId: user.userId,
                  caseStatus: CASE_STATUS_TYPES.new,
                  document: {
                    documentId: 'abc',
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
          status: CASE_STATUS_TYPES.new,
        },
        documentId: 'abc',
        permissions: {
          COURT_ISSUED_DOCUMENT: true,
        },
      },
    });
    expect(result.showSignDocumentButton).toEqual(true);
  });

  describe('createdFiledLabel', () => {
    it('should set createFiledLabel to `Created` for a court-issued document', async () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.createdFiledLabel).toEqual('Created');
    });

    it('should set createFiledLabel to `Filed` for a non court-issued document', async () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.createdFiledLabel).toEqual('Filed');
    });
  });

  describe('showCreatedFiled', () => {
    it('should set showCreatedFiled to true if the document is not an order or court-issued document', async () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Answer',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showCreatedFiled).toEqual(true);
    });

    it('should set showCreatedFiled to true if the document is an order and is in draft state (not on the docket record)', async () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showCreatedFiled).toEqual(true);
    });

    it('should set showCreatedFiled to false if the document is an order and is in not draft state (on the docket record)', async () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [{ documentId: 'abc' }],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showCreatedFiled).toEqual(false);
    });
  });

  describe('showAddCourtIssuedDocketEntryButton', () => {
    it('should set showAddCourtIssuedDocketEntryButton true when the user has the DOCKET_ENTRY permission and the document is an unsigned stipulated decision', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toEqual(true);
    });

    it('should set showAddCourtIssuedDocketEntryButton true when the user has the DOCKET_ENTRY permission and the document is a signed stipulated decision', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                signedAt: getDateISO(),
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toEqual(true);
    });

    it('should set showAddCourtIssuedDocketEntryButton true when the user has the DOCKET_ENTRY permission and the document is an unsigned order', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toEqual(true);
    });

    it('should set showAddCourtIssuedDocketEntryButton false when the user has the DOCKET_ENTRY permission and the document is a served order', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
                servedAt: getDateISO(),
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toEqual(false);
    });

    it('should set showAddCourtIssuedDocketEntryButton false when the user does not have the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitioner,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: false },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toBeFalsy();
    });

    it('should set showAddCourtIssuedDocketEntryButton false when the document type is not an order or stipulated decision', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddCourtIssuedDocketEntryButton).toEqual(false);
    });
  });

  describe('showEditDocketEntry and showEditCourtIssuedDocketEntry', () => {
    it('should set showEditDocketEntry false and showEditCourtIssuedDocketEntry true when the document is a signed stipulated decision with a docket entry and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [
              {
                documentId: 'abc',
              },
            ],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision Entered',
                signedAt: getDateISO(),
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
      expect(result.showEditCourtIssuedDocketEntry).toEqual(true);
    });

    it('should set showEditDocketEntry false when the document is an unsigned stipulated decision and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });

    it('should set showEditDocketEntry true when the non QCed document is a served order and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
                servedAt: getDateISO(),
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    isQC: true,
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(true);
    });

    it('should set showEditDocketEntry false on a QCed document even when it is a served order and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
                servedAt: getDateISO(),
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    completedAt: '2018-11-21T20:49:28.192Z',
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    isQC: true,
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });

    it('should set showEditDocketEntry false when the document is an unserved order and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });

    it('should set showEditDocketEntry false when the document is petition and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: CASE_STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });
  });

  describe('formattedDocument', () => {
    it('should search for the specified document in the case correspondence list', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const mockCorrespondence = new Correspondence({
        documentId: '123-abc',
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
      });
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            correspondence: [mockCorrespondence],
            docketRecord: [],
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
                documentType: 'Proposed Stipulated Decision',
                processingStatus: 'pending',
                reviewDate: '2018-11-21T20:49:28.192Z',
                userId: 'petitioner',
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    completedAt: '2018-11-21T20:49:28.192Z',
                    completedBy: 'William T. Riker',
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                  {
                    assigneeId: 'abc',
                    caseStatus: CASE_STATUS_TYPES.new,
                    document: {
                      documentType: 'Proposed Stipulated Decision',
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          documentId: '123-abc',
          workQueueToDisplay: { workQueueIsInternal: true },
        },
      });

      expect(result.formattedDocument.documentId).toEqual(
        mockCorrespondence.documentId,
      );
    });

    it('should search for the specified document in the case documents list', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const mockCorrespondence = new Correspondence({
        documentId: '123-abc',
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
      });
      const mockDocument = {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Proposed Stipulated Decision',
        processingStatus: 'pending',
        reviewDate: '2018-11-21T20:49:28.192Z',
        userId: 'petitioner',
        workItems: [
          {
            caseStatus: CASE_STATUS_TYPES.new,
            completedAt: '2018-11-21T20:49:28.192Z',
            completedBy: 'William T. Riker',
            document: {
              receivedAt: '2018-11-21T20:49:28.192Z',
            },
            messages: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',

                message: 'Served on IRS',
              },
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                message: 'Test',
              },
            ],
          },
          {
            assigneeId: 'abc',
            caseStatus: CASE_STATUS_TYPES.new,
            document: {
              documentType: 'Proposed Stipulated Decision',
              receivedAt: '2018-11-21T20:49:28.192Z',
            },
            messages: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',

                message: 'Served on IRS',
              },
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                message: 'Test',
              },
            ],
          },
        ],
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            correspondence: [mockCorrespondence],
            docketRecord: [],
            documents: [mockDocument],
          },
          documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          workQueueToDisplay: { workQueueIsInternal: true },
        },
      });

      expect(result.formattedDocument.documentId).toEqual(
        mockDocument.documentId,
      );
    });

    it('should indicate QC completed by workItem "completedBy" if not indicated on Document', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
                documentType: 'Proposed Stipulated Decision',
                processingStatus: 'pending',
                reviewDate: '2018-11-21T20:49:28.192Z',
                userId: 'petitioner',
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    completedAt: '2018-11-21T20:49:28.192Z',
                    completedBy: 'William T. Riker',
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                  {
                    assigneeId: 'abc',
                    caseStatus: CASE_STATUS_TYPES.new,
                    document: {
                      documentType: 'Proposed Stipulated Decision',
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          workQueueToDisplay: { workQueueIsInternal: true },
        },
      });

      expect(result.formattedDocument.qcInfo).toMatchObject({
        date: '11/21/18',
        name: 'William T. Riker',
      });
    });

    it('should indicate QC completed by "qcByUser" on Document if present', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
                documentType: 'Proposed Stipulated Decision',
                processingStatus: 'pending',
                qcAt: '2019-10-27T20:49:28.192Z',
                qcByUser: {
                  name: 'Reginald Barclay',
                  userId: 'xyzzy',
                },
                reviewDate: '2018-11-21T20:49:28.192Z',
                userId: 'petitioner',
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    completedAt: '2018-11-21T20:49:28.192Z',
                    completedBy: 'William T. Riker',
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                  {
                    assigneeId: 'abc',
                    caseStatus: CASE_STATUS_TYPES.new,
                    document: {
                      documentType: 'Proposed Stipulated Decision',
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          workQueueToDisplay: { workQueueIsInternal: true },
        },
      });

      expect(result.formattedDocument.qcInfo).toMatchObject({
        date: '10/27/19',
        name: 'Reginald Barclay',
      });
    });

    it('should filter out completed work items with Served on IRS messages', () => {
      const user = {
        role: ROLES.adc,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
                documentType: 'Proposed Stipulated Decision',
                processingStatus: 'pending',
                reviewDate: '2018-11-21T20:49:28.192Z',
                userId: 'petitioner',
                workItems: [
                  {
                    caseStatus: CASE_STATUS_TYPES.new,
                    completedAt: '2018-11-21T20:49:28.192Z',
                    document: {
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                  {
                    assigneeId: 'abc',
                    caseStatus: CASE_STATUS_TYPES.new,
                    document: {
                      documentType: 'Proposed Stipulated Decision',
                      receivedAt: '2018-11-21T20:49:28.192Z',
                    },
                    messages: [
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',

                        message: 'Served on IRS',
                      },
                      {
                        createdAt: '2018-11-21T20:49:28.192Z',
                        message: 'Test',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          workQueueToDisplay: { workQueueIsInternal: true },
        },
      });

      expect(result.formattedDocument.workItems).toHaveLength(1);
    });

    it("default to empty array when a document's workItems are non-existent", () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              },
            ],
          },
          documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
      });

      expect(result.formattedDocument.documentId).toEqual(
        'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
      expect(result.formattedDocument.workItems).toEqual([]);
    });
  });

  describe('showConfirmEditOrder, showSignedAt, and showRemoveSignature', () => {
    it('should show confirm edit order, signed at, and remove signature for a signed order', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Order of Dismissal',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(true);
      expect(result.showSignedAt).toEqual(true);
      expect(result.showRemoveSignature).toEqual(true);
    });

    it('should show confirm edit order, signed at, but NOT remove signature for a signed notice', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Notice',
                eventCode: 'NOT',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(true);
      expect(result.showSignedAt).toEqual(true);
      expect(result.showRemoveSignature).toEqual(false);
    });

    it('should NOT show confirm edit order OR remove signature when the documentType is not an order', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showSignedAt).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });

    it('should NOT show confirm edit order OR remove signature when the document has not been signed', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: null,
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showSignedAt).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });
  });

  describe('showPrintCaseConfirmationButton', () => {
    it("should show the 'Print Confirmation' button if a document has been served and the document is a petition ", () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(true);
    });

    it("should not show the 'Print Confirmation' button if a document has not been served", () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
                status: 'new',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(false);
    });

    it("should not show the 'Print Confirmation' button if the document is not a petition ", () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(false);
    });
  });

  describe('isDraftDocument', () => {
    it('should return isDraftDocument false if the document is served', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(false);
    });

    it('should return isDraftDocument true if the document is an unserved Stipulated Decision', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(true);
    });

    it('should return isDraftDocument true if the document is an order that is NOT on the docket record', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(true);
    });

    it('should return isDraftDocument false if the document is an order that is on the docket record', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [
              {
                documentId: 'abc',
              },
            ],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(false);
    });

    it('should return isDraftDocument true if the document is a court-issued document that is NOT on the docket record', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order for Amended Petition',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(true);
    });

    it('should return isDraftDocument false if the document is a court-issued document that is on the docket record', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [{ documentId: 'abc' }],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order for Amended Petition',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(false);
    });

    it('should return isDraftDocument false if the document is unserved but is not an internal document type', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId: 'abc',
                documentType: 'Amendment to Answer',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.isDraftDocument).toEqual(false);
    });

    describe('editUrl', () => {
      it('should go to the sign url when the document is a stip decision', () => {
        const user = {
          role: ROLES.petitionsClerk,
          userId: '123',
        };
        const result = runCompute(documentDetailHelper, {
          state: {
            ...getBaseState(user),
            caseDetail: {
              docketRecord: [],
              documents: [
                {
                  documentId: 'abc',
                  documentType: 'Stipulated Decision',
                },
              ],
            },
            documentId: 'abc',
            user,
          },
        });

        expect(result.isDraftDocument).toEqual(true);
        expect(result.formattedDocument.editUrl).toContain(
          '/documents/abc/sign',
        );
      });

      it('should go to the edit upload pdf url when the document is a Miscellaneous document', () => {
        const user = {
          role: ROLES.petitionsClerk,
          userId: '123',
        };
        const result = runCompute(documentDetailHelper, {
          state: {
            ...getBaseState(user),
            caseDetail: {
              docketRecord: [],
              documents: [
                {
                  documentId: 'abc',
                  documentType: 'Miscellaneous',
                },
              ],
            },
            documentId: 'abc',
            user,
          },
        });

        expect(result.isDraftDocument).toEqual(true);
        expect(result.formattedDocument.editUrl).toContain(
          '/edit-upload-court-issued/abc',
        );
      });

      it('should go to the edit order url when the document is a Order document', () => {
        const user = {
          role: ROLES.petitionsClerk,
          userId: '123',
        };
        const result = runCompute(documentDetailHelper, {
          state: {
            ...getBaseState(user),
            caseDetail: {
              docketNumber: '123-20',
              docketRecord: [],
              documents: [
                {
                  documentId: 'abc',
                  documentType: 'Order for Amended Petition',
                },
              ],
            },
            documentId: 'abc',
            user,
          },
        });

        expect(result.isDraftDocument).toEqual(true);
        expect(result.formattedDocument.editUrl).toContain('/edit-order/abc');
      });
    });
  });
});
