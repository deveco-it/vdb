import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Dialog } from '@headlessui/react';
import { ButtonCloseModal, ButtonFloatClose } from '@/components';

const Modal = ({
  handleClose,
  title,
  children,
  size = 'md',
  noPadding = false,
  centered = false,
  initialFocus,
  noBorder,
}) => {
  const widthClass = {
    sm: 'min-w-full sm:min-w-[500px] sm:max-w-[550px]',
    md: 'min-w-full sm:min-w-[650px] sm:max-w-[725px]',
    card: 'w-full sm:w-[900px]',
    cardText: 'w-full sm:w-[900px] max-sm:m-2',
    lg: 'min-w-full lg:min-w-[1150px] lg:max-w-[1250px]',
    xl: 'min-w-full xl:min-w-[1350px] xl:max-w-[1500px]',
  };

  return (
    <Dialog initialFocus={initialFocus} onClose={handleClose} className="relative z-50" open>
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div
          className={twMerge(
            'flex min-h-full justify-center p-0 sm:p-8',
            centered ? 'items-center' : 'items-start',
          )}
        >
          <Dialog.Panel
            className={twMerge(
              'rounded border-bgSecondary bg-bgPrimary dark:border-bgSecondaryDark dark:bg-bgPrimaryDark',
              widthClass[size],
              !noBorder && 'border',
              !noPadding && 'p-3 sm:p-5',
            )}
          >
            <Dialog.Title className="flex items-center justify-between border-none">
              {title && (
                <>
                  <div
                    className={twMerge(
                      'text-lg font-bold text-fgSecondary dark:text-fgSecondaryDark',
                      noPadding ? 'p-1.5' : 'py-1.5',
                    )}
                  >
                    {title}
                  </div>
                  <div className="max-md:hidden">
                    <ButtonCloseModal handleClick={handleClose} />
                  </div>
                </>
              )}
            </Dialog.Title>
            <div className="max-h-0 max-w-0 opacity-0">
              <button />
            </div>
            {children}
          </Dialog.Panel>
        </div>
      </div>
      <div className="md:hidden">
        <ButtonFloatClose handleClose={handleClose} />
      </div>
    </Dialog>
  );
};

export default Modal;
