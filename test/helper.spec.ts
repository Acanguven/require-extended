import "jest";
import {expect} from "chai";
import faker from "faker";
import {Helper} from "../lib/helper";

describe("[helper.ts]", () => {

  it("should create new helper", () => {
    // Arrange
    const wrapper = new Helper();

    // Assert
    expect(wrapper).to.be.instanceOf(Helper);
  });

  it("should match with string", () => {
    // Arrange
    const matcher = faker.random.word();
    const helper = new Helper();

    // Act
    const result = helper.match(matcher, matcher);

    // Assert
    expect(result).to.eq(true);
  });

  it("should match with regex", () => {
    // Arrange
    const input = faker.random.word();
    const regex = new RegExp(input);
    const helper = new Helper();

    // Act
    const result = helper.match(regex, input);

    // Assert
    expect(result).to.eq(true);
  });

  it("should match with fn", () => {
    // Arrange
    const input = faker.random.word();
    const fn = () => true;
    const helper = new Helper();

    // Act
    const result = helper.match(fn, input);

    // Assert
    expect(result).to.eq(true);
  });

  it("should return false when unknown type received", () => {
    // Arrange
    const input = faker.random.word();
    const unkownType = {};
    const helper = new Helper();

    // Act
    const result = helper.match(unkownType as any, input);

    // Assert
    expect(result).to.eq(false);
  });
});
