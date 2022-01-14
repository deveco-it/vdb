import React, { useState, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import CloudArrowUpFill from 'assets/images/icons/cloud-plus-fill.svg';
import { BlockButton, ErrorOverlay, DeckImportText } from 'components';
import { useApp } from 'context';

function DeckImportAnonymous(props) {
  const { getDecks, setActiveDeck, isMobile } = useApp();
  const [importError, setImportError] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const ref = useRef(null);

  const fileInputTxt = React.createRef();
  const fileInputDek = React.createRef();
  const fileInputEld = React.createRef();

  const handleFileChange = (format) => anonymousImportDeckFromFile(format);
  const handleFileInputClick = (format) => {
    switch (format) {
      case 'txt':
        fileInputTxt.current.click();
        break;
      case 'dek':
        fileInputDek.current.click();
        break;
      case 'eld':
        fileInputEld.current.click();
        break;
    }
  };

  const handleCloseImportModal = () => {
    setShowTextModal(false);
    isMobile && props.setShowButtons(false);
  };
  const handleOpenTextModal = () => setShowTextModal(true);

  const anonymousImportDeckFromFile = (format) => {
    setImportError(false);

    let fileInput;
    switch (format) {
      case 'txt':
        fileInput = fileInputTxt;
        break;
      case 'dek':
        fileInput = fileInputDek;
        break;
      case 'eld':
        fileInput = fileInputEld;
        break;
    }

    let newDeckId;
    const reader = new FileReader();
    reader.readAsText(fileInput.current.files[0]);
    reader.onload = () => {
      let result;
      switch (format) {
        case 'txt':
          result = reader.result;
          break;
        case 'dek':
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(reader.result, 'text/xml');
          const xmlCrypt =
            xmlDoc.getElementsByTagName('deck')[0].childNodes[5].children;
          const xmlLibrary =
            xmlDoc.getElementsByTagName('deck')[0].childNodes[3].children;

          const crypt = {};
          Object.values(xmlCrypt).map((i) => {
            const cardName = i.childNodes[0].childNodes[0].data;
            if (!crypt[cardName]) {
              crypt[cardName] = 0;
            }
            crypt[cardName] += 1;
          });

          const library = {};
          Object.values(xmlLibrary).map((i) => {
            const cardName = i.childNodes[0].childNodes[0].data;
            if (!library[cardName]) {
              library[cardName] = 0;
            }
            library[cardName] += 1;
          });

          result = '';

          Object.keys(crypt).map((card) => {
            result += `${crypt[card]} ${card}\n`;
          });

          Object.keys(library).map((card) => {
            result += `${library[card]} ${card}\n`;
          });
          break;
        case 'eld':
          result = '';
          const cards = reader.result.split('\n');
          cards.forEach((res) => {
            const card = res.split(',');
            if (card.length >= 5) {
              let name = card[0].slice(1);
              const n = card.length - 5;
              if (n) {
                for (let i = 1; i <= n; i++) {
                  name += `, ${card[i]}`;
                }
              }
              name = name.slice(0, -1);
              const q = card[n + 1];

              if (q && name) result += `${q} ${name}\n`;
            }
          });
          break;
      }

      const url = `${process.env.API_URL}decks/anonymous_import`;

      const body = JSON.stringify({
        deckText: result,
      });
      const options = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      };

      const fetchPromise = fetch(url, options);

      fetchPromise
        .then((response) => response.json())
        .then((data) => (newDeckId = data.deckid))
        .then(() => {
          setActiveDeck({ src: 'shared', deckid: newDeckId });
          isMobile && props.setShowButtons(false);
        })
        .catch((error) => setImportError(true));
    };
  };

  const ImportButtonOptions = (
    <>
      <Dropdown.Item onClick={() => handleFileInputClick('txt')}>
        Import from File - Amaranth, Lackey.TXT, TWD
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleFileInputClick('dek')}>
        Import from File - Lackey.DEK
      </Dropdown.Item>
      <Dropdown.Item onClick={handleOpenTextModal}>
        Import from Text - Amaranth, Lackey.TXT, TWD
      </Dropdown.Item>
    </>
  );

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={BlockButton} variant="secondary">
          <div
            title="Import deck without attaching to account (you will not be able to delete/edit it)"
            className="d-flex justify-content-center align-items-center"
          >
            <div className="pe-2">
              <CloudArrowUpFill size={24} />
            </div>
            Import w/o Account
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>{ImportButtonOptions}</Dropdown.Menu>
      </Dropdown>
      <DeckImportText
        anonymous={true}
        handleClose={handleCloseImportModal}
        getDecks={getDecks}
        show={showTextModal}
      />
      <input
        ref={fileInputTxt}
        accept="text/*"
        type="file"
        onChange={() => handleFileChange('txt')}
        style={{ display: 'none' }}
      />
      <input
        ref={fileInputDek}
        accept="text/*"
        type="file"
        onChange={() => handleFileChange('dek')}
        style={{ display: 'none' }}
      />
      <input
        ref={fileInputEld}
        accept="text/*"
        type="file"
        onChange={() => handleFileChange('eld')}
        style={{ display: 'none' }}
      />
      <ErrorOverlay
        show={importError}
        target={ref.current}
        placement="left"
        modal={true}
      >
        {importError && <b>CANNOT IMPORT THIS DECK</b>}
      </ErrorOverlay>
    </>
  );
}

export default DeckImportAnonymous;
