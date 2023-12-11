import { Correspondence } from '../../../../../shared/src/business/entities/Correspondence';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updateCaseCorrespondence } from './updateCaseCorrespondence';

describe('updateCaseCorrespondence', () => {
  let putStub;

  beforeAll(() => {
    putStub = jest.fn().mockResolvedValue(null);

    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });
  });

  it('should update the specified correspondence record', async () => {
    const mockGuid = applicationContext.getUniqueId();
    const mockCorrespondence = new Correspondence({
      archived: false,
      correspondenceId: mockGuid,
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
      userId: mockGuid,
    });

    await updateCaseCorrespondence({
      applicationContext,
      correspondence: mockCorrespondence,
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        archived: false,
        correspondenceId: mockGuid,
        documentTitle: 'My Correspondence',
        filedBy: 'Docket clerk',
        pk: 'case|101-20',
        sk: `correspondence|${mockGuid}`,
        userId: mockGuid,
      },
    });
  });
});
