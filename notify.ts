require("dotenv").config();
import "source-map-support/register";
import * as https from "https";
import * as url from "url";

export const handle = (event, _context) => {
  console.log({ event });
  // get AWSIoT1Click event
  const { deviceEvent, placementInfo } = event as any;
  console.log({ deviceEvent, placementInfo });
  const clickType = deviceEvent.buttonClicked.clickType;
  let text = "";
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
  console.log({ text });
  if (!text) return false;

  let status = "dummy";

  if (!event.path) {
    return (status = "not found requested place");
  }
  // const path = event.path as string;
  const path = event.pathParameters.place as string;
  console.log({ path });
  let webhookUrl = "";

  if ("osaka" === path) {
    webhookUrl = process.env.SLACK_WEBHOOK_OSAKA;
  } else if ("tokyo" === path) {
    webhookUrl = process.env.SLACK_WEBHOOK_TOKYO;
  } else {
    webhookUrl = process.env.SLACK_WEBHOOK_DEV;
  }

  const req = https.request(url.parse(webhookUrl), res => {
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
