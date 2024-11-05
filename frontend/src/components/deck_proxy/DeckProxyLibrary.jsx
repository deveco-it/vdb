import React from 'react';
import {
  DeckProxyLibraryTable,
  ResultLibraryType,
  ResultModal,
  Header,
  FlexGapped,
} from '@/components';
import { useApp } from '@/context';
import { countCards } from '@/utils';
import { INVENTORY_TYPE, MASTER } from '@/constants';
import { useModalCardController, useDeckLibrary } from '@/hooks';

const DeckProxyLibrary = ({
  deck,
  proxySelected,
  handleSetSelector,
  handleProxyCounter,
  handleProxySelector,
}) => {
  const { setShowFloatingButtons } = useApp();

  const {
    library,
    librarySide,
    libraryByType,
    librarySideByType,
    trifleTotal,
    libraryByTypeTotal,
  } = useDeckLibrary(deck.library);

  const proxiesToPrint = Object.keys(proxySelected)
    .filter(
      (cardid) => cardid < 200000 && proxySelected[cardid].print && proxySelected[cardid].q > 0,
    )
    .map((cardid) => proxySelected[cardid]);

  const libraryTotalSelected = countCards(proxiesToPrint);

  const {
    currentModalCard,
    shouldShowModal,
    handleModalCardOpen,
    handleModalSideCardOpen,
    handleModalCardChange,
    handleModalCardClose,
  } = useModalCardController(library, librarySide);

  const handleClick = (card) => {
    handleModalCardOpen(card);
    setShowFloatingButtons(false);
  };

  const handleClickSide = (card) => {
    handleModalSideCardOpen(card);
    setShowFloatingButtons(false);
  };

  const handleClose = () => {
    handleModalCardClose();
    setShowFloatingButtons(true);
  };

  return (
    <FlexGapped className="flex-col">
      <div className="flex flex-col gap-2">
        <Header>
          <div className="px-2 font-bold">Library [{libraryTotalSelected}]</div>
        </Header>
        {Object.keys(libraryByType).map((cardtype) => {
          return (
            <div key={cardtype}>
              <div className="flex justify-between">
                <ResultLibraryType
                  cardtype={cardtype}
                  total={libraryByTypeTotal[cardtype]}
                  trifleTotal={cardtype == MASTER && trifleTotal}
                />
              </div>
              <DeckProxyLibraryTable
                inventoryType={deck[INVENTORY_TYPE]}
                handleClick={handleClick}
                cards={libraryByType[cardtype]}
                handleProxySelector={handleProxySelector}
                handleSetSelector={handleSetSelector}
                handleProxyCounter={handleProxyCounter}
                proxySelected={proxySelected}
              />
            </div>
          );
        })}
      </div>
      {librarySide.length > 0 && (
        <div className="flex flex-col gap-2 opacity-60 dark:opacity-50">
          <Header>
            <div className="px-2 font-bold">Side Library</div>
          </Header>
          {Object.keys(librarySideByType).map((cardtype) => {
            return (
              <div key={cardtype}>
                <ResultLibraryType
                  cardtype={cardtype}
                  total={0}
                  trifleTotal={cardtype == MASTER && trifleTotal}
                />
                <DeckProxyLibraryTable
                  inventoryType={deck[INVENTORY_TYPE]}
                  handleClick={handleClickSide}
                  cards={librarySideByType[cardtype]}
                  handleProxySelector={handleProxySelector}
                  handleSetSelector={handleSetSelector}
                  handleProxyCounter={handleProxyCounter}
                  proxySelected={proxySelected}
                />
              </div>
            );
          })}
        </div>
      )}
      {shouldShowModal && (
        <ResultModal
          card={currentModalCard}
          handleModalCardChange={handleModalCardChange}
          handleClose={handleClose}
        />
      )}
    </FlexGapped>
  );
};

export default DeckProxyLibrary;
