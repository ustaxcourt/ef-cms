import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

let user = {
  section: 'armenChambers',
};

let judgeUser = {
  name: 'Judge Armen',
};

presenter.providers.applicationContext = {
  getChiefJudgeNameForSigning: () => 'Judge Buch',
  getCurrentUser: () => user,
  getUseCases: () => ({
    getJudgeForUserChambersInteractor: () => judgeUser,
  }),
};

describe('setSignatureNameForPdfSigningAction', () => {
  it('sets the Chief Judge for non chamber users', async () => {
    user.section = 'docketclerk';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('Judge Buch');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Chief Judge',
    );
  });

  it('sets the chamber judge for chamber users', async () => {
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('Judge Armen');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual('');
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.name = 'Special Trial Judge Armen';
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('Judge Armen');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
