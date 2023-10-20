import { MOCK_CASE } from '../../../../../../shared/src/test/mockCase';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { migrateItems } from './0012-remove-signed-judge-on-spos-spto';

describe('migrateItems', () => {
  const mockJudge = 'Judge Barney';

  it('should add judge field and remove signedJudgeName, signedAt, and signedByUserId fields from SPTO docket entries', () => {
    const items = [
      {
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
        judge: undefined,
        pk: `case|${MOCK_CASE.docketNumber}`,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: '0e7f0c1a-4d88-4c42-a094-982812ca3d63',
        signedJudgeName: mockJudge,
        sk: 'docket-entry|f186f98f-6682-43e3-ac62-cc3ace20a7be',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([
      {
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
        judge: mockJudge,
        pk: `case|${MOCK_CASE.docketNumber}`,
        signedAt: undefined,
        signedByUserId: undefined,
        signedJudgeName: undefined,
        sk: 'docket-entry|f186f98f-6682-43e3-ac62-cc3ace20a7be',
      },
    ]);
  });

  it('should add judge field and remove signedJudgeName, signedAt, and signedByUserId fields from SPOS docket entries', () => {
    const items = [
      {
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .eventCode,
        judge: undefined,
        pk: `case|${MOCK_CASE.docketNumber}`,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: '0e7f0c1a-4d88-4c42-a094-982812ca3d63',
        signedJudgeName: mockJudge,
        sk: 'docket-entry|f186f98f-6682-43e3-ac62-cc3ace20a7be',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([
      {
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
            .eventCode,
        judge: mockJudge,
        pk: `case|${MOCK_CASE.docketNumber}`,
        signedAt: undefined,
        signedByUserId: undefined,
        signedJudgeName: undefined,
        sk: 'docket-entry|f186f98f-6682-43e3-ac62-cc3ace20a7be',
      },
    ]);
  });
});
