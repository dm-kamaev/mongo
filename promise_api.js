#!/usr/local/bin/node

'use strict';

// METHODS FOR WORK WITH PRoMISE

const promise_api = exports;

/**
 * queue –– call promise step by step
 * @param  {Array} data
 * @param  {Function} promise_handler(el_of_array, data_from_prev_promise, index)
 * @return {Promise}
 */
promise_api.queue = function (data, promise_handler) {
  let start = Promise.resolve();
  for (let i = 0, l = data.length; i < l; i++) {
    start = start.then((res) => promise_handler(data[i], res, i));
  }
  return start;
};