# CaseInternal
 ```
---
  type: "object"
  dependencies: 
    - 
      rel: "or"
      peers: 
        - "preferredTrialCity"
        - "requestForPlaceOfTrialFile"
        - "orderDesignatingPlaceOfTrial"
  keys: 
    archivedCorrespondences: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of Correspondence Entities that were archived."
      items: 
        - 
          type: "object"
          keys: 
            archived: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "A correspondence document that was archived."
            documentId: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            documentTitle: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            filedBy: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
              allow: 
                - ""
            filingDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "required"
                description: "Date that this Document was filed."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            userId: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
    archivedDocuments: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of Document Entities that were archived instead of added to the docket record."
      items: 
        - 
          type: "object"
          keys: 
            action: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Action taken in response to this Docket Record item."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              allow: 
                - null
            addToCoversheet: 
              type: "boolean"
              flags: 
                presence: "optional"
            additionalInfo: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            additionalInfo2: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            archived: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "A document that was archived instead of added to the Docket Record."
            attachments: 
              type: "boolean"
              flags: 
                presence: "optional"
            certificateOfService: 
              type: "boolean"
              flags: 
                presence: "optional"
            certificateOfServiceDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
              whens: 
                - 
                  ref: 
                    path: 
                      - "certificateOfService"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            createdAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "required"
                description: "When the Document was added to the system."
            date: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "An optional date used when generating a fully concatenated document title."
              allow: 
                - null
            description: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Text that describes this entry on the Docket Record, which may be part of the Filings and Proceedings value."
            docketNumber: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Docket Number of the associated Case in XXXXX-YY format."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            docketNumbers: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Optional Docket Number text used when generating a fully concatenated document title."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            documentContentsId: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The S3 ID containing the text contents of the document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            documentId: 
              type: "string"
              flags: 
                presence: "required"
                description: "ID of the associated PDF document in the S3 bucket."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            documentIdBeforeSignature: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The id for the original document that was uploaded."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            documentTitle: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The title of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 3000
            documentType: 
              type: "string"
              flags: 
                only: true
                presence: "required"
                description: "The type of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Administrative Record"
                - "Affidavit in Support"
                - "Agreed Computation for Entry of Decision"
                - "Amended"
                - "Amended Certificate of Service"
                - "Amended [Document Name]"
                - "Amendment [anything]"
                - "Answer"
                - "Answer to Amended Petition"
                - "Answer to Amended Petition, as Amended"
                - "Answer to Amendment to Amended Petition"
                - "Answer to Amendment to Petition"
                - "Answer to Petition, as Amended"
                - "Answer to Second Amended Petition"
                - "Answer to Second Amendment to Petition"
                - "Answer to Supplement to Petition"
                - "Answer to Third Amended Petition"
                - "Answer to Third Amendment to Petition"
                - "Appellate Filing Fee Received"
                - "Application"
                - "Application for Examination Pursuant to Rule 73"
                - "Application for Waiver of Filing Fee"
                - "Application for Waiver of Filing Fee and Affidavit"
                - "Application to Take Deposition"
                - "Bond"
                - "Bounced Electronic Service"
                - "Brief in Support"
                - "Caption of case is amended"
                - "Certificate as to the Genuineness of the Administrative Record"
                - "Certificate of Service"
                - "Civil Penalty Approval Form"
                - "Computation for Entry of Decision"
                - "Corrected Transcript"
                - "Decision"
                - "Declaration in Support"
                - "Designation of Counsel to Receive Service"
                - "Docket Number is amended"
                - "Entry of Appearance"
                - "Evidence"
                - "Exhibit(s)"
                - "Filing Fee Paid"
                - "Filing Fee Waived"
                - "Further Trial before"
                - "Hearing Exhibits"
                - "Hearing before"
                - "Letter"
                - "Memorandum"
                - "Memorandum Opinion"
                - "Memorandum in Support"
                - "Miscellaneous"
                - "Miscellaneous (Lodged)"
                - "Motion"
                - "Motion for Appointment of Mediator"
                - "Motion for Assignment of Judge"
                - "Motion for Audio of Trial Proceeding(s)"
                - "Motion for Certification of an Interlocutory Order to Permit Immediate Appeal"
                - "Motion for Continuance"
                - "Motion for Default and Dismissal"
                - "Motion for Entry of Decision"
                - "Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)"
                - "Motion for Estate Tax Deduction Developing at or after Trial Pursuant to Rule 156"
                - "Motion for Extension of Time"
                - "Motion for International Judicial Assistance"
                - "Motion for Judgment on the Pleadings"
                - "Motion for Leave to Conduct Discovery Pursuant to Rule 70(a)(2)"
                - "Motion for Leave to File"
                - "Motion for Leave to File Out of Time"
                - "Motion for Leave to Serve Additional Interrogatories"
                - "Motion for Leave to Use Electronic Equipment"
                - "Motion for More Definite Statement Pursuant to Rule 51"
                - "Motion for Non-Binding Mediation"
                - "Motion for Oral Argument"
                - "Motion for Order Fixing Amount of an Appeal Bond"
                - "Motion for Order to Release the Amount of an Appeal Bond"
                - "Motion for Order to Show Cause Why Case Should Not Be Sumitted on the Basis of the Administrative Record"
                - "Motion for Order to Show Cause Why Judgment Should Not be Entered on the Basis of a Previously Decided Case"
                - "Motion for Order to Show Cause Why Proposed Facts and Evidence Should Not be Accepted as Established Pursuant to Rule 91(f)"
                - "Motion for Partial Summary Judgment"
                - "Motion for Pretrial Conference"
                - "Motion for Protective Order Pursuant to Rule 103"
                - "Motion for Reasonable Litigation or Administrative Costs"
                - "Motion for Reconsideration of Findings or Opinion Pursuant to Rule 161"
                - "Motion for Reconsideration of Order"
                - "Motion for Recusal of Judge"
                - "Motion for Review By the Full Court"
                - "Motion for Review En Banc"
                - "Motion for Review of Jeopardy Assessment or Jeopardy Levy Pursuant to Rule 56"
                - "Motion for Summary Judgment"
                - "Motion for Voluntary Binding Arbitration"
                - "Motion for Writ of Habeas Corpus Ad Testificandum"
                - "Motion for a New Trial"
                - "Motion for an Order under Federal Rule of Evidence 502(d)"
                - "Motion for an Order under Model Rule of Professional Conduct 4.2"
                - "Motion for in Camera Review"
                - "Motion for the Court to Pay the Expenses of a Transcript"
                - "Motion for the Court to Pay the Expenses of an Interpreter"
                - "Motion in Limine"
                - "Motion to Add Lien or Levy Designation"
                - "Motion to Add Small Tax case Designation"
                - "Motion to Amend Order"
                - "Motion to Appoint New Tax Matters Partner"
                - "Motion to Appoint Tax Matters Partner"
                - "Motion to Appoint an Interpreter Pursuant to Rule 143(f)"
                - "Motion to Authorize Proposed Sale of Seized Property"
                - "Motion to Be Excused from Appearing at the Trial Session"
                - "Motion to Be Exempt from E-Filing"
                - "Motion to Be Recognized as Next Friend"
                - "Motion to Bifurcate"
                - "Motion to Calendar"
                - "Motion to Calendar and Consolidate"
                - "Motion to Calendar in the Electronic (North) Courtroom"
                - "Motion to Certify for Interlocutory Appeal"
                - "Motion to Change Place of Hearing of Disclosure Case"
                - "Motion to Change Place of Submission of Declaratory Judgment Case"
                - "Motion to Change Place of Trial"
                - "Motion to Change Service Method"
                - "Motion to Change or Correct Caption"
                - "Motion to Change or Correct Docket Entry"
                - "Motion to Clarify Order"
                - "Motion to Close on Ground of Duplication"
                - "Motion to Compel Discovery"
                - "Motion to Compel Production of Documents"
                - "Motion to Compel Responses to Interrogatories"
                - "Motion to Compel the Taking of Deposition"
                - "Motion to Conform the Pleadings to the Proof"
                - "Motion to Consolidate"
                - "Motion to Correct Clerical Order"
                - "Motion to Correct Transcript"
                - "Motion to Correct and Certify Record on Appeal"
                - "Motion to Depose Pursuant to Rule 74"
                - "Motion to Determine the Tax Matters Partner"
                - "Motion to Dismiss"
                - "Motion to Dismiss for Failure to Properly Prosecute"
                - "Motion to Dismiss for Failure to State a Claim upon Which Relief Can Be Granted"
                - "Motion to Dismiss for Lack of Jurisdiction"
                - "Motion to Dismiss for Lack of Jurisdiction as to [person, notice, or year]"
                - "Motion to Dismiss for Lack of Prosecution"
                - "Motion to Dismiss on Grounds of Mootness"
                - "Motion to Disqualify Counsel"
                - "Motion to Enforce Subpoena"
                - "Motion to Enforce a Refund of Overpayment Pursuant to Rule 260"
                - "Motion to Extend Time to Move or File Answer"
                - "Motion to File Document Under Seal"
                - "Motion to Impose Sanctions"
                - "Motion to Impose a Penalty"
                - "Motion to Intervene"
                - "Motion to Modify Decision in Estate Tax Case Pursuant to Rule 262"
                - "Motion to Modify Order"
                - "Motion to Permit Expert Witness to Testify without a Written Report Regarding Industry Practice Pursuant to Rule 143(g)(3)"
                - "Motion to Permit Levy"
                - "Motion to Preclude"
                - "Motion to Proceed Anonymously"
                - "Motion to Quash or Modify Subpoena"
                - "Motion to Redetermine Interest Pursuant to Rule 261"
                - "Motion to Remand"
                - "Motion to Remove Lien/Levy Designation"
                - "Motion to Remove Small Tax Case Designation"
                - "Motion to Remove Tax Matters Partner"
                - "Motion to Reopen the Record"
                - "Motion to Require Petitioner to File a Reply in a Small Tax Case Pursuant to Rule 173(c)"
                - "Motion to Restore Case to the General Docket"
                - "Motion to Restrain Assessment or Collection or to Order Refund of Amount Collected"
                - "Motion to Retain File in Estate Tax Case Involving § 6166 Election Pursuant to Rule 157"
                - "Motion to Review the Sufficiency of Answers or Objections to Request for Admissions"
                - "Motion to Seal"
                - "Motion to Set Pretrial Scheduling Order"
                - "Motion to Set for a Time & Date Certain"
                - "Motion to Sever"
                - "Motion to Shift the Burden of Proof"
                - "Motion to Shorten the Time"
                - "Motion to Stay Proceedings"
                - "Motion to Stay Proposed Sale of Seized Property"
                - "Motion to Strike"
                - "Motion to Submit Case Pursuant to Rule 122"
                - "Motion to Substitute Parties and Change Caption"
                - "Motion to Substitute Trial Exhibit(s)"
                - "Motion to Supplement the Record"
                - "Motion to Suppress Evidence"
                - "Motion to Take Deposition Pursuant to Rule 74(c)(3)"
                - "Motion to Take Judicial Notice"
                - "Motion to Vacate"
                - "Motion to Vacate or Revise Pursuant to Rule 162"
                - "Motion to Withdraw"
                - "Motion to Withdraw Counsel (filed by petitioner)"
                - "Motion to Withdraw as Counsel"
                - "Motion to Withdraw or Modify the Deemed Admitted Admissions Pursuant to Rule 90(f)"
                - "No Objection"
                - "Notice"
                - "Notice of Abatement of Jeopardy Assessment"
                - "Notice of Appeal"
                - "Notice of Change of Address"
                - "Notice of Change of Address and Telephone Number"
                - "Notice of Change of Counsel for Non-Party"
                - "Notice of Change of Telephone Number"
                - "Notice of Clarification of Tax Matters Partner"
                - "Notice of Concession"
                - "Notice of Consistent Agreement Pursuant to Rule 248(c)(1)"
                - "Notice of Death of Counsel"
                - "Notice of Docket Change"
                - "Notice of Election to Intervene"
                - "Notice of Election to Participate"
                - "Notice of Filing of Petition and Right to Intervene"
                - "Notice of Filing of the Administrative Record"
                - "Notice of Identification of Tax Matters Partner"
                - "Notice of Intent Not to File"
                - "Notice of Intervention"
                - "Notice of Issue Concerning Foreign Law"
                - "Notice of Jeopardy Assessment"
                - "Notice of Judicial Ruling"
                - "Notice of No Objection"
                - "Notice of Objection"
                - "Notice of Partial Abatement of Jeopardy Assessment"
                - "Notice of Proceeding in Bankruptcy"
                - "Notice of Relevant Judicial Decisions"
                - "Notice of Settlement Agreement Pursuant to Rule 248(c)(1)"
                - "Notice of Small Tax Case Election"
                - "Notice of Supplemental Authority"
                - "Notice of Telephone Number"
                - "Notice of Termination Assessment"
                - "Notice of Trial"
                - "Notice of Unavailability"
                - "Objection"
                - "Objection [anything]"
                - "Opposition"
                - "Opposition [anything]"
                - "Order"
                - "Order and Decision"
                - "Order fixing amount of bond"
                - "Order for Amended Petition"
                - "Order for Amended Petition and Filing Fee"
                - "Order for Amendment to Petition"
                - "Order for Filing Fee"
                - "Order for Filing Fee. Application waiver of Filing Fee is denied"
                - "Order for Ownership Disclosure Statement"
                - "Order for Ratification of Petition"
                - "Order of Dismissal"
                - "Order of Dismissal and Decision"
                - "Order of Dismissal for Lack of Jurisdiction"
                - "Order of Service of Transcript (Bench Opinion)"
                - "Order petr(s) to show cause why \"S\" should not be removed"
                - "Order that caption of case is amended"
                - "Order that case is assigned"
                - "Order that case is submitted"
                - "Order that jurisdiction is retained"
                - "Order that the letter \"L\" is added to Docket number"
                - "Order that the letter \"L\" is deleted from the Docket number"
                - "Order that the letter \"P\" is added to the Docket number"
                - "Order that the letter \"P\" is deleted from the Docket number"
                - "Order that the letter \"R\" is added to the Docket number"
                - "Order that the letter \"R\" is deleted from the Docket number"
                - "Order that the letter \"S\" is added to the Docket number"
                - "Order that the letter \"S\" is deleted from the Docket number"
                - "Order that the letter \"W\" is added to the Docket number"
                - "Order that the letter \"W\" is deleted from the Docket number"
                - "Order that the letter \"X\" is added to the Docket number"
                - "Order that the letter \"X\" is deleted from the Docket number"
                - "Order that the letters \"SL\" are added to the Docket number"
                - "Order that the letters \"SL\" are deleted from the Docket number"
                - "Order time is extended for petr(s) to file Amended Petition"
                - "Order time is extended for petr(s) to file Amended Petition and pay the Filing Fee or submit an Application for Waiver of Filing Fee"
                - "Order time is extended for petr(s) to pay filing fee or submit an Application for Waiver of Filing fee"
                - "Order time is extended for petr(s) to pay the filing fee"
                - "Order to Show Cause"
                - "Ownership Disclosure Statement"
                - "Partial Administrative Record"
                - "Partial Trial before"
                - "Petition"
                - "Prehearing Memorandum"
                - "Pretrial Memorandum"
                - "Proposed Stipulated Decision"
                - "Ratification"
                - "Ratification of Petition"
                - "Record on Appeal"
                - "Redacted"
                - "Redacted Petition Filed"
                - "Reference List of Redacted Information"
                - "Reply"
                - "Report"
                - "Request"
                - "Request for Admissions"
                - "Request for Judicial Notice"
                - "Request for Place of Trial"
                - "Request for Pretrial Conference"
                - "Response"
                - "Response [anything]"
                - "Returned Mail"
                - "Revised Computation"
                - "Revised Transcript"
                - "Seriatim Answering Brief"
                - "Seriatim Answering Memorandum Brief"
                - "Seriatim Opening Brief"
                - "Seriatim Opening Memorandum Brief"
                - "Seriatim Reply Brief"
                - "Seriatim Reply Memorandum Brief"
                - "Seriatim Sur-Reply Brief"
                - "Seriatim Sur-Reply Memorandum Brief"
                - "Settlement Stipulation"
                - "Simultaneous Answering Brief"
                - "Simultaneous Answering Memoranda of Law"
                - "Simultaneous Answering Memorandum Brief"
                - "Simultaneous Memoranda of Law"
                - "Simultaneous Opening Brief"
                - "Simultaneous Opening Memorandum Brief"
                - "Simultaneous Reply Brief"
                - "Simultaneous Supplemental Brief"
                - "Simultaneous Sur-Reply Brief"
                - "Simultaneous Sur-Reply Memorandum Brief"
                - "Standing Pretrial Notice"
                - "Standing Pretrial Order"
                - "Statement"
                - "Statement of Redacted Information"
                - "Statement of Taxpayer Identification"
                - "Statement under Rule 212"
                - "Statement under Rule 50(c)"
                - "Status Report"
                - "Stipulated Decision"
                - "Stipulation"
                - "Stipulation as to the Administrative Record"
                - "Stipulation as to the Partial Administrative Record"
                - "Stipulation of Facts"
                - "Stipulation of Pretrial Deadlines"
                - "Stipulation of Settled Issues"
                - "Stipulation of Settlement"
                - "Stipulation to Be Bound"
                - "Stipulation to Take Deposition"
                - "Substitution of Counsel"
                - "Summary Opinion"
                - "Supplement"
                - "Supplement To [anything]"
                - "Supplemental"
                - "Supplemental [anything]"
                - "Sur-Reply"
                - "T.C. Opinion"
                - "Transcript"
                - "Trial Exhibits"
                - "Trial before"
                - "U.S.C.A"
                - "Unsworn Declaration under Penalty of Perjury in Support"
                - "Writ of Habeas Corpus Ad Testificandum"
            draftState: 
              type: "object"
              flags: 
                presence: "optional"
              allow: 
                - null
            editState: 
              type: "string"
              flags: 
                presence: "optional"
                description: "JSON representation of the in-progress edit of this item."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 4000
              allow: 
                - null
              metas: 
                - 
                  tags: 
                    - "Restricted"
            entityName: 
              type: "string"
              flags: 
                only: true
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "DocketEntry"
            eventCode: 
              type: "string"
              flags: 
                only: true
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "A"
                - "AAAP"
                - "AAPN"
                - "AATP"
                - "AATS"
                - "AATT"
                - "ACED"
                - "ADMR"
                - "ADMT"
                - "AFE"
                - "AFF"
                - "AFP"
                - "AMAT"
                - "AMDC"
                - "APA"
                - "APLD"
                - "APPL"
                - "APPW"
                - "APW"
                - "ASAP"
                - "ASUP"
                - "ATAP"
                - "ATSP"
                - "BND"
                - "BRF"
                - "CERT"
                - "CIVP"
                - "COED"
                - "CS"
                - "CTRA"
                - "DCL"
                - "DEC"
                - "DISC"
                - "DSC"
                - "EA"
                - "ES"
                - "EVID"
                - "EXH"
                - "FEE"
                - "FEEW"
                - "FTRL"
                - "HE"
                - "HEAR"
                - "LTR"
                - "M000"
                - "M001"
                - "M002"
                - "M003"
                - "M004"
                - "M005"
                - "M006"
                - "M007"
                - "M008"
                - "M009"
                - "M010"
                - "M011"
                - "M012"
                - "M013"
                - "M014"
                - "M015"
                - "M016"
                - "M017"
                - "M018"
                - "M019"
                - "M020"
                - "M021"
                - "M022"
                - "M023"
                - "M024"
                - "M026"
                - "M027"
                - "M028"
                - "M029"
                - "M030"
                - "M031"
                - "M032"
                - "M033"
                - "M034"
                - "M035"
                - "M036"
                - "M037"
                - "M038"
                - "M039"
                - "M040"
                - "M041"
                - "M042"
                - "M043"
                - "M044"
                - "M045"
                - "M046"
                - "M047"
                - "M048"
                - "M049"
                - "M050"
                - "M051"
                - "M052"
                - "M053"
                - "M054"
                - "M055"
                - "M056"
                - "M057"
                - "M058"
                - "M059"
                - "M060"
                - "M061"
                - "M062"
                - "M063"
                - "M064"
                - "M065"
                - "M066"
                - "M067"
                - "M068"
                - "M069"
                - "M070"
                - "M071"
                - "M072"
                - "M073"
                - "M074"
                - "M075"
                - "M076"
                - "M077"
                - "M078"
                - "M079"
                - "M080"
                - "M081"
                - "M082"
                - "M083"
                - "M084"
                - "M085"
                - "M086"
                - "M087"
                - "M088"
                - "M089"
                - "M090"
                - "M091"
                - "M092"
                - "M093"
                - "M094"
                - "M095"
                - "M096"
                - "M097"
                - "M098"
                - "M099"
                - "M100"
                - "M101"
                - "M102"
                - "M103"
                - "M104"
                - "M105"
                - "M106"
                - "M107"
                - "M108"
                - "M109"
                - "M110"
                - "M111"
                - "M112"
                - "M113"
                - "M114"
                - "M115"
                - "M116"
                - "M117"
                - "M118"
                - "M119"
                - "M120"
                - "M121"
                - "M122"
                - "M123"
                - "M124"
                - "M125"
                - "M126"
                - "M129"
                - "M130"
                - "M131"
                - "M132"
                - "M133"
                - "M134"
                - "M135"
                - "M136"
                - "M218"
                - "MEMO"
                - "MINC"
                - "MIND"
                - "MISC"
                - "MISCL"
                - "MISP"
                - "MOP"
                - "NAJA"
                - "NCA"
                - "NCAG"
                - "NCAP"
                - "NCNP"
                - "NCON"
                - "NCP"
                - "NCTP"
                - "NDC"
                - "NFAR"
                - "NIFL"
                - "NINF"
                - "NIS"
                - "NITM"
                - "NJAR"
                - "NNOB"
                - "NOA"
                - "NOB"
                - "NODC"
                - "NOEI"
                - "NOEP"
                - "NOI"
                - "NOST"
                - "NOT"
                - "NOU"
                - "NPB"
                - "NPJR"
                - "NRJD"
                - "NRJR"
                - "NSA"
                - "NSTE"
                - "NTA"
                - "NTD"
                - "NTN"
                - "O"
                - "OAD"
                - "OAJ"
                - "OAL"
                - "OAP"
                - "OAPF"
                - "OAR"
                - "OAS"
                - "OASL"
                - "OAW"
                - "OAX"
                - "OBJ"
                - "OBJE"
                - "OBJN"
                - "OCA"
                - "OD"
                - "ODD"
                - "ODJ"
                - "ODL"
                - "ODP"
                - "ODR"
                - "ODS"
                - "ODSL"
                - "ODW"
                - "ODX"
                - "OF"
                - "OFAB"
                - "OFFX"
                - "OFWD"
                - "OFX"
                - "OIP"
                - "OJR"
                - "OODS"
                - "OP"
                - "OPFX"
                - "OPPO"
                - "OPX"
                - "ORAP"
                - "OROP"
                - "OSC"
                - "OSCP"
                - "OST"
                - "OSUB"
                - "P"
                - "PARD"
                - "PHM"
                - "PMT"
                - "PSDE"
                - "PTFR"
                - "PTRL"
                - "RAT"
                - "RATF"
                - "RCOM"
                - "REDC"
                - "REPL"
                - "REQ"
                - "REQA"
                - "RESP"
                - "RFPC"
                - "RJN"
                - "RLRI"
                - "RM"
                - "ROA"
                - "RPT"
                - "RQT"
                - "RSP"
                - "RTP"
                - "RTRA"
                - "S212"
                - "SADM"
                - "SAMB"
                - "SATL"
                - "SDEC"
                - "SEAB"
                - "SEOB"
                - "SERB"
                - "SESB"
                - "SIAB"
                - "SIAM"
                - "SIMB"
                - "SIML"
                - "SIOB"
                - "SIOM"
                - "SIRB"
                - "SISB"
                - "SOC"
                - "SOMB"
                - "SOP"
                - "SORI"
                - "SPAR"
                - "SPD"
                - "SPML"
                - "SPMT"
                - "SPTN"
                - "SPTO"
                - "SRMB"
                - "SSB"
                - "SSRB"
                - "SSRM"
                - "SSTP"
                - "STAR"
                - "STAT"
                - "STBB"
                - "STIN"
                - "STIP"
                - "STP"
                - "STPD"
                - "STS"
                - "STST"
                - "SUPM"
                - "SURP"
                - "TCOP"
                - "TE"
                - "TRAN"
                - "TRL"
                - "USCA"
                - "USDL"
                - "WRIT"
            filedBy: 
              type: "string"
              flags: 
                description: "The party who filed the document, either the petitioner or respondent on the case."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
              whens: 
                - 
                  ref: 
                    path: 
                      - "documentType"
                  is: 
                    type: "string"
                    flags: 
                      only: true
                    rules: 
                      - 
                        name: "min"
                        args: 
                          limit: 1
                    allow: 
                      - "Answer"
                      - "Answer to Amended Petition"
                      - "Answer to Amended Petition, as Amended"
                      - "Answer to Amendment to Amended Petition"
                      - "Answer to Amendment to Petition"
                      - "Answer to Petition, as Amended"
                      - "Answer to Second Amended Petition"
                      - "Answer to Second Amendment to Petition"
                      - "Answer to Supplement to Petition"
                      - "Answer to Third Amended Petition"
                      - "Answer to Third Amendment to Petition"
                      - "Designation of Counsel to Receive Service"
                      - "Motion to Withdraw as Counsel"
                      - "Motion to Withdraw Counsel (filed by petitioner)"
                      - "Application for Waiver of Filing Fee"
                      - "Application for Waiver of Filing Fee and Affidavit"
                      - "Application to Take Deposition"
                      - "Agreed Computation for Entry of Decision"
                      - "Computation for Entry of Decision"
                      - "Proposed Stipulated Decision"
                      - "Revised Computation"
                      - "Administrative Record"
                      - "Amended"
                      - "Amended Certificate of Service"
                      - "Amendment [anything]"
                      - "Certificate as to the Genuineness of the Administrative Record"
                      - "Certificate of Service"
                      - "Civil Penalty Approval Form"
                      - "Exhibit(s)"
                      - "Memorandum"
                      - "Partial Administrative Record"
                      - "Ratification"
                      - "Redacted"
                      - "Report"
                      - "Status Report"
                      - "Motion for Continuance"
                      - "Motion for Extension of Time"
                      - "Motion to Dismiss for Lack of Jurisdiction"
                      - "Motion to Dismiss for Lack of Prosecution"
                      - "Motion for Summary Judgment"
                      - "Motion to Change or Correct Caption"
                      - "Motion for a New Trial"
                      - "Motion for an Order under Federal Rule of Evidence 502(d)"
                      - "Motion for an Order under Model Rule of Professional Conduct 4.2"
                      - "Motion for Appointment of Mediator"
                      - "Motion for Assignment of Judge"
                      - "Motion for Audio of Trial Proceeding(s)"
                      - "Motion for Certification of an Interlocutory Order to Permit Immediate Appeal"
                      - "Motion for Default and Dismissal"
                      - "Motion for Entry of Decision"
                      - "Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)"
                      - "Motion for Estate Tax Deduction Developing at or after Trial Pursuant to Rule 156"
                      - "Motion for in Camera Review"
                      - "Motion for International Judicial Assistance"
                      - "Motion for Judgment on the Pleadings"
                      - "Motion for Leave to Conduct Discovery Pursuant to Rule 70(a)(2)"
                      - "Motion for Leave to File"
                      - "Motion for Leave to File Out of Time"
                      - "Motion for Leave to Serve Additional Interrogatories"
                      - "Motion for Leave to Use Electronic Equipment"
                      - "Motion for More Definite Statement Pursuant to Rule 51"
                      - "Motion for Non-Binding Mediation"
                      - "Motion for Oral Argument"
                      - "Motion for Order Fixing Amount of an Appeal Bond"
                      - "Motion for Order to Release the Amount of an Appeal Bond"
                      - "Motion for Order to Show Cause Why Case Should Not Be Sumitted on the Basis of the Administrative Record"
                      - "Motion for Order to Show Cause Why Judgment Should Not be Entered on the Basis of a Previously Decided Case"
                      - "Motion for Order to Show Cause Why Proposed Facts and Evidence Should Not be Accepted as Established Pursuant to Rule 91(f)"
                      - "Motion for Partial Summary Judgment"
                      - "Motion for Pretrial Conference"
                      - "Motion for Protective Order Pursuant to Rule 103"
                      - "Motion for Reasonable Litigation or Administrative Costs"
                      - "Motion for Reconsideration of Findings or Opinion Pursuant to Rule 161"
                      - "Motion for Reconsideration of Order"
                      - "Motion for Recusal of Judge"
                      - "Motion for Review of Jeopardy Assessment or Jeopardy Levy Pursuant to Rule 56"
                      - "Motion for the Court to Pay the Expenses of a Transcript"
                      - "Motion for the Court to Pay the Expenses of an Interpreter"
                      - "Motion for Voluntary Binding Arbitration"
                      - "Motion for Writ of Habeas Corpus Ad Testificandum"
                      - "Motion in Limine"
                      - "Motion to Add Lien or Levy Designation"
                      - "Motion to Add Small Tax case Designation"
                      - "Motion to Amend Order"
                      - "Motion to Appoint an Interpreter Pursuant to Rule 143(f)"
                      - "Motion to Appoint New Tax Matters Partner"
                      - "Motion to Appoint Tax Matters Partner"
                      - "Motion to Authorize Proposed Sale of Seized Property"
                      - "Motion to Be Excused from Appearing at the Trial Session"
                      - "Motion to Be Recognized as Next Friend"
                      - "Motion to Bifurcate"
                      - "Motion to Calendar"
                      - "Motion to Calendar and Consolidate"
                      - "Motion to Calendar in the Electronic (North) Courtroom"
                      - "Motion to Certify for Interlocutory Appeal"
                      - "Motion to Change or Correct Docket Entry"
                      - "Motion to Change Place of Submission of Declaratory Judgment Case"
                      - "Motion to Change Place of Trial"
                      - "Motion to Change Service Method"
                      - "Motion to Clarify Order"
                      - "Motion to Close on Ground of Duplication"
                      - "Motion to Compel Discovery"
                      - "Motion to Compel Production of Documents"
                      - "Motion to Compel Responses to Interrogatories"
                      - "Motion to Compel the Taking of Deposition"
                      - "Motion to Conform the Pleadings to the Proof"
                      - "Motion to Consolidate"
                      - "Motion to Correct and Certify Record on Appeal"
                      - "Motion to Correct Clerical Order"
                      - "Motion to Correct Transcript"
                      - "Motion to Depose Pursuant to Rule 74"
                      - "Motion to Determine the Tax Matters Partner"
                      - "Motion to Dismiss"
                      - "Motion to Dismiss for Failure to Properly Prosecute"
                      - "Motion to Dismiss for Failure to State a Claim upon Which Relief Can Be Granted"
                      - "Motion to Dismiss for Lack of Jurisdiction as to [person, notice, or year]"
                      - "Motion to Dismiss on Grounds of Mootness"
                      - "Motion to Disqualify Counsel"
                      - "Motion to Enforce a Refund of Overpayment Pursuant to Rule 260"
                      - "Motion to Enforce Subpoena"
                      - "Motion to Extend Time to Move or File Answer"
                      - "Motion to Impose a Penalty"
                      - "Motion to Impose Sanctions"
                      - "Motion to Modify Decision in Estate Tax Case Pursuant to Rule 262"
                      - "Motion to Modify Order"
                      - "Motion to Permit Expert Witness to Testify without a Written Report Regarding Industry Practice Pursuant to Rule 143(g)(3)"
                      - "Motion to Permit Levy"
                      - "Motion to Preclude"
                      - "Motion to Quash or Modify Subpoena"
                      - "Motion to Redetermine Interest Pursuant to Rule 261"
                      - "Motion to Remand"
                      - "Motion to Remove Lien/Levy Designation"
                      - "Motion to Remove Small Tax Case Designation"
                      - "Motion to Remove Tax Matters Partner"
                      - "Motion to Reopen the Record"
                      - "Motion to Require Petitioner to File a Reply in a Small Tax Case Pursuant to Rule 173(c)"
                      - "Motion to Restore Case to the General Docket"
                      - "Motion to Restrain Assessment or Collection or to Order Refund of Amount Collected"
                      - "Motion to Retain File in Estate Tax Case Involving § 6166 Election Pursuant to Rule 157"
                      - "Motion to Review the Sufficiency of Answers or Objections to Request for Admissions"
                      - "Motion to Seal"
                      - "Motion to Set for a Time & Date Certain"
                      - "Motion to Set Pretrial Scheduling Order"
                      - "Motion to Sever"
                      - "Motion to Shift the Burden of Proof"
                      - "Motion to Shorten the Time"
                      - "Motion to Stay Proceedings"
                      - "Motion to Stay Proposed Sale of Seized Property"
                      - "Motion to Strike"
                      - "Motion to Submit Case Pursuant to Rule 122"
                      - "Motion to Substitute Parties and Change Caption"
                      - "Motion to Substitute Trial Exhibit(s)"
                      - "Motion to Supplement the Record"
                      - "Motion to Suppress Evidence"
                      - "Motion to Take Deposition Pursuant to Rule 74(c)(3)"
                      - "Motion to Take Judicial Notice"
                      - "Motion to Vacate"
                      - "Motion to Vacate or Revise Pursuant to Rule 162"
                      - "Motion to Withdraw"
                      - "Motion to Withdraw or Modify the Deemed Admitted Admissions Pursuant to Rule 90(f)"
                      - "Notice of Abatement of Jeopardy Assessment"
                      - "Notice of Appeal"
                      - "Notice of Change of Address"
                      - "Notice of Change of Address and Telephone Number"
                      - "Notice of Change of Telephone Number"
                      - "Notice of Clarification of Tax Matters Partner"
                      - "Notice of Concession"
                      - "Notice of Consistent Agreement Pursuant to Rule 248(c)(1)"
                      - "Notice of Death of Counsel"
                      - "Notice of Filing of Petition and Right to Intervene"
                      - "Notice of Filing of the Administrative Record"
                      - "Notice of Identification of Tax Matters Partner"
                      - "Notice of Intent Not to File"
                      - "Notice of Issue Concerning Foreign Law"
                      - "Notice of Jeopardy Assessment"
                      - "Notice of Judicial Ruling"
                      - "Notice of No Objection"
                      - "Notice of Objection"
                      - "Notice of Partial Abatement of Jeopardy Assessment"
                      - "Notice of Proceeding in Bankruptcy"
                      - "Notice of Relevant Judicial Decisions"
                      - "Notice of Settlement Agreement Pursuant to Rule 248(c)(1)"
                      - "Notice of Small Tax Case Election"
                      - "Notice of Supplemental Authority"
                      - "Notice of Telephone Number"
                      - "Notice of Termination Assessment"
                      - "Notice of Unavailability"
                      - "Redacted Petition Filed"
                      - "Prehearing Memorandum"
                      - "Pretrial Memorandum"
                      - "Reply"
                      - "Sur-Reply"
                      - "Request for Admissions"
                      - "Request for Judicial Notice"
                      - "Request for Place of Trial"
                      - "Request for Pretrial Conference"
                      - "No Objection"
                      - "Objection"
                      - "Opposition"
                      - "Response"
                      - "Seriatim Answering Brief"
                      - "Seriatim Answering Memorandum Brief"
                      - "Seriatim Opening Brief"
                      - "Seriatim Opening Memorandum Brief"
                      - "Seriatim Reply Brief"
                      - "Seriatim Reply Memorandum Brief"
                      - "Seriatim Sur-Reply Brief"
                      - "Seriatim Sur-Reply Memorandum Brief"
                      - "Simultaneous Answering Brief"
                      - "Simultaneous Answering Memoranda of Law"
                      - "Simultaneous Answering Memorandum Brief"
                      - "Simultaneous Memoranda of Law"
                      - "Simultaneous Opening Brief"
                      - "Simultaneous Opening Memorandum Brief"
                      - "Simultaneous Reply Brief"
                      - "Simultaneous Supplemental Brief"
                      - "Simultaneous Sur-Reply Brief"
                      - "Simultaneous Sur-Reply Memorandum Brief"
                      - "Ownership Disclosure Statement"
                      - "Statement"
                      - "Statement of Redacted Information"
                      - "Statement under Rule 212"
                      - "Statement under Rule 50(c)"
                      - "Settlement Stipulation"
                      - "Stipulation"
                      - "Stipulation as to the Administrative Record"
                      - "Stipulation as to the Partial Administrative Record"
                      - "Stipulation of Facts"
                      - "Stipulation of Pretrial Deadlines"
                      - "Stipulation of Settled Issues"
                      - "Stipulation of Settlement"
                      - "Stipulation to Be Bound"
                      - "Stipulation to Take Deposition"
                      - "Supplement"
                      - "Supplemental"
                      - "Affidavit in Support"
                      - "Brief in Support"
                      - "Declaration in Support"
                      - "Memorandum in Support"
                      - "Unsworn Declaration under Penalty of Perjury in Support"
                      - "Entry of Appearance"
                      - "Substitution of Counsel"
                      - "Application"
                      - "Application for Examination Pursuant to Rule 73"
                      - "Amended [Document Name]"
                      - "Appellate Filing Fee Received"
                      - "Bond"
                      - "Evidence"
                      - "Letter"
                      - "Miscellaneous"
                      - "Miscellaneous (Lodged)"
                      - "Reference List of Redacted Information"
                      - "Motion"
                      - "Motion for Review By the Full Court"
                      - "Motion for Review En Banc"
                      - "Motion to Be Exempt from E-Filing"
                      - "Motion to Change Place of Hearing of Disclosure Case"
                      - "Motion to File Document Under Seal"
                      - "Motion to Intervene"
                      - "Motion to Proceed Anonymously"
                      - "Notice"
                      - "Notice of Change of Counsel for Non-Party"
                      - "Notice of Election to Intervene"
                      - "Notice of Election to Participate"
                      - "Notice of Intervention"
                      - "Petition"
                      - "Ratification of Petition"
                      - "Request"
                      - "Objection [anything]"
                      - "Opposition [anything]"
                      - "Response [anything]"
                      - "Supplement To [anything]"
                      - "Supplemental [anything]"
                  then: 
                    type: "any"
                    whens: 
                      - 
                        ref: 
                          path: 
                            - "documentType"
                        is: 
                          type: "string"
                          flags: 
                            only: true
                          rules: 
                            - 
                              name: "min"
                              args: 
                                limit: 1
                          allow: 
                            - "Notice of Change of Address"
                            - "Notice of Change of Address and Telephone Number"
                            - "Notice of Change of Telephone Number"
                            - "Request for Place of Trial"
                            - "Miscellaneous"
                            - "Notice"
                        then: 
                          type: "any"
                          whens: 
                            - 
                              ref: 
                                path: 
                                  - "isAutoGenerated"
                              is: 
                                type: "any"
                                flags: 
                                  only: true
                                  presence: "required"
                                allow: 
                                  - 
                                    override: true
                                  - false
                              then: 
                                type: "any"
                                flags: 
                                  presence: "required"
                              otherwise: 
                                type: "any"
                                flags: 
                                  presence: "optional"
                                allow: 
                                  - ""
                                  - null
                        otherwise: 
                          type: "any"
                          flags: 
                            presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - ""
                      - null
            filingDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "required"
                description: "Date that this Document was filed."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            freeText: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            freeText2: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            hasOtherFilingParty: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Whether the document has other filing party."
            hasSupportingDocuments: 
              type: "boolean"
              flags: 
                presence: "optional"
            index: 
              type: "number"
              flags: 
                presence: "optional"
                description: "Index of this item in the Docket Record list."
              rules: 
                - 
                  name: "integer"
            isAutoGenerated: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "A flag that indicates when a document was generated by the system as opposed to being uploaded by a user."
            isDraft: 
              type: "boolean"
              flags: 
                presence: "required"
                description: "Whether the document is a draft (not on the docket record)."
            isFileAttached: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Has an associated PDF in S3."
            isLegacySealed: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates whether or not the legacy document was sealed prior to being migrated to the new system."
            isLegacy: 
              type: "boolean"
              flags: 
                description: "Indicates whether or not the document belongs to a legacy case that has been migrated to the new system."
              whens: 
                - 
                  ref: 
                    path: 
                      - "isLegacySealed"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                      only: true
                    allow: 
                      - true
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
            isLegacyServed: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates whether or not the legacy document was served prior to being migrated to the new system."
            isMinuteEntry: 
              type: "boolean"
              flags: 
                presence: "optional"
            isOnDocketRecord: 
              type: "boolean"
              flags: 
                presence: "optional"
            isPaper: 
              type: "boolean"
              flags: 
                presence: "optional"
            isSealed: 
              type: "boolean"
              flags: 
                description: "Indicates whether or not the document is sealed."
              whens: 
                - 
                  ref: 
                    path: 
                      - "isLegacySealed"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                      only: true
                    allow: 
                      - true
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
            isStricken: 
              type: "boolean"
              flags: 
                description: "Indicates the item has been removed from the docket record."
              whens: 
                - 
                  ref: 
                    path: 
                      - "isLegacy"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
            judge: 
              type: "string"
              flags: 
                description: "The judge associated with the document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              allow: 
                - null
              whens: 
                - 
                  ref: 
                    path: 
                      - "documentType"
                  is: 
                    type: "string"
                    flags: 
                      only: true
                    rules: 
                      - 
                        name: "min"
                        args: 
                          limit: 1
                    allow: 
                      - "Memorandum Opinion"
                      - "Summary Opinion"
                      - "T.C. Opinion"
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
            lodged: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "A lodged document is awaiting action by the judge to enact or refuse."
            mailingDate: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
            numberOfPages: 
              type: "number"
              flags: 
                presence: "optional"
              allow: 
                - null
            objections: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Yes"
                - "No"
                - "Unknown"
            ordinalValue: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            otherFilingParty: 
              type: "string"
              flags: 
                description: "When someone other than the petitioner or respondent files a document, this is the name of the person who filed that document"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              whens: 
                - 
                  ref: 
                    path: 
                      - "hasOtherFilingParty"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
            partyIrsPractitioner: 
              type: "boolean"
              flags: 
                presence: "optional"
            partyPrimary: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Use the primary contact to compose the filedBy text."
            partySecondary: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Use the secondary contact to compose the filedBy text."
            pending: 
              type: "boolean"
              flags: 
                presence: "optional"
            previousDocument: 
              type: "object"
              flags: 
                presence: "optional"
              keys: 
                documentId: 
                  type: "string"
                  flags: 
                    presence: "optional"
                    description: "The ID of the previous document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "guid"
                      args: 
                        options: 
                          version: 
                            - "uuidv4"
                documentTitle: 
                  type: "string"
                  flags: 
                    presence: "optional"
                    description: "The title of the previous document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 3000
                documentType: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "optional"
                    description: "The type of the previous document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "Administrative Record"
                    - "Affidavit in Support"
                    - "Agreed Computation for Entry of Decision"
                    - "Amended"
                    - "Amended Certificate of Service"
                    - "Amended [Document Name]"
                    - "Amendment [anything]"
                    - "Answer"
                    - "Answer to Amended Petition"
                    - "Answer to Amended Petition, as Amended"
                    - "Answer to Amendment to Amended Petition"
                    - "Answer to Amendment to Petition"
                    - "Answer to Petition, as Amended"
                    - "Answer to Second Amended Petition"
                    - "Answer to Second Amendment to Petition"
                    - "Answer to Supplement to Petition"
                    - "Answer to Third Amended Petition"
                    - "Answer to Third Amendment to Petition"
                    - "Appellate Filing Fee Received"
                    - "Application"
                    - "Application for Examination Pursuant to Rule 73"
                    - "Application for Waiver of Filing Fee"
                    - "Application for Waiver of Filing Fee and Affidavit"
                    - "Application to Take Deposition"
                    - "Bond"
                    - "Bounced Electronic Service"
                    - "Brief in Support"
                    - "Caption of case is amended"
                    - "Certificate as to the Genuineness of the Administrative Record"
                    - "Certificate of Service"
                    - "Civil Penalty Approval Form"
                    - "Computation for Entry of Decision"
                    - "Corrected Transcript"
                    - "Decision"
                    - "Declaration in Support"
                    - "Designation of Counsel to Receive Service"
                    - "Docket Number is amended"
                    - "Entry of Appearance"
                    - "Evidence"
                    - "Exhibit(s)"
                    - "Filing Fee Paid"
                    - "Filing Fee Waived"
                    - "Further Trial before"
                    - "Hearing Exhibits"
                    - "Hearing before"
                    - "Letter"
                    - "Memorandum"
                    - "Memorandum Opinion"
                    - "Memorandum in Support"
                    - "Miscellaneous"
                    - "Miscellaneous (Lodged)"
                    - "Motion"
                    - "Motion for Appointment of Mediator"
                    - "Motion for Assignment of Judge"
                    - "Motion for Audio of Trial Proceeding(s)"
                    - "Motion for Certification of an Interlocutory Order to Permit Immediate Appeal"
                    - "Motion for Continuance"
                    - "Motion for Default and Dismissal"
                    - "Motion for Entry of Decision"
                    - "Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)"
                    - "Motion for Estate Tax Deduction Developing at or after Trial Pursuant to Rule 156"
                    - "Motion for Extension of Time"
                    - "Motion for International Judicial Assistance"
                    - "Motion for Judgment on the Pleadings"
                    - "Motion for Leave to Conduct Discovery Pursuant to Rule 70(a)(2)"
                    - "Motion for Leave to File"
                    - "Motion for Leave to File Out of Time"
                    - "Motion for Leave to Serve Additional Interrogatories"
                    - "Motion for Leave to Use Electronic Equipment"
                    - "Motion for More Definite Statement Pursuant to Rule 51"
                    - "Motion for Non-Binding Mediation"
                    - "Motion for Oral Argument"
                    - "Motion for Order Fixing Amount of an Appeal Bond"
                    - "Motion for Order to Release the Amount of an Appeal Bond"
                    - "Motion for Order to Show Cause Why Case Should Not Be Sumitted on the Basis of the Administrative Record"
                    - "Motion for Order to Show Cause Why Judgment Should Not be Entered on the Basis of a Previously Decided Case"
                    - "Motion for Order to Show Cause Why Proposed Facts and Evidence Should Not be Accepted as Established Pursuant to Rule 91(f)"
                    - "Motion for Partial Summary Judgment"
                    - "Motion for Pretrial Conference"
                    - "Motion for Protective Order Pursuant to Rule 103"
                    - "Motion for Reasonable Litigation or Administrative Costs"
                    - "Motion for Reconsideration of Findings or Opinion Pursuant to Rule 161"
                    - "Motion for Reconsideration of Order"
                    - "Motion for Recusal of Judge"
                    - "Motion for Review By the Full Court"
                    - "Motion for Review En Banc"
                    - "Motion for Review of Jeopardy Assessment or Jeopardy Levy Pursuant to Rule 56"
                    - "Motion for Summary Judgment"
                    - "Motion for Voluntary Binding Arbitration"
                    - "Motion for Writ of Habeas Corpus Ad Testificandum"
                    - "Motion for a New Trial"
                    - "Motion for an Order under Federal Rule of Evidence 502(d)"
                    - "Motion for an Order under Model Rule of Professional Conduct 4.2"
                    - "Motion for in Camera Review"
                    - "Motion for the Court to Pay the Expenses of a Transcript"
                    - "Motion for the Court to Pay the Expenses of an Interpreter"
                    - "Motion in Limine"
                    - "Motion to Add Lien or Levy Designation"
                    - "Motion to Add Small Tax case Designation"
                    - "Motion to Amend Order"
                    - "Motion to Appoint New Tax Matters Partner"
                    - "Motion to Appoint Tax Matters Partner"
                    - "Motion to Appoint an Interpreter Pursuant to Rule 143(f)"
                    - "Motion to Authorize Proposed Sale of Seized Property"
                    - "Motion to Be Excused from Appearing at the Trial Session"
                    - "Motion to Be Exempt from E-Filing"
                    - "Motion to Be Recognized as Next Friend"
                    - "Motion to Bifurcate"
                    - "Motion to Calendar"
                    - "Motion to Calendar and Consolidate"
                    - "Motion to Calendar in the Electronic (North) Courtroom"
                    - "Motion to Certify for Interlocutory Appeal"
                    - "Motion to Change Place of Hearing of Disclosure Case"
                    - "Motion to Change Place of Submission of Declaratory Judgment Case"
                    - "Motion to Change Place of Trial"
                    - "Motion to Change Service Method"
                    - "Motion to Change or Correct Caption"
                    - "Motion to Change or Correct Docket Entry"
                    - "Motion to Clarify Order"
                    - "Motion to Close on Ground of Duplication"
                    - "Motion to Compel Discovery"
                    - "Motion to Compel Production of Documents"
                    - "Motion to Compel Responses to Interrogatories"
                    - "Motion to Compel the Taking of Deposition"
                    - "Motion to Conform the Pleadings to the Proof"
                    - "Motion to Consolidate"
                    - "Motion to Correct Clerical Order"
                    - "Motion to Correct Transcript"
                    - "Motion to Correct and Certify Record on Appeal"
                    - "Motion to Depose Pursuant to Rule 74"
                    - "Motion to Determine the Tax Matters Partner"
                    - "Motion to Dismiss"
                    - "Motion to Dismiss for Failure to Properly Prosecute"
                    - "Motion to Dismiss for Failure to State a Claim upon Which Relief Can Be Granted"
                    - "Motion to Dismiss for Lack of Jurisdiction"
                    - "Motion to Dismiss for Lack of Jurisdiction as to [person, notice, or year]"
                    - "Motion to Dismiss for Lack of Prosecution"
                    - "Motion to Dismiss on Grounds of Mootness"
                    - "Motion to Disqualify Counsel"
                    - "Motion to Enforce Subpoena"
                    - "Motion to Enforce a Refund of Overpayment Pursuant to Rule 260"
                    - "Motion to Extend Time to Move or File Answer"
                    - "Motion to File Document Under Seal"
                    - "Motion to Impose Sanctions"
                    - "Motion to Impose a Penalty"
                    - "Motion to Intervene"
                    - "Motion to Modify Decision in Estate Tax Case Pursuant to Rule 262"
                    - "Motion to Modify Order"
                    - "Motion to Permit Expert Witness to Testify without a Written Report Regarding Industry Practice Pursuant to Rule 143(g)(3)"
                    - "Motion to Permit Levy"
                    - "Motion to Preclude"
                    - "Motion to Proceed Anonymously"
                    - "Motion to Quash or Modify Subpoena"
                    - "Motion to Redetermine Interest Pursuant to Rule 261"
                    - "Motion to Remand"
                    - "Motion to Remove Lien/Levy Designation"
                    - "Motion to Remove Small Tax Case Designation"
                    - "Motion to Remove Tax Matters Partner"
                    - "Motion to Reopen the Record"
                    - "Motion to Require Petitioner to File a Reply in a Small Tax Case Pursuant to Rule 173(c)"
                    - "Motion to Restore Case to the General Docket"
                    - "Motion to Restrain Assessment or Collection or to Order Refund of Amount Collected"
                    - "Motion to Retain File in Estate Tax Case Involving § 6166 Election Pursuant to Rule 157"
                    - "Motion to Review the Sufficiency of Answers or Objections to Request for Admissions"
                    - "Motion to Seal"
                    - "Motion to Set Pretrial Scheduling Order"
                    - "Motion to Set for a Time & Date Certain"
                    - "Motion to Sever"
                    - "Motion to Shift the Burden of Proof"
                    - "Motion to Shorten the Time"
                    - "Motion to Stay Proceedings"
                    - "Motion to Stay Proposed Sale of Seized Property"
                    - "Motion to Strike"
                    - "Motion to Submit Case Pursuant to Rule 122"
                    - "Motion to Substitute Parties and Change Caption"
                    - "Motion to Substitute Trial Exhibit(s)"
                    - "Motion to Supplement the Record"
                    - "Motion to Suppress Evidence"
                    - "Motion to Take Deposition Pursuant to Rule 74(c)(3)"
                    - "Motion to Take Judicial Notice"
                    - "Motion to Vacate"
                    - "Motion to Vacate or Revise Pursuant to Rule 162"
                    - "Motion to Withdraw"
                    - "Motion to Withdraw Counsel (filed by petitioner)"
                    - "Motion to Withdraw as Counsel"
                    - "Motion to Withdraw or Modify the Deemed Admitted Admissions Pursuant to Rule 90(f)"
                    - "No Objection"
                    - "Notice"
                    - "Notice of Abatement of Jeopardy Assessment"
                    - "Notice of Appeal"
                    - "Notice of Change of Address"
                    - "Notice of Change of Address and Telephone Number"
                    - "Notice of Change of Counsel for Non-Party"
                    - "Notice of Change of Telephone Number"
                    - "Notice of Clarification of Tax Matters Partner"
                    - "Notice of Concession"
                    - "Notice of Consistent Agreement Pursuant to Rule 248(c)(1)"
                    - "Notice of Death of Counsel"
                    - "Notice of Docket Change"
                    - "Notice of Election to Intervene"
                    - "Notice of Election to Participate"
                    - "Notice of Filing of Petition and Right to Intervene"
                    - "Notice of Filing of the Administrative Record"
                    - "Notice of Identification of Tax Matters Partner"
                    - "Notice of Intent Not to File"
                    - "Notice of Intervention"
                    - "Notice of Issue Concerning Foreign Law"
                    - "Notice of Jeopardy Assessment"
                    - "Notice of Judicial Ruling"
                    - "Notice of No Objection"
                    - "Notice of Objection"
                    - "Notice of Partial Abatement of Jeopardy Assessment"
                    - "Notice of Proceeding in Bankruptcy"
                    - "Notice of Relevant Judicial Decisions"
                    - "Notice of Settlement Agreement Pursuant to Rule 248(c)(1)"
                    - "Notice of Small Tax Case Election"
                    - "Notice of Supplemental Authority"
                    - "Notice of Telephone Number"
                    - "Notice of Termination Assessment"
                    - "Notice of Trial"
                    - "Notice of Unavailability"
                    - "Objection"
                    - "Objection [anything]"
                    - "Opposition"
                    - "Opposition [anything]"
                    - "Order"
                    - "Order and Decision"
                    - "Order fixing amount of bond"
                    - "Order for Amended Petition"
                    - "Order for Amended Petition and Filing Fee"
                    - "Order for Amendment to Petition"
                    - "Order for Filing Fee"
                    - "Order for Filing Fee. Application waiver of Filing Fee is denied"
                    - "Order for Ownership Disclosure Statement"
                    - "Order for Ratification of Petition"
                    - "Order of Dismissal"
                    - "Order of Dismissal and Decision"
                    - "Order of Dismissal for Lack of Jurisdiction"
                    - "Order of Service of Transcript (Bench Opinion)"
                    - "Order petr(s) to show cause why \"S\" should not be removed"
                    - "Order that caption of case is amended"
                    - "Order that case is assigned"
                    - "Order that case is submitted"
                    - "Order that jurisdiction is retained"
                    - "Order that the letter \"L\" is added to Docket number"
                    - "Order that the letter \"L\" is deleted from the Docket number"
                    - "Order that the letter \"P\" is added to the Docket number"
                    - "Order that the letter \"P\" is deleted from the Docket number"
                    - "Order that the letter \"R\" is added to the Docket number"
                    - "Order that the letter \"R\" is deleted from the Docket number"
                    - "Order that the letter \"S\" is added to the Docket number"
                    - "Order that the letter \"S\" is deleted from the Docket number"
                    - "Order that the letter \"W\" is added to the Docket number"
                    - "Order that the letter \"W\" is deleted from the Docket number"
                    - "Order that the letter \"X\" is added to the Docket number"
                    - "Order that the letter \"X\" is deleted from the Docket number"
                    - "Order that the letters \"SL\" are added to the Docket number"
                    - "Order that the letters \"SL\" are deleted from the Docket number"
                    - "Order time is extended for petr(s) to file Amended Petition"
                    - "Order time is extended for petr(s) to file Amended Petition and pay the Filing Fee or submit an Application for Waiver of Filing Fee"
                    - "Order time is extended for petr(s) to pay filing fee or submit an Application for Waiver of Filing fee"
                    - "Order time is extended for petr(s) to pay the filing fee"
                    - "Order to Show Cause"
                    - "Ownership Disclosure Statement"
                    - "Partial Administrative Record"
                    - "Partial Trial before"
                    - "Petition"
                    - "Prehearing Memorandum"
                    - "Pretrial Memorandum"
                    - "Proposed Stipulated Decision"
                    - "Ratification"
                    - "Ratification of Petition"
                    - "Record on Appeal"
                    - "Redacted"
                    - "Redacted Petition Filed"
                    - "Reference List of Redacted Information"
                    - "Reply"
                    - "Report"
                    - "Request"
                    - "Request for Admissions"
                    - "Request for Judicial Notice"
                    - "Request for Place of Trial"
                    - "Request for Pretrial Conference"
                    - "Response"
                    - "Response [anything]"
                    - "Returned Mail"
                    - "Revised Computation"
                    - "Revised Transcript"
                    - "Seriatim Answering Brief"
                    - "Seriatim Answering Memorandum Brief"
                    - "Seriatim Opening Brief"
                    - "Seriatim Opening Memorandum Brief"
                    - "Seriatim Reply Brief"
                    - "Seriatim Reply Memorandum Brief"
                    - "Seriatim Sur-Reply Brief"
                    - "Seriatim Sur-Reply Memorandum Brief"
                    - "Settlement Stipulation"
                    - "Simultaneous Answering Brief"
                    - "Simultaneous Answering Memoranda of Law"
                    - "Simultaneous Answering Memorandum Brief"
                    - "Simultaneous Memoranda of Law"
                    - "Simultaneous Opening Brief"
                    - "Simultaneous Opening Memorandum Brief"
                    - "Simultaneous Reply Brief"
                    - "Simultaneous Supplemental Brief"
                    - "Simultaneous Sur-Reply Brief"
                    - "Simultaneous Sur-Reply Memorandum Brief"
                    - "Standing Pretrial Notice"
                    - "Standing Pretrial Order"
                    - "Statement"
                    - "Statement of Redacted Information"
                    - "Statement of Taxpayer Identification"
                    - "Statement under Rule 212"
                    - "Statement under Rule 50(c)"
                    - "Status Report"
                    - "Stipulated Decision"
                    - "Stipulation"
                    - "Stipulation as to the Administrative Record"
                    - "Stipulation as to the Partial Administrative Record"
                    - "Stipulation of Facts"
                    - "Stipulation of Pretrial Deadlines"
                    - "Stipulation of Settled Issues"
                    - "Stipulation of Settlement"
                    - "Stipulation to Be Bound"
                    - "Stipulation to Take Deposition"
                    - "Substitution of Counsel"
                    - "Summary Opinion"
                    - "Supplement"
                    - "Supplement To [anything]"
                    - "Supplemental"
                    - "Supplemental [anything]"
                    - "Sur-Reply"
                    - "T.C. Opinion"
                    - "Transcript"
                    - "Trial Exhibits"
                    - "Trial before"
                    - "U.S.C.A"
                    - "Unsworn Declaration under Penalty of Perjury in Support"
                    - "Writ of Habeas Corpus Ad Testificandum"
            privatePractitioners: 
              type: "array"
              flags: 
                presence: "optional"
                description: "Practitioner names to be used to compose the filedBy text."
              items: 
                - 
                  type: "object"
                  keys: 
                    name: 
                      type: "string"
                      flags: 
                        presence: "required"
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
                        - 
                          name: "max"
                          args: 
                            limit: 100
            processingStatus: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "complete"
                - "pending"
            qcAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            qcByUserId: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
              allow: 
                - null
            receivedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            relationship: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "primaryDocument"
                - "primarySupportingDocument"
                - "secondaryDocument"
                - "secondarySupportingDocument"
                - "supportingDocument"
            scenario: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Standard"
                - "Nonstandard A"
                - "Nonstandard B"
                - "Nonstandard C"
                - "Nonstandard D"
                - "Nonstandard E"
                - "Nonstandard F"
                - "Nonstandard G"
                - "Nonstandard H"
                - "Type A"
                - "Type B"
                - "Type C"
                - "Type D"
                - "Type E"
                - "Type F"
                - "Type G"
                - "Type H"
            secondaryDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "A secondary date associated with the document, typically related to time-restricted availability. Used to build the document title for TRAN documents."
            secondaryDocument: 
              type: "object"
              flags: 
                description: "The secondary document."
              whens: 
                - 
                  ref: 
                    path: 
                      - "scenario"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - "Nonstandard H"
                  then: 
                    type: "any"
                    flags: 
                      presence: "optional"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "forbidden"
              keys: 
                documentTitle: 
                  type: "string"
                  flags: 
                    presence: "optional"
                    description: "The title of the secondary document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 500
                documentType: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "required"
                    description: "The type of the secondary document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "Administrative Record"
                    - "Affidavit in Support"
                    - "Agreed Computation for Entry of Decision"
                    - "Amended"
                    - "Amended Certificate of Service"
                    - "Amended [Document Name]"
                    - "Amendment [anything]"
                    - "Answer"
                    - "Answer to Amended Petition"
                    - "Answer to Amended Petition, as Amended"
                    - "Answer to Amendment to Amended Petition"
                    - "Answer to Amendment to Petition"
                    - "Answer to Petition, as Amended"
                    - "Answer to Second Amended Petition"
                    - "Answer to Second Amendment to Petition"
                    - "Answer to Supplement to Petition"
                    - "Answer to Third Amended Petition"
                    - "Answer to Third Amendment to Petition"
                    - "Appellate Filing Fee Received"
                    - "Application"
                    - "Application for Examination Pursuant to Rule 73"
                    - "Application for Waiver of Filing Fee"
                    - "Application for Waiver of Filing Fee and Affidavit"
                    - "Application to Take Deposition"
                    - "Bond"
                    - "Bounced Electronic Service"
                    - "Brief in Support"
                    - "Caption of case is amended"
                    - "Certificate as to the Genuineness of the Administrative Record"
                    - "Certificate of Service"
                    - "Civil Penalty Approval Form"
                    - "Computation for Entry of Decision"
                    - "Corrected Transcript"
                    - "Decision"
                    - "Declaration in Support"
                    - "Designation of Counsel to Receive Service"
                    - "Docket Number is amended"
                    - "Entry of Appearance"
                    - "Evidence"
                    - "Exhibit(s)"
                    - "Filing Fee Paid"
                    - "Filing Fee Waived"
                    - "Further Trial before"
                    - "Hearing Exhibits"
                    - "Hearing before"
                    - "Letter"
                    - "Memorandum"
                    - "Memorandum Opinion"
                    - "Memorandum in Support"
                    - "Miscellaneous"
                    - "Miscellaneous (Lodged)"
                    - "Motion"
                    - "Motion for Appointment of Mediator"
                    - "Motion for Assignment of Judge"
                    - "Motion for Audio of Trial Proceeding(s)"
                    - "Motion for Certification of an Interlocutory Order to Permit Immediate Appeal"
                    - "Motion for Continuance"
                    - "Motion for Default and Dismissal"
                    - "Motion for Entry of Decision"
                    - "Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)"
                    - "Motion for Estate Tax Deduction Developing at or after Trial Pursuant to Rule 156"
                    - "Motion for Extension of Time"
                    - "Motion for International Judicial Assistance"
                    - "Motion for Judgment on the Pleadings"
                    - "Motion for Leave to Conduct Discovery Pursuant to Rule 70(a)(2)"
                    - "Motion for Leave to File"
                    - "Motion for Leave to File Out of Time"
                    - "Motion for Leave to Serve Additional Interrogatories"
                    - "Motion for Leave to Use Electronic Equipment"
                    - "Motion for More Definite Statement Pursuant to Rule 51"
                    - "Motion for Non-Binding Mediation"
                    - "Motion for Oral Argument"
                    - "Motion for Order Fixing Amount of an Appeal Bond"
                    - "Motion for Order to Release the Amount of an Appeal Bond"
                    - "Motion for Order to Show Cause Why Case Should Not Be Sumitted on the Basis of the Administrative Record"
                    - "Motion for Order to Show Cause Why Judgment Should Not be Entered on the Basis of a Previously Decided Case"
                    - "Motion for Order to Show Cause Why Proposed Facts and Evidence Should Not be Accepted as Established Pursuant to Rule 91(f)"
                    - "Motion for Partial Summary Judgment"
                    - "Motion for Pretrial Conference"
                    - "Motion for Protective Order Pursuant to Rule 103"
                    - "Motion for Reasonable Litigation or Administrative Costs"
                    - "Motion for Reconsideration of Findings or Opinion Pursuant to Rule 161"
                    - "Motion for Reconsideration of Order"
                    - "Motion for Recusal of Judge"
                    - "Motion for Review By the Full Court"
                    - "Motion for Review En Banc"
                    - "Motion for Review of Jeopardy Assessment or Jeopardy Levy Pursuant to Rule 56"
                    - "Motion for Summary Judgment"
                    - "Motion for Voluntary Binding Arbitration"
                    - "Motion for Writ of Habeas Corpus Ad Testificandum"
                    - "Motion for a New Trial"
                    - "Motion for an Order under Federal Rule of Evidence 502(d)"
                    - "Motion for an Order under Model Rule of Professional Conduct 4.2"
                    - "Motion for in Camera Review"
                    - "Motion for the Court to Pay the Expenses of a Transcript"
                    - "Motion for the Court to Pay the Expenses of an Interpreter"
                    - "Motion in Limine"
                    - "Motion to Add Lien or Levy Designation"
                    - "Motion to Add Small Tax case Designation"
                    - "Motion to Amend Order"
                    - "Motion to Appoint New Tax Matters Partner"
                    - "Motion to Appoint Tax Matters Partner"
                    - "Motion to Appoint an Interpreter Pursuant to Rule 143(f)"
                    - "Motion to Authorize Proposed Sale of Seized Property"
                    - "Motion to Be Excused from Appearing at the Trial Session"
                    - "Motion to Be Exempt from E-Filing"
                    - "Motion to Be Recognized as Next Friend"
                    - "Motion to Bifurcate"
                    - "Motion to Calendar"
                    - "Motion to Calendar and Consolidate"
                    - "Motion to Calendar in the Electronic (North) Courtroom"
                    - "Motion to Certify for Interlocutory Appeal"
                    - "Motion to Change Place of Hearing of Disclosure Case"
                    - "Motion to Change Place of Submission of Declaratory Judgment Case"
                    - "Motion to Change Place of Trial"
                    - "Motion to Change Service Method"
                    - "Motion to Change or Correct Caption"
                    - "Motion to Change or Correct Docket Entry"
                    - "Motion to Clarify Order"
                    - "Motion to Close on Ground of Duplication"
                    - "Motion to Compel Discovery"
                    - "Motion to Compel Production of Documents"
                    - "Motion to Compel Responses to Interrogatories"
                    - "Motion to Compel the Taking of Deposition"
                    - "Motion to Conform the Pleadings to the Proof"
                    - "Motion to Consolidate"
                    - "Motion to Correct Clerical Order"
                    - "Motion to Correct Transcript"
                    - "Motion to Correct and Certify Record on Appeal"
                    - "Motion to Depose Pursuant to Rule 74"
                    - "Motion to Determine the Tax Matters Partner"
                    - "Motion to Dismiss"
                    - "Motion to Dismiss for Failure to Properly Prosecute"
                    - "Motion to Dismiss for Failure to State a Claim upon Which Relief Can Be Granted"
                    - "Motion to Dismiss for Lack of Jurisdiction"
                    - "Motion to Dismiss for Lack of Jurisdiction as to [person, notice, or year]"
                    - "Motion to Dismiss for Lack of Prosecution"
                    - "Motion to Dismiss on Grounds of Mootness"
                    - "Motion to Disqualify Counsel"
                    - "Motion to Enforce Subpoena"
                    - "Motion to Enforce a Refund of Overpayment Pursuant to Rule 260"
                    - "Motion to Extend Time to Move or File Answer"
                    - "Motion to File Document Under Seal"
                    - "Motion to Impose Sanctions"
                    - "Motion to Impose a Penalty"
                    - "Motion to Intervene"
                    - "Motion to Modify Decision in Estate Tax Case Pursuant to Rule 262"
                    - "Motion to Modify Order"
                    - "Motion to Permit Expert Witness to Testify without a Written Report Regarding Industry Practice Pursuant to Rule 143(g)(3)"
                    - "Motion to Permit Levy"
                    - "Motion to Preclude"
                    - "Motion to Proceed Anonymously"
                    - "Motion to Quash or Modify Subpoena"
                    - "Motion to Redetermine Interest Pursuant to Rule 261"
                    - "Motion to Remand"
                    - "Motion to Remove Lien/Levy Designation"
                    - "Motion to Remove Small Tax Case Designation"
                    - "Motion to Remove Tax Matters Partner"
                    - "Motion to Reopen the Record"
                    - "Motion to Require Petitioner to File a Reply in a Small Tax Case Pursuant to Rule 173(c)"
                    - "Motion to Restore Case to the General Docket"
                    - "Motion to Restrain Assessment or Collection or to Order Refund of Amount Collected"
                    - "Motion to Retain File in Estate Tax Case Involving § 6166 Election Pursuant to Rule 157"
                    - "Motion to Review the Sufficiency of Answers or Objections to Request for Admissions"
                    - "Motion to Seal"
                    - "Motion to Set Pretrial Scheduling Order"
                    - "Motion to Set for a Time & Date Certain"
                    - "Motion to Sever"
                    - "Motion to Shift the Burden of Proof"
                    - "Motion to Shorten the Time"
                    - "Motion to Stay Proceedings"
                    - "Motion to Stay Proposed Sale of Seized Property"
                    - "Motion to Strike"
                    - "Motion to Submit Case Pursuant to Rule 122"
                    - "Motion to Substitute Parties and Change Caption"
                    - "Motion to Substitute Trial Exhibit(s)"
                    - "Motion to Supplement the Record"
                    - "Motion to Suppress Evidence"
                    - "Motion to Take Deposition Pursuant to Rule 74(c)(3)"
                    - "Motion to Take Judicial Notice"
                    - "Motion to Vacate"
                    - "Motion to Vacate or Revise Pursuant to Rule 162"
                    - "Motion to Withdraw"
                    - "Motion to Withdraw Counsel (filed by petitioner)"
                    - "Motion to Withdraw as Counsel"
                    - "Motion to Withdraw or Modify the Deemed Admitted Admissions Pursuant to Rule 90(f)"
                    - "No Objection"
                    - "Notice"
                    - "Notice of Abatement of Jeopardy Assessment"
                    - "Notice of Appeal"
                    - "Notice of Change of Address"
                    - "Notice of Change of Address and Telephone Number"
                    - "Notice of Change of Counsel for Non-Party"
                    - "Notice of Change of Telephone Number"
                    - "Notice of Clarification of Tax Matters Partner"
                    - "Notice of Concession"
                    - "Notice of Consistent Agreement Pursuant to Rule 248(c)(1)"
                    - "Notice of Death of Counsel"
                    - "Notice of Docket Change"
                    - "Notice of Election to Intervene"
                    - "Notice of Election to Participate"
                    - "Notice of Filing of Petition and Right to Intervene"
                    - "Notice of Filing of the Administrative Record"
                    - "Notice of Identification of Tax Matters Partner"
                    - "Notice of Intent Not to File"
                    - "Notice of Intervention"
                    - "Notice of Issue Concerning Foreign Law"
                    - "Notice of Jeopardy Assessment"
                    - "Notice of Judicial Ruling"
                    - "Notice of No Objection"
                    - "Notice of Objection"
                    - "Notice of Partial Abatement of Jeopardy Assessment"
                    - "Notice of Proceeding in Bankruptcy"
                    - "Notice of Relevant Judicial Decisions"
                    - "Notice of Settlement Agreement Pursuant to Rule 248(c)(1)"
                    - "Notice of Small Tax Case Election"
                    - "Notice of Supplemental Authority"
                    - "Notice of Telephone Number"
                    - "Notice of Termination Assessment"
                    - "Notice of Trial"
                    - "Notice of Unavailability"
                    - "Objection"
                    - "Objection [anything]"
                    - "Opposition"
                    - "Opposition [anything]"
                    - "Order"
                    - "Order and Decision"
                    - "Order fixing amount of bond"
                    - "Order for Amended Petition"
                    - "Order for Amended Petition and Filing Fee"
                    - "Order for Amendment to Petition"
                    - "Order for Filing Fee"
                    - "Order for Filing Fee. Application waiver of Filing Fee is denied"
                    - "Order for Ownership Disclosure Statement"
                    - "Order for Ratification of Petition"
                    - "Order of Dismissal"
                    - "Order of Dismissal and Decision"
                    - "Order of Dismissal for Lack of Jurisdiction"
                    - "Order of Service of Transcript (Bench Opinion)"
                    - "Order petr(s) to show cause why \"S\" should not be removed"
                    - "Order that caption of case is amended"
                    - "Order that case is assigned"
                    - "Order that case is submitted"
                    - "Order that jurisdiction is retained"
                    - "Order that the letter \"L\" is added to Docket number"
                    - "Order that the letter \"L\" is deleted from the Docket number"
                    - "Order that the letter \"P\" is added to the Docket number"
                    - "Order that the letter \"P\" is deleted from the Docket number"
                    - "Order that the letter \"R\" is added to the Docket number"
                    - "Order that the letter \"R\" is deleted from the Docket number"
                    - "Order that the letter \"S\" is added to the Docket number"
                    - "Order that the letter \"S\" is deleted from the Docket number"
                    - "Order that the letter \"W\" is added to the Docket number"
                    - "Order that the letter \"W\" is deleted from the Docket number"
                    - "Order that the letter \"X\" is added to the Docket number"
                    - "Order that the letter \"X\" is deleted from the Docket number"
                    - "Order that the letters \"SL\" are added to the Docket number"
                    - "Order that the letters \"SL\" are deleted from the Docket number"
                    - "Order time is extended for petr(s) to file Amended Petition"
                    - "Order time is extended for petr(s) to file Amended Petition and pay the Filing Fee or submit an Application for Waiver of Filing Fee"
                    - "Order time is extended for petr(s) to pay filing fee or submit an Application for Waiver of Filing fee"
                    - "Order time is extended for petr(s) to pay the filing fee"
                    - "Order to Show Cause"
                    - "Ownership Disclosure Statement"
                    - "Partial Administrative Record"
                    - "Partial Trial before"
                    - "Petition"
                    - "Prehearing Memorandum"
                    - "Pretrial Memorandum"
                    - "Proposed Stipulated Decision"
                    - "Ratification"
                    - "Ratification of Petition"
                    - "Record on Appeal"
                    - "Redacted"
                    - "Redacted Petition Filed"
                    - "Reference List of Redacted Information"
                    - "Reply"
                    - "Report"
                    - "Request"
                    - "Request for Admissions"
                    - "Request for Judicial Notice"
                    - "Request for Place of Trial"
                    - "Request for Pretrial Conference"
                    - "Response"
                    - "Response [anything]"
                    - "Returned Mail"
                    - "Revised Computation"
                    - "Revised Transcript"
                    - "Seriatim Answering Brief"
                    - "Seriatim Answering Memorandum Brief"
                    - "Seriatim Opening Brief"
                    - "Seriatim Opening Memorandum Brief"
                    - "Seriatim Reply Brief"
                    - "Seriatim Reply Memorandum Brief"
                    - "Seriatim Sur-Reply Brief"
                    - "Seriatim Sur-Reply Memorandum Brief"
                    - "Settlement Stipulation"
                    - "Simultaneous Answering Brief"
                    - "Simultaneous Answering Memoranda of Law"
                    - "Simultaneous Answering Memorandum Brief"
                    - "Simultaneous Memoranda of Law"
                    - "Simultaneous Opening Brief"
                    - "Simultaneous Opening Memorandum Brief"
                    - "Simultaneous Reply Brief"
                    - "Simultaneous Supplemental Brief"
                    - "Simultaneous Sur-Reply Brief"
                    - "Simultaneous Sur-Reply Memorandum Brief"
                    - "Standing Pretrial Notice"
                    - "Standing Pretrial Order"
                    - "Statement"
                    - "Statement of Redacted Information"
                    - "Statement of Taxpayer Identification"
                    - "Statement under Rule 212"
                    - "Statement under Rule 50(c)"
                    - "Status Report"
                    - "Stipulated Decision"
                    - "Stipulation"
                    - "Stipulation as to the Administrative Record"
                    - "Stipulation as to the Partial Administrative Record"
                    - "Stipulation of Facts"
                    - "Stipulation of Pretrial Deadlines"
                    - "Stipulation of Settled Issues"
                    - "Stipulation of Settlement"
                    - "Stipulation to Be Bound"
                    - "Stipulation to Take Deposition"
                    - "Substitution of Counsel"
                    - "Summary Opinion"
                    - "Supplement"
                    - "Supplement To [anything]"
                    - "Supplemental"
                    - "Supplemental [anything]"
                    - "Sur-Reply"
                    - "T.C. Opinion"
                    - "Transcript"
                    - "Trial Exhibits"
                    - "Trial before"
                    - "U.S.C.A"
                    - "Unsworn Declaration under Penalty of Perjury in Support"
                    - "Writ of Habeas Corpus Ad Testificandum"
                eventCode: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "required"
                    description: "The event code of the secondary document."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "A"
                    - "AAAP"
                    - "AAPN"
                    - "AATP"
                    - "AATS"
                    - "AATT"
                    - "ACED"
                    - "ADMR"
                    - "ADMT"
                    - "AFE"
                    - "AFF"
                    - "AFP"
                    - "AMAT"
                    - "AMDC"
                    - "APA"
                    - "APLD"
                    - "APPL"
                    - "APPW"
                    - "APW"
                    - "ASAP"
                    - "ASUP"
                    - "ATAP"
                    - "ATSP"
                    - "BND"
                    - "BRF"
                    - "CERT"
                    - "CIVP"
                    - "COED"
                    - "CS"
                    - "CTRA"
                    - "DCL"
                    - "DEC"
                    - "DISC"
                    - "DSC"
                    - "EA"
                    - "ES"
                    - "EVID"
                    - "EXH"
                    - "FEE"
                    - "FEEW"
                    - "FTRL"
                    - "HE"
                    - "HEAR"
                    - "LTR"
                    - "M000"
                    - "M001"
                    - "M002"
                    - "M003"
                    - "M004"
                    - "M005"
                    - "M006"
                    - "M007"
                    - "M008"
                    - "M009"
                    - "M010"
                    - "M011"
                    - "M012"
                    - "M013"
                    - "M014"
                    - "M015"
                    - "M016"
                    - "M017"
                    - "M018"
                    - "M019"
                    - "M020"
                    - "M021"
                    - "M022"
                    - "M023"
                    - "M024"
                    - "M026"
                    - "M027"
                    - "M028"
                    - "M029"
                    - "M030"
                    - "M031"
                    - "M032"
                    - "M033"
                    - "M034"
                    - "M035"
                    - "M036"
                    - "M037"
                    - "M038"
                    - "M039"
                    - "M040"
                    - "M041"
                    - "M042"
                    - "M043"
                    - "M044"
                    - "M045"
                    - "M046"
                    - "M047"
                    - "M048"
                    - "M049"
                    - "M050"
                    - "M051"
                    - "M052"
                    - "M053"
                    - "M054"
                    - "M055"
                    - "M056"
                    - "M057"
                    - "M058"
                    - "M059"
                    - "M060"
                    - "M061"
                    - "M062"
                    - "M063"
                    - "M064"
                    - "M065"
                    - "M066"
                    - "M067"
                    - "M068"
                    - "M069"
                    - "M070"
                    - "M071"
                    - "M072"
                    - "M073"
                    - "M074"
                    - "M075"
                    - "M076"
                    - "M077"
                    - "M078"
                    - "M079"
                    - "M080"
                    - "M081"
                    - "M082"
                    - "M083"
                    - "M084"
                    - "M085"
                    - "M086"
                    - "M087"
                    - "M088"
                    - "M089"
                    - "M090"
                    - "M091"
                    - "M092"
                    - "M093"
                    - "M094"
                    - "M095"
                    - "M096"
                    - "M097"
                    - "M098"
                    - "M099"
                    - "M100"
                    - "M101"
                    - "M102"
                    - "M103"
                    - "M104"
                    - "M105"
                    - "M106"
                    - "M107"
                    - "M108"
                    - "M109"
                    - "M110"
                    - "M111"
                    - "M112"
                    - "M113"
                    - "M114"
                    - "M115"
                    - "M116"
                    - "M117"
                    - "M118"
                    - "M119"
                    - "M120"
                    - "M121"
                    - "M122"
                    - "M123"
                    - "M124"
                    - "M125"
                    - "M126"
                    - "M129"
                    - "M130"
                    - "M131"
                    - "M132"
                    - "M133"
                    - "M134"
                    - "M135"
                    - "M136"
                    - "M218"
                    - "MEMO"
                    - "MINC"
                    - "MIND"
                    - "MISC"
                    - "MISCL"
                    - "MISP"
                    - "MOP"
                    - "NAJA"
                    - "NCA"
                    - "NCAG"
                    - "NCAP"
                    - "NCNP"
                    - "NCON"
                    - "NCP"
                    - "NCTP"
                    - "NDC"
                    - "NFAR"
                    - "NIFL"
                    - "NINF"
                    - "NIS"
                    - "NITM"
                    - "NJAR"
                    - "NNOB"
                    - "NOA"
                    - "NOB"
                    - "NODC"
                    - "NOEI"
                    - "NOEP"
                    - "NOI"
                    - "NOST"
                    - "NOT"
                    - "NOU"
                    - "NPB"
                    - "NPJR"
                    - "NRJD"
                    - "NRJR"
                    - "NSA"
                    - "NSTE"
                    - "NTA"
                    - "NTD"
                    - "NTN"
                    - "O"
                    - "OAD"
                    - "OAJ"
                    - "OAL"
                    - "OAP"
                    - "OAPF"
                    - "OAR"
                    - "OAS"
                    - "OASL"
                    - "OAW"
                    - "OAX"
                    - "OBJ"
                    - "OBJE"
                    - "OBJN"
                    - "OCA"
                    - "OD"
                    - "ODD"
                    - "ODJ"
                    - "ODL"
                    - "ODP"
                    - "ODR"
                    - "ODS"
                    - "ODSL"
                    - "ODW"
                    - "ODX"
                    - "OF"
                    - "OFAB"
                    - "OFFX"
                    - "OFWD"
                    - "OFX"
                    - "OIP"
                    - "OJR"
                    - "OODS"
                    - "OP"
                    - "OPFX"
                    - "OPPO"
                    - "OPX"
                    - "ORAP"
                    - "OROP"
                    - "OSC"
                    - "OSCP"
                    - "OST"
                    - "OSUB"
                    - "P"
                    - "PARD"
                    - "PHM"
                    - "PMT"
                    - "PSDE"
                    - "PTFR"
                    - "PTRL"
                    - "RAT"
                    - "RATF"
                    - "RCOM"
                    - "REDC"
                    - "REPL"
                    - "REQ"
                    - "REQA"
                    - "RESP"
                    - "RFPC"
                    - "RJN"
                    - "RLRI"
                    - "RM"
                    - "ROA"
                    - "RPT"
                    - "RQT"
                    - "RSP"
                    - "RTP"
                    - "RTRA"
                    - "S212"
                    - "SADM"
                    - "SAMB"
                    - "SATL"
                    - "SDEC"
                    - "SEAB"
                    - "SEOB"
                    - "SERB"
                    - "SESB"
                    - "SIAB"
                    - "SIAM"
                    - "SIMB"
                    - "SIML"
                    - "SIOB"
                    - "SIOM"
                    - "SIRB"
                    - "SISB"
                    - "SOC"
                    - "SOMB"
                    - "SOP"
                    - "SORI"
                    - "SPAR"
                    - "SPD"
                    - "SPML"
                    - "SPMT"
                    - "SPTN"
                    - "SPTO"
                    - "SRMB"
                    - "SSB"
                    - "SSRB"
                    - "SSRM"
                    - "SSTP"
                    - "STAR"
                    - "STAT"
                    - "STBB"
                    - "STIN"
                    - "STIP"
                    - "STP"
                    - "STPD"
                    - "STS"
                    - "STST"
                    - "SUPM"
                    - "SURP"
                    - "TCOP"
                    - "TE"
                    - "TRAN"
                    - "TRL"
                    - "USCA"
                    - "USDL"
                    - "WRIT"
            servedAt: 
              type: "alternatives"
              flags: 
                description: "When the document is served on the parties."
              matches: 
                - 
                  ref: 
                    path: 
                      - "servedParties"
                  is: 
                    type: "any"
                    flags: 
                      presence: "required"
                    invalid: 
                      - null
                  then: 
                    type: "date"
                    flags: 
                      format: 
                        - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                        - "YYYY-MM-DD"
                      presence: "required"
                  otherwise: 
                    type: "date"
                    flags: 
                      format: 
                        - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                        - "YYYY-MM-DD"
                      presence: "optional"
            servedParties: 
              type: "array"
              flags: 
                description: "The parties to whom the document has been served."
              whens: 
                - 
                  ref: 
                    path: 
                      - "servedAt"
                  is: 
                    type: "any"
                    flags: 
                      presence: "required"
                    invalid: 
                      - null
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
              items: 
                - 
                  type: "object"
                  keys: 
                    email: 
                      type: "string"
                      flags: 
                        presence: "optional"
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
                        - 
                          name: "email"
                          args: 
                            options: 
                              tlds: false
                        - 
                          name: "max"
                          args: 
                            limit: 100
                    name: 
                      type: "string"
                      flags: 
                        presence: "required"
                        description: "The name of a party from a contact, or \"IRS\""
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
                        - 
                          name: "max"
                          args: 
                            limit: 100
                    role: 
                      type: "string"
                      flags: 
                        only: true
                        presence: "optional"
                        description: "Currently only required for the IRS"
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
                      allow: 
                        - "adc"
                        - "admin"
                        - "admissionsclerk"
                        - "chambers"
                        - "clerkofcourt"
                        - "docketclerk"
                        - "floater"
                        - "inactivePractitioner"
                        - "irsPractitioner"
                        - "irsSuperuser"
                        - "judge"
                        - "petitioner"
                        - "petitionsclerk"
                        - "privatePractitioner"
                        - "trialclerk"
            servedPartiesCode: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
                description: "Served parties code to override system-computed code."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "B"
                - "P"
                - "R"
                - null
            serviceDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "Used by certificate of service documents to construct the document title."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
              allow: 
                - null
            serviceStamp: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            signedAt: 
              type: "string"
              flags: 
                description: "The time at which the document was signed."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              whens: 
                - 
                  ref: 
                    path: 
                      - "isDraft"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - false
                  then: 
                    type: "any"
                    whens: 
                      - 
                        ref: 
                          path: 
                            - "eventCode"
                        is: 
                          type: "any"
                          flags: 
                            only: true
                          allow: 
                            - "O"
                            - "OAJ"
                            - "OAL"
                            - "OAP"
                            - "OAPF"
                            - "OAR"
                            - "OAS"
                            - "OASL"
                            - "OAW"
                            - "OAX"
                            - "OCA"
                            - "OD"
                            - "ODD"
                            - "ODP"
                            - "ODR"
                            - "ODS"
                            - "ODSL"
                            - "ODW"
                            - "ODX"
                            - "OF"
                            - "OFAB"
                            - "OFFX"
                            - "OFWD"
                            - "OFX"
                            - "OIP"
                            - "OJR"
                            - "OODS"
                            - "OPFX"
                            - "OPX"
                            - "ORAP"
                            - "OROP"
                            - "OSC"
                            - "OSCP"
                            - "OST"
                            - "OSUB"
                            - "DEC"
                            - "OAD"
                            - "ODJ"
                            - "SDEC"
                            - "NOT"
                            - "NTD"
                        then: 
                          type: "any"
                          flags: 
                            presence: "required"
                        otherwise: 
                          type: "any"
                          flags: 
                            presence: "optional"
                          allow: 
                            - null
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            signedJudgeName: 
              type: "string"
              flags: 
                description: "The judge who signed the document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              whens: 
                - 
                  ref: 
                    path: 
                      - "isDraft"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - false
                  then: 
                    type: "any"
                    whens: 
                      - 
                        ref: 
                          path: 
                            - "eventCode"
                        is: 
                          type: "string"
                          flags: 
                            only: true
                          rules: 
                            - 
                              name: "min"
                              args: 
                                limit: 1
                          allow: 
                            - "O"
                            - "OAJ"
                            - "OAL"
                            - "OAP"
                            - "OAPF"
                            - "OAR"
                            - "OAS"
                            - "OASL"
                            - "OAW"
                            - "OAX"
                            - "OCA"
                            - "OD"
                            - "ODD"
                            - "ODP"
                            - "ODR"
                            - "ODS"
                            - "ODSL"
                            - "ODW"
                            - "ODX"
                            - "OF"
                            - "OFAB"
                            - "OFFX"
                            - "OFWD"
                            - "OFX"
                            - "OIP"
                            - "OJR"
                            - "OODS"
                            - "OPFX"
                            - "OPX"
                            - "ORAP"
                            - "OROP"
                            - "OSC"
                            - "OSCP"
                            - "OST"
                            - "OSUB"
                            - "DEC"
                            - "OAD"
                            - "ODJ"
                            - "SDEC"
                        then: 
                          type: "any"
                          flags: 
                            presence: "required"
                        otherwise: 
                          type: "any"
                          flags: 
                            presence: "optional"
                          allow: 
                            - null
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            signedByUserId: 
              type: "any"
              flags: 
                description: "The id of the user who applied the signature."
              whens: 
                - 
                  ref: 
                    path: 
                      - "signedJudgeName"
                  is: 
                    type: "any"
                    flags: 
                      presence: "required"
                    invalid: 
                      - null
                  then: 
                    type: "string"
                    flags: 
                      presence: "required"
                    rules: 
                      - 
                        name: "min"
                        args: 
                          limit: 1
                      - 
                        name: "guid"
                        args: 
                          options: 
                            version: 
                              - "uuidv4"
                  otherwise: 
                    type: "string"
                    flags: 
                      presence: "optional"
                    rules: 
                      - 
                        name: "min"
                        args: 
                          limit: 1
                      - 
                        name: "guid"
                        args: 
                          options: 
                            version: 
                              - "uuidv4"
                    allow: 
                      - null
            strickenAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "Date that this Docket Record item was stricken."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            strickenBy: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            strickenByUserId: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            supportingDocument: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              allow: 
                - null
            trialLocation: 
              type: "string"
              flags: 
                presence: "optional"
                description: "An optional trial location used when generating a fully concatenated document title."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              allow: 
                - null
            userId: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            workItem: 
              type: "object"
              flags: 
                presence: "optional"
              keys: 
                assigneeId: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "guid"
                      args: 
                        options: 
                          version: 
                            - "uuidv4"
                  allow: 
                    - null
                assigneeName: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 100
                  allow: 
                    - null
                associatedJudge: 
                  type: "string"
                  flags: 
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 100
                caseIsInProgress: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                caseStatus: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "Assigned - Case"
                    - "Assigned - Motion"
                    - "Calendared"
                    - "CAV"
                    - "Closed"
                    - "General Docket - Not at Issue"
                    - "General Docket - At Issue (Ready for Trial)"
                    - "Jurisdiction Retained"
                    - "New"
                    - "On Appeal"
                    - "Rule 155"
                    - "Submitted"
                caseTitle: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 500
                completedAt: 
                  type: "date"
                  flags: 
                    format: 
                      - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      - "YYYY-MM-DD"
                    presence: "optional"
                completedBy: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 100
                  allow: 
                    - null
                completedByUserId: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "guid"
                      args: 
                        options: 
                          version: 
                            - "uuidv4"
                  allow: 
                    - null
                completedMessage: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 100
                  allow: 
                    - null
                createdAt: 
                  type: "date"
                  flags: 
                    format: 
                      - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      - "YYYY-MM-DD"
                    presence: "optional"
                docketNumber: 
                  type: "string"
                  flags: 
                    presence: "required"
                    description: "Unique case identifier in XXXXX-YY format."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "pattern"
                      args: 
                        regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
                docketNumberWithSuffix: 
                  type: "string"
                  flags: 
                    presence: "optional"
                    description: "Auto-generated from docket number and the suffix."
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                document: 
                  type: "object"
                  flags: 
                    presence: "required"
                entityName: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "WorkItem"
                hideFromPendingMessages: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                highPriority: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                inProgress: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                isInitializeCase: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                isRead: 
                  type: "boolean"
                  flags: 
                    presence: "optional"
                section: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "adc"
                    - "admissions"
                    - "chambers"
                    - "clerkofcourt"
                    - "docket"
                    - "petitions"
                    - "trialClerks"
                    - "armensChambers"
                    - "ashfordsChambers"
                    - "buchsChambers"
                    - "carluzzosChambers"
                    - "cohensChambers"
                    - "colvinsChambers"
                    - "copelandsChambers"
                    - "foleysChambers"
                    - "galesChambers"
                    - "gerbersChambers"
                    - "goekesChambers"
                    - "gustafsonsChambers"
                    - "guysChambers"
                    - "halpernsChambers"
                    - "holmesChambers"
                    - "jacobsChambers"
                    - "jonesChambers"
                    - "kerrigansChambers"
                    - "laubersChambers"
                    - "leydensChambers"
                    - "marvelsChambers"
                    - "morrisonsChambers"
                    - "negasChambers"
                    - "panuthosChambers"
                    - "parisChambers"
                    - "pughsChambers"
                    - "ruwesChambers"
                    - "thorntonsChambers"
                    - "torosChambers"
                    - "urdasChambers"
                    - "vasquezsChambers"
                    - "wellsChambers"
                    - "admin"
                    - "admissionsclerk"
                    - "docketclerk"
                    - "floater"
                    - "inactivePractitioner"
                    - "irsPractitioner"
                    - "irsSuperuser"
                    - "judge"
                    - "petitioner"
                    - "petitionsclerk"
                    - "privatePractitioner"
                    - "trialclerk"
                    - "irsSystem"
                sentBy: 
                  type: "string"
                  flags: 
                    presence: "required"
                    description: "The name of the user that sent the WorkItem"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "max"
                      args: 
                        limit: 100
                sentBySection: 
                  type: "string"
                  flags: 
                    only: true
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                  allow: 
                    - "adc"
                    - "admissions"
                    - "chambers"
                    - "clerkofcourt"
                    - "docket"
                    - "petitions"
                    - "trialClerks"
                    - "armensChambers"
                    - "ashfordsChambers"
                    - "buchsChambers"
                    - "carluzzosChambers"
                    - "cohensChambers"
                    - "colvinsChambers"
                    - "copelandsChambers"
                    - "foleysChambers"
                    - "galesChambers"
                    - "gerbersChambers"
                    - "goekesChambers"
                    - "gustafsonsChambers"
                    - "guysChambers"
                    - "halpernsChambers"
                    - "holmesChambers"
                    - "jacobsChambers"
                    - "jonesChambers"
                    - "kerrigansChambers"
                    - "laubersChambers"
                    - "leydensChambers"
                    - "marvelsChambers"
                    - "morrisonsChambers"
                    - "negasChambers"
                    - "panuthosChambers"
                    - "parisChambers"
                    - "pughsChambers"
                    - "ruwesChambers"
                    - "thorntonsChambers"
                    - "torosChambers"
                    - "urdasChambers"
                    - "vasquezsChambers"
                    - "wellsChambers"
                    - "admin"
                    - "admissionsclerk"
                    - "docketclerk"
                    - "floater"
                    - "inactivePractitioner"
                    - "irsPractitioner"
                    - "irsSuperuser"
                    - "judge"
                    - "petitioner"
                    - "petitionsclerk"
                    - "privatePractitioner"
                    - "trialclerk"
                sentByUserId: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "guid"
                      args: 
                        options: 
                          version: 
                            - "uuidv4"
                trialDate: 
                  type: "date"
                  flags: 
                    format: 
                      - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      - "YYYY-MM-DD"
                    presence: "optional"
                  allow: 
                    - null
                updatedAt: 
                  type: "date"
                  flags: 
                    format: 
                      - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      - "YYYY-MM-DD"
                    presence: "required"
                workItemId: 
                  type: "string"
                  flags: 
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                    - 
                      name: "guid"
                      args: 
                        options: 
                          version: 
                            - "uuidv4"
    caseCaption: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 4700
    caseType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "CDP (Lien/Levy)"
        - "Deficiency"
        - "Declaratory Judgment (Exempt Organization)"
        - "Declaratory Judgment (Retirement Plan)"
        - "Disclosure"
        - "Innocent Spouse"
        - "Interest Abatement"
        - "Other"
        - "Partnership (BBA Section 1101)"
        - "Partnership (Section 6226)"
        - "Partnership (Section 6228)"
        - "Passport"
        - "Whistleblower"
        - "Worker Classification"
    contactPrimary: 
      type: "object"
      flags: 
        presence: "required"
    contactSecondary: 
      type: "object"
      flags: 
        presence: "optional"
      allow: 
        - null
    filingType: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Myself"
        - "Myself and my spouse"
        - "A business"
        - "Other"
        - "Individual petitioner"
        - "Petitioner and spouse"
    hasVerifiedIrsNotice: 
      type: "boolean"
      flags: 
        presence: "required"
    irsNoticeDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "Last date that the petitioner is allowed to file before."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      allow: 
        - null
    mailingDate: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 25
    noticeOfAttachments: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the notice of attachments."
    orderDesignatingPlaceOfTrial: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order Designating Place of Trial."
    orderForAmendedPetition: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for amended Petition."
    orderForAmendedPetitionAndFilingFee: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for amended Petition And filing fee."
    orderForFilingFee: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for filing fee."
    orderForOds: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for ODS."
    orderForRatification: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order for Ratification."
    orderToShowCause: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order to Show Cause."
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Conservator"
        - "Corporation"
        - "Custodian"
        - "Donor"
        - "Estate with an executor/personal representative/fiduciary/etc."
        - "Estate without an executor/personal representative/fiduciary/etc."
        - "Guardian"
        - "Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)"
        - "Next friend for a minor (without a guardian, conservator, or other like fiduciary)"
        - "Partnership (as the Tax Matters Partner)"
        - "Partnership (as a partnership representative under the BBA regime)"
        - "Partnership (as a partner other than Tax Matters Partner)"
        - "Petitioner"
        - "Petitioner & deceased spouse"
        - "Petitioner & spouse"
        - "Surviving spouse"
        - "Transferee"
        - "Trust"
    ownershipDisclosureFile: 
      type: "object"
      whens: 
        - 
          ref: 
            path: 
              - "partyType"
          is: 
            type: "any"
            flags: 
              presence: "required"
              only: true
            allow: 
              - "Corporation"
              - "Partnership (as the Tax Matters Partner)"
              - "Partnership (as a partnership representative under the BBA regime)"
              - "Partnership (as a partner other than Tax Matters Partner)"
          then: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "orderForOds"
                is: 
                  type: "any"
                  invalid: 
                    - true
                then: 
                  type: "any"
                  flags: 
                    presence: "required"
                otherwise: 
                  type: "any"
                  flags: 
                    presence: "optional"
                  allow: 
                    - null
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    ownershipDisclosureFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "ownershipDisclosureFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionFile: 
      type: "object"
      flags: 
        presence: "required"
    petitionFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "petitionFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Status of the case fee payment."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Paid"
        - "Not Paid"
        - "Waived"
    applicationForWaiverOfFilingFeeFile: 
      type: "object"
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Waived"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    applicationForWaiverOfFilingFeeFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "applicationForWaiverOfFilingFeeFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Paid"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentMethod: 
      type: "string"
      flags: 
        description: "How the petitioner paid the case fee."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 50
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Paid"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentWaivedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        description: "When the case fee was waived."
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Waived"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    preferredTrialCity: 
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "requestForPlaceOfTrialFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    procedureType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Regular"
        - "Small"
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
    requestForPlaceOfTrialFile: 
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "preferredTrialCity"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "object"
            flags: 
              presence: "required"
          otherwise: 
            type: "object"
            flags: 
              presence: "optional"
    requestForPlaceOfTrialFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "requestForPlaceOfTrialFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    statistics: 
      type: "array"
      flags: 
        description: "List of Statistic Entities for the case."
      whens: 
        - 
          ref: 
            path: 
              - "hasVerifiedIrsNotice"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "caseType"
                is: 
                  type: "any"
                  flags: 
                    only: true
                    presence: "required"
                  allow: 
                    - 
                      override: true
                    - "Deficiency"
                then: 
                  type: "array"
                  flags: 
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                otherwise: 
                  type: "any"
                  flags: 
                    presence: "optional"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
      items: 
        - 
          type: "object"
          keys: 
            determinationDeficiencyAmount: 
              type: "alternatives"
              flags: 
                description: "The amount of the deficiency determined by the Court."
              matches: 
                - 
                  ref: 
                    path: 
                      - "determinationTotalPenalties"
                  is: 
                    type: "any"
                    flags: 
                      presence: "required"
                    invalid: 
                      - null
                  then: 
                    type: "number"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "number"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            determinationTotalPenalties: 
              type: "alternatives"
              flags: 
                description: "The total amount of penalties for the period or year determined by the Court."
              matches: 
                - 
                  ref: 
                    path: 
                      - "determinationDeficiencyAmount"
                  is: 
                    type: "any"
                    flags: 
                      presence: "required"
                    invalid: 
                      - null
                  then: 
                    type: "number"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "number"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            entityName: 
              type: "string"
              flags: 
                only: true
                presence: "required"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Statistic"
            irsDeficiencyAmount: 
              type: "number"
              flags: 
                presence: "required"
                description: "The amount of the deficiency on the IRS notice."
            irsTotalPenalties: 
              type: "number"
              flags: 
                presence: "required"
                description: "The total amount of penalties for the period or year on the IRS notice."
            statisticId: 
              type: "string"
              flags: 
                presence: "required"
                description: "Unique statistic ID only used by the system."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            yearOrPeriod: 
              type: "string"
              flags: 
                presence: "required"
                only: true
                description: "Whether the statistics are for a year or period."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Year"
                - "Period"
            lastDateOfPeriod: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                description: "Last date of the statistics period."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
              whens: 
                - 
                  ref: 
                    path: 
                      - "yearOrPeriod"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - "Period"
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            year: 
              type: "number"
              flags: 
                description: "The year of the statistics period."
              rules: 
                - 
                  name: "integer"
                - 
                  name: "min"
                  args: 
                    limit: 1900
                - 
                  name: "max"
                  args: 
                    limit: 2020
              whens: 
                - 
                  ref: 
                    path: 
                      - "yearOrPeriod"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - "Year"
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
    stinFile: 
      type: "object"
      flags: 
        presence: "optional"
    stinFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "stinFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    useSameAsPrimary: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process)."

 ```
