export const workQueueSectionHelper = (get, applicationContext) => {
  const CHAMBERS_SECTIONS_LABELS = applicationContext
    .getPersistenceGateway()
    .getChambersSectionsLabels();

  const sectionDisplay = key => {
    return (
      {
        adc: 'ADC',
        admissions: 'Admissions',
        chambers: 'Chambers',
        clerkofcourt: 'Clerk of the Court',
        docket: 'Docket',
        floater: 'Floater',
        petitions: 'Petitions',
        reportersOffice: 'Reporter’s Office',
        trialClerks: 'Trial Clerks',
      }[key] || chambersDisplay(key)
    );
  };

  const chambersDisplay = key => {
    return CHAMBERS_SECTIONS_LABELS[key];
  };

  const chambersSections = applicationContext
    .getPersistenceGateway()
    .getChambersSections();

  return {
    chambersDisplay,
    chambersSections,
    sectionDisplay,
  };
};
