import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest, waitForExpectedItem } from './helpers';

describe('Admissions Clerk uploads a practitioner document', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');

  it('view the practitioner documents tab', async () => {
    await cerebralTest.runSequence('gotoPractitionerDetailSequence', {
      barNumber: 'PT1234',
      tab: 'practitioner-documents',
    });

    await cerebralTest.runSequence('gotoPractitionerAddDocumentSequence', {
      barNumber: 'PT1234',
    });

    cerebralTest.setState('form.practitionerDocumentFile', fakeFile);

    await cerebralTest.runSequence('submitAddPractitionerDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      categoryType: expect.any(String),
    });

    cerebralTest.setState(
      'form.categoryType',
      PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
    );
    cerebralTest.expectedDescription = `my integration test ${Math.random()}`;
    cerebralTest.setState('form.description', cerebralTest.expectedDescription);

    await cerebralTest.runSequence('submitAddPractitionerDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'PractitionerInformation',
    });

    const practitionerDocuments = cerebralTest.getState(
      'practitionerDocuments',
    );

    const expectedApplicationDocument = practitionerDocuments.find(
      document => document.description === cerebralTest.expectedDescription,
    );

    expect(expectedApplicationDocument).toBeDefined();
  });
});
