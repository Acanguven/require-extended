import "jest";
import {expect} from "chai";
import {Core} from "../lib";

let core: Core;

describe("[core.ts]", () => {
  beforeEach(() => {
    core = new Core();
  });

  it("should create new Core", () => {
    // Act
    const core = new Core();

    // Assert
    expect(core).to.be.instanceOf(Core);
  });

  it("should use app-root-path library to pick default location for project root", () => {
    // Assert
    expect(core.rootPath).to.be.an('string');
  });
});
