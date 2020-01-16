require('dotenv').config();
import 'source-map-support/register';

import * as https from 'https';
import * as url from 'url';

interface SlackReqOpts {
  method: string;
  headers: { [key: string]: string };
}

export const main = (event, _context, _callback) => {
  const webhook_url = process.env.SLACK_WEBHOOK_URL;
  const slack_req_opts = url.parse(webhook_url) as any as SlackReqOpts;
  slack_req_opts.method = 'POST';
  slack_req_opts.headers = {'Content-type': 'application/json'};

  // get AWSIoT1Click event
  const { deviceEvent, placementInfo } = event as any;
  const clickType = deviceEvent.buttonClicked.clickType;
  let text = null;
  switch (clickType) {
    case 'SINGLE':
      text = placementInfo.attributes.single;
      break;
    case 'DOUBLE':
      text = placementInfo.attributes.double;
      break;
    case 'LONG':
      text = placementInfo.attributes.long;
      break;
  };
  if(text == null) return;

  // send message to slack
  let status = 'dummy';
  const req = https.request(slack_req_opts, res => {
    if (res.statusCode === 200) {
      status = 'posted to slack';
    }
    else {
      status = 'status code:' + res.statusCode;
    }
  });

  req.on('error', e => {
    console.log('problem with request' + e.message);
    _context.fail(e.message);
  });

  req.write(JSON.stringify({
    text: text,
    username: placementInfo.placementName,
    icon_emoji: placementInfo.attributes.icon_emoji
  }));
  req.end();

  return status;
}
