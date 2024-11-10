import React, { Suspense } from 'react';
import Snow from '@/assets/images/icons/snow.svg?react';
import { Modal } from '@/components';
import { useApp } from '@/context';
import { NAME, IS_NON_EDITABLE } from '@/constants';

const DeckQrModal = ({ qrUrl, setQrUrl, deck }) => {
  const QRCode = React.lazy(() => import('react-qr-code'));
  const { setShowMenuButtons, setShowFloatingButtons } = useApp();

  const handleClose = () => {
    setQrUrl(false);
    setShowMenuButtons(false);
    setShowFloatingButtons(true);
  };

  return (
    <Modal
      handleClose={handleClose}
      size="xs"
      centered
      title={
        <div className="flex items-center gap-2">
          <div>{deck[NAME]}</div>
          {(deck[IS_NON_EDITABLE] || qrUrl.includes('decks/deck?')) && (
            <div className="flex px-2 text-fgPrimary dark:text-fgPrimaryDark" title="Non-editable">
              <Snow width="26" height="26" viewBox="0 0 16 16" />
            </div>
          )}
        </div>
      }
    >
      <div className="flex justify-center">
        <div className="bg-white p-1">
          <a href={qrUrl}>
            <Suspense fallback={<div />}>
              <QRCode size={320} level="L" title={qrUrl} value={qrUrl} />
            </Suspense>
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default DeckQrModal;
