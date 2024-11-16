import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { CardsDesktop, CardsMobile } from '@/components';
import { useApp, searchResults } from '@/context';
import { getIsPlaytest } from '@/utils';
import { ID } from '@/constants';

const Cards = () => {
  const params = useParams();
  const { cryptCardBase, libraryCardBase, isMobile, playtestMode } = useApp();
  const card = useSnapshot(searchResults).quickCard;
  const navigate = useNavigate();

  const handleSetCard = (card) => {
    navigate(`/cards/${card[ID]}`);
  };

  const handleChange = (event) => {
    handleSetCard({ [ID]: event.value });
  };

  const openRandomCard = (isCrypt) => {
    const cardbase = isCrypt ? cryptCardBase : libraryCardBase;
    const cards = Object.keys(cardbase).filter((cardid) => playtestMode || !getIsPlaytest(cardid));
    const cardid = cards[Math.floor(Math.random() * cards.length)];
    navigate(`/cards/${cardid}`);
  };

  useEffect(() => {
    if (cryptCardBase && libraryCardBase) {
      searchResults.quickCard =
        params.cardid > 200000 ? cryptCardBase[params.cardid] : libraryCardBase[params.cardid];
    }
  }, [params.cardid, cryptCardBase, libraryCardBase]);

  return (
    <div className="cards-container mx-auto">
      <>
        {isMobile ? (
          <CardsMobile
            card={card}
            openRandomCard={openRandomCard}
            handleChange={handleChange}
            handleSetCard={handleSetCard}
          />
        ) : (
          <CardsDesktop
            card={card}
            openRandomCard={openRandomCard}
            handleChange={handleChange}
            handleSetCard={handleSetCard}
          />
        )}
      </>
    </div>
  );
};

export default Cards;
