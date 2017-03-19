##  clinical:hl7-resource-patient   

HL7 FHIR Resource - Patient

--------------------------------------------  
#### Conformance Statement  

The resource in this package implements the FHIR Patient Resource schema provided at  [https://www.hl7.org/fhir/patient.html](https://www.hl7.org/fhir/patient.html).  

--------------------------------------------  
#### Installation  

```bash
meteor add clinical:hl7-resource-patient
```


--------------------------------------------  
#### Example    

```js
var newPatient = {
  'name' : [
    {
      'text' : 'Jane Doe',
      'given' : 'Jane',
      'family' : 'Doe',
      'resourceType' : 'HumanName'
    }
  ],
  'active' : true,
  'gender' : 'female',
  'identifier' : [{
      'use' : 'usual',
      'type' : {
        text: 'Medical record number',
        'coding' : [
          {
            'system' : 'http://hl7.org/fhir/v2/0203',
            'code' : 'MR'
          }
        ]
      },
      'system' : 'urn:oid:1.2.36.146.595.217.0.1',
      'value' : '123',
      'period' : {}
   }],
  'birthdate' : new Date(1970, 1, 25),
  'resourceType' : 'Patient'
};
Patients.insert(newPatient);
```

--------------------------------------------  
#### Extending the Schema  

```js
ExtendedPatientSchema = new SimpleSchema([
  PatientSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Patients.attachSchema( ExtendedPatientSchema );
```


--------------------------------------------  
#### Licensing   

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
