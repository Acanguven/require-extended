import "jest";
import {expect} from "chai";
import {Core} from "../lib/core";
import sinon, {SinonMock} from "sinon";
import {IWrapper} from "../lib/wrapper";
import faker from "faker";
import {Binding} from "../lib/binding";
import {IHelper} from "../lib/helper";
import {Mimic} from "../lib/mimic";

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

const sandbox = sinon.createSandbox();
let wrapperMock: SinonMock;
let helperMock: SinonMock;

describe("[core.ts]", () => {
  beforeEach(() => {
    wrapperMock = sandbox.mock(wrapper);
    helperMock = sandbox.mock(helper);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create new Core", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").once();

    // Act
    const core = new Core(wrapper, helper);

    // Assert
    expect(core).to.be.instanceOf(Core);
  });

  it("should use app-root-path library to pick default location for project root", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").once();
    const core = new Core(wrapper, helper);

    // Assert
    expect(core.rootPath).to.be.an('string');
  });

  it("should set root", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").once();
    const core = new Core(wrapper, helper);

    // Act
    core.setRoot(__dirname);

    // Assert
    expect(core.rootPath).to.eq(__dirname)
  });

  it("should set root when relative path given. Path should be relative to be the caller method", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").once();
    const core = new Core(wrapper, helper);

    // Act
    core.setRoot('./');

    // Assert
    expect(core.rootPath).to.eq(__dirname)
  });

  it("should create new binding", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").twice();

    const matcher = faker.random.word();
    const target = faker.random.word();
    const core = new Core(wrapper, helper);

    // Act
    const binding = core.binding(matcher, target);

    // Assert
    expect(binding).to.be.instanceOf(Binding);
  });

  it("should create new mimic", () => {
    // Arrange
    wrapperMock.expects("wrapModule");
    wrapperMock.expects("addPlugin").twice();

    const matcher = faker.random.word();
    const target = faker.random.word();
    const core = new Core(wrapper, helper);

    // Act
    const binding = core.mimic(matcher, target);

    // Assert
    expect(binding).to.be.instanceOf(Mimic);
  });
});
