import { COURT_ISSUED_EVENT_CODES } from '../../../../../shared/src/business/entities/EntityConstants';
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
          isMinuteEntry: true,
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('NoDocument');
    expect(result.state.docketEntryId).toEqual('123');
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
