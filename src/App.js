import React, { Component } from 'react';
import './stylesheets/App.scss';
import { Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import ConversationPage from './components/ConversationPage';
import ConversationThreading from './components/ConversationThreading';
import Loading from './components/Loading';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fetchToken } from './components/services/TokenService';
import {
  faEllipsisH,
  faEyeSlash,
  faPaperPlane,
  faKey,
  faAngleDoubleLeft,
  faEye
} from '@fortawesome/free-solid-svg-icons';
library.add(faEllipsisH, faEyeSlash, faPaperPlane, faKey, faAngleDoubleLeft, faEye);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      userInfo: {
        nickname: "",
        password: ""
      },
      dataUser: null,
      groups: null,
      token: "",
      logIn: {
        error: 0
      },
      isChecked: false,
      isLoading: true,
      isAuthenticated: false
    };
    this.addModalClick = this.addModalClick.bind(this);
    this.cancelClickModal = this.cancelClickModal.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.getDataInfo = this.getDataInfo.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
  }

  saveData(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      return {
        userInfo: {
          ...prevState.userInfo,
          [name]: value
        }
      }
    })
  }

  inputSendMessage(event) {
    const sendMessageInputValue = event.target.value;
    console.log("SendMessage input value:", sendMessageInputValue);
  }

  addModalClick(event) {
    this.setState(prevState => {
      return {
        ...prevState,
        isHidden: false,
      }
    })
  }

  cancelClickModal(event) {
    this.setState(prevState => {
      return {
        ...prevState,
        isHidden: true,
      }
    }
    )
  }

  getDataInfo() {
    fetchToken(this.state.userInfo)
      .then(data => {
        return (
          this.setState({
            dataUser: data.user,
            groups: data.groups,
            token: data.user.auth_token,
            userInfo: {
              nickname: "",
              password: ""
            }
          }),
          this.keepInLocalStorage()
        )
      })
      .catch(error => {
        return (
          this.setState({
            logIn: {
              error: error.status
            }
          })
        )
      })
  }

  keepInLocalStorage() {
    if (this.state.isChecked === false) {
      return (localStorage.removeItem('token'))
    } else {
      localStorage.setItem('token', JSON.stringify(this.state.token))
    }
  }

  handleButton(event) {
    event.preventDefault();
    this.setState({
      dataUser: null,
      groups: null,
      logIn: {
        errorLogIn: 0
      }
    })
    this.getDataInfo();
  }

  handleChecked(event) {
    if (this.state.isChecked === false) {
      this.setState({
        isChecked: true
      })
    } else {
      this.setState({
        isChecked: false
      })
    }
  }

  render() {
    const { logIn, isHidden } = this.state;
    return (
      <Switch>

        <Route exact path="/login" render={props =>
          (<LandingPage
            saveData={this.saveData}
            handleButton={this.handleButton}
            wrongCredentials={logIn.error}
            handleChecked={this.handleChecked}
          />)} />
        <Route exact path="/" render={() => {
          if (this.state.isLoading === true) {
            return <Loading />
          } else if (this.state.isLoading === false && this.state.isAuthenticated === true) {
            return <MainPage
              addModalClick={this.addModalClick}
              cancelClickModal={this.cancelClickModal}
              isHidden={isHidden}
            />
          } else {
            return <Redirect to="/login" />
          }
        }} />

        <Route
          path="/conversation-page"
          render={() => (
            (false) ?
              <ConversationPage
                inputSendMessage={this.inputSendMessage}
                addModalClick={this.addModalClick}
                cancelClickModal={this.cancelClickModal}
                isHidden={isHidden}
              />
              : <Redirect to="/login" />
          )}
        />
        <Route
          path="/conversation-threading"
          render={() => (
            (false) ?
              <ConversationThreading
                inputSendMessage={this.inputSendMessage}
                addModalClick={this.addModalClick}
              />
              : <Redirect to="/login" />
          )}
        />
      </Switch >
    )
  }
}

export default App;
