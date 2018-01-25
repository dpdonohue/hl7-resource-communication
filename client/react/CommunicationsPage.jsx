import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';

import Glass from './Glass';
import GlassCard from './GlassCard';
import CommunicationDetail from './CommunicationDetail';
import CommunicationTable from './CommunicationTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { FullPageCanvas } from './FullPageCanvas';

// import { Communications } from '../lib/Communications';
import { Session } from 'meteor/session';


let defaultCommunication = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('communicationFormData', defaultCommunication);
Session.setDefault('communicationSearchFilter', '');

export class CommunicationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('communicationPageTabIndex'),
      communication: defaultCommunication,
      communicationSearchFilter: '',
      currentCommunication: null
    };

    if (Session.get('communicationFormData')) {
      data.communication = Session.get('communicationFormData');
    }
    if (Session.get('communicationSearchFilter')) {
      data.communicationSearchFilter = Session.get('communicationSearchFilter');
    }
    if (Session.get("selectedCommunication")) {
      data.currentCommunication = Session.get("selectedCommunication");
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("CommunicationsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('communicationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCommunication', false);
    Session.set('communicationUpsert', false);
  }

  render() {
    return (
      <div id="communicationsPage">
        <FullPageCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Communications"
            />
            <CardText>
              <Tabs id='communicationsPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newCommunicationTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <CommunicationDetail id='newCommunication' />
                 </Tab>
                 <Tab className="communicationListTab" label='Communications' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <CommunicationTable showBarcodes={true} />
                 </Tab>
                 <Tab className="communicationDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <CommunicationDetail id='communicationDetails' currentCommunication={this.data.currentCommunication} />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(CommunicationsPage.prototype, ReactMeteorData);

export default CommunicationsPage;