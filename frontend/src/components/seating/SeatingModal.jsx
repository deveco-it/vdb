import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import X from 'assets/images/icons/x.svg';
import PencilSquare from 'assets/images/icons/pencil-square.svg';
import Recycle from 'assets/images/icons/recycle.svg';
import ToggleOn from 'assets/images/icons/toggle-on.svg';
import ToggleOff from 'assets/images/icons/toggle-off.svg';
import {
  Button,
  ButtonIconed,
  SeatingPlayerSelector,
  SeatingRandomDeck,
  SeatingCustomDeckAdd,
  SeatingTableLayout,
} from 'components';
import { useApp } from 'context';

const SeatingModal = ({
  addCustomDeck,
  customDecks,
  handleClose,
  removeCustomDeck,
  players,
  reshuffle,
  seating,
  setPlayer,
  setWithCustom,
  setWithStandard,
  show,
  standardDecks,
  toggleCustom,
  toggleStandard,
  withCustom,
  withStandard,
}) => {
  const { isNarrow, isMobile } = useApp();
  const [editRandom, setEditRandom] = useState();

  const withRandom = Object.values(players).some((d) => {
    return d.random;
  });

  const haveRandomSelected =
    (withStandard &&
      Object.values(standardDecks).some((d) => {
        return d.state;
      })) ||
    (withCustom &&
      Object.values(customDecks).some((d) => {
        return d.state;
      }));

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        dialogClassName={isMobile ? 'm-0' : 'modal-wide'}
      >
        <Modal.Header className="no-border p-2 pb-0 pb-md-1 p-md-4">
          <div className="text-lg text-blue font-bold">Table Seating</div>
          {!isNarrow && (
            <Button variant="outline-secondary" onClick={handleClose}>
              <X width="32" height="32" viewBox="0 0 16 16" />
            </Button>
          )}
        </Modal.Header>
        <Modal.Body className="py-0 px-2 px-md-4">
          <div className="mb-0 mb-md-3 px-0 px-md-0">
            <div className="flex flex-row items-center">
              <div className="py-2 md:basis-5/12 xl:basis-1/3">
                <div className="flex flex-col space-y-1">
                  {players.map((p, idx) => {
                    return (
                      <SeatingPlayerSelector
                        key={idx}
                        i={idx}
                        player={p}
                        setPlayer={setPlayer}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-row space-y-2 pt-4">
                  <ButtonIconed
                    variant="primary"
                    onClick={reshuffle}
                    title="Reshuffle"
                    icon={
                      <Recycle width="18" height="18" viewBox="0 0 16 16" />
                    }
                    text="Reshuffle"
                  />
                  <ButtonIconed
                    variant="primary"
                    onClick={() => setEditRandom(!editRandom)}
                    title="Reshuffle"
                    icon={
                      <PencilSquare
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                      />
                    }
                    text="Select Random"
                  />
                  {withRandom && !haveRandomSelected && (
                    <div className="pt-2 red">
                      No random players source selected
                    </div>
                  )}
                </div>
              </div>
              <div className="md:basis-7/12 xl:basis-8/12 px-0">
                {seating && (
                  <div className="flex flex-row py-2 py-md-0">
                    <SeatingTableLayout players={seating} />
                  </div>
                )}
              </div>
            </div>
            {editRandom && (
              <div className="flex flex-row pt-0 pt-md-3">
                <hr className="mx-0" />
                <div className="flex flex-row pb-3">
                  <div className="flex flex-row">
                    <div
                      className="flex items-center"
                      onClick={() => setWithCustom(!withCustom)}
                    >
                      <div className="flex items-center pe-2">
                        <>
                          {withCustom ? (
                            <ToggleOn
                              width="30"
                              height="30"
                              viewBox="0 0 16 16"
                            />
                          ) : (
                            <ToggleOff
                              width="30"
                              height="30"
                              viewBox="0 0 16 16"
                            />
                          )}
                        </>
                      </div>
                      <div className="flex font-bold text-blue py-2">
                        Custom Decks
                      </div>
                    </div>
                    <div className="basis-full md:basis-7/12 lg:basis-1/2 xl:basis-5/12 py-2">
                      <SeatingCustomDeckAdd addDeck={addCustomDeck} />
                    </div>
                  </div>
                  <div className="basis-full md:basis-1/2 lg:basis-1/3">
                    {customDecks
                      .slice(0, Math.ceil(customDecks.length / 3))
                      .map((d, idx) => {
                        return (
                          <SeatingRandomDeck
                            key={idx}
                            i={idx}
                            deck={d}
                            toggle={toggleCustom}
                            disabled={!withCustom}
                            remove={removeCustomDeck}
                          />
                        );
                      })}
                  </div>
                  <div className="basis-full md:basis-1/2 lg:basis-1/3">
                    {customDecks
                      .slice(
                        Math.ceil(customDecks.length / 3),
                        Math.ceil((customDecks.length * 2) / 3)
                      )
                      .map((d, idx) => {
                        return (
                          <SeatingRandomDeck
                            key={idx}
                            i={Math.ceil(customDecks.length / 3) + idx}
                            deck={d}
                            toggle={toggleCustom}
                            disabled={!withCustom}
                            remove={removeCustomDeck}
                          />
                        );
                      })}
                  </div>
                  <div className="basis-full md:basis-1/2 lg:basis-1/3">
                    {customDecks
                      .slice(Math.ceil((customDecks.length * 2) / 3))
                      .map((d, idx) => {
                        return (
                          <SeatingRandomDeck
                            key={idx}
                            i={Math.ceil((customDecks.length * 2) / 3) + idx}
                            deck={d}
                            toggle={toggleCustom}
                            disabled={!withCustom}
                            remove={removeCustomDeck}
                          />
                        );
                      })}
                  </div>
                </div>
                <hr className="mx-0" />
                <div className="flex flex-row">
                  <div
                    className="flex items-center"
                    onClick={() => setWithStandard(!withStandard)}
                  >
                    <div className="flex items-center pe-2">
                      <>
                        {withStandard ? (
                          <ToggleOn
                            width="30"
                            height="30"
                            viewBox="0 0 16 16"
                          />
                        ) : (
                          <ToggleOff
                            width="30"
                            height="30"
                            viewBox="0 0 16 16"
                          />
                        )}
                      </>
                    </div>
                    <div className="font-bold text-blue py-2">
                      Standard Decks (from{' '}
                      <a
                        className="name"
                        target="_blank"
                        rel="noreferrer"
                        href="https://codex-of-the-damned.org/en/archetypes/index.html"
                      >
                        Codex
                      </a>
                      )
                    </div>
                  </div>
                </div>
                <div className="basis-full md:basis-1/2 lg:basis-1/3">
                  {standardDecks
                    .slice(0, Math.ceil(standardDecks.length / 3))
                    .map((d, idx) => {
                      return (
                        <SeatingRandomDeck
                          key={idx}
                          i={idx}
                          deck={d}
                          toggle={toggleStandard}
                          disabled={!withStandard}
                        />
                      );
                    })}
                </div>
                <div className="basis-full md:basis-1/2 lg:basis-1/3">
                  {standardDecks
                    .slice(
                      Math.ceil(standardDecks.length / 3),
                      Math.ceil((standardDecks.length * 2) / 3)
                    )
                    .map((d, idx) => {
                      return (
                        <SeatingRandomDeck
                          key={idx}
                          i={Math.ceil(standardDecks.length / 3) + idx}
                          deck={d}
                          toggle={toggleStandard}
                          disabled={!withStandard}
                        />
                      );
                    })}
                </div>
                <div className="basis-full md:basis-1/2 lg:basis-1/3">
                  {standardDecks
                    .slice(Math.ceil((standardDecks.length * 2) / 3))
                    .map((d, idx) => {
                      return (
                        <SeatingRandomDeck
                          key={idx}
                          i={Math.ceil((standardDecks.length * 2) / 3) + idx}
                          deck={d}
                          toggle={toggleStandard}
                          disabled={!withStandard}
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      {isNarrow && (
        <div
          onClick={handleClose}
          className="flex float-right-bottom float-clear items-center justify-center"
        >
          <X viewBox="0 0 16 16" />
        </div>
      )}
    </>
  );
};

export default SeatingModal;
