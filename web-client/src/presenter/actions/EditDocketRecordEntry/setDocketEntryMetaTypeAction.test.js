import { Document } from '../../../../../shared/src/business/entities/Document';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDocketEntryMetaTypeAction } from './setDocketEntryMetaTypeAction';

describe('setDocketEntryMetaTypeAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('Should return CourtIssued in the case of a court issued document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {
          documentId: '123',
          eventCode: Document.COURT_ISSUED_EVENT_CODES[0].eventCode,
        },
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('CourtIssued');
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
  });

  it('Should return NoDocument when there is no document', async () => {
    const result = await runAction(setDocketEntryMetaTypeAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.screenMetadata.editType).toEqual('NoDocument');
  });
});
