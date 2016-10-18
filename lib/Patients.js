
/**
 * @summary Represents a Patient; typically documented by a clinician.  A Clinical Impression can be self-assigned, in which case it may be considered a Status or ReportedCondition.
 * @class Patient
 * @param {Object} document An object representing an impression, ususally a Mongo document.
 * @example
newPatient = new Patient({
  name: {
    given: "Jane",
    family: "Doe"
  },
  gender: "female",
  identifier: "12345"
});


newPatient.clean();
newPatient.validate();
newPatient.save();
 */


// create the object using our BaseModel
Patient = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Patient.prototype._collection = Patients;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
Patients = new Mongo.Collection('Patients');
Patients.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Patients._transform = function (document) {
  return new Patient(document);
};


if (Meteor.isClient){
  Meteor.subscribe("Patients");
}

if (Meteor.isServer){
  Meteor.publish("Patients", function (argument){
    return Patients.find();
  });
}


PatientSchema = new SimpleSchema([
  BaseSchema,
  DomainResourceSchema,
  {
  "resourceType" : {
    type: String,
    defaultValue: "Patient"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
    },
  "active" : {
    type: Boolean,
    defaultValue: true
    },
  "name" : {
    type: [ HumanNameSchema ]
    },
  "telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
    },
  "gender" : {
    optional: true,
    type: String
    },
  "birthDate" : {
    optional: true,
    type: Date
    },
  "deceasedBoolean" : {
    optional: true,
    type: Boolean
    },
  "deceasedDateTime" : {
    optional: true,
    type: Date
    },
  "address" : {
    optional: true,
    type: [ String ]
    },
  "maritalStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "multipleBirthBoolean" : {
    optional: true,
    type: Boolean
    },
  "multipleBirthInteger" : {
    optional: true,
    type: Number
    },
  "photo" : {
    optional: true,
    type: [ AttachmentSchema ]
    },
  "contact.$.relationship" : {
    optional: true,
    type: [ String ]
    },
  "contact.$.name" : {
    optional: true,
    type: HumanNameSchema
    },
  "contact.$.telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
    },
  "contact.$.address" : {
    optional: true,
    type: AddressSchema
    },
  "contact.$.gender" : {
    optional: true,
    type: String
    },
  "contact.$.organization" : {
    optional: true,
    type: String
    },
  "contact.$.period" : {
    optional: true,
    type: PeriodSchema
    },
  "animal.species" : {
    optional: true,
    type: String
    //type: CodeableConceptSchema
    },
  "animal.breed" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "animal.genderStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "communication.$.language" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "communication.$.preferred" : {
    optional: true,
    type: Boolean
    },
  "careProvider" : {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "managingOrganization" : {
    optional: true,
    type: String
    },
  "link.$.other" : {
    optional: true,
    type: String
    },
  "link.$.type" : {
    optional: true,
    type: String
    }
  }
]);
Patients.attachSchema(PatientSchema);




/**
 * @summary The displayed name of the patient.
 * @memberOf Patient
 * @name displayName
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Patient.prototype.displayName = function () {
  if (this.name && this.name[0]) {
    return this.name[0].text;
  }
};


/**
 * @summary The displayed Meteor.userId() of the patient.
 * @memberOf Patient
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Patient.prototype.userId = function () {
  var result = null;
  if (this.extension) {
    this.extension.forEach(function(extension){
      if (extension.url === "Meteor.userId()") {
        result = extension.valueString;
      }
    });
  }
  return result;
};
