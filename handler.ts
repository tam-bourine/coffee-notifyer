require("dotenv").config();
import "source-map-support/register";
import axios from "axios";

export const dev = (event, _context) => {
  const webhook_url = process.env.SLACK_WEBHOOK_URL; // eslint-disable-line

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
  try {
    axios.post(webhook_url, {
      text: text,
      username: placementInfo.placementName,
      icon_emoji: placementInfo.attributes.icon_emoji // eslint-disable-line
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "webhook post success",
        input: event
      })
    };
  } catch (err) {
    console.log({ err });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "webhook post failed",
        input: event
      })
    };
  }
};
