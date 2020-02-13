/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { getAWSIoT1ClickEvent, sendMessage } from "../handler";
const _context = require("aws-lambda-mock-context");
const event = require("../button-dummy-osaka.json");
const expectedResponseBody = require("../response-body.json");

describe("handler/getAWSIoT1ClickEvent", () => {
  it("exec func and check value returned", () => {
    const { deviceEvent, placementInfo } = event;
    const text = getAWSIoT1ClickEvent({ deviceEvent, placementInfo });
    expect(text).not.toBe("");
  });
});

describe("handler/slackSendMessage", () => {
  it("exec func and check response sccessed", () => {
    const response = sendMessage(event, _context);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(expectedResponseBody));
  });
});
