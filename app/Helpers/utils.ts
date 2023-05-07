"use strict";
import { Readable } from "stream";
import slugify from "slugify";
// import Env from "@ioc:Adonis/Core/Env";
// import { merge } from 'lodash'

export const STANDARD_DATE_TIME_FORMAT = "yyyy-LL-dd HH:mm:ss";
export const TIMEZONE_DATE_TIME_FORMAT = "yyyy-LL-dd HH:mm:ss ZZ";
export const DATE_FORMAT = "yyyy-LL-dd";
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
export const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
export const urlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

/**
 * An utility function which returns a random number
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {Promise<Number>} Random value
 * @throws {Error}
 */
export const generateCode = function (
  min: number,
  max: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!min || !max) reject(new Error("Incomplete parameters"));
    const code = Math.floor(Math.random() * (max - min) + min);
    return resolve(code);
  });
};

export const bytesToKbytes = (bytes: number) =>
  Math.round((bytes / 1000) * 100) / 100;

export const streamToBuffer = (stream: Readable) =>
  new Promise((resolve, reject) => {
    const chunks: Array<Uint8Array> = [];
    stream.on("data", (chunk: Uint8Array) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });

export const nameToSlug = (name: string, options = { replacement: "-" }) =>
  slugify(name, options);

export const nameToCollectionName = (name: string) =>
  slugify(name, { replacement: "_", lower: true });

// export const commonEmailProperties = function () {
//   const APP_NAME = Env.get("APP_NAME");
//   const APP_SENDING_EMAIL = Env.get("APP_SENDING_EMAIL");

//   return { APP_NAME, APP_SENDING_EMAIL };
// };

// export const getPrintServerBaseUrl = function () {
//   let host: string
//   let port: number
//   const NODE_ENV = Env.get('NODE_ENV')

//   if (NODE_ENV === 'production' || NODE_ENV === 'testing') {
//     host = Env.get('PROD_PRINT_SERVER_HOST')
//     port = Env.get('PROD_PRINT_SERVER_PORT')
//   } else {
//     host = Env.get('DEV_PRINT_SERVER_HOST')
//     port = Env.get('DEV_PRINT_SERVER_PORT')
//   }

//   return `http://${host}:${port}`
// }

// export const isProduction = Env.get('NODE_ENV') === 'production'
// export const isDevelopment = Env.get('NODE_ENV') === 'development'
