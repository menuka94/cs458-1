import './App.css';
import React, {Component} from "react";
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from "react-redux";

import initBlockchain from "./initBlockchain";
import Test from "./test";
import ShowPoll from "./pages/ShowPoll"
import MainPage from "./pages/MainPage";

import store from "./redux/store";

function initState(data) {
  return {
    type: "setpolls",
    payload: data
  };
}

function setnumpolls(data) {
  return {
    type: "setnumpolls",
    payload: data
  };
}

function setpolllist(data) {
  return {
    type: "setpolllist",
    payload: data
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    console.log("App constructor");
    this.state = store.getState();
    //store.dispatch(initState(null));
  }

  componentDidMount = async () => {
    try {
      console.log("App componentDidMount");
      const poll = await initBlockchain();
      const nump = await poll.contract.numPolls();
      console.log("App componentDidMount nump:", nump.toNumber());
      //this.setState({numpolls: nump.toNumber()});
      store.dispatch(setnumpolls({numpolls: nump.toNumber()}));
      //this.setState({contract: poll.voting});
      let i;
      for (i = 0; i < nump.toNumber(); i++) {
        this.state.polls.push(i + 1);
      }
      store.dispatch(setpolllist({polls: this.state.polls}));
      // weirdly I need to do this here for Mainpage to update
      // regardless of whether mainpage uses this.props.polls
      // or this.state.polls
      this.setState({polls: this.state.polls});
      console.log("App componentDidMount polls:", this.state.polls);
      console.log("App componentDidMount state:", this.state);
      console.log("App componentDidMount store getState:", store.getState());
      this.state = store.getState();
      console.log("App componentDidMount end");
    } catch (error) {
      alert("Failed to load provider");
      console.log(error);
    }
  };


  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route exact path="/" component={MainPage}/>
          <Route exact path="/ShowPoll" component={ShowPoll}/>
        </Router>
      </Provider>
    );
  }

  /*
  render() {
    return (
      <Router>
      <Route exact path ="/" component={ShowPoll}/>
      <div>
      <h2>Connected?:</h2><br/>
      {this.state.isConnected?'Connected':'Not connected'}
      <br/>
      <h2>Node info:</h2><br /> {this.state.version}
      <Test  contract={this.state} />
      <h2>Numpolls: {this.state.numpolls}</h2><br/>
      <h2>isConnected: {this.state.isConnected}</h2><br/>
      <ul>
      {this.state.polls.map((thing) => (
        <li key={thing}>{thing}</li>
      ))}
      </ul>
      <Link to="/ShowPoll">ShowPoll</Link>
      </div>
      </Router>
    )
  }
  */
}

export default App;
