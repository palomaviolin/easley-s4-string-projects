import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './GoBack.scss'

class GoBack extends Component {

  render() {
    return (

          <button
          className = "button-back"
          type="button">
          <FontAwesomeIcon
          icon = "angle-double-left"
          className = "icon_button-back"
          />
            Volver
          </button>

    );
  }
}

export default GoBack;