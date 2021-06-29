import { fakeFile, loginAs, setupTest, viewCaseDetail } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest();

describe('Petitions Clerk Views Draft Documents', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile, 'Lubbock, Texas');

  it('views case detail', async () => {
    await viewCaseDetail({ docketNumber: test.docketNumber, test });
  });

  petitionsClerkAddsOrderToCase(test);
  petitionsClerkAddsOrderToCase(test);
  petitionsClerkViewsDraftDocuments(test, 2);

  it('views the second document in the draft documents list', async () => {
    // reset the draft documents view meta
    test.setState('draftDocumentViewerDocketEntryId', null);

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
      primaryTab: 'drafts',
    });

    expect(
      test.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toEqual(true);

    // this gets fired when the component is mounted, so it is being explicitly called here
    await test.runSequence('loadDefaultDraftViewerDocumentToDisplaySequence');

    let formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    let { draftDocuments } = formattedCase;

    const viewerDraftDocumentIdToDisplay = test.getState(
      'viewerDraftDocumentToDisplay.docketEntryId',
    );
    expect(viewerDraftDocumentIdToDisplay).toEqual(
      draftDocuments[0].docketEntryId,
    );

    // select the second document in the list
    await test.runSequence('setViewerDraftDocumentToDisplaySequence', {
      viewerDraftDocumentToDisplay: draftDocuments[1],
    });

    expect(
      test.getState('screenMetadata.draftDocumentViewerDocketEntryId'),
    ).toEqual(draftDocuments[1].docketEntryId);

    // change tabs and come back to draft documents

    test.setState('currentViewMetadata.caseDetail.primaryTab', 'docketRecord');
    await test.runSequence('caseDetailPrimaryTabChangeSequence');

    test.setState('currentViewMetadata.caseDetail.primaryTab', 'drafts');
    await test.runSequence('caseDetailPrimaryTabChangeSequence');

    expect(test.getState('viewerDraftDocumentToDisplay.docketEntryId')).toEqual(
      draftDocuments[1].docketEntryId,
    );

    //leave case and come back
    await test.runSequence('gotoDashboardSequence');

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
      primaryTab: 'drafts',
    });

    // this gets fired when the component is mounted, so it is being explicitly called here
    await test.runSequence('loadDefaultDraftViewerDocumentToDisplaySequence');

    formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    // resets back to first document
    expect(test.getState('viewerDraftDocumentToDisplay.docketEntryId')).toEqual(
      formattedCase.draftDocuments[0].docketEntryId,
    );
  });
});
