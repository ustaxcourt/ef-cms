// TODO: POSSIBLY DELETE

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTitleForMessagesAction } from './generateTitleForMessagesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateTitleForMessagesAction', () => {
  presenter.providers.applicationContext = applicationContext;
  let docTitle = 'Regular Title of doc';
  let documentMetaData = {
    documentTitle: docTitle,
  };
  it('should call set the forms document title with its document title if there is no previous Document (original)', async () => {
    const result = await runAction(generateTitleForMessagesAction, {
      modules: {
        presenter,
      },
      state: {
        form: documentMetaData,
      },
    });

    expect(result.state.form.documentTitle).toEqual(docTitle);
  });

  it('should call set the forms document title with previous Document document Title and its additional info if available', async () => {
    docTitle = 'Motion for Summary Judgement';
    const result = await runAction(generateTitleForMessagesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...documentMetaData,
          previousDocument: {
            additionalInfo: 'additional info from original entry',
            documentTitle: docTitle,
          },
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual(
      `${docTitle} additional info from original entry`,
    );
  });

  it('should call set the forms document title with previous Document document Title (and its additional info) with the modified additionalInfo', async () => {
    docTitle = 'Motion for Summary Judgement';
    const addedInfo =
      'Newly added info in preparation for modifying original document title';
    const result = await runAction(generateTitleForMessagesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...documentMetaData,
          additionalInfo: addedInfo,
          previousDocument: {
            additionalInfo: 'additional info from original entry',
            documentTitle: docTitle,
          },
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual(
      `${docTitle} additional info from original entry ${addedInfo}`,
    );
  });
});
