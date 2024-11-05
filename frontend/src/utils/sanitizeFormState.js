import { deepClone } from '@/utils';
import {
  DISCIPLINES,
  TRAITS,
  TITLES,
  CARDTYPES,
  LIBRARY_TOTAL,
  RANK,
  LOCATION,
  ANY,
  VALUE,
  CRYPT,
  LIBRARY,
  TWD,
  PDA,
  ANALYZE,
  MATCH_INVENTORY,
  TEXT,
} from '@/constants';

const sanitizeFormState = (target, state) => {
  const input = deepClone(state);
  let forms = [];

  switch (target) {
    case CRYPT:
    case LIBRARY:
      forms = [TEXT];
      break;
    default:
      forms = [];
  }

  forms.forEach((i) => {
    input[i].forEach((j, idx) => {
      Object.entries(j).forEach(([key, value]) => {
        switch (key) {
          case VALUE:
            input[i] = input[i].filter((i) => i.value !== '');
            break;
          default:
            if (input[i][idx] && !value) delete input[i][idx][key];
        }
      });
    });
  });

  switch (target) {
    case CRYPT:
      forms = [DISCIPLINES, TITLES, 'group', TRAITS];
      break;
    case LIBRARY:
      forms = [TRAITS];
      break;
    case PDA:
      forms = [DISCIPLINES, TRAITS, CARDTYPES, 'date', 'capacity', LIBRARY_TOTAL];
      break;
    case TWD:
      forms = [
        DISCIPLINES,
        TRAITS,
        CARDTYPES,
        'date',
        'players',
        LOCATION,
        'capacity',
        LIBRARY_TOTAL,
      ];
      break;
    case ANALYZE:
      forms = [DISCIPLINES, TRAITS, CARDTYPES, RANK, 'capacity', LIBRARY_TOTAL];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    Object.keys(input[i]).forEach((k) => {
      (input[i][k] == 0 || input[i][k] == ANY) && delete input[i][k];
    });
  });

  switch (target) {
    case PDA:
    case TWD:
      forms = [MATCH_INVENTORY];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    Object.keys(input[i]).forEach((k) => {
      (input[i][k] == 0 || input[i][k] == ANY) && delete input[i][k];
    });
    if (!input[i].crypt && !input[i].library) delete input[i];
  });

  switch (target) {
    case CRYPT:
      forms = ['set', 'precon'];
      break;
    case LIBRARY:
      forms = ['discipline', 'type', 'set', 'precon'];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    Object.keys(input[i]).forEach((k) => {
      input[i][k] === false && delete input[i][k];
      input[i].value.forEach((j, idx) => {
        if (j === ANY) {
          input[i].value.splice(idx, 1);
        }
      });
    });
  });

  switch (target) {
    case LIBRARY:
      forms = ['blood', 'pool', 'capacity'];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    if (input[i][i] == ANY) {
      delete input[i];
    }
  });

  switch (target) {
    case CRYPT:
      forms = ['capacity'];
      break;
    default:
      forms = [];
      break;
  }
  forms.forEach((i) => {
    input[i].value.forEach((j, idx) => {
      if (j[i] === ANY) {
        input[i].value.splice(idx, 1);
      }
    });
  });

  switch (target) {
    case CRYPT:
    case ANALYZE:
    case PDA:
    case TWD:
      forms = ['clan', 'sect'];
      break;
    case LIBRARY:
      forms = ['clan', 'sect', 'title'];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    input[i].value = input[i].value.filter((i) => {
      return i !== ANY;
    });
  });

  switch (target) {
    case ANALYZE:
    case PDA:
    case TWD:
      forms = [CRYPT, LIBRARY];
      break;
    default:
      forms = [];
  }
  forms.forEach((i) => {
    Object.keys(input[i]).forEach((k) => {
      input[i][k] == -1 && delete input[i][k];
    });
  });

  Object.keys(input).forEach((k) => {
    if (
      input[k] == ANY ||
      !input[k] ||
      input[k].length === 0 ||
      (input[k].value && input[k].value.length === 0) ||
      Object.keys(input[k]).length === 0
    ) {
      delete input[k];
    }
  });

  return input;
};

export default sanitizeFormState;
