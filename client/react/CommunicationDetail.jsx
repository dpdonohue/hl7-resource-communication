import { CardActions, CardText } from 'material-ui/Card';
import { get, has, set } from 'lodash';
// import { insertCommunication, removeCommunicationById, updateCommunication } from '/imports/ui/workflows/communications/methods';
// import { insertCommunication, removeCommunicationById, updateCommunication } from 'meteor/dpdonohue:hl7-resource-communication';
import { insertCommunication, removeCommunicationById, updateCommunication } from 'meteor/dpdonohue:hl7-resource-communication';


import { Bert } from 'meteor/themeteorchef:bert';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';

let defaultCommunication = {
  "resourceType" : "Communication",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : null,
  "photo" : [{
    url: ""
  }],
  identifier: [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};


Session.setDefault('communicationUpsert', false);
Session.setDefault('selectedCommunication', false);

export default class CommunicationDetail extends React.Component {
  getMeteorData() {
    let data = {
      communicationId: false,
      communication: defaultCommunication
    };

    if (Session.get('communicationUpsert')) {
      data.communication = Session.get('communicationUpsert');
    } else {
      if (Session.get('selectedCommunication')) {
        data.communicationId = Session.get('selectedCommunication');
        console.log("selectedCommunication", Session.get('selectedCommunication'));

        let selectedCommunication = Communications.findOne({_id: Session.get('selectedCommunication')});
        console.log("selectedCommunication", selectedCommunication);

        if (selectedCommunication) {
          data.communication = selectedCommunication;

          if (typeof selectedCommunication.birthDate === "object") {
            data.communication.birthDate = moment(selectedCommunication.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.communication = defaultCommunication;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="communicationDetail">
        <CardText>
          <TextField
            id='nameInput'
            ref='name'
            name='name'
            floatingLabelText='name'
            value={this.data.communication.name[0] ? this.data.communication.name[0].text : ''}
            onChange={ this.changeState.bind(this, 'name')}
            fullWidth
            /><br/>
          <TextField
            id='genderInput'
            ref='gender'
            name='gender'
            floatingLabelText='gender'
            value={this.data.communication.gender}
            onChange={ this.changeState.bind(this, 'gender')}
            fullWidth
            /><br/>
          <TextField
            id='birthdateInput'
            ref='birthdate'
            name='birthdate'
            floatingLabelText='birthdate'
            value={this.data.communication.birthDate ? this.data.communication.birthDate : ''}
            onChange={ this.changeState.bind(this, 'birthDate')}
            fullWidth
            /><br/>
          <TextField
            id='photoInput'
            ref='photo'
            name='photo'
            floatingLabelText='photo'
            value={ (this.data.communication.photo && this.data.communication.photo[0]) ? this.data.communication.photo[0].url : ''}
            onChange={ this.changeState.bind(this, 'photo')}
            floatingLabelFixed={false}
            fullWidth
            /><br/>
          <TextField
            id='mrnInput'
            ref='mrn'
            name='mrn'
            floatingLabelText='medical record number'
            value={this.data.communication.identifier ? this.data.communication.identifier[0].value : ''}
            onChange={ this.changeState.bind(this, 'mrn')}
            fullWidth
            /><br/>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.communicationId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(communicationId){
    if (communicationId) {
      return (
        <div>
          <RaisedButton id='saveCommunicationButton' className='saveCommunicationButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveCommunicationButton'  className='saveCommunicationButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let communicationUpdate;

    if(process.env.NODE_ENV === "test") console.log("communicationDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new communication
    if (Session.get('communicationUpsert')) {
      communicationUpdate = Session.get('communicationUpsert');
    } else {
      communicationUpdate = defaultCommunication;
    }



    // if there's an existing communication, use them
    if (Session.get('selectedCommunication')) {
      communicationUpdate = this.data.communication;
    }

    switch (field) {
      case "name":
        communicationUpdate.name[0].text = value;
        break;
      case "gender":
        communicationUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        communicationUpdate.birthDate = value;
        break;
      case "photo":
        communicationUpdate.photo[0].url = value;
        break;
      case "mrn":
        communicationUpdate.identifier[0].value = value;
        break;
      default:

    }
    // communicationUpdate[field] = value;
    process.env.TRACE && console.log("communicationUpdate", communicationUpdate);

    Session.set('communicationUpsert', communicationUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let communicationUpdate = Session.get('communicationUpsert', communicationUpdate);


    if (communicationUpdate.birthDate) {
      communicationUpdate.birthDate = new Date(communicationUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("communicationUpdate", communicationUpdate);

    if (Session.get('selectedCommunication')) {
      if(process.env.NODE_ENV === "test") console.log("Updating communication...");

      delete communicationUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      communicationUpdate.resourceType = 'Communication';

      Communications.update({_id: Session.get('selectedCommunication')}, {$set: communicationUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Communications.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: Session.get('selectedCommunication')});
          Session.set('communicationUpdate', defaultCommunication);
          Session.set('communicationUpsert', defaultCommunication);
          Session.set('communicationPageTabIndex', 1);
          Bert.alert('Communication added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new communication...", communicationUpdate);

      Communications.insert(communicationUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Communications.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: result});
          Session.set('communicationPageTabIndex', 1);
          Session.set('selectedCommunication', false);
          Session.set('communicationUpsert', false);
          Bert.alert('Communication added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('communicationPageTabIndex', 1);
  }

  handleDeleteButton(){
    Communications.remove({_id: Session.get('selectedCommunication')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Communications.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: Session.get('selectedCommunication')});
        Session.set('communicationUpdate', defaultCommunication);
        Session.set('communicationUpsert', defaultCommunication);
        Session.set('communicationPageTabIndex', 1);
        Bert.alert('Communication removed!', 'success');
      }
    });
  }
}


ReactMixin(CommunicationDetail.prototype, ReactMeteorData);
