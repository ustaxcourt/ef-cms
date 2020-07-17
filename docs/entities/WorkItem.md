# WorkItem
 ```
---
  type: "object"
  keys: 
    assigneeId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
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
          name: "max"
          args: 
            limit: 100
    caseId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseIsInProgress: 
      type: "boolean"
      flags: 
        presence: "optional"
    caseStatus: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
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
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "W"
        - "P"
        - "X"
        - "R"
        - "SL"
        - "L"
        - "S"
        - null
    document: 
      type: "object"
      flags: 
        presence: "required"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
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
    isQC: 
      type: "boolean"
      flags: 
        presence: "required"
    isRead: 
      type: "boolean"
      flags: 
        presence: "optional"
    messages: 
      type: "array"
      flags: 
        presence: "required"
      items: 
        - 
          type: "object"
          rules: 
            - 
              name: "instance"
              args: 
                constructor: [object Function]
                name: "Message"
    section: 
      type: "string"
      flags: 
        only: true
        presence: "required"
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
          name: "max"
          args: 
            limit: 100
    sentBySection: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
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
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"

 ```
