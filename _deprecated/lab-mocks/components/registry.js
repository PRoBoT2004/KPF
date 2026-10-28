import * as A from "./counter";
import * as B from "./canvas";
import * as Cc from "./edition";

// id → section mock. Rows: hero, work, code, process, about, contact. Columns: a, b, c.
export const MOCKS = {
  "hero-a": A.CounterHero, "work-a": A.CounterWork, "code-a": A.CounterDesignCode,
  "process-a": A.CounterProcess, "about-a": A.CounterAbout, "contact-a": A.CounterContact,
  "hero-b": B.CanvasHero, "work-b": B.CanvasWork, "code-b": B.CanvasDesignCode,
  "process-b": B.CanvasProcess, "about-b": B.CanvasAbout, "contact-b": B.CanvasContact,
  "hero-c": Cc.EditionHero, "work-c": Cc.EditionWork, "code-c": Cc.EditionDesignCode,
  "process-c": Cc.EditionProcess, "about-c": Cc.EditionAbout, "contact-c": Cc.EditionContact,
};
