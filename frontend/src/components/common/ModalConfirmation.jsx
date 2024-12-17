import React, { useState, useActionState } from 'react';
import { twMerge } from 'tailwind-merge';
import { FlexGapped, Input, Modal, Button, ErrorOverlay } from '@/components';
import { useApp } from '@/context';
import { YES, TEXT } from '@/constants';

const ModalConfirmation = ({
  title,
  buttonText,
  withWrittenConfirmation,
  handleConfirm,
  handleCancel,
  centered,
  size = 'xs',
  disabled,
  children,
  buttonVariant = 'primary',
  withMobileMargin = 'true',
}) => {
  const { isMobile } = useApp();
  const [error, setError] = useState(false);

  const handleClose = () => {
    setError(false);
    handleCancel();
  };

  const confirm = async (prevState, formData) => {
    if (withWrittenConfirmation) {
      if (formData.get(TEXT) === YES) {
        setError(false);
        handleConfirm();
      } else {
        setError(true);
      }
    } else {
      handleConfirm();
    }

    return { [TEXT]: formData.get(TEXT) };
  };

  const [data, action] = useActionState(confirm);

  return (
    <Modal
      handleClose={handleClose}
      centered={centered ?? isMobile}
      size={size}
      title={title}
      withMobileMargin={withMobileMargin}
    >
      <FlexGapped className="flex-col">
        {children}
        <form action={action} className={twMerge('flex justify-end gap-2', !children && 'pt-3')}>
          {withWrittenConfirmation && (
            <>
              <div className="relative w-full">
                <Input
                  placeholder={`Type '${YES}' to confirm`}
                  name={TEXT}
                  defaultValue={data?.[TEXT]}
                  autoFocus
                />
                {error && (
                  <ErrorOverlay placement="bottom">Type &apos;{YES}&apos; to confirm</ErrorOverlay>
                )}
              </div>
            </>
          )}
          <div className="flex justify-between gap-2">
            <Button disabled={disabled} variant={buttonVariant} type="submit">
              {buttonText}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </div>
        </form>
      </FlexGapped>
    </Modal>
  );
};

export default ModalConfirmation;
