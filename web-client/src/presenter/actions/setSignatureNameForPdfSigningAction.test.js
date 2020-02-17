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
    judgeUser.judgeFullName = 'Robert N. Armen, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Armen, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.judgeFullName = 'Robert N. Armen, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Armen, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
