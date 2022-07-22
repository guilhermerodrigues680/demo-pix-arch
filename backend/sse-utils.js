/**
 * @param {import('express').Response} res
 * @param {string | number} comment
 * @returns
 */
function sendComment(res, comment = "") {
  res.write(`: ${comment}\n\n`);
}

/**
 * @param {import('express').Response} res
 * @param {any} evtData
 * @param {string | number} id
 * @returns
 */
function sendMessage(res, evtData, id = undefined) {
  id !== undefined && res.write(`id: ${id}\n`);
  res.write(`data: ${evtData}\n\n`);
}

/**
 * @param {import('express').Response} res
 * @param {string} evtName
 * @param {any} evtData
 * @param {string | number} id
 * @returns
 */
function sendTypedEvent(res, evtName, evtData, id = undefined) {
  id !== undefined && res.write(`id: ${id}\n`);
  res.write(`event: ${evtName}\n`);
  res.write(`data: ${evtData}\n\n`);
}

/**
 * Tell the client to retry every milliseconds if connectivity is lost
 * @param {import('express').Response} res
 * @param {number} ms valor default = 5 segundos
 */
function setClientRetryInterval(res, ms = 5000) {
  res.write(`retry: ${ms}\n\n`);
}

export { sendComment, sendMessage, sendTypedEvent, setClientRetryInterval };
