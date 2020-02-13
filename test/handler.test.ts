/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { slackSendMessage } from "../handler";
const _context = require("aws-lambda-mock-context");
const event = require("../button-dummy-osaka.json");
const expectedResponseBody = require("../response-body.json");

describe("handler/slackSendMessage", () => {
  it("exec func and check response", () => {
    const response = slackSendMessage(event, _context);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(expectedResponseBody));
  });
});
