import { EligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  eligibleCases: EligibleCase[];
} => {
  // const permissions = get(state.permissions)!;
  const { eligibleCases, location } = get(state.trialLocationPage);

  const trialCityFormatted = location.replace('-', ', ');

  // const pageSize = 100;

  return { eligibleCases, location: trialCityFormatted };
};
