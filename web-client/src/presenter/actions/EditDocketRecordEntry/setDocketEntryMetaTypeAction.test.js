import { COURT_ISSUED_EVENT_CODES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocketEntryMetaTypeAction } from './setDocketEntryMetaTypeAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setDocketEntryMetaTypeAction', () => {
  it('Should return CourtIssued in the case of a court issued document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          documentId: '123',
          eventCode: COURT_ISSUED_EVENT_CODES[0].eventCode,
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
    expect(result.state.documentId).toEqual('123');
  });

  it('Should return Document in the case of a non court issued document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          documentId: '123',
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('Document');
    expect(result.state.documentId).toEqual('123');
  });

  it('Should return NoDocument when there is no document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('NoDocument');
    expect(result.state.documentId).toBeUndefined();
  });
});
