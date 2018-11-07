import Parallel from 'paralleljs';
import ordering from '../assets/data/quest-ordering.json';
import dragonageConfig from '../assets/data/dragonage.json';
import dragonage2Config from '../assets/data/dragonage2.json';

class SaveFileService {
  constructor() {
    this.progress = () => {}; // no-op
  }

  setProgressListener = listener => {
    const isFunction = Object.prototype.toString.call(listener) === '[object Function]';

    if (!isFunction) {
      throw new Error('Given parameter to setProgressListener must be a function');
    }

    this.progress = listener;
  }

  upload = async (file) => {
    // Read the file and start the parsing process
    this.progress("parsing");
    const buffer = await this._fetchBuffer(file);

    // Start the processing thread
    const p = new Parallel(buffer,{evalPath: "lib/jsgff/dist/eval.js"});
    p.require('byte-buffer.js').require('jspack.js').require('datatypes.js').require('gff4.js');

    const saveInfo = await p.spawn(function(buffer) {
      /* eslint-disable */
      gff4 = new GFF4();
      bytebuffer = new ByteBuffer(buffer);
      try {
        result = gff4.read_gff4(bytebuffer);
        //TODO: Check file version and use the right flags for Dragon Age 2 support
        return {
          file_version: result.header.file_version,
          plot_data: result[16003][16400][16401]
        };
      } catch(e) {
        return e;
      }
      /* eslint-enable */
    },{},[buffer]);

    this.progress("processing");

    // Now we process
    try {
      return this._process(saveInfo);
    } catch (e) {
      console.error(e);
    }
  }

  _fetchBuffer = file => {
    return new Promise((resolve,reject) => {
      var reader = new FileReader();

      reader.onload = function(result) {
        resolve(result.target.result);
      };
      reader.readAsArrayBuffer(file);

      return reader
    })
  }

  _convert = (quests,game) => {
    if (!quests) {
      throw new Error("No quests found in convert request.");
    }

    const results = quests.reduce((choices, quest) => {
      let config = dragonageConfig.default;
      if (game === 'da2') {
        config = dragonage2Config.default;
      }

      // Pre-process the guid string
      const guid = `${quest[config.guids.plot_guid].value}`.replace(/\0+$/, "");

      // Fetch the quest flags
      const questFlags = [...config.guids.plot_flags];
      const sideQuests = config.quests;

      // Add further side quest choices to the list in case there are any
      if (sideQuests[guid]) {
        const sideQuest = sideQuests[guid];
        const { chapter } = sideQuest;

        const results = sideQuest.choices
            .filter(sideQuest => !sideQuest.exclude)
            .map(sideQuest => ({ choice: this._getChoice(questFlags, sideQuest), sideQuest }))
            .filter(({choice}) => choice && choice.length > 0)
            .map(({choice, sideQuest}) => ({
              chapter: chapter || sideQuests[guid].chapter,
              question: sideQuest.label,
              choice,
              note: sideQuest.note,
            }));

        return [...choices, ...results];
      }

      // Retain the previous choices list
      return choices;
    }, []);

    return results;
  }

  _getChoice = (plot, side_quest) => {
    if (side_quest === null) {
      return null;
    }

    for (const {flag, choice_str} in side_quest.flags) {
      if (typeof(choice_str) === 'object' && this._hasFlag(plot,flag))
        return this._getChoice(plot, choice_str);
      else if (this._hasFlag(plot,flag))
        return choice_str;
    }

    return side_quest.flags ? side_quest.flags.default : null;
  }

  _hasFlag = (plot, flag) => {
    if (flag < 32)
      return (2**flag) & plot[0];
    else if (flag < 74)
      return (2**(flag-32)) & plot[1];
    else if (flag < 96)
      return (2**(flag-64)) & plot[2];
    else if (flag < 128)
      return (2**(flag-96)) & plot[3];
    else
      return false;
  }

  _process = (saveInfo) => {
    let plotOrder = [];
    let data = [];

    // Validate
    if (['V1.1', 'V2.0'].indexOf(saveInfo.file_version) < 0) {
      throw new Error("Unknown file format - cannot convert file version " + saveInfo.file_version);
    }

    if (saveInfo.file_version === "V1.1") {
      data = this._convert(saveInfo.plot_data, "dao");
      plotOrder = ordering.dragonage;
    }
    else {
      data = this._convert(saveInfo.plot_data, "da2");
      plotOrder = ordering.dragonage2;
    }

    // Get the sorted choices
    return plotOrder.map(chapter => data.filter(result => result.chapter === chapter));
  }
}

export const saveFileService = new SaveFileService();
export default saveFileService;
