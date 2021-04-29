import '../App.css';
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import store from "../redux/store";

function mapStateToProps(state) {
    console.log("Mainpage mapStateToProps", state);
    return state;
}

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        console.log("Mainpage constructor state:", this.state);
    }

    componentDidMount = async () => {
        try {
            console.log("Mainpage componentDidMount store:", store.getState());
            //this.state = store.getState();
        } catch (error) {
            alert("Failed to load provider");
            console.log(error);
        }
    };

    //<Test  contract={this.state} />
    render() {
        console.log("Mainpage render props:", this.props);
        console.log("Mainpage render getState:", store.getState());
        console.log("Mainpage render this.state.polls:", this.state.polls);
        console.log("Mainpage render this.props.polls:", this.props.polls);
        console.log("Mainpage render this.state.numpolls:", this.state.numpolls);
        return (
          <div>
              <h3>Node info: {this.state.version}</h3>
              <br/>
              <h3>No. of Polls: {this.props.numpolls}</h3>
              <br/>
              <h3>isConnected: {this.props.isConnected}</h3>
              <br/>
              <ul>
                  {this.props.polls.map((thing) => (
                    <li key={thing}>
                        <Link to={{pathname: '/ShowPoll', id: {thing}}}>{thing}</Link>
                    </li>
                  ))}
              </ul>
              <Link to="/ShowPoll">ShowPoll</Link>
          </div>
        )
    }
}

export default connect(mapStateToProps)(MainPage);