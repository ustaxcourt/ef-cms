// const {
//   applicationContext,
// } = require('../../test/createTestApplicationContext');
// const {
//   createAndServeNoticeDocketEntry,
// } = require('./createAndServeNoticeDocketEntry');
// const { Case } = require('../../entities/cases/Case');
// const { MOCK_CASE } = require('../../../test/mockCase');

// describe('createAndServeDocketEntry', () => {
//   const mockUserId = '85a5b1c8-1eed-44b6-932a-967af060597a';
//   const trialSessionId = '76a5b1c8-1eed-44b6-932a-967af060597a';

//   const mockOpenCase = new Case(
//     {
//       ...MOCK_CASE,
//       trialDate: '2019-03-01T21:42:29.073Z',
//       trialSessionId,
//     },
//     { applicationContext },
//   );

//   it('should save the generated notice to s3', async () => {
//     const mockDocketEntryId = '1ed611ad-17f9-4e2d-84fb-a084fe475dd7';
//     const mockNotice = 'The rain falls mainly on the plane';
//     applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);
//     applicationContext
//       .getUseCases()
//       .generateNoticeOfChangeOfTrialJudgeInteractor.mockReturnValue(mockNotice);

//     await createAndServeNoticeDocketEntry(applicationContext, {
//       PDFDocument: mockPdfDocument,
//       caseEntity: mockOpenCase,
//       userId: mockUserId,
//       // documentInfo
//       // newPdfDoc
//       // notice
//     });

//     expect(
//       applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
//         .calls[0][0],
//     ).toMatchObject({
//       document: mockNotice,
//       key: mockDocketEntryId,
//     });
//   });
// });
