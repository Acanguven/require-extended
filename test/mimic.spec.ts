import "jest";
import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {IWrapper} from "../lib/wrapper";
import {IHelper} from "../lib/helper";
import {Mimic} from "../lib/mimic";
import faker from "faker";
import {MATCH_RESULT} from "../lib/enums";

const sandbox = sinon.createSandbox();
const mockedMethodCall = () => {
  throw new Error('Mocked method call exception');
};
const wrapper: IWrapper = {
  wrapModule: mockedMethodCall,
  addPlugin: mockedMethodCall,
  removePlugin: mockedMethodCall,
  unwrapModule: mockedMethodCall
};

const helper: IHelper = {
  match: mockedMethodCall
};

let wrapperMock: SinonMock;
let helperMock: SinonMock;

describe("[mimic.ts]", () => {
  beforeEach(() => {
    wrapperMock = sandbox.mock(wrapper);
    helperMock = sandbox.mock(helper);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create new mimic", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const mimic = new Mimic(wrapper, helper, matcher, target);

    // Assert
    expect(mimic).to.be.instanceOf(Mimic);
  });

  it("should remove itself from wrapper when restore called", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const mimic = new Mimic(wrapper, helper, matcher, target);

    // Assert
    wrapperMock.expects("removePlugin").withExactArgs(mimic);

    // Act
    mimic.restore();
  });

  it("should restart the resolving state by changing the requested file if it matches", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const mimic = new Mimic(wrapper, helper, matcher, target);
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    helperMock.expects("match").withExactArgs(matcher, request).returns(true);

    // Act
    mimic.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyNext.called).to.eq(false);
    expect(spyRestart.calledOnce).to.eq(true);
  });

  it("should call next it doesn't match", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const mimic = new Mimic(wrapper, helper, matcher, target);
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    helperMock.expects("match").withExactArgs(matcher, request).returns(false);

    // Act
    mimic.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyRestart.called).to.eq(false);
    expect(spyNext.calledOnce).to.eq(true);
  });
});
