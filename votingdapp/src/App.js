import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, {Component} from "react";
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from "react-redux";

import initBlockchain from "./initBlockchain";
import Test from "./test";
import ShowPoll from "./pages/ShowPoll"
import MainPage from "./pages/MainPage";
import AddPoll from "./pages/AddPoll";

import store from "./redux/store";
import {Container} from "react-bootstrap";
import TopBar from "./components/TopBar";

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
                  <Container>
                      <TopBar state={this.state}/>
                      <Route exact path="/" component={MainPage}/>
                      <Route exact path="/ShowPoll" component={ShowPoll}/>
                      <Route exact path="/AddPoll" component={AddPoll}/>
                  </Container>
              </Router>
          </Provider>
        );
    }

}

export default App;
