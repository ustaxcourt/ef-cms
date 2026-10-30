import {
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsIrsPractitioner1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../authentication/login-as-helpers';
import { UNAUTHORIZED_PETITIONER_EMAIL } from './motion-visibility-constants';
import { UnassociatedExternalRole } from './motion-visibility-types';

export const unassociatedExternalRolesForPrivatePractitionerFiledMotion: UnassociatedExternalRole[] =
  [
    {
      login: () => loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL),
      role: 'petitioner not on case',
    },
    {
      login: () =>
        loginAsPrivatePractitioner('privatePractitioner2@example.com'),
      role: 'private practitioner not on case',
    },
    {
      login: () => loginAsIrsPractitioner(),
      role: 'IRS practitioner not on case',
    },
    {
      login: () => loginAsDojPractitioner(),
      role: 'DOJ practitioner not on case',
    },
  ];

export const unassociatedExternalRolesForPetitionerOrPaperMotionCase: UnassociatedExternalRole[] =
  [
    {
      login: () => loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL),
      role: 'petitioner not on case',
    },
    {
      login: () =>
        loginAsPrivatePractitioner('privatePractitioner2@example.com'),
      role: 'private practitioner not on case',
    },
    {
      login: () => loginAsIrsPractitioner1(),
      role: 'IRS practitioner not on case',
    },
    {
      login: () => loginAsDojPractitioner(),
      role: 'DOJ practitioner not on case',
    },
  ];

export const unassociatedExternalRolesForIrsPractitionerFiledMotion: UnassociatedExternalRole[] =
  [
    {
      login: () => loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL),
      role: 'petitioner not on case',
    },
    {
      login: () => loginAsPrivatePractitioner(),
      role: 'private practitioner not on case',
    },
    {
      login: () => loginAsIrsPractitioner1(),
      role: 'IRS practitioner not on case',
    },
    {
      login: () => loginAsDojPractitioner(),
      role: 'DOJ practitioner not on case',
    },
  ];

export const getPetitionerFilerTestId = (primaryFilerName: string): string =>
  `filingParty-${primaryFilerName}, Petitioner`;
