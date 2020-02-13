require("dotenv").config();
import "source-map-support/register";

import * as https from "https";
import * as url from "url";

type SlackReqOpts = {
  method: string;
  headers: { [key: string]: string };
};

export const dev = (event, _context) => {
  const webhook_url = process.env.SLACK_WEBHOOK_URL; // eslint-disable-line
  const slack_req_opts = (url.parse(webhook_url) as any) as SlackReqOpts; // eslint-disable-line
  slack_req_opts.method = "POST"; // eslint-disable-line
  slack_req_opts.headers = { "Content-type": "application/json" }; // eslint-disable-line

  // get AWSIoT1Click event
  const { deviceEvent, placementInfo } = event as any;
  const clickType = deviceEvent.buttonClicked.clickType;
  let text = null;
  switch (clickType) {
    case "SINGLE":
      text = placementInfo.attributes.single;
      break;
    case "DOUBLE":
      text = placementInfo.attributes.double;
      break;
    case "LONG":
      text = placementInfo.attributes.long;
      break;
  }
  if (text == null) return;

  // send message to slack
  let status = "dummy";
  const req = https.request(slack_req_opts, res => {
    if (res.statusCode === 200) {
      status = "posted to slack";
    } else {
      status = "status code:" + res.statusCode;
    }
  });

  req.on("error", e => {
    console.log("problem with request" + e.message);
    _context.fail(e.message);
  });

  req.write(
    JSON.stringify({
      text: text,
      username: placementInfo.placementName,
      icon_emoji: placementInfo.attributes.icon_emoji // eslint-disable-line
    })
  );
  req.end();

  return status;
};
