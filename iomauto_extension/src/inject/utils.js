const manifestData = chrome.runtime.getManifest();
const VERSION = manifestData.version

function log(msg, ...args) {
  console.log(`[IOMAutoMod v${VERSION}] < log >`, msg, ...args)
}
function logDebug(msg, ...args) {
  console.log(`[IOMAutoMod v${VERSION}] <debug>`, msg, ...args)
}

function logError(msg, ...args) {
  console.error(`[IOMAutoMod v${VERSION}] <error>`, msg, ...args)
}

function logErrorNotification(error, ...args) {
  chrome.storage.sync.set({
    moduleStatus: MODULE_STATUS.ERROR,
    error,
  })
  logError(error, ...args)
}

function css(element, style) {
  for (const property in style)
      element.style[property] = style[property];
}

/**
 * используем sendMessage в background.js чтобы там CORS не мешал
 * chrome.runtime.onMessage.addListener(
 * @param url
 * @return {Promise<unknown>}
 */
async function fetchFromExtension(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        url,
      },
      ([okData, error]) => {
        // response.text().then((responseText) => {
        //   resolve(responseText)
        // })
        if (okData) {
          const {
            body,
            status,
            statusText,
          } = okData
          resolve(body)
        } else {
          // todo @ANKU @LOW - иногда долго сайт отвечает, сделать оповещение и запустить еще раз
          reject(error)
        }
      },
    )
  })
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

class IOMError extends Error {
  errorMsg
  constructor(message, ...otherArgs) {
    super(message);
    // todo @LOW - почему-то .message возвращает undefined
    this.errorMsg = message
    this.otherArgs = otherArgs;
  }
}
