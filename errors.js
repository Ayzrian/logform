/* eslint no-undefined: 0 */
'use strict';

const format = require('./format');
const { LEVEL, MESSAGE } = require('triple-beam');

/*
 * function errors (info)
 * If the `message` property of the `info` object is an instance of `Error`,
 * replace the `Error` object its own `message` property.
 *
 * Optionally, the Error's `stack` property can also be appended to the `message` property.
 * For backward compatibility also include stack property into info object.
 */
module.exports = format((einfo, { stack }) => {
  if (einfo instanceof Error) {
    const info = Object.assign({}, einfo, {
      level: einfo.level,
      [LEVEL]: einfo[LEVEL] || einfo.level,
      message: einfo.message,
      [MESSAGE]: einfo[MESSAGE] || einfo.message
    });

    if (stack) {
      info[MESSAGE] += '\n' + einfo.stack;
      info.message = info[MESSAGE];
      info.stack = einfo.stack;
    }

    return info;
  }

  if (!(einfo.message instanceof Error)) return einfo;

  // Assign all enumerable properties and the
  // message property from the error provided.
  const err = einfo.message;
  Object.assign(einfo, err);
  einfo.message = err.message;
  einfo[MESSAGE] = err.message;

  // Assign the stack if requested.
  if (stack) {
    einfo[MESSAGE] += '\n' + err.stack;
    einfo.message = einfo[MESSAGE];
    einfo.stack = err.stack;
  }

  return einfo;
});
