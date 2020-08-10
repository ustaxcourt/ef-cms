// const {
//   updateInitialFilingDocuments,
// } = require('./updateInitialFilingDocuments');
// const { applicationContext } = require('../');
// const { MOCK_CASE } = require('../../../test/mockCase');
// const { ROLES } = require('../../entities/EntityConstants');

// describe('addNewInitialFilingToCase', () => {
//   const mockRQT = {
//     documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
//     documentType: 'Request for Place of Trial',
//     eventCode: 'RQT',
//     filedBy: 'Test Petitioner',
//     userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
//   };

//   const petitionsClerkUser = {
//     name: 'petitions clerk',
//     role: ROLES.petitionsClerk,
//     userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
//   };

//   let mockOriginalCase;
//   let mockCaseToUpdate;

//   beforeAll(() => {});

//   it.only('should add a new initial filing document to the case when the document does not exist on the original case', async () => {
//     mockOriginalCase = { ...MOCK_CASE, documents: [] };
//     mockCaseToUpdate = {
//       ...MOCK_CASE,
//       documents: [...MOCK_CASE.documents, mockRQT],
//     };

//     await updateInitialFilingDocuments({
//       applicationContext,
//       authorizedUser: petitionsClerkUser,
//       caseEntity: mockOriginalCase,
//       caseToUpdate: mockCaseToUpdate,
//     });

//     const rqtFile = mockOriginalCase.find(
//       d => d.documentId === mockRQT.documentId,
//     );
//     expect(rqtFile).toBeDefined();
//   });

//   it('should remove a new initial filing document from the case when the document does not exist on the case from the form', async () => {
//     applicationContext
//       .getPersistenceGateway()
//       .getCaseByDocketNumber.mockReturnValue({
//         ...MOCK_CASE,
//         documents: [...MOCK_CASE.documents, mockRQT],
//       });

//     await updateInitialFilingDocuments({
//       applicationContext,
//       caseToUpdate: {
//         ...MOCK_CASE,
//       },
//       docketNumber: MOCK_CASE.docketNumber,
//     });

//     const rqtFile = mockOriginalCase.find(
//       d => d.documentId === mockRQT.documentId,
//     );
//     expect(rqtFile).toBeUndefined();
//   });

//   it.skip('should remove the original document from the case and add a new one fix this test anme later', async () => {
//     applicationContext
//       .getPersistenceGateway()
//       .getCaseByDocketNumber.mockReturnValue({
//         ...MOCK_CASE,
//         documents: [...MOCK_CASE.documents, mockRQT],
//       });

//     await addNewInitialFilingToCase({
//       applicationContext,
//       caseToUpdate: {
//         ...MOCK_CASE,
//       },
//       docketNumber: MOCK_CASE.docketNumber,
//     });

//     const updatedCaseDocuments = applicationContext.getPersistenceGateway()
//       .updateCase.mock.calls[0][0].caseToUpdate.documents;
//     const rqtFile = updatedCaseDocuments.find(
//       d => d.documentId === mockRQT.documentId,
//     );
//     expect(rqtFile).toBeUndefined();
//   });
// });
