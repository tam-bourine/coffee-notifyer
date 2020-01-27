require("dotenv").config();
import "source-map-support/register";
const axios = require("axios");

export const handle = (event, _context) => {
  // get AWSIoT1Click event
  const { deviceEvent, placementInfo } = event as any;
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

  const webhookUrl = process.env.WEBHOOK_URL;
  console.log({ webhookUrl });

  try {
    axios.post(webhookUrl, {
      text: text,
      username: placementInfo.placementName,
      icon_emoji: placementInfo.attributes.icon_emoji
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