import { genericHandler } from '../../genericHandler';

export const getJudgesChambersLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    console.log('Got to lambda!!');
    return await applicationContext
      .getUseCases()
      .getJudgesChambersInteractor(applicationContext);
  });
