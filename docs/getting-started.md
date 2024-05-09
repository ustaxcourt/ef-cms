## Getting Started with Dawson

Hopefully you've read through [What is Dawson?](/what-is-dawson). The terminology defined there will help you better understand how to navigate the Dawson application.  If you would rather poke around on a live environment, this part of the documentation is for you. We'll guide you on how to log in to Dawson, the various URLs and user roles we have, and how to begin using the Dawson application.

?> You can find the [Running Locally Guide](/running-locally) if you'd like to get Dawson running on your machine to start development.

## Dawson's User Interfaces

There are two UIs that we deploy for the Dawson system; both address the needs of authenticated and unauthenticated users.

### 👪 Public UI

Our **public** web application contains features accessible to the general public, such as *searching for a case*, *searching orders*, *searching opinions*, and *viewing the public docket entries of a case*.  This application does not require any form of authentication to be able to search.

The public UI contains some logic for **terminal users**, who are physically sitting inside the Tax Court building, searching through public records.

Below is a screenshot of the public UI. Note that some features allow public users to search for cases, search for orders, search for opinions, view the documents, and view the case's docket record:

![Public UI](./images/public-ui.png)

### 🔒 Private UI

The majority of our application code and features exist in a private user interface which requires authentication.

The private application contains features specific to the **internal users** of the Tax Court building.  Some of these operations include a Petitions Clerk reviewing and serving petitions, a Docket Clerk creating and serving docket entries, Judges signing documents, an Admissions Clerk adding new Private Practitioner users and associating them with cases, etc.  

The private UI is also where **external** users will interact with their Case.  For example, a Petitioner may login to upload a petition, or a Private Practitioner may login to upload their first Entry of Appearance document to become associated with a Case.

## Logging into Dawson

Our Dawson application is hosted on a variety of different environments on different domains.  Flexion maintains their own instances of the Dawson system deployed to a Flexion AWS account separate from the Tax Court.  This enables Flexion to experiment with features, security settings, AWS services, etc. without requiring special permissions on the Tax Court environments. The following links all redirect to the **public UI**, but you can click the **log in** link in the header to navigate to the private application.

Here is a list of the **Tax Court**'s deployed Dawson instances:

- [https://dawson.ustaxcourt.gov/](https://dawson.ustaxcourt.gov/) (production)
- [https://mig.ef-cms.ustaxcourt.gov/](https://mig.ef-cms.ustaxcourt.gov/) (migration)
- [https://test.ef-cms.ustaxcourt.gov/](https://test.ef-cms.ustaxcourt.gov/) (test)
- [https://irs.ef-cms.ustaxcourt.gov/](https://irs.ef-cms.ustaxcourt.gov/) (irs)

And the **Flexion** environments:

- [https://exp1.ustc-case-mgmt.flexion.us/](https://exp1.ustc-case-mgmt.flexion.us/) (flexion experimental1)
- [https://exp2.ustc-case-mgmt.flexion.us/](https://exp2.ustc-case-mgmt.flexion.us/) (flexion experimental2)
- [https://exp3.ustc-case-mgmt.flexion.us/](https://exp3.ustc-case-mgmt.flexion.us/) (flexion experimental3)
- [https://exp4.ustc-case-mgmt.flexion.us/](https://exp4.ustc-case-mgmt.flexion.us/) (flexion experimental4)
- [https://exp5.ustc-case-mgmt.flexion.us/](https://exp5.ustc-case-mgmt.flexion.us/) (flexion experimental5)


## Dawson User Roles

The Dawson system is built using a role-based authentication system.  Each user in Dawson has different permissions for various features in the application.  For example, only a Petitions Clerk has the ability to serve a petition, whereas a Docket Clerk has the ability to upload a docket entry.  Here is a list of the current roles we have in our system:

?> Check [User Roles](/what-is-dawson?id=users) to learn about each of the user roles in the Dawson system.

- adc
- admin
- admissionsclerk
- chambers
- clerkofcourt
- docketclerk
- floater
- general
- inactivePractitioner
- irsPractitioner
- irsSuperuser
- judge
- legacyJudge
- petitioner
- petitionsclerk
- privatePractitioner
- reportersOffice
- trialclerk


## Mock Users

After deploying a brand new Dawson environment, an admin will manually run the [setup-test-users.ts](https://github.com/ustaxcourt/ef-cms/blob/staging/scripts/user/setup-test-users.ts) script to create these mock users in our deployed environments so members of our team can login and interact with the system to test various roles.  This script will generate the following test users will allow you to login.

!> **Ask a teammate for the passwords.**

?> The **1** in the emails is an example; you can use adc2@example.com, or adc10@example.com, etc.

| email                         | role            | number of users |
|-------------------------------|-----------------|-----------------|
| adc1@example.com              | adc             | 10              |
| admissionsclerk1@example.com  | admissionsclerk | 10              |
| clerkofcourt1@example.com     | clerkofcourt    | 10              |
| docketclerk1@example.com      | docketclerk     | 10              |
| petitionsclerk1@example.com   | petitionsclerk  | 10              |
| trialclerk1@example.com       | trialclerk      | 10              |
| floater1@example.com          | floater         | 2               |
| general1@example.com          | general         | 2               |
| reportersOffice1@example.com  | reportersOffice | 2               |
| ashfordsChambers1@example.com | chambers        | 5               |
| buchsChambers1@example.com    | chambers        | 5               |
| cohensChambers1@example.com   | chambers        | 5               |

## 💡 Test Your Knowledge

It's time to get your feet wet with Dawson.  Don't worry, we'll walk you through how you can file a petition as a Petitioner and then later serve that petition as a Petitions Clerk. 

1. Log in into the environment as `petitioner4@example.com` and click the `Create a Case` button.
2. Read the instructions and try walking through the wizard. When the case is created, you should see it on your dashboard. 
3. Write down your docket number (xxx-xx). You'll need it for the next steps.
4. Log in as `petitionsclerk2@example.com`.
5. Search for the case by docket number xxx-xx.
6. Click on the `petition` link that's in the case's docket record table.
7. Review the petition information to make sure it's correct and press the `Review Petition` button.
8. Review on the confirmation page and click `Serve to IRS` (don't worry, it won't really serve anything to the IRS).
9. Congrats! 🥳 You filed your first petition as a Petitioner and reviewed / served it as a Petitions Clerk!

This is just one of many user flows we have in our system.  The reason we started you off with a petition is because a petitioner filing their petition is the start of the life cycle of a case.
