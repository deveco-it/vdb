import React from 'react';
import reactStringReplace from 'react-string-replace';
import { useApp } from '@/context';
import { CardPopover, ResultName, ResultMiscImage, ConditionalTooltip } from '@/components';

const Refs = ({ refs }) => {
  return (
    <div className={Object.keys(refs).length > 2 ? 'flex flex-wrap gap-1' : 'inline space-x-1'}>
      {Object.keys(refs).map((i) => {
        return (
          <div key={i} className="inline whitespace-nowrap">
            <a target="_blank" rel="noreferrer" href={refs[i]}>
              {i}
            </a>
          </div>
        );
      })}
    </div>
  );
};

const Text = ({ text }) => {
  const { nativeCrypt, nativeLibrary, cryptCardBase, libraryCardBase, isMobile } = useApp();

  const textWithIcons = reactStringReplace(text, /\[(\w+?)\]/g, (match, idx) => {
    return (
      <div key={`${match}-${idx}`} className="inline pr-0.5">
        <ResultMiscImage value={match} />
      </div>
    );
  });

  return reactStringReplace(textWithIcons, /{(.*?)}/g, (match, idx) => {
    const cardBase = { ...nativeCrypt, ...nativeLibrary };
    const cardid = Object.keys(cardBase).find((j) => cardBase[j][NAME] == match);

    const card = cardid > 200000 ? cryptCardBase[cardid] : libraryCardBase[cardid];

    if (card) {
      return (
        <ConditionalTooltip
          key={`${match}-${idx}`}
          overlay={<CardPopover card={card} />}
          disabled={isMobile}
          noPadding
        >
          <ResultName card={card} />
        </ConditionalTooltip>
      );
    }
    return <React.Fragment key={idx}>&#123;{match}&#125;</React.Fragment>;
  });
};

const ResultLayoutTextRulings = ({ rulings }) => {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {rulings.map((k, idx) => {
        const text = k[TEXT].replace(/\(D\)/g, '\u24B9').split('\n');

        return (
          <li key={idx}>
            {text.map((i, idxText) => {
              return <Text key={`x${idxText}`} text={i} />;
            })}
            <Refs refs={k['refs']} />
          </li>
        );
      })}
    </ul>
  );
};

export default ResultLayoutTextRulings;
