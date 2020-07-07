export const workQueueSectionHelper = (get, applicationContext) => {
  const { CHAMBERS_SECTION_LABELS } = applicationContext.getConstants();
  const sectionDisplay = key => {
    return (
      {
        adc: 'ADC',
        admissions: 'Admissions',
        calendar: 'Calendar',
        chambers: 'Chambers',
        clerkofcourt: 'Clerk of the Court',
        docket: 'Docket',
        petitions: 'Petitions',
        trialClerks: 'Trial Clerks',
      }[key] || chambersDisplay(key)
    );
  };

  const chambersDisplay = key => {
    return CHAMBERS_SECTION_LABELS[key];
  };

  return {
    chambersDisplay,
    sectionDisplay,
  };
};
