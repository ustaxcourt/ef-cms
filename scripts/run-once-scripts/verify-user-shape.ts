import { createApplicationContext } from '../../web-api/src/applicationContext';
import { environment } from '../../web-api/src/environment';
import joi from 'joi';

async function main() {
  const applicationContext = createApplicationContext({});
  const cognito = applicationContext.getCognito();
  const PAGE_SIZE = 60;
  const authUserSchema = joi
    .object()
    .required()
    .keys({
      email: joi.string().min(1).max(100).email({ tlds: false }).required(),
      name: joi.string().min(1).required(),
      userId: joi.string().min(1).uuid().required(),
    });

  let PaginationToken: string | undefined;
  let usersCompleted = 0;
  do {
    const response = await cognito.listUsers({
      Limit: PAGE_SIZE,
      PaginationToken,
      UserPoolId: environment.userPoolId,
    });

    PaginationToken = response.PaginationToken;
    response.Users?.forEach(async user => {
      const userId = user.Attributes?.find(
        cognitoAttribute => cognitoAttribute.Name === 'custom:userId',
      )?.Value;
      const email = user.Attributes?.find(
        cognitoAttribute => cognitoAttribute.Name === 'email',
      )?.Value;
      const name = user.Attributes?.find(
        cognitoAttribute => cognitoAttribute.Name === 'name',
      )?.Value;

      const authUser = {
        userId,
        name,
        email,
      };

      const { error } = authUserSchema.validate(authUser, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        console.log(error);
        console.log('User does not meet authUser standards', user);
      }
    });

    usersCompleted = usersCompleted + PAGE_SIZE;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);
}

void main();
