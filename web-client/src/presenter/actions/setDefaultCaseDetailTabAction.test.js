import { PARTY_VIEW_TABS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultCaseDetailTabAction } from './setDefaultCaseDetailTabAction';

describe('setDefaultCaseDetailTabAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the default values for caseDetail view tabs', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'overview',
      docketRecordTab: 'docketRecord',
      inProgressTab: 'draftDocuments',
      partyViewTab: PARTY_VIEW_TABS.petitionersAndCounsel,
      primaryTab: 'docketRecord',
    });
  });

  it('should set the partyViewTab based on the props.partiesTab provided if it is not already set in state', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
      props: {
        caseInformationTab: 'parties',
        partiesTab: 'participantsAndCounsel',
        primaryTab: 'caseInformation',
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'parties',
      partyViewTab: PARTY_VIEW_TABS.participantsAndCounsel,
      primaryTab: 'caseInformation',
    });
  });

  it('should NOT set the partyViewTab based on the props.partiesTab provided if it is already set in state', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
      props: {
        caseInformationTab: 'parties',
        partyViewTab: PARTY_VIEW_TABS.petitionersAndCounsel,
        primaryTab: 'caseInformation',
      },
      state: {
        currentViewMetadata: {
          caseDetail: {
            partyViewTab: PARTY_VIEW_TABS.participantsAndCounsel,
          },
        },
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'parties',
      partyViewTab: PARTY_VIEW_TABS.participantsAndCounsel,
      primaryTab: 'caseInformation',
    });
  });

  it('should set the primaryTab to passed in prop value', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
      props: {
        primaryTab: 'caseInformation',
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'overview',
      inProgressTab: 'draftDocuments',
      primaryTab: 'caseInformation',
    });
  });

  it('should set the docketRecordTab to passed in prop value', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
      props: {
        docketRecordTab: 'documentView',
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'overview',
      docketRecordTab: 'documentView',
      inProgressTab: 'draftDocuments',
      primaryTab: 'docketRecord',
    });
  });

  it('should not set anything if currentViewMetadata.caseDetail.frozen is true', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      modules: { presenter },
      props: {
        docketRecordTab: 'documentView',
        primaryTab: 'caseInformation',
      },
      state: {
        currentViewMetadata: {
          caseDetail: {
            caseInformationTab: 'petitioner',
            docketRecordTab: 'docketRecord',
            frozen: true,
            inProgressTab: 'messages',
            primaryTab: 'caseInformation',
          },
        },
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'petitioner',
      docketRecordTab: 'docketRecord',
      frozen: true,
      inProgressTab: 'messages',
      primaryTab: 'caseInformation',
    });
  });
});
