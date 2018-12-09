import "jest";
import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {IWrapper} from "../lib/wrapper";
import {IHelper} from "../lib/helper";
import faker from "faker";
import {RootResolver} from "../lib/root-resolver";
import {ICore} from "../lib/core";

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

describe("[binding.ts]", () => {
  beforeEach(() => {
    wrapperMock = sandbox.mock(wrapper);
    helperMock = sandbox.mock(helper);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create new root resolver", () => {
    // Arrange
    const config = {
      enabled: true,
      prefix: '~'
    };
    const rootResolver = new RootResolver(wrapper, helper, config, {rootPath: ''} as ICore);

    // Assert
    expect(rootResolver).to.be.instanceOf(RootResolver);
  });

  it("should replace path with root when prefix found (second character /)", () => {
    // Arrange
    const path = faker.random.word();
    const request = `~/${path}`;
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const config = {
      enabled: true,
      prefix: '~'
    };
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    const core = {
      rootPath: faker.random.word()
    } as ICore;
    const rootResolver = new RootResolver(wrapper, helper, config, core);

    // Act
    rootResolver.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyRestart.calledWithExactly(`${core.rootPath}/${path}`, parent, isMain)).to.eq(true);
  });

  it("should replace path with root when prefix found (second character is not /)", () => {
    // Arrange
    const path = faker.random.word();
    const request = `~${path}`;
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const config = {
      enabled: true,
      prefix: '~'
    };
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    const core = {
      rootPath: faker.random.word()
    } as ICore;
    const rootResolver = new RootResolver(wrapper, helper, config, core);

    // Act
    rootResolver.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyRestart.calledWithExactly(`${core.rootPath}/${path}`, parent, isMain)).to.eq(true);
  });

  it("should call next if not matched", () => {
    // Arrange
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const config = {
      enabled: true,
      prefix: '~'
    };
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    const core = {
      rootPath: faker.random.word()
    } as ICore;
    const rootResolver = new RootResolver(wrapper, helper, config, core);

    // Act
    rootResolver.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyNext.calledWithExactly(request, parent, isMain)).to.eq(true);
  });

  it("should call next if config is not enabled", () => {
    // Arrange
    const path = faker.random.word();
    const request = `~${path}`;
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const config = {
      enabled: false,
      prefix: '~'
    };
    const spyNext = sinon.spy();
    const spyRestart = sinon.spy();
    const core = {
      rootPath: faker.random.word()
    } as ICore;
    const rootResolver = new RootResolver(wrapper, helper, config, core);

    // Act
    rootResolver.resolver(request, parent, isMain, spyNext, spyRestart);

    // Assert
    expect(spyNext.calledWithExactly(request, parent, isMain)).to.eq(true);
  });
});
