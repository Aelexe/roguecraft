import { SpellAuraAppliedEvent, SpellAuraRemovedEvent, parseCombatLogLine } from "../logParser";
import { expect } from "chai";
import "mocha";

import * as type from "type-detect";

describe("logParser.parseCombatLogLine", () => {
  it("should parse a spell aura application", () => {
    const event: SpellAuraAppliedEvent = parseCombatLogLine('8/22 13:41:18.227  SPELL_AURA_APPLIED,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0,257506,"Shot in the Dark",0x1,BUFF');
    expect(event.timestamp).to.equal(1534945278227);
    expect(event.event).to.equal("SPELL_AURA_APPLIED");
    expect(event.sourceGuid).to.equal("Player-3725-0A9929AE");
    expect(event.sourceName).to.equal("Aelexe-Frostmourne");
    expect(event.destGuid).to.equal("Player-3725-0A9929AE");
    expect(event.destName).to.equal("Aelexe-Frostmourne");
    expect(event.spellId).to.equal(257506);
    expect(event.spellName).to.equal("Shot in the Dark");
    expect(event.auraType).to.equal("BUFF");
    expect(event.amount).to.equal(0);
  });
  it("should parse a spell aura removal", () => {
    const event: SpellAuraRemovedEvent = parseCombatLogLine('8/22 13:36:39.315  SPELL_AURA_REMOVED,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0,87840,"Running Wild",0x1,BUFF');
    expect(event.timestamp).to.equal(1534944999315);
    expect(event.event).to.equal("SPELL_AURA_REMOVED");
    expect(event.sourceGuid).to.equal("Player-3725-0A9929AE");
    expect(event.sourceName).to.equal("Aelexe-Frostmourne");
    expect(event.destGuid).to.equal("Player-3725-0A9929AE");
    expect(event.destName).to.equal("Aelexe-Frostmourne");
    expect(event.spellId).to.equal(87840);
    expect(event.spellName).to.equal("Running Wild");
    expect(event.auraType).to.equal("BUFF");
    expect(event.amount).to.equal(0);
  });
  it("should throw an error parsing an invalid event", () => {
    expect(() => { parseCombatLogLine('8/22 13:36:39.315  INVALID_EVENT,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0,Player-3725-0A9929AE,"Aelexe-Frostmourne",0x511,0x0') }).to.throw("Event type INVALID_EVENT not valid.");
  });
});
