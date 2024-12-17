import React, { useState, useActionState } from 'react';
import EnvelopeFill from '@icons/envelope-fill.svg?react';
import { AccountEmailForm, AccountPasswordForm, ErrorOverlay } from '@/components';
import { useApp } from '@/context';
import { userServices } from '@/services';
import { PASSWORD, EMAIL } from '@/constants';

const AccountChangeEmail = () => {
  const { setEmail } = useApp();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const changeEmail = async (prevState, formData) => {
    const result = await userServices.changeEmail(formData.get(PASSWORD), formData.get(EMAIL));
    switch (result.error) {
      case 401:
        setError('WRONG PASSWORD');
        break;
      case 500:
        setError('CONNECTION PROBLEM');
        break;
      default:
        setEmail(formData.get(EMAIL));
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
    }

    return { [PASSWORD]: formData.get(PASSWORD), [EMAIL]: formData.get(EMAIL) };
  };

  const [data, action] = useActionState(changeEmail);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-lg font-bold text-fgSecondary dark:text-fgSecondaryDark">
        <div className="flex min-w-[23px] justify-center">
          <EnvelopeFill />
        </div>
        <div className="flex">Change email</div>
      </div>
      <form className="flex flex-col gap-2" action={action}>
        <div className="relative flex w-full">
          <AccountEmailForm defaultValue={data?.[EMAIL]} />
        </div>
        <div className="relative flex w-full">
          <AccountPasswordForm defaultValue={data?.password} success={success} />
          {error && <ErrorOverlay placement="bottom">{error}</ErrorOverlay>}
        </div>
      </form>
    </div>
  );
};

export default AccountChangeEmail;
