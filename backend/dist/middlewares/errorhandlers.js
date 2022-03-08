"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewarePageNotFound = exports.middlewareServerError = void 0;
/*
    error 500
*/
function middlewareServerError(_req, res, next) {
    if (res.statusCode !== 500) {
        next();
    }
    else {
        res.status(500).json({
            message: "Our servers had an internal problem please comeback later",
            status: 500,
        });
    }
}
exports.middlewareServerError = middlewareServerError;
/*
      error 404
  */
function middlewarePageNotFound(_req, res, next) {
    if (res.statusCode !== 404) {
        next();
    }
    else {
        res.status(404).json({
            message: "page not found",
            status: 404,
        });
    }
}
exports.middlewarePageNotFound = middlewarePageNotFound;
