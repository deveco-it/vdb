import React from 'react';
import { Button } from 'react-bootstrap';
import LightningFill from '../../assets/images/icons/lightning-fill.svg';
import Dice3 from '../../assets/images/icons/dice-3-fill.svg';
import X from '../../assets/images/icons/x.svg';

function TwdSearchFormButtons(props) {
  return (
    <div className="d-flex pb-2 justify-content-between">
      <div className="d-flex">
        <Button variant="outline-secondary" onClick={() => props.getRandomTwd(10)}>
          <Dice3 /> 10 Random
        </Button>
        <Button variant="outline-secondary" onClick={() => props.getNewTwd(50)}>
          <LightningFill /> 50 New
        </Button>
      </div>
      <div>
        <Button variant="outline-secondary" onClick={props.handleClearButton}>
          <X /> Clear
        </Button>
      </div>
    </div>
  );
}

export default TwdSearchFormButtons;
