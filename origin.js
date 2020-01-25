exports.handler = (event, context, callback) => {
    const https = require('https');
    const url = require('url');
    const webhook_url = process.env.SLACK_WEBHOOK_URL;
    const slack_req_opts = url.parse(webhook_url);
    slack_req_opts.method = 'POST';
    slack_req_opts.headers = { 'Content-type': 'application/json' };

    var clickType = event.deviceEvent.buttonClicked.clickType;
    var text = null;
    switch (clickType) {
        case 'SINGLE':
            text = event.placementInfo.attributes.single;
            break;
        case 'DOUBLE':
            text = event.placementInfo.attributes.double;
            break;
        case 'LONG':
            text = event.placementInfo.attributes.long;
            break;
    }
    if (text == null) return;

    var req = https.request(slack_req_opts, function (res) {
        if (res.statusCode === 200) {
            context.succeed('posted to slack');
        } else {
            context.fail('status code: ' + res.statusCode);
        }
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        context.fail(e.message);
    });

    req.write(JSON.stringify({
        text: text,
        username: event.placementInfo.placementName,
        icon_emoji: event.placementInfo.attributes.icon_emoji
    }));
    req.end();
};