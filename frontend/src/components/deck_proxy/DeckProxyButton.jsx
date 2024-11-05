import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import Printer from '@/assets/images/icons/printer.svg?react';
import { Spinner, MenuButton, MenuItems, MenuItem, DeckProxySelectModal } from '@/components';
import { countCards, cryptSort, librarySort } from '@/utils';
import { useCardImageUrl } from '@/hooks';
import { EN, GROUPED_TYPE } from '@/constants';
import { useApp } from '@/context';

const DeckProxyButton = ({ missingCrypt, missingLibrary, deck, inDiff }) => {
  const {
    inventoryMode,
    setShowFloatingButtons,
    setShowMenuButtons,
    cryptDeckSort,
    isDesktop,
    lang,
    showLegacyImage,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState();

  const proxyCards = async (crypt, library, format) => {
    setIsLoading(true);

    const cryptSorted = cryptSort(
      Object.values(crypt).filter((card) => card.q > 0),
      cryptDeckSort,
    );

    const librarySorted = librarySort(
      Object.values(library).filter((card) => card.q > 0),
      GROUPED_TYPE,
    );

    const cardsTotal = countCards([...cryptSorted, ...librarySorted]);
    const cards = [...cryptSorted, ...librarySorted].map((card) => {
      return {
        Id: card.c.Id,
        set: card.set,
        url: useCardImageUrl(card.c, card.set, lang),
        q: card.q,
      };
    });

    const sheetW = format.isLetter ? 215.9 : 210;
    const sheetH = format.isLetter ? 279.4 : 297;

    let { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', [sheetW, sheetH]);

    const w = 63;
    const h = 88;
    const gap = 0.25;
    const marginLeft = (sheetW - w * 3 - gap * 2) / 2;
    const marginTop = format.isLetter
      ? (sheetH - h * 3 - gap * 2) / 2
      : (sheetW - w * 3 - gap * 2) / 2;

    let counterX = 0;
    let counterY = 0;
    let page = 1;

    const drawBorders = () => {
      if (format.isWhite) {
        pdf.setFillColor(255, 255, 255);
      } else {
        pdf.setFillColor(60, 60, 60);
      }

      const cutLineGap = 1;

      pdf.line(cutLineGap, marginTop, sheetW - cutLineGap, marginTop);
      pdf.line(
        cutLineGap,
        marginTop + h * 1 + gap * 0.5,
        sheetW - cutLineGap,
        marginTop + h * 1 + gap * 0.5,
      );
      pdf.line(
        cutLineGap,
        marginTop + h * 2 + gap * 1.5,
        sheetW - cutLineGap,
        marginTop + h * 2 + gap * 1.5,
      );
      pdf.line(
        cutLineGap,
        marginTop + h * 3 + gap * 2,
        sheetW - cutLineGap,
        marginTop + h * 3 + gap * 2,
      );
      pdf.line(marginLeft, cutLineGap, marginLeft, sheetH - cutLineGap);
      pdf.line(
        marginLeft + w * 1 + gap * 0.5,
        cutLineGap,
        marginLeft + w * 1 + gap * 0.5,
        sheetH - cutLineGap,
      );
      pdf.line(
        marginLeft + w * 2 + gap * 1.5,
        cutLineGap,
        marginLeft + w * 2 + gap * 1.5,
        sheetH - cutLineGap,
      );
      pdf.line(
        marginLeft + w * 3 + gap * 2,
        cutLineGap,
        marginLeft + w * 3 + gap * 2,
        sheetH - cutLineGap,
      );
    };

    drawBorders();

    Object.values(cards).forEach(async (card) => {
      const img = new Image();
      for (let i = 0; i < card.q; i++) {
        pdf.rect(
          marginLeft + counterX * (w + gap),
          marginTop + counterY * (h + gap),
          w + (counterX < 2 ? gap : 0),
          h + (counterY < 2 ? gap : 0),
          'F',
        );

        try {
          if (lang !== EN || card.set || showLegacyImage) {
            const url = card.set
              ? card.url.otherUrl
              : showLegacyImage && card.Id > 200000
                ? card.url.legacyUrl
                : card.url.otherUrl;

            if (!url) throw null;
            img.src = `${url}.jpg`;
            pdf.addImage(
              img,
              'JPEG',
              (w + gap) * counterX + marginLeft,
              (h + gap) * counterY + marginTop,
              w,
              h,
            );
          } else {
            throw null;
          }
        } catch {
          img.src = `${card.url.baseUrl}.jpg`;
          pdf.addImage(
            img,
            'JPEG',
            (w + gap) * counterX + marginLeft,
            (h + gap) * counterY + marginTop,
            w,
            h,
          );
        }

        if (counterX == 2) {
          counterY += 1;
          counterX = 0;
        } else {
          counterX += 1;
        }

        if (counterY == 3 && page * 9 < cardsTotal) {
          page += 1;
          counterY = 0;
          pdf.addPage();
          drawBorders();
        }
      }
    });

    pdf.save(`${deck['name']}.pdf`);
    setIsLoading(false);
  };

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton
          title="Create PDF with Cards"
          icon={isLoading ? <Spinner /> : <Printer width="18" height="18" viewBox="0 0 18 16" />}
          variant={isDesktop ? 'secondary' : 'primary'}
          text="PDF Proxy"
        />
        <MenuItems>
          {!inDiff && (
            <>
              <MenuItem
                onClick={() =>
                  proxyCards(deck.crypt, deck.library, {
                    isWhiteGaps: false,
                    isLetter: false,
                  })
                }
              >
                Full Deck - Gray gaps (A4)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(deck.crypt, deck.library, {
                    isWhite: true,
                    isLetter: false,
                  })
                }
              >
                Full Deck - White gaps (A4)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(deck.crypt, deck.library, {
                    isWhiteGaps: false,
                    isLetter: true,
                  })
                }
              >
                Full Deck - Gray gaps (Letter)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(deck.crypt, deck.library, {
                    isWhite: true,
                    isLetter: true,
                  })
                }
              >
                Full Deck - White gaps (Letter)
              </MenuItem>
            </>
          )}
          {(inventoryMode || inDiff) && (
            <>
              <MenuItem
                onClick={() =>
                  proxyCards(missingCrypt, missingLibrary, {
                    isWhite: false,
                    isLetter: false,
                  })
                }
              >
                Missing{inDiff ? ' ' : ' in Inventory '}Gray gaps (A4)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(missingCrypt, missingLibrary, {
                    isWhite: true,
                    isLetter: false,
                  })
                }
              >
                Missing{inDiff ? ' ' : ' in Inventory '}White gaps (A4)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(missingCrypt, missingLibrary, {
                    isWhite: false,
                    isLetter: true,
                  })
                }
              >
                Missing{inDiff ? ' ' : ' in Inventory '}Gray gaps (Letter)
              </MenuItem>
              <MenuItem
                onClick={() =>
                  proxyCards(missingCrypt, missingLibrary, {
                    isWhite: true,
                    isLetter: true,
                  })
                }
              >
                Missing{inDiff ? ' ' : ' in Inventory '}White gaps (Letter)
              </MenuItem>
            </>
          )}
          {!inDiff && (
            <MenuItem
              onClick={() => {
                setShowSelectModal(true);
                setShowFloatingButtons(false);
              }}
            >
              Select Cards
            </MenuItem>
          )}
        </MenuItems>
      </Menu>
      {showSelectModal && (
        <DeckProxySelectModal
          show={showSelectModal}
          handleClose={() => {
            setShowSelectModal(false);
            setShowMenuButtons(false);
            setShowFloatingButtons(true);
          }}
          deck={deck}
          missingCrypt={missingCrypt}
          missingLibrary={missingLibrary}
          proxyCards={proxyCards}
        />
      )}
    </>
  );
};

export default DeckProxyButton;
