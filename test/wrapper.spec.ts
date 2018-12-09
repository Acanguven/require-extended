import "jest";
import {expect} from "chai";
import sinon from "sinon";
import {Wrapper} from "../lib/wrapper";
import faker from "faker";
import {MATCH_RESULT} from "../lib/enums";

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

  it("should add new plugin", () => {
    // Arrange
    const wrapper = new Wrapper();
    const plugin = {
      resolver: sandbox.spy(),
      loader: sandbox.spy()
    };

    // Act
    wrapper.addPlugin(plugin);

    // Assert
    const addedResolver = wrapper.resolvers.find(resolver => resolver.__plugin === plugin);
    const addedLoader = wrapper.loaders.find(loader => loader.__plugin === plugin);
    expect(addedResolver.__plugin).to.eq(plugin);
    expect(addedLoader.__plugin).to.eq(plugin);
  });

  it("should remove plugin", () => {
    // Arrange
    const wrapper = new Wrapper();
    const plugin = {
      resolver: sandbox.spy(),
      loader: sandbox.spy()
    };
    const plugin2 = {
      resolver: sandbox.spy(),
      loader: sandbox.spy()
    };

    // Act
    wrapper.addPlugin(plugin);
    wrapper.addPlugin(plugin2);
    wrapper.removePlugin(plugin);

    // Assert
    const addedResolver = wrapper.resolvers.find(resolver => resolver.__plugin === plugin);
    const addedLoader = wrapper.loaders.find(loader => loader.__plugin === plugin);
    const addedResolver2 = wrapper.resolvers.find(resolver => resolver.__plugin === plugin2);
    const addedLoader2 = wrapper.loaders.find(loader => loader.__plugin === plugin2);
    expect(addedResolver).to.eq(undefined);
    expect(addedLoader).to.eq(undefined);
    expect(addedResolver2).to.not.eq(undefined);
    expect(addedLoader2).to.not.eq(undefined);
  });

  it("should load from loaders on match", () => {
    // Arrange
    const wrapper = new Wrapper();
    const match = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const plugin = {
      loader: sandbox.stub().returns(match)
    };
    wrapper.addPlugin(plugin);

    // Act
    const result = wrapper._load(request, parent, isMain);

    // Assert
    expect(result).to.eq(match);
  });

  it("should use real load if there is no loader matched", () => {
    // Arrange
    const wrapper = new Wrapper();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const aModule = faker.random.word();
    const plugin = {
      loader: sandbox.stub().returns(MATCH_RESULT.NO_MATCH)
    };
    wrapper.addPlugin(plugin);
    wrapper.addPlugin(plugin);
    const spy = sandbox.stub(wrapper, '_loadRef').returns(aModule);

    // Act
    const result = wrapper._load(request, parent, isMain);

    // Assert
    expect(result).to.eq(aModule);
    expect(spy.calledWithExactly(request, parent, isMain));
  });

  it("should resolve from resolvers (calling next with multiple resolver)", () => {
    // Arrange
    const wrapper = new Wrapper();
    const match = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const plugin = {
      resolver: sandbox.stub().callsArgWith(3, match, parent, isMain)
    };
    const plugin2 = {
      resolver: sandbox.stub().callsArgWith(3, match, parent, isMain)
    };
    const spy = sandbox.stub(wrapper, '_resolveFilenameRef');
    wrapper.addPlugin(plugin);
    wrapper.addPlugin(plugin2);

    // Act
    wrapper._resolveFilename(request, parent, isMain);

    // Assert
    expect(spy.calledWithExactly(match, parent, isMain)).to.eq(true);
  });

  it("should resolve from resolvers (calling next with single resolver)", () => {
    // Arrange
    const wrapper = new Wrapper();
    const match = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const plugin = {
      resolver: sandbox.stub().callsArgWith(3, match, parent, isMain)
    };
    const spy = sandbox.stub(wrapper, '_resolveFilenameRef');
    wrapper.addPlugin(plugin);

    // Act
    wrapper._resolveFilename(request, parent, isMain);

    // Assert
    expect(spy.calledWithExactly(match, parent, isMain)).to.eq(true);
  });

  it("should resolve from resolvers (calling restart)", () => {
    // Arrange
    const wrapper = new Wrapper();
    const match = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const plugin = {
      resolver: sandbox.stub().onFirstCall().callsArgWith(4, match, parent, isMain).onSecondCall().callsArgWith(3, match, parent, isMain)
    };
    const spy = sandbox.stub(wrapper, '_resolveFilenameRef');
    wrapper.addPlugin(plugin);

    // Act
    wrapper._resolveFilename(request, parent, isMain);

    // Assert
    expect(spy.calledWithExactly(match, parent, isMain)).to.eq(true);
  });

  it("should resolve with real resolver if no plugins registered", () => {
    // Arrange
    const wrapper = new Wrapper();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const spy = sandbox.stub(wrapper, '_resolveFilenameRef');

    // Act
    wrapper._resolveFilename(request, parent, isMain);

    // Assert
    expect(spy.calledWithExactly(request, parent, isMain)).to.eq(true);
  });
});
