import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.map(client => ({ ...client, status: 'backlog' })),
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];
    this.drake = Dragula(containers);

    this.drake.on('drop', (el, target, source, sibling) => {
      // Revert the DOM change made by Dragula so React can handle the state and update the DOM itself.
      this.drake.cancel(true);

      // Find the ID of the dragged client
      const clientId = el.getAttribute('data-id');

      // Map container refs to their respective swimlane names
      let targetSwimlane = null;
      if (target === this.swimlanes.backlog.current) {
        targetSwimlane = 'backlog';
      } else if (target === this.swimlanes.inProgress.current) {
        targetSwimlane = 'inProgress';
      } else if (target === this.swimlanes.complete.current) {
        targetSwimlane = 'complete';
      }

      let sourceSwimlane = null;
      if (source === this.swimlanes.backlog.current) {
        sourceSwimlane = 'backlog';
      } else if (source === this.swimlanes.inProgress.current) {
        sourceSwimlane = 'inProgress';
      } else if (source === this.swimlanes.complete.current) {
        sourceSwimlane = 'complete';
      }

      // If dropped outside of our lanes or if some reference is lost, do nothing.
      if (!targetSwimlane || !sourceSwimlane) {
        return;
      }

      // Find the client object that was dragged
      const sourceClients = [...this.state.clients[sourceSwimlane]];
      const targetClients = sourceSwimlane === targetSwimlane ? sourceClients : [...this.state.clients[targetSwimlane]];

      const clientIndex = sourceClients.findIndex(c => c.id === clientId);
      if (clientIndex === -1) return;

      const [client] = sourceClients.splice(clientIndex, 1);

      // Update client status based on the target swimlane
      const updatedClient = {
        ...client,
        status: targetSwimlane === 'inProgress' ? 'in-progress' : targetSwimlane,
      };

      // Determine the drop index in the target swimlane
      let dropIndex = targetClients.length;
      if (sibling) {
        const siblingId = sibling.getAttribute('data-id');
        dropIndex = targetClients.findIndex(c => c.id === siblingId);
        if (dropIndex === -1) {
          dropIndex = targetClients.length;
        }
      }

      // Insert the client at the drop index
      targetClients.splice(dropIndex, 0, updatedClient);

      // Update state
      this.setState({
        clients: {
          ...this.state.clients,
          [sourceSwimlane]: sourceClients,
          [targetSwimlane]: targetClients,
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
