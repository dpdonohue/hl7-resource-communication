import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';

import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CommunicationTable from './CommunicationTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';

Session.setDefault('communicationDialogOpen', false);
export class CommunicationPickList extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    return {
      communicationDialog: {
        open: Session.get('communicationDialogOpen'),
        communication: {
          display: '',
          reference: ''
        }
      }
    };
  }
  changeInput(variable, event, value){
    Session.set(variable, value);
  }
  handleOpenCommunications(){
    Session.set('communicationDialogOpen', true);
  }  
  handleCloseCommunications(){
    Session.set('communicationDialogOpen', false);
  }  
  render() {
    const communicationActions = [
      <FlatButton
        label="Clear"
        primary={true}
        onTouchTap={this.handleCloseCommunications}
      />,
      <FlatButton
        label="Select"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCloseCommunications}
      />
    ];
    return(
      <GlassCard>
        <CardTitle
          title="Communication Pick List"
        />
        <CardText>

          <TextField
            hintText="Jane Doe"
            errorText="Communication Search"
            onChange={this.changeInput.bind(this, 'description')}
            value={this.data.communicationDialog.communication.display}
            fullWidth>
              <FlatButton
                label="Communications"
                className="communicationsButton"
                primary={true}
                onTouchTap={this.handleOpenCommunications}
                icon={ <AccountCircle /> }
                style={{textAlign: 'right', cursor: 'pointer'}}
              />
            </TextField>

          <Dialog
            title="Communication Search"
            actions={communicationActions}
            modal={false}
            open={this.data.communicationDialog.open}
            onRequestClose={this.handleCloseCommunications}
          >
            <CardText style={{overflowY: "auto"}}>
            <TextField
              hintText="Jane Doe"
              errorText="Communication Search"
              onChange={this.changeInput.bind(this, 'description')}
              value={this.data.communicationDialog.communication.display}
              fullWidth />
              <CommunicationTable />
            </CardText>
          </Dialog>
        </CardText>
      </GlassCard>
    );
  }
}
ReactMixin(CommunicationPickList.prototype, ReactMeteorData);