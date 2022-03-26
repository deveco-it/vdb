import React from 'react';
import {
  Row,
  Col,
  Stack,
  Form,
  FormControl,
  InputGroup,
  Button,
} from 'react-bootstrap';
import X from 'assets/images/icons/x.svg';
import Check2 from 'assets/images/icons/check2.svg';
import {
  SearchAdditionalFormsText,
  SearchFormButtonAddText,
  SearchFormButtonDelText,
} from '../shared_search_components';
import { useApp } from 'context';

function SearchFormTextAndButtons(props) {
  const { inventoryMode, isMobile } = useApp();

  const options = [
    {
      value: 'name',
      label: 'Only in Name',
    },
    {
      value: 'text',
      label: 'Only in Text',
    },
    {
      value: 'regex',
      label: 'Regex',
    },
  ];

  const OptionsForm = options.map((opt, index) => {
    return (
      <Form.Check
        key={index}
        name={0}
        value={opt.value}
        type="checkbox"
        className="small"
        id={`text-${opt.value}`}
        label={opt.label}
        checked={
          opt.value === 'regex'
            ? props.value[0].regex
            : props.value[0].in === opt.value
        }
        onChange={(e) => props.onChangeOptions(e)}
      />
    );
  });

  return (
    <Row className="ps-0 ps-md-1 mx-0 align-items-center">
      {isMobile ? (
        <FormControl
          placeholder="Card Name / Text / RegEx"
          type="text"
          name={0}
          autoComplete="off"
          spellCheck="false"
          value={props.value[0].value}
          onChange={props.onChange}
        />
      ) : (
        <InputGroup className="px-0">
          <FormControl
            placeholder="Card Name / Text / RegEx"
            type="text"
            name={0}
            autoComplete="off"
            spellCheck="false"
            value={props.value[0].value}
            onChange={props.onChange}
          />
          {props.preresults > props.showLimit && (
            <Button variant="primary" onClick={props.handleShowResults}>
              <Check2 /> FOUND {props.preresults}
            </Button>
          )}
          <Button
            title="Clear Forms & Results"
            variant="primary"
            onClick={props.handleClearButton}
          >
            <X />
          </Button>
        </InputGroup>
      )}
      <Row className="mx-0 px-0 pt-1">
        <Col
          xs={2}
          className="d-flex justify-content-between align-items-center px-0"
        >
          {props.value[0].value !== '' && (
            <div className="d-flex justify-content-end">
              {props.value.length == 1 ? (
                <SearchFormButtonAddText setFormState={props.setFormState} />
              ) : (
                <SearchFormButtonDelText
                  setFormState={props.setFormState}
                  value={props.value}
                  i={0}
                />
              )}
            </div>
          )}
        </Col>
        <Col className="d-flex justify-content-end px-0">
          <Stack direction="horizontal" gap={3}>
            {OptionsForm}
          </Stack>
        </Col>
      </Row>
      <SearchAdditionalFormsText
        value={props.value}
        onChange={props.onChange}
        onChangeOptions={props.onChangeOptions}
        setFormState={props.setFormState}
      />
      {inventoryMode && (
        <Form.Check
          name={0}
          value="hideMissing"
          type="checkbox"
          className="small pt-1"
          id="text-hideMissing"
          label="Search In Inventory"
          checked={props.value[0].hideMissing}
          onChange={(e) => props.setHideMissing(!props.hideMissing)}
        />
      )}
    </Row>
  );
}

export default SearchFormTextAndButtons;
