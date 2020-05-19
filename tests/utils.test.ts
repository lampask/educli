import { expect } from "chai";
import { is_valid_url } from "../src/utils";
import "mocha";

describe("Check valid url function", () => {
  it("should suceed on edupage url", () => {
    const result = is_valid_url("https://domian.edupage.com/");
    expect(result).to.equal(true);
  });
  it("should fail if url does not contain alias of domain edupage", () => {
    const result = is_valid_url("https://edupage.com/");
    expect(result).to.equal(false);
  });
  it("should fail on other url", () => {
    const result = is_valid_url("https://domian.ext/");
    expect(result).to.equal(false);
  });
  it("should fail on non-url string", () => {
    const result = is_valid_url("sgsgkokaew[']']/.");
    expect(result).to.equal(false);
  });
});
