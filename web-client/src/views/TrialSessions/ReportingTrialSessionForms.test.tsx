import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionInformationForm } from './SessionInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionAssignments } from '../TrialSessionWorkingCopy/SessionAssignments';
import { TrialSessionInformation } from '../TrialSessionDetails/TrialSessionInformation';
import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';

let mockDependencies: Record<string, unknown>;

jest.mock('@web-client/presenter/shared.cerebral', () => ({
  connect:
    (
      _dependencies: unknown,
      Component: React.ComponentType<Record<string, unknown>>,
    ) =>
    (props: Record<string, unknown>): React.ReactElement => (
      <Component {...mockDependencies} {...props} />
    ),
}));
jest.mock('@web-client/ustc-ui/DateInput/DateSelector', () => ({
  DateSelector: ({
    id,
    label,
    defaultValue,
  }: {
    id: string;
    label: string;
    defaultValue?: string;
  }): React.ReactElement => (
    <label>
      {label}
      <input id={id} defaultValue={defaultValue} />
    </label>
  ),
}));
jest.mock('../TrialCityOptions', () => ({
  TrialCityOptions: (): React.ReactElement => (
    <option>Birmingham, Alabama</option>
  ),
}));
jest.mock('@web-client/ustc-ui/Select/SelectSearch', () => ({
  SelectSearch: (): React.ReactElement => (
    <input aria-label="Search IRS calendar administrators" />
  ),
}));

describe('Reporting trial session views', () => {
  beforeEach(() => {
    mockDependencies = {
      TRIAL_SESSION_PROCEEDING_TYPES,
      TRIAL_SESSION_SCOPE_TYPES,
      DATE_FORMATS: {},
      addTrialSessionInformationHelper: {
        isReportingSession: true,
        isStandaloneSession: false,
        showReportingOption: true,
        sessionTypes: ['Regular', 'Small', 'Hybrid', 'Hybrid-S'],
        title: 'Location Information',
      },
      form: {
        proceedingType: 'Reporting',
        sessionScope: 'Location-based',
        trialLocation: 'Birmingham, Alabama',
      },
      formattedTrialSessionDetails: {
        isReportingSession: true,
        proceedingType: 'Reporting',
        trialLocation: 'Birmingham, Alabama',
        editPermissions: 'all',
        formattedJudge: 'Judge Test',
        formattedStartDate: '12/01/30',
        formattedEstimatedEndDate: '12/01/30',
        formattedStartTime: '',
        formattedIrsCalendarAdministratorInfo: {
          name: 'Calendar Admin',
          email: 'admin@example.com',
          phone: '1234567890',
        },
      },
      trialSessionHeaderHelper: {},
      validationErrors: {},
      judges: [],
      sessionAssignmentHelper: { formattedTrialClerks: [] },
      getAllIrsPractitionersForSelectHelper: {
        irsPractitionersContactInfo: [],
      },
    };
  });

  it.each([true, false])(
    'shows Reporting create/edit fields (adding: %s)',
    addingTrialSession => {
      const container = window.document.createElement('div');
      container.innerHTML = renderToStaticMarkup(
        <>
          <SessionInformationForm addingTrialSession={addingTrialSession} />
          <LocationInformationForm addingTrialSession={addingTrialSession} />
          <SessionAssignmentsForm addingTrialSession={addingTrialSession} />
        </>,
      );
      expect(
        container.querySelector('#reporting-proceeding:checked'),
      ).not.toBeNull();
      expect(container.querySelector('#trial-location')).not.toBeNull();
      expect(container.querySelector('#start-date')).not.toBeNull();
      expect(container.querySelector('#estimated-end-date')).not.toBeNull();
      expect(container.querySelector('#start-time-hours')).toBeNull();
      expect(container.querySelector('#swing-session')).toBeNull();
      expect(container.querySelector('#session-type-Special')).toBeNull();
      expect(
        container.querySelector('#session-type-Motion\\/Hearing'),
      ).toBeNull();
      expect(container.querySelector('#trial-clerk')).toBeNull();
      expect(container.querySelector('#court-reporter')).toBeNull();
      expect(container.querySelector('#chambers-phone-number')).not.toBeNull();
      expect(
        container.querySelector('#irs-calendar-administrator-info-name'),
      ).not.toBeNull();
      expect(
        container.querySelector('#irs-calendar-administrator-info-email'),
      ).not.toBeNull();
      expect(
        container.querySelector('#irs-calendar-administrator-info-phone'),
      ).not.toBeNull();
      if (addingTrialSession)
        expect(
          container.querySelector('#standaloneRemote-sessionScope:disabled'),
        ).not.toBeNull();
    },
  );

  it('shows Reporting location and IRS assignments without excluded assignments on details and working copies', () => {
    const details = renderToStaticMarkup(<TrialSessionInformation />);
    expect(details).toContain('Reporting');
    expect(details).toContain('Birmingham, Alabama');
    expect(details).not.toContain('Remote Proceeding');
    expect(details).not.toContain('Courthouse Location');
    const assignments = renderToStaticMarkup(<SessionAssignments />);
    expect(assignments).toContain('Calendar Admin');
    expect(assignments).toContain('admin@example.com');
    expect(assignments).toContain('1234567890');
    expect(assignments).not.toContain('Trial clerk');
    expect(assignments).not.toContain('Court reporter');
    expect(assignments).toContain('assignments-sessions-chambers-phone-number');
  });

  it('hides Reporting creation when the flag is off', () => {
    mockDependencies.addTrialSessionInformationHelper = {
      isReportingSession: false,
      isStandaloneSession: false,
      showReportingOption: false,
    };
    const markup = renderToStaticMarkup(
      <LocationInformationForm addingTrialSession={true} />,
    );
    expect(markup).not.toContain('reporting-proceeding');
    expect(markup).toContain('remote-proceeding');
    expect(markup).toContain('inPerson-proceeding');
  });

  it('preserves time and assignment fields for ordinary sessions', () => {
    mockDependencies.addTrialSessionInformationHelper = {
      isReportingSession: false,
      isStandaloneSession: false,
      sessionTypes: ['Regular', 'Small', 'Special', 'Motion/Hearing'],
    };
    mockDependencies.form = {
      proceedingType: 'Remote',
      sessionScope: 'Location-based',
      startTimeHours: '10',
      startTimeMinutes: '00',
      startTimeExtension: 'am',
    };
    const container = window.document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <>
        <SessionInformationForm addingTrialSession={true} />
        <SessionAssignmentsForm addingTrialSession={true} />
      </>,
    );
    expect(container.querySelector('#start-time-hours')).not.toBeNull();
    expect(container.querySelector('#trial-clerk')).not.toBeNull();
    expect(container.querySelector('#court-reporter')).not.toBeNull();
    expect(container.querySelector('#session-type-Special')).not.toBeNull();
  });

  it('disables conversion of a calendared trial session to Reporting', () => {
    mockDependencies.addTrialSessionInformationHelper = {
      isReportingSession: false,
      isStandaloneSession: false,
      showReportingOption: true,
    };
    mockDependencies.form = { proceedingType: 'Remote' };
    mockDependencies.formattedTrialSessionDetails = {
      isCalendared: true,
      editPermissions: 'all',
    };
    const container = window.document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <LocationInformationForm addingTrialSession={false} />,
    );
    expect(
      container.querySelector('#reporting-proceeding:disabled'),
    ).not.toBeNull();
  });
});
