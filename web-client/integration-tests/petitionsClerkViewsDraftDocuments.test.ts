import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { loginAs, setupTest, viewCaseDetail } from './helpers';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Petitions Clerk Views Draft Documents', () => {
  const cerebralTest = setupTest();

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    trialLocation: 'Lubbock, Texas',
  });

  it('views case detail', async () => {
    await viewCaseDetail({
      cerebralTest,
      docketNumber: cerebralTest.docketNumber,
    });
  });

  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest, 3);

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
