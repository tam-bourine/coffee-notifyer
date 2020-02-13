/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */

require("dotenv").config();
import "source-map-support/register";
import axios from "axios";

// ----------
// types
type GetAWSIoT1ClickEventParams = {
  deviceEvent: {
    buttonClicked: {
      clickType: string;
    };
  };
  placementInfo: {
    attributes: {
      single: string;
      double: string;
      long: string;
    };
  };
};
// ----------

// get AWSIoT1Click event
export const getAWSIoT1ClickEvent = ({
  deviceEvent,
  placementInfo
}: GetAWSIoT1ClickEventParams) => {
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
  return text;
};

export const sendMessage = (event, _context) => {
  const webhook_url = process.env.SLACK_WEBHOOK_URL;
  const { deviceEvent, placementInfo } = event;

  // get AWSIoT1Click event
  const text = getAWSIoT1ClickEvent({ deviceEvent, placementInfo });
  try {
    axios.post(webhook_url, {
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
