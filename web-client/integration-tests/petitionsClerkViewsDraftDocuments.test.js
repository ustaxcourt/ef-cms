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

const cerebralTest = setupTest();

describe('Petitions Clerk Views Draft Documents', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, 'Lubbock, Texas');

  it('views case detail', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: cerebralTest.docketNumber,
    });
  });

  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest, 2);

  it('views the second document in the draft documents list', async () => {
    // reset the draft documents view meta
    cerebralTest.setState('draftDocumentViewerDocketEntryId', null);

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      primaryTab: 'drafts',
    });

    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toEqual(true);

    // this gets fired when the component is mounted, so it is being explicitly called here
    await cerebralTest.runSequence(
      'loadDefaultDraftViewerDocumentToDisplaySequence',
    );

    let formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    let { draftDocuments } = formattedCase;

    const viewerDraftDocumentIdToDisplay = cerebralTest.getState(
      'viewerDraftDocumentToDisplay.docketEntryId',
    );
    expect(viewerDraftDocumentIdToDisplay).toEqual(
      draftDocuments[0].docketEntryId,
    );

    // select the second document in the list
    await cerebralTest.runSequence('setViewerDraftDocumentToDisplaySequence', {
      viewerDraftDocumentToDisplay: draftDocuments[1],
    });

    expect(
      cerebralTest.getState('screenMetadata.draftDocumentViewerDocketEntryId'),
    ).toEqual(draftDocuments[1].docketEntryId);

    // change tabs and come back to draft documents

    cerebralTest.setState(
      'currentViewMetadata.caseDetail.primaryTab',
      'docketRecord',
    );
    await cerebralTest.runSequence('caseDetailPrimaryTabChangeSequence');

    cerebralTest.setState(
      'currentViewMetadata.caseDetail.primaryTab',
      'drafts',
    );
    await cerebralTest.runSequence('caseDetailPrimaryTabChangeSequence');

    expect(
      cerebralTest.getState('viewerDraftDocumentToDisplay.docketEntryId'),
    ).toEqual(draftDocuments[1].docketEntryId);

    //leave case and come back
    await cerebralTest.runSequence('gotoDashboardSequence');

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      primaryTab: 'drafts',
    });

    // this gets fired when the component is mounted, so it is being explicitly called here
    await cerebralTest.runSequence(
      'loadDefaultDraftViewerDocumentToDisplaySequence',
    );

    formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    // resets back to first document
    expect(
      cerebralTest.getState('viewerDraftDocumentToDisplay.docketEntryId'),
    ).toEqual(formattedCase.draftDocuments[0].docketEntryId);
  });
});
