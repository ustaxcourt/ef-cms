# CaseMessage
 ```
---
  type: "object"
  keys: 
    attachments: 
      type: "array"
      flags: 
        presence: "optional"
        description: "Array of document metadata objects attached to the message."
      items: 
        - 
          type: "object"
          keys: 
            documentId: 
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
            documentTitle: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "max"
                  args: 
                    limit: 500
    caseId: 
      type: "string"
      flags: 
        presence: "required"
        description: "ID of the case the message is attached to."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The status of the associated case."
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
        presence: "required"
        description: "The case title for the associated cases."
    completedMessage: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The message entered when completing the message thread."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      allow: 
        - null
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the message was created."
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "required"
        description: "The docket number and suffix for the associated case."
      rules: 
        - 
          name: "max"
          args: 
            limit: 20
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "CaseMessage"
    from: 
      type: "string"
      flags: 
        presence: "required"
        description: "The name of the user who sent the message."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    fromSection: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The section of the user who sent the message."
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
    fromUserId: 
      type: "string"
      flags: 
        presence: "required"
        description: "The ID of the user who sent the message."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    isCompleted: 
      type: "boolean"
      flags: 
        presence: "required"
        description: "Whether the message thread has been completed."
    completedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        description: "When the message was marked as completed."
      whens: 
        - 
          ref: 
            path: 
              - "isCompleted"
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
    completedBy: 
      type: "string"
      flags: 
        description: "The name of the user who completed the message thread"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      whens: 
        - 
          ref: 
            path: 
              - "isCompleted"
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
    completedBySection: 
      type: "string"
      flags: 
        only: true
        description: "The section of the user who completed the message thread"
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
      whens: 
        - 
          ref: 
            path: 
              - "isCompleted"
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
    completedByUserId: 
      type: "string"
      flags: 
        description: "The ID of the user who completed the message thread"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      whens: 
        - 
          ref: 
            path: 
              - "isCompleted"
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
    isRepliedTo: 
      type: "boolean"
      flags: 
        presence: "required"
        description: "Whether the message has been replied to or forwarded."
    message: 
      type: "string"
      flags: 
        presence: "required"
        description: "The message text."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    messageId: 
      type: "string"
      flags: 
        presence: "required"
        description: "A unique ID generated by the system to represent the message."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    parentMessageId: 
      type: "string"
      flags: 
        presence: "required"
        description: "The ID of the initial message in the thread."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    subject: 
      type: "string"
      flags: 
        presence: "required"
        description: "The subject line of the message."
      rules: 
        - 
          name: "max"
          args: 
            limit: 250
    to: 
      type: "string"
      flags: 
        presence: "required"
        description: "The name of the user who is the recipient of the message."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    toSection: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The section of the user who is the recipient of the message."
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
    toUserId: 
      type: "string"
      flags: 
        presence: "required"
        description: "The ID of the user who is the recipient of the message."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      allow: 
        - null

 ```
