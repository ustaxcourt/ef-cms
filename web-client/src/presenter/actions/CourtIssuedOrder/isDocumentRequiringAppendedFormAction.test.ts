import { isDocumentRequiringAppendedFormAction } from './isDocumentRequiringAppendedFormAction';
import { presenter } from '../../presenter-mock';

import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isDocumentRequiringAppendedFormAction', () => {
  let noStub;
  let yesStub;

  beforeAll(() => {
    noStub = jest.fn();
    yesStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should call path.yes when the document to edit is an OAP', async () => {
    await runAction(isDocumentRequiringAppendedFormAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
          eventCode:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition.eventCode,
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call path.yes when the document to edit is an OAPF', async () => {
    await runAction(isDocumentRequiringAppendedFormAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
          eventCode:
            SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
              .eventCode,
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call path.no when the document to edit is not an OAP', async () => {
    await runAction(isDocumentRequiringAppendedFormAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
          eventCode:
            SYSTEM_GENERATED_DOCUMENT_TYPES
              .noticeOfAttachmentsInNatureOfEvidence.eventCode,
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
