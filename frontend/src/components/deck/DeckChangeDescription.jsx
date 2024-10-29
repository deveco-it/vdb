import React, { useState, useEffect } from 'react';
import ChevronBarExpand from '@/assets/images/icons/chevron-bar-expand.svg?react';
import ChevronBarContract from '@/assets/images/icons/chevron-bar-contract.svg?react';
import ChatLeftQuoteFill from '@/assets/images/icons/chat-left-quote-fill.svg?react';
import { Input, InputLabel, Textarea, Button } from '@/components';
import { deckUpdate } from '@/context';

const DeckDescription = ({ deck, folded, setFolded }) => {
  const { deckid, description, isAuthor, isPublic, isFrozen } = deck;
  const [value, setValue] = useState(description || '');
  const isEditable = isAuthor && !isPublic && !isFrozen;

  useEffect(() => {
    if (value !== description) setValue(description ?? '');
  }, [description]);

  const handleChange = (event) => {
    setValue(folded ? value.replace(/.*/, event.target.value) : event.target.value);
  };

  const deckChangeDescription = () => {
    deckUpdate(deckid, 'description', value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    deckChangeDescription();
  };

  const handleOnBlur = () => {
    if (value !== description) {
      deckChangeDescription();
    }
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <InputLabel title="Description">
        <ChatLeftQuoteFill width="20" height="18" viewBox="0 0 16 16" />
      </InputLabel>
      {folded ? (
        <Input
          value={value.split('\n', 1)[0]}
          onChange={handleChange}
          onBlur={handleOnBlur}
          readOnly={!isEditable}
          borderStyle="border-y"
          roundedStyle="rounded-none"
        />
      ) : (
        <Textarea
          className="w-full"
          rows={12}
          value={value}
          onChange={handleChange}
          onBlur={handleOnBlur}
          readOnly={!isEditable}
          roundedStyle="rounded-none"
          borderStyle="border-y"
        />
      )}
      <Button
        roundedStyle="rounded-r"
        title="Collapse/Uncollapse Description"
        onClick={() => setFolded(!folded)}
      >
        {folded ? <ChevronBarExpand /> : <ChevronBarContract />}
      </Button>
    </form>
  );
};

export default DeckDescription;
