import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const mockPetitionerUser: AuthUser = {
  email: 'mockPetitioner@example.com',
  name: 'Tax Payer',
  role: ROLES.petitioner,
  userId: 'e4988d2d-deb0-4b65-a97f-5abfadb0970a',
};
export const mockDocketClerkUser: AuthUser = {
  email: 'mockDocketClerk@example.com',
  name: 'Dimmy Docket',
  role: ROLES.docketClerk,
  userId: 'e4988d2d-deb0-4b65-a97f-5abfadb0970a',
};

export const mockJudgeUser: AuthUser = {
  email: 'mockJudge@example.com',
  name: 'Judge Judy',
  role: ROLES.judge,
  userId: '3a13531b-0fc5-4a4c-8188-c72f50b1889d',
};
