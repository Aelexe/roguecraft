import fs = require("fs");

export class CombatLogEvent {
  private _timestamp: number;
  private _event: string;
  private _sourceGuid: string;
  private _sourceName: string;
  private _destGuid: string;
  private _destName: string;

  constructor(timestamp: number, event: string,
    sourceGuid: string, sourceName: string, destGuid: string, destName: string) {
    this._timestamp = timestamp;
    this._event = event;
    this._sourceGuid = sourceGuid;
    this._sourceName = sourceName;
    this._destGuid = destGuid;
    this._destName = destName;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get event(): string {
    return this._event;
  }

  get sourceGuid(): string {
    return this._sourceGuid;
  }

  get sourceName(): string {
    return this._sourceName;
  }
}

export class SpellEvent extends CombatLogEvent {
  private spellId: number;
  private spellName: string;
  private spellSchool: number;

  constructor(timestamp: number, event: string,
    sourceGuid: string, sourceName: string, destGuid: string, destName: string,
    spellId: number, spellName: string, spellSchool: number) {
    super(timestamp, event, sourceGuid, sourceName, destGuid, destName);
    this.spellId = spellId;
    this.spellName = spellName;
    this.spellSchool = spellSchool;
  }
}

export class SpellAuraRemovedEvent extends SpellEvent {
  private auraType: string;
  private amount: number;

  constructor(timestamp: number, event: string,
    sourceGuid: string, sourceName: string, destGuid: string, destName: string,
    spellId: number, spellName: string, spellSchool: number, auraType: string, amount: number) {
    super(timestamp, event, sourceGuid, sourceName, destGuid, destName, spellId, spellName, spellSchool);
    this.auraType = auraType;
    this.amount = amount;
  }
}

/*fs.readFile("D:/WoWCombatLog.txt", "utf8", (err, data) => {
  if (err) {
    throw err;
  }
  const lines: string[] = data.split("\n");

  lines.forEach((line) => {
    parseCombatLine(line);
  });
});*/

export const parseCombatLogLine = (line: string): CombatLogEvent => {
  line = line.replace("  ", ",");
  const data: string[] = line.split(",");

  const timestamp = parseCombatTimestamp(data[0]);
  const eventType = data[1];
  const sourceGuid = data[2];
  const sourceName = data[3].replace(/"/g, "");
  const destGuid = data[6];
  const destName = data[7].replace(/"/g, "");

  if (eventType.indexOf("SPELL") === 0) {
    const spellId = parseInt(data[8], 16);
    const spellName = data[9];
    const spellSchool = parseInt(data[10], 16);

    if (eventType.indexOf("_AURA_REMOVED") !== -1) {
      const auraType = data[11];
      const amount = data[12] !== undefined ? parseInt(data[12], 10) : 0;

      return new SpellAuraRemovedEvent(timestamp, eventType,
        sourceGuid, sourceName, destGuid, destName,
        spellId, spellName, spellSchool, auraType, amount);
    }
  }

  throw new Error("Event type " + eventType + " not valid.");
};

export const parseCombatTimestamp = (timestampString: string): number => {
  const timestamp = new Date();
  const regex = /^(\d+)\/(\d+) (\d+):(\d+):(\d+).(\d+)$/;
  const match = regex.exec(timestampString);

  timestamp.setUTCFullYear(2018);
  timestamp.setUTCMonth(parseInt(match[1], 10) - 1);
  timestamp.setUTCDate(parseInt(match[2], 10));
  timestamp.setUTCHours(parseInt(match[3], 10));
  timestamp.setUTCMinutes(parseInt(match[4], 10));
  timestamp.setUTCSeconds(parseInt(match[5], 10));
  timestamp.setUTCMilliseconds(parseInt(match[6], 10));

  return timestamp.getTime();
};
