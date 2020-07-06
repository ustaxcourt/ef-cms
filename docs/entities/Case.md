# Case
 ```
---
  type: "object"
  keys: 
    associatedJudge: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Judge assigned to this case. Defaults to Chief Judge."
      rules: 
        - 
          name: "max"
          args: 
            limit: 50
      metas: 
        - 
          tags: 
            - "Restricted"
    automaticBlocked: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Temporarily blocked from trial due to a pending item or due date."
    automaticBlockedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      whens: 
        - 
          ref: 
            path: 
              - "automaticBlocked"
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
    automaticBlockedReason: 
      type: "string"
      flags: 
        only: true
        description: "The reason the case was automatically blocked from trial."
      allow: 
        - "Due Date"
        - "Pending Item"
        - "Pending Item and Due Date"
      whens: 
        - 
          ref: 
            path: 
              - "automaticBlocked"
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
    blocked: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Temporarily blocked from trial."
      metas: 
        - 
          tags: 
            - "Restricted"
    blockedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      metas: 
        - 
          tags: 
            - "Restricted"
      whens: 
        - 
          ref: 
            path: 
              - "blocked"
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
    blockedReason: 
      type: "string"
      flags: 
        description: "Open text field for describing reason for blocking this case from trial."
      rules: 
        - 
          name: "max"
          args: 
            limit: 250
      metas: 
        - 
          tags: 
            - "Restricted"
      whens: 
        - 
          ref: 
            path: 
              - "blocked"
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
    caseCaption: 
      type: "string"
      flags: 
        presence: "required"
        description: "The name of the party bringing the case, e.g. \"Carol Williams, Petitioner,\" \"Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner,\" or \"Estate of Test Taxpayer, Deceased, Petitioner.\" This is the first half of the case title."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    caseId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case ID only used by the system."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseNote: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      metas: 
        - 
          tags: 
            - "Restricted"
    caseType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "CDP (Lien/Levy)"
        - "Deficiency"
        - "Declaratory Judgment (Exempt Organization)"
        - "Declaratory Judgment (Retirement Plan)"
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
    correspondence: 
      type: "array"
      flags: 
        description: "List of Correspondence documents for the case."
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "Correspondence"
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the paper or electronic case was added to the system. This value cannot be edited."
    damages: 
      type: "number"
      flags: 
        presence: "optional"
        description: "Damages for the case."
      allow: 
        - null
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - null
        - "W"
        - "P"
        - "X"
        - "R"
        - "SL"
        - "L"
        - "S"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Auto-generated from docket number and the suffix."
    docketRecord: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of DocketRecord Entities for the case."
      rules: 
        - 
          name: "unique"
          args: 
            comparator: [object Function]
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "DocketRecord"
    documents: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of Document Entities for the case."
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "Document"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Case"
    filingType: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
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
        presence: "optional"
        description: "Whether the petitioner received an IRS notice, verified by the petitions clerk."
      allow: 
        - null
    highPriority: 
      type: "boolean"
      flags: 
        presence: "optional"
      metas: 
        - 
          tags: 
            - "Restricted"
    highPriorityReason: 
      type: "string"
      rules: 
        - 
          name: "max"
          args: 
            limit: 250
      metas: 
        - 
          tags: 
            - "Restricted"
      whens: 
        - 
          ref: 
            path: 
              - "highPriority"
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
    initialCaption: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Case caption before modification."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      allow: 
        - null
    initialDocketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
        description: "Case docket number suffix before modification."
      allow: 
        - "W"
        - "P"
        - "X"
        - "R"
        - "SL"
        - "L"
        - "S"
        - "_"
        - null
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
    irsPractitioners: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of IRS practitioners (also known as respondents) associated with the case."
    isPaper: 
      type: "boolean"
      flags: 
        presence: "optional"
    isSealed: 
      type: "boolean"
      flags: 
        presence: "optional"
    leadCaseId: 
      type: "string"
      flags: 
        presence: "optional"
        description: "If this case is consolidated, this is the ID of the lead case. It is the lowest docket number in the consolidated group."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    litigationCosts: 
      type: "number"
      flags: 
        presence: "optional"
        description: "Litigation costs for the case."
      allow: 
        - null
    mailingDate: 
      type: "string"
      flags: 
        description: "Date that petition was mailed to the court."
      rules: 
        - 
          name: "max"
          args: 
            limit: 25
      whens: 
        - 
          ref: 
            path: 
              - "isPaper"
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
    noticeOfAttachments: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the notice of attachments."
    noticeOfTrialDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "Reminder for clerks to review the notice of trial date."
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
    otherFilers: 
      type: "array"
      flags: 
        description: "List of OtherFilerContact Entities for the case."
        presence: "optional"
      rules: 
        - 
          name: "unique"
          args: 
            comparator: [object Function]
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "OtherFilerContact"
    otherPetitioners: 
      type: "array"
      flags: 
        description: "List of OtherPetitionerContact Entities for the case."
        presence: "optional"
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "OtherPetitionerContact"
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Party type of the case petitioner."
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
    petitionPaymentStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Status of the case fee payment."
      allow: 
        - "Paid"
        - "Not Paid"
        - "Waived"
    petitionPaymentDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        description: "When the petitioner paid the case fee."
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
      flags: 
        presence: "optional"
        description: "Where the petitioner would prefer to hold the case trial."
      matches: 
        - 
          schema: 
            type: "string"
            flags: 
              only: true
            allow: 
              - "Fresno, California"
              - "Tallahassee, Florida"
              - "Pocatello, Idaho"
              - "Peoria, Illinois"
              - "Wichita, Kansas"
              - "Shreveport, Louisiana"
              - "Portland, Maine"
              - "Billings, Montana"
              - "Albany, New York"
              - "Syracuse, New York"
              - "Bismarck, North Dakota"
              - "Aberdeen, South Dakota"
              - "Burlington, Vermont"
              - "Roanoke, Virginia"
              - "Cheyenne, Wyoming"
              - "Birmingham, Alabama"
              - "Mobile, Alabama"
              - "Anchorage, Alaska"
              - "Phoenix, Arizona"
              - "Little Rock, Arkansas"
              - "Los Angeles, California"
              - "San Diego, California"
              - "San Francisco, California"
              - "Denver, Colorado"
              - "Hartford, Connecticut"
              - "Washington, District of Columbia"
              - "Jacksonville, Florida"
              - "Miami, Florida"
              - "Tampa, Florida"
              - "Atlanta, Georgia"
              - "Honolulu, Hawaii"
              - "Boise, Idaho"
              - "Chicago, Illinois"
              - "Indianapolis, Indiana"
              - "Des Moines, Iowa"
              - "Louisville, Kentucky"
              - "New Orleans, Louisiana"
              - "Baltimore, Maryland"
              - "Boston, Massachusetts"
              - "Detroit, Michigan"
              - "St. Paul, Minnesota"
              - "Jackson, Mississippi"
              - "Kansas City, Missouri"
              - "St. Louis, Missouri"
              - "Helena, Montana"
              - "Omaha, Nebraska"
              - "Las Vegas, Nevada"
              - "Reno, Nevada"
              - "Albuquerque, New Mexico"
              - "Buffalo, New York"
              - "New York City, New York"
              - "Winston-Salem, North Carolina"
              - "Cincinnati, Ohio"
              - "Cleveland, Ohio"
              - "Columbus, Ohio"
              - "Oklahoma City, Oklahoma"
              - "Portland, Oregon"
              - "Philadelphia, Pennsylvania"
              - "Pittsburgh, Pennsylvania"
              - "Columbia, South Carolina"
              - "Knoxville, Tennessee"
              - "Memphis, Tennessee"
              - "Nashville, Tennessee"
              - "Dallas, Texas"
              - "El Paso, Texas"
              - "Houston, Texas"
              - "Lubbock, Texas"
              - "San Antonio, Texas"
              - "Salt Lake City, Utah"
              - "Richmond, Virginia"
              - "Seattle, Washington"
              - "Spokane, Washington"
              - "Charleston, West Virginia"
              - "Milwaukee, Wisconsin"
              - null
        - 
          schema: 
            type: "string"
            rules: 
              - 
                name: "pattern"
                args: 
                  regex: "/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/"
    privatePractitioners: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of private practitioners associated with the case."
    procedureType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Procedure type of the case."
      allow: 
        - "Regular"
        - "Small"
    qcCompleteForTrial: 
      type: "object"
      flags: 
        presence: "optional"
        description: "QC Checklist object that must be completed before the case can go to trial."
      metas: 
        - 
          tags: 
            - "Restricted"
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited."
    sealedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "When the case was sealed from the public."
      allow: 
        - null
    sortableDocketNumber: 
      type: "number"
      flags: 
        presence: "required"
        description: "A sortable representation of the docket number (auto-generated by constructor)."
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
          metas: 
            - 
              entityName: "Statistic"
    status: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
        description: "Status of the case."
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
      metas: 
        - 
          tags: 
            - "Restricted"
    closedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      whens: 
        - 
          ref: 
            path: 
              - "status"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Closed"
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
    trialDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "When this case goes to trial."
      allow: 
        - null
    trialLocation: 
      type: "alternatives"
      flags: 
        presence: "optional"
        description: "Where this case goes to trial. This may be different that the preferred trial location."
      matches: 
        - 
          schema: 
            type: "string"
            flags: 
              only: true
            allow: 
              - "Fresno, California"
              - "Tallahassee, Florida"
              - "Pocatello, Idaho"
              - "Peoria, Illinois"
              - "Wichita, Kansas"
              - "Shreveport, Louisiana"
              - "Portland, Maine"
              - "Billings, Montana"
              - "Albany, New York"
              - "Syracuse, New York"
              - "Bismarck, North Dakota"
              - "Aberdeen, South Dakota"
              - "Burlington, Vermont"
              - "Roanoke, Virginia"
              - "Cheyenne, Wyoming"
              - "Birmingham, Alabama"
              - "Mobile, Alabama"
              - "Anchorage, Alaska"
              - "Phoenix, Arizona"
              - "Little Rock, Arkansas"
              - "Los Angeles, California"
              - "San Diego, California"
              - "San Francisco, California"
              - "Denver, Colorado"
              - "Hartford, Connecticut"
              - "Washington, District of Columbia"
              - "Jacksonville, Florida"
              - "Miami, Florida"
              - "Tampa, Florida"
              - "Atlanta, Georgia"
              - "Honolulu, Hawaii"
              - "Boise, Idaho"
              - "Chicago, Illinois"
              - "Indianapolis, Indiana"
              - "Des Moines, Iowa"
              - "Louisville, Kentucky"
              - "New Orleans, Louisiana"
              - "Baltimore, Maryland"
              - "Boston, Massachusetts"
              - "Detroit, Michigan"
              - "St. Paul, Minnesota"
              - "Jackson, Mississippi"
              - "Kansas City, Missouri"
              - "St. Louis, Missouri"
              - "Helena, Montana"
              - "Omaha, Nebraska"
              - "Las Vegas, Nevada"
              - "Reno, Nevada"
              - "Albuquerque, New Mexico"
              - "Buffalo, New York"
              - "New York City, New York"
              - "Winston-Salem, North Carolina"
              - "Cincinnati, Ohio"
              - "Cleveland, Ohio"
              - "Columbus, Ohio"
              - "Oklahoma City, Oklahoma"
              - "Portland, Oregon"
              - "Philadelphia, Pennsylvania"
              - "Pittsburgh, Pennsylvania"
              - "Columbia, South Carolina"
              - "Knoxville, Tennessee"
              - "Memphis, Tennessee"
              - "Nashville, Tennessee"
              - "Dallas, Texas"
              - "El Paso, Texas"
              - "Houston, Texas"
              - "Lubbock, Texas"
              - "San Antonio, Texas"
              - "Salt Lake City, Utah"
              - "Richmond, Virginia"
              - "Seattle, Washington"
              - "Spokane, Washington"
              - "Charleston, West Virginia"
              - "Milwaukee, Wisconsin"
              - null
        - 
          schema: 
            type: "string"
            rules: 
              - 
                name: "pattern"
                args: 
                  regex: "/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/"
    trialSessionId: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The unique ID of the trial session associated with this case."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    trialTime: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Time of day when this case goes to trial."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/"
    useSameAsPrimary: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process)."
    userId: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The unique ID of the User who added the case to the system."
      rules: 
        - 
          name: "max"
          args: 
            limit: 50
      metas: 
        - 
          tags: 
            - "Restricted"
    workItems: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of system messages associated with this case."
      metas: 
        - 
          tags: 
            - "Restricted"

 ```
