import { saveFileService } from './SaveFileService';
import dragonageConfig from '../assets/data/dragonage.json';
import ordering from '../assets/data/quest-ordering.json';

const { guids, quests } = dragonageConfig.default;

const questEntry = (guid, flags) => ({
  [guids.plot_guid]: { value: `${guid}\0\0` },
  ...Object.fromEntries(guids.plot_flags.map((id, i) => [id, { value: flags[i] || 0 }])),
});

describe('_hasFlag', () => {
  it.each([
    [0, [1, 0, 0, 0]],
    [31, [2 ** 31, 0, 0, 0]],
    [32, [0, 1, 0, 0]],
    [63, [0, 2 ** 31, 0, 0]],
    [64, [0, 0, 1, 0]],
    [96, [0, 0, 0, 1]],
  ])('reads flag %i from the right plot word', (flag, plot) => {
    expect(saveFileService._hasFlag(plot, flag)).toBeTruthy();
    expect(saveFileService._hasFlag([0, 0, 0, 0], flag)).toBeFalsy();
  });
});

describe('_process', () => {
  it('rejects unknown save versions', () => {
    expect(() => saveFileService._process({ file_version: 'V9.9', plot_data: [] })).toThrow(/Unknown file format/);
  });

  it('maps quest flags to labelled choices grouped by chapter', () => {
    const [guid, quest] = Object.entries(quests).find(([, q]) =>
      q.choices.some(c => !c.exclude && c.flags && Object.keys(c.flags).some(k => /^\d+$/.test(k) && typeof c.flags[k] === 'string')));
    const choice = quest.choices.find(c => !c.exclude && c.flags && Object.keys(c.flags).some(k => /^\d+$/.test(k) && typeof c.flags[k] === 'string'));
    const flag = Number(Object.keys(choice.flags).find(k => /^\d+$/.test(k) && typeof choice.flags[k] === 'string'));
    const plot = [0, 0, 0, 0];
    plot[Math.floor(flag / 32)] = 2 ** (flag % 32);

    const result = saveFileService._process({ file_version: 'V1.1', plot_data: [questEntry(guid, plot)] });

    expect(result).toHaveLength(ordering.dragonage.length);
    expect(result.flat()).toContainEqual(expect.objectContaining({
      chapter: quest.chapter,
      question: choice.label,
    }));
  });
});
