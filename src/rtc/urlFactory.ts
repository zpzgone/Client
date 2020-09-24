import config from '@shared/project.config';

let protooPort = 4443;

const hostname =
  config.environment === 'development'
    ? 'rtc.moonrailgun.com'
    : window.location.hostname;

if (hostname === 'test.mediasoup.org') protooPort = 4444;

export function getProtooUrl({ roomId, peerId, forceH264, forceVP9 }) {
  let url = `wss://${hostname}:${protooPort}/?roomId=${roomId}&peerId=${peerId}`;

  if (forceH264) url = `${url}&forceH264=true`;
  else if (forceVP9) url = `${url}&forceVP9=true`;

  return url;
}
