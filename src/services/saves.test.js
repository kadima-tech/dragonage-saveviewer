import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createContext, runInContext } from 'node:vm';
import { saveFileService } from './SaveFileService';

const parse = (fixture) => {
  const context = createContext({});
  context.self = context;
  for (const file of ['byte-buffer.js', 'jspack.js', 'datatypes.js', 'gff4.js']) {
    runInContext(readFileSync(resolve('public/lib/jsgff/dist', file), 'utf8'), context);
  }
  const bytes = readFileSync(resolve('src/test/fixtures', fixture));
  const result = new context.GFF4().read_gff4(new context.ByteBuffer(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length)));
  return saveFileService._process({ file_version: result.header.file_version, plot_data: result[16003][16400][16401] });
};

const answers = (fixture) => Object.fromEntries(parse(fixture).flat().map(({ question, choice }) => [question, choice]));

const CIRCLE = 'Who did the Warden support at the Broken Circle?';
const BEAST = 'How did the Warden resolve the problems between the werewolves and the elves? [*]';

it('extracts the choices from a generated Origins save', () => {
  expect(answers('default.das')).toMatchObject({
    "What was your hero's origin?": 'Human Noble',
    [CIRCLE]: 'Mages supported',
    [BEAST]: 'Brokered peace',
    'Did the Warden recruit Dog?': 'Recruited',
    'Did the Warden recruit Leliana?': 'Recruited',
    'Did the Warden recruit Zevran?': 'Recruited',
    'Did the Warden recruit Alistair?': 'Not recruited',
  });
});

it('reflects different story decisions', () => {
  const base = answers('default.das');
  const other = answers('templars-werewolves.das');

  expect(other[CIRCLE]).toBe('Templars supported');
  expect(other[BEAST]).toBe('Sided with werewolves');

  const changed = Object.keys(base).filter((question) => base[question] !== other[question]);
  expect(changed.sort()).toEqual([CIRCLE, BEAST].sort());
});
