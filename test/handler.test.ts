import { dev } from "../handler";
const _context = require("aws-lambda-mock-context"); // eslint-disable-line
const event = require("../button-dummy-osaka.json"); // eslint-disable-line

describe("handler/dev", () => {
  it("exec dev func", () => {
    const response = dev(event, _context);
    expect(typeof response).toBe("string");
  });
});
