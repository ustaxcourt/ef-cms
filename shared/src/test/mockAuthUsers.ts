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
  userId: '612e3eb3-332c-4f1f-aaff-44ac8eae9a5f',
};

export const mockJudgeUser: AuthUser = {
  email: 'mockJudge@example.com',
  name: 'Judge Judy',
  role: ROLES.judge,
  userId: '3a13531b-0fc5-4a4c-8188-c72f50b1889d',
};

export const mockPetitionsClerkUser: AuthUser = {
  email: 'mockPetitionsClerk@example.com',
  name: 'Patty Petitions Clerk',
  role: ROLES.petitionsClerk,
  userId: 'd5234a80-64aa-4e3e-b0fd-59e6a835585e',
};

export const mockPrivatePractitionerUser: AuthUser = {
  email: 'mockPrivatePractitioner@example.com',
  name: 'Reginald Barclay',
  role: ROLES.privatePractitioner,
  userId: '73dedd03-e353-4703-bf6b-5b864b8c16ae',
};
