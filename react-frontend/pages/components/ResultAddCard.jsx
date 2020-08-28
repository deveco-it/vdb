import React from 'react';
import { Button } from 'react-bootstrap';

function ResultAddCard(props) {
  const handleButton = () => props.cardAdd(props.cardid);
  return(
    <Button variant='outline-primary' onClick={handleButton}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-left-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
      </svg>
    </Button>
  );
}

export default ResultAddCard;
