import {describe, it} from "mocha";
import {expect} from "chai";
import {Core} from "../lib";

describe("[core.ts]", () => {
  it("should create new Core", () => {
    // Act
    const core = new Core();

    // Assert
    expect(core).to.be.instanceOf(Core);
  });
});
