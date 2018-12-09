import "jest";
import {expect} from "chai";
import sinon from "sinon";
import root from "../lib";
import {Wrapper} from "../lib/wrapper";
import {Core} from "../lib/core";

const sandbox = sinon.createSandbox();

describe("[index.ts]", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("should export function that creates new Core", () => {
    expect(root).to.be.a('function');
  });

  it("should create new core", () => {
    // Arrange
    const spy = sandbox.stub(Wrapper.prototype, 'wrapModule');

    // Act
    const core = root();

    // Assert
    expect(core).to.be.instanceOf(Core);
    expect(spy.calledOnce).to.eq(true)
  });
});
