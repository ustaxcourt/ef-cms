
# Statistics tab
* Visible to all internal users
* Hidden to parties and public users


### Deficiency table
If Deficiency stat have been added
* Deficiency and Penalty table displays
* "Edit" link displays (Only displays for Docket Clerk, Petitions Clerk, Clerk of the Court roles)
* "Add Year/Period" link is still displayed

**Year/Period**
* displays the Year/Period entered on the Petition QC form or Add/Edit Statistics screen

**IRS Notice**
Displays data entered:
* Petition QC form > Deficiency field
* Add/Edit Statistics form > Deficiency (IRS Notice)

**Determination**
Displays data entered:
* Add/Edit Statistics form > Deficiency (Determination)

### Penalties table

**IRS Notice**
Displays data entered:
* Petition QC form = Total penalties field
* Add/Edit Statistics form = Total penalties (IRS Notice)

**Determination**
Displays data entered:
* Add/Edit Statistics form = Total penalties (Determination)

### Other table
If Other statistics have been added
* Other table displays
* "Edit" link displays (Only displays for Docket Clerk, Petitions Clerk, Clerk of the Court roles)
* "Add Other Statistics" link is hidden

**Litigation costs**
Displays data entered:
* Add/Edit Statistics = Litigation costs

**Damages (IRC §6673)**
Displays data entered:
* Add/Edit Statistics = Damages (IRC §6673)

## Add Year/Period
* Add Year/Period button is visible to Petitions/Docket/Clerk of the Court only
* Year/Period, Deficiency (IRS Notice) and Total Penalties (IRS Notice) fields are required
* Deficiency (Determination) is required IF Total Penalties (Determination) is complete
* Total Penalties (Determination) is required IF Deficiency (Determination) is complete
* User can add up to 12 year/periods on a case

## Add Other Statistics
* Add Other Statistics button is visible to Petitions/Docket/Clerk of the Court only
* Litigation costs and Damages fields are optional

## Editing and Deleting Statistics
* Other statistics can be deleted by petitions/docket/clerk of the court
* All deficiency stats can be deleted by year/period if hasVerifiedIrsNotice-no
* If hasVerifiedIrsNotice-yes, one set of deficiency statistics is required. If one set remains, "Delete Year/Period" button is hidden
