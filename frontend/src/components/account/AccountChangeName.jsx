import React, { useState } from 'react';
import Check2 from '@icons/check2.svg?react';
import PenFill from '@icons/pen-fill.svg?react';
import { Spinner, Input, ConditionalTooltipOrModal, ErrorOverlay, Button } from '@/components';
import { useApp } from '@/context';
import { userServices } from '@/services';

const TooltipText = () => {
  return (
    <div className="flex flex-col gap-1">
      <div>Public name is default author name for new decks.</div>
      <div>Author name is per-deck and can be changed anytime for each deck.</div>
      <div>Public names are not unique.</div>
      <div>Changing public name will not change author name of your existing decks.</div>
      <div>
        Public name is <b>not</b> your account username (the one you login with, which cannot be
        changed).
      </div>
    </div>
  );
};

const AccountChangeName = () => {
  const { publicName, setPublicName } = useApp();
  const [formName, setFormName] = useState(publicName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const onError = () => {
    setIsLoading(false);
    setError('CONNECTION PROBLEM');
  };

  const onSuccess = () => {
    setIsLoading(false);
    setPublicName(formName);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  };

  const changeName = () => {
    if (isLoading) return;
    setError(false);

    if (formName) {
      setIsLoading(true);
      userServices.changeName(formName, onSuccess, onError);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    changeName();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-lg font-bold text-fgSecondary dark:text-fgSecondaryDark">
        <div className="flex min-w-[23px] justify-center">
          <PenFill />
        </div>
        <div className="flex">Change public name</div>
        <ConditionalTooltipOrModal title="Public name" overlay={<TooltipText />}>
          <div className="text-fgThird dark:text-fgThirdDark">[?]</div>
        </ConditionalTooltipOrModal>
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="relative flex w-full">
          <Input
            placeholder="Public name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            roundedStyle="rounded rounded-r-none"
          />
          <Button
            roundedStyle="rounded-r"
            borderStyle="border-r border-y"
            variant={success ? 'success' : 'primary'}
            type="submit"
          >
            {isLoading ? <Spinner /> : <Check2 />}
          </Button>
          {error && <ErrorOverlay placement="bottom">{error}</ErrorOverlay>}
        </div>
      </form>
    </div>
  );
};

export default AccountChangeName;
