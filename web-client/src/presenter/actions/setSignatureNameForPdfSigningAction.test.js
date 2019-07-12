import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

const testName = 'Test Name';

presenter.providers.applicationContext = {
  getChiefJudgeNameForSigning: () => testName,
};

describe('setSignatureNameForPdfSigningAction', () => {
  it('sets the Chief Judge name on state for document signing', async () => {
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(testName);
  });
});
