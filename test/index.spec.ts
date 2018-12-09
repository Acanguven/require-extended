import "jest";
import {expect} from "chai";
import sinon from "sinon";
import {Wrapper} from "../lib/wrapper";
import {Core} from "../lib/core";

const requireExtended = require('../lib');
const sandbox = sinon.createSandbox();
let core1: Core, core2: Core;

describe("[index.ts]", () => {
  afterEach(() => {
    sandbox.restore();
    delete require.cache[require.resolve('../lib')]
  });

  it("should export function that creates new Core", () => {
    expect(require('../lib')).to.be.a('function');
  });

  it("should create new core", () => {
    // Arrange
    const spy = sandbox.stub(Wrapper.prototype, 'wrapModule');

    // Act
    core1 = require('../lib')();

    // Assert
    expect(core1).to.be.instanceOf(Core);
    expect(spy.calledOnce).to.eq(true);
  });

  it("should return existing core", () => {
    // Arrange
    const spy = sandbox.stub(Wrapper.prototype, 'wrapModule');

    // Act
    core2 = require('../lib')();

    // Assert
    expect(core2).to.be.instanceOf(Core);
    expect(core2).to.eq(core1);
    expect(spy.callCount).to.eq(0);
  });
});
