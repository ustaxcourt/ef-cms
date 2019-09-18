export const workQueueSectionHelper = () => {
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
        seniorattorney: 'Senior Attorney',
        trialClerks: 'Trial Clerks',
      }[key] || chambersDisplay(key)
    );
  };

  const chambersDisplay = key => {
    return {
      armensChambers: "Armen's Chambers",
      ashfordsChambers: "Ashford's Chambers",
      buchsChambers: "Buch's Chambers",
      carluzzosChambers: "Carluzzo's Chambers",
      cohensChambers: "Cohen's Chambers",
      colvinsChambers: "Colvin's Chambers",
      copelandsChambers: "Copeland's Chambers",
      foleysChambers: "Foley's Chambers",
      galesChambers: "Gale's Chambers",
      gerbersChambers: "Gerber's Chambers",
      goekesChambers: "Goeke's Chambers",
      gustafsonsChambers: "Gustafson's Chambers",
      guysChambers: "Guy's Chambers",
      halpernsChambers: "Halpern's Chambers",
      holmesChambers: "Holmes' Chambers",
      jacobsChambers: "Jacobs' Chambers",
      kerrigansChambers: "Kerrigan's Chambers",
      laubersChambers: "Lauber's Chambers",
      leydensChambers: "Leyden's Chambers",
      marvelsChambers: "Marvel's Chambers",
      morrisonsChambers: "Morrison's Chambers",
      negasChambers: "Nega's Chambers",
      panuthosChambers: "Panuthos' Chambers",
      parisChambers: "Paris' Chambers",
      pughsChambers: "Pugh's Chambers",
      ruwesChambers: "Ruwe's Chambers",
      thortonsChambers: "Thorton's Chambers",
      urdasChambers: "Urda's Chambers",
      vasquezsChambers: "Vasquez's Chambers",
      wellsChambers: "Wells' Chambers",
    }[key];
  };

  return {
    chambersDisplay,
    sectionDisplay,
  };
};
