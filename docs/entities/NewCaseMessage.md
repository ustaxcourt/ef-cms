# NewCaseMessage
 ```
---
  type: "object"
  keys: 
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "NewCaseMessage"
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
