import "jest";
import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {IWrapper} from "../lib/wrapper";
import {IHelper} from "../lib/helper";
import {Binding} from "../lib/binding";
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

describe("[binding.ts]", () => {
  beforeEach(() => {
    wrapperMock = sandbox.mock(wrapper);
    helperMock = sandbox.mock(helper);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create new binding", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const binding = new Binding(wrapper, helper, matcher, target);

    // Assert
    expect(binding).to.be.instanceOf(Binding);
  });

  it("should remove itself from wrapper when restore called", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const binding = new Binding(wrapper, helper, matcher, target);

    // Assert
    wrapperMock.expects("removePlugin").withExactArgs(binding);

    // Act
    binding.restore();
  });

  it("should return target value if it matches with the requested path", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const binding = new Binding(wrapper, helper, matcher, target);
    helperMock.expects("match").withExactArgs(matcher, request).returns(true);

    // Act
    const loadResult = binding.loader(request, parent, isMain);

    // Assert
    expect(loadResult).to.eq(target);
  });

  it("should return NO_MATCH if matcher doesn't match with input", () => {
    // Arrange
    const matcher = faker.random.word();
    const target = faker.random.word();
    const request = faker.random.word();
    const parent = faker.random.word();
    const isMain = faker.random.boolean();
    const binding = new Binding(wrapper, helper, matcher, target);
    helperMock.expects("match").withExactArgs(matcher, request).returns(false);

    // Act
    const loadResult = binding.loader(request, parent, isMain);

    // Assert
    expect(loadResult).to.eq(MATCH_RESULT.NO_MATCH);
  });
});
