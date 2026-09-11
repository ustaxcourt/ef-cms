import {
  COURT_ISSUED_EVENT_CODES,
  MINUTE_ENTRIES_MAP,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketEntryMetaTypeAction } from './setDocketEntryMetaTypeAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setDocketEntryMetaTypeAction', () => {
  it('Should return CourtIssued in the case of a court issued document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode: COURT_ISSUED_EVENT_CODES[0].eventCode,
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
    expect(result.state.docketEntryId).toEqual('123');
  });

  it('Should return Document in the case of a non court issued document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('Document');
    expect(result.state.docketEntryId).toEqual('123');
  });

  it('Should return NoDocument when the docket entry is a minute entry', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode:
            MINUTE_ENTRIES_MAP[Object.keys(MINUTE_ENTRIES_MAP)[0]].eventCode,
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('NoDocument');
    expect(result.state.docketEntryId).toEqual('123');
  });

  it('Should return Document for an event code shared with the court issued list when the scenario matches an internal filing event', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode: 'MISC',
          scenario: 'Nonstandard B',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('Document');
  });

  it('Should return CourtIssued for an event code shared with the internal filing events when the scenario is a court issued scenario', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode: 'MISC',
          scenario: 'Type A',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
  });

  it('Should return CourtIssued for an event code shared with the internal filing events when no scenario is recorded', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode: 'MISC',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
  });

  it('Should return CourtIssued when form.eventCode is NODC', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          docketEntryId: '123',
          eventCode: 'NODC',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
  });
});
