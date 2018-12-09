import "jest";
import {expect} from "chai";
import sinon from "sinon";
import {Wrapper} from "../lib/wrapper";

const Module = require('module').Module;

const sandbox = sinon.createSandbox();

describe("[wrapper.ts]", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("should create new wrapper", () => {
    // Arrange
    const wrapper = new Wrapper();

    // Assert
    expect(wrapper).to.be.instanceOf(Wrapper);
  });

  it("should wrap Module inner functions", () => {
    // Arrange
    const wrapper = new Wrapper();

    // Act
    wrapper.wrapModule();

    // Assert
    expect(Module._require__extended).to.eq(wrapper);

    // Clear
    wrapper.unwrapModule();
  });

  it("should clear unwrap Module", () => {
    // Arrange
    const realMethod = Module._resolveFileName;
    const wrapper = new Wrapper();

    // Act
    wrapper.wrapModule();
    wrapper.unwrapModule();

    // Assert
    expect(Module._require__extended).to.not.eq(wrapper);
    expect(Module._resolveFileName).to.eq(realMethod);
  });

  it("should return same ref when trying to wrap again", () => {
    // Arrange
    const wrapper = new Wrapper();
    const wrapper2 = new Wrapper();

    // Act
    wrapper.wrapModule();
    wrapper2.wrapModule();

    // Assert
    expect(Module._require__extended).to.eq(wrapper);

    // Clear
    wrapper.unwrapModule();
  });
});
