import './index-Ddp2AB5f.js';
import { ZodFirstPartyTypeKind, z } from 'zod';
import { w as writable, d as derived, a as readonly } from './index2-7tr__D8z.js';
import { p as page, n as navigating, i as invalidateAll, a as applyAction } from './stores-CaFYFvqm.js';
import { U as UNDEFINED, N as NAN, P as POSITIVE_INFINITY, h as NEGATIVE_INFINITY, j as NEGATIVE_ZERO, k as decode64, H as HOLE, B as BROWSER, f as stringify } from './stringify-CIuySMKb.js';
import { g as get_store_value, o as onDestroy } from './lifecycle-CY0VpZrS.js';
import { t as tick } from './scheduler-nF4nnj9q.js';

/**
 * Revive a value serialized with `devalue.stringify`
 * @param {string} serialized
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function parse(serialized, revivers) {
	return unflatten(JSON.parse(serialized));
}

/**
 * Revive a value flattened with `devalue.stringify`
 * @param {number | any[]} parsed
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function unflatten(parsed, revivers) {
	if (typeof parsed === 'number') return hydrate(parsed, true);

	if (!Array.isArray(parsed) || parsed.length === 0) {
		throw new Error('Invalid input');
	}

	const values = /** @type {any[]} */ (parsed);

	const hydrated = Array(values.length);

	/**
	 * @param {number} index
	 * @returns {any}
	 */
	function hydrate(index, standalone = false) {
		if (index === UNDEFINED) return undefined;
		if (index === NAN) return NaN;
		if (index === POSITIVE_INFINITY) return Infinity;
		if (index === NEGATIVE_INFINITY) return -Infinity;
		if (index === NEGATIVE_ZERO) return -0;

		if (standalone) throw new Error(`Invalid input`);

		if (index in hydrated) return hydrated[index];

		const value = values[index];

		if (!value || typeof value !== 'object') {
			hydrated[index] = value;
		} else if (Array.isArray(value)) {
			if (typeof value[0] === 'string') {
				const type = value[0];

				switch (type) {
					case 'Date':
						hydrated[index] = new Date(value[1]);
						break;

					case 'Set':
						const set = new Set();
						hydrated[index] = set;
						for (let i = 1; i < value.length; i += 1) {
							set.add(hydrate(value[i]));
						}
						break;

					case 'Map':
						const map = new Map();
						hydrated[index] = map;
						for (let i = 1; i < value.length; i += 2) {
							map.set(hydrate(value[i]), hydrate(value[i + 1]));
						}
						break;

					case 'RegExp':
						hydrated[index] = new RegExp(value[1], value[2]);
						break;

					case 'Object':
						hydrated[index] = Object(value[1]);
						break;

					case 'BigInt':
						hydrated[index] = BigInt(value[1]);
						break;

					case 'null':
						const obj = Object.create(null);
						hydrated[index] = obj;
						for (let i = 1; i < value.length; i += 2) {
							obj[value[i]] = hydrate(value[i + 1]);
						}
						break;

          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            const typedArray = new TypedArrayConstructor(arraybuffer);
            hydrated[index] = typedArray;
            break;
          }

          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }

					default:
						throw new Error(`Unknown type ${type}`);
				}
			} else {
				const array = new Array(value.length);
				hydrated[index] = array;

				for (let i = 0; i < value.length; i += 1) {
					const n = value[i];
					if (n === HOLE) continue;

					array[i] = hydrate(n);
				}
			}
		} else {
			/** @type {Record<string, any>} */
			const object = {};
			hydrated[index] = object;

			for (const key in value) {
				const n = value[key];
				object[key] = hydrate(n);
			}
		}

		return hydrated[index];
	}

	return hydrate(0);
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var collectionClone = clone$2;

/*
  Deep clones all properties except functions

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone$2(obj) {
  let result = obj;
  var type = {}.toString.call(obj).slice(8, -1);
  if (type == 'Set') {
    return new Set([...obj].map(value => clone$2(value)));
  }
  if (type == 'Map') {
    return new Map([...obj].map(kv => [clone$2(kv[0]), clone$2(kv[1])]));
  }
  if (type == 'Date') {
    return new Date(obj.getTime());
  }
  if (type == 'RegExp') {
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == 'Array' || type == 'Object') {
    result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // include prototype properties
      result[key] = clone$2(obj[key]);
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}

// istanbul ignore next
const isObject = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    return false;
};
const merge$1 = (...objects) => objects.reduce((result, current) => {
    if (Array.isArray(current)) {
        throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
    }
    Object.keys(current).forEach((key) => {
        if (["__proto__", "constructor", "prototype"].includes(key)) {
            return;
        }
        if (Array.isArray(result[key]) && Array.isArray(current[key])) {
            result[key] = merge$1.options.mergeArrays
                ? merge$1.options.uniqueArrayItems
                    ? Array.from(new Set(result[key].concat(current[key])))
                    : [...result[key], ...current[key]]
                : current[key];
        }
        else if (isObject(result[key]) && isObject(current[key])) {
            result[key] = merge$1(result[key], current[key]);
        }
        else {
            result[key] =
                current[key] === undefined
                    ? merge$1.options.allowUndefinedOverrides
                        ? current[key]
                        : result[key]
                    : current[key];
        }
    });
    return result;
}, {});
const defaultOptions$2 = {
    allowUndefinedOverrides: true,
    mergeArrays: true,
    uniqueArrayItems: true,
};
merge$1.options = defaultOptions$2;
merge$1.withOptions = (options, ...objects) => {
    merge$1.options = Object.assign(Object.assign({}, defaultOptions$2), options);
    const result = merge$1(...objects);
    merge$1.options = defaultOptions$2;
    return result;
};

const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions$1 = {
    name: undefined,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: false,
    definitions: {},
    errorMessages: false,
    markdownDescription: false,
    patternStrategy: "escape",
    applyRegexFlags: false,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref"
};
const getDefaultOptions = (options) => (typeof options === "string"
    ? {
        ...defaultOptions$1,
        name: options,
    }
    : {
        ...defaultOptions$1,
        ...options,
    });

const getRefs = (options) => {
    const _options = getDefaultOptions(options);
    const currentPath = _options.name !== undefined
        ? [..._options.basePath, _options.definitionPath, _options.name]
        : _options.basePath;
    return {
        ..._options,
        currentPath: currentPath,
        propertyPath: undefined,
        seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
            def._def,
            {
                def: def._def,
                path: [..._options.basePath, _options.definitionPath, name],
                // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                jsonSchema: undefined,
            },
        ])),
    };
};

function addErrorMessage(res, key, errorMessage, refs) {
    if (!refs?.errorMessages)
        return;
    if (errorMessage) {
        res.errorMessage = {
            ...res.errorMessage,
            [key]: errorMessage,
        };
    }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
    res[key] = value;
    addErrorMessage(res, key, errorMessage, refs);
}

function parseAnyDef() {
    return {};
}

function parseArrayDef(def, refs) {
    const res = {
        type: "array",
    };
    if (def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
        res.items = parseDef(def.type._def, {
            ...refs,
            currentPath: [...refs.currentPath, "items"],
        });
    }
    if (def.minLength) {
        setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
    }
    if (def.maxLength) {
        setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
    }
    if (def.exactLength) {
        setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
        setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
    }
    return res;
}

function parseBigintDef(def, refs) {
    const res = {
        type: "integer",
        format: "int64",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function parseBooleanDef() {
    return {
        type: "boolean",
    };
}

function parseBrandedDef(_def, refs) {
    return parseDef(_def.type._def, refs);
}

const parseCatchDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy ?? refs.dateStrategy;
    if (Array.isArray(strategy)) {
        return {
            anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)),
        };
    }
    switch (strategy) {
        case "string":
        case "format:date-time":
            return {
                type: "string",
                format: "date-time",
            };
        case "format:date":
            return {
                type: "string",
                format: "date",
            };
        case "integer":
            return integerDateParser(def, refs);
    }
}
const integerDateParser = (def, refs) => {
    const res = {
        type: "integer",
        format: "unix-time",
    };
    if (refs.target === "openApi3") {
        return res;
    }
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                setResponseValueAndErrors(res, "minimum", check.value, // This is in milliseconds
                check.message, refs);
                break;
            case "max":
                setResponseValueAndErrors(res, "maximum", check.value, // This is in milliseconds
                check.message, refs);
                break;
        }
    }
    return res;
};

function parseDefaultDef(_def, refs) {
    return {
        ...parseDef(_def.innerType._def, refs),
        default: _def.defaultValue(),
    };
}

function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input"
        ? parseDef(_def.schema._def, refs)
        : {};
}

function parseEnumDef(def) {
    return {
        type: "string",
        enum: def.values,
    };
}

const isJsonSchema7AllOfType = (type) => {
    if ("type" in type && type.type === "string")
        return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        parseDef(def.left._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "0"],
        }),
        parseDef(def.right._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "1"],
        }),
    ].filter((x) => !!x);
    let unevaluatedProperties = refs.target === "jsonSchema2019-09"
        ? { unevaluatedProperties: false }
        : undefined;
    const mergedAllOf = [];
    // If either of the schemas is an allOf, merge them into a single allOf
    allOf.forEach((schema) => {
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
            if (schema.unevaluatedProperties === undefined) {
                // If one of the schemas has no unevaluatedProperties set,
                // the merged schema should also have no unevaluatedProperties set
                unevaluatedProperties = undefined;
            }
        }
        else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema &&
                schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            }
            else {
                // As soon as one of the schemas has additionalProperties set not to false, we allow unevaluatedProperties
                unevaluatedProperties = undefined;
            }
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length
        ? {
            allOf: mergedAllOf,
            ...unevaluatedProperties,
        }
        : undefined;
}

function parseLiteralDef(def, refs) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" &&
        parsedType !== "number" &&
        parsedType !== "boolean" &&
        parsedType !== "string") {
        return {
            type: Array.isArray(def.value) ? "array" : "object",
        };
    }
    if (refs.target === "openApi3") {
        return {
            type: parsedType === "bigint" ? "integer" : parsedType,
            enum: [def.value],
        };
    }
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value,
    };
}

/**
 * Generated from the regular expressions found here as of 2024-05-22:
 * https://github.com/colinhacks/zod/blob/master/src/types.ts.
 *
 * Expressions with /i flag have been changed accordingly.
 */
const zodPatterns = {
    /**
     * `c` was changed to `[cC]` to replicate /i flag
     */
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    /**
     * `a-z` was added to replicate /i flag
     */
    email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    /**
     * Constructed a valid Unicode RegExp
     */
    emoji: RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u"),
    /**
     * Unused
     */
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /**
     * Unused
     */
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    /**
     * Unused
     */
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
};
function parseStringDef(def, refs) {
    const res = {
        type: "string",
    };
    function processPattern(value) {
        return refs.patternStrategy === "escape"
            ? escapeNonAlphaNumeric(value)
            : value;
    }
    if (def.checks) {
        for (const check of def.checks) {
            switch (check.kind) {
                case "min":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "max":
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "email":
                    switch (refs.emailStrategy) {
                        case "format:email":
                            addFormat(res, "email", check.message, refs);
                            break;
                        case "format:idn-email":
                            addFormat(res, "idn-email", check.message, refs);
                            break;
                        case "pattern:zod":
                            addPattern(res, zodPatterns.email, check.message, refs);
                            break;
                    }
                    break;
                case "url":
                    addFormat(res, "uri", check.message, refs);
                    break;
                case "uuid":
                    addFormat(res, "uuid", check.message, refs);
                    break;
                case "regex":
                    addPattern(res, check.regex, check.message, refs);
                    break;
                case "cuid":
                    addPattern(res, zodPatterns.cuid, check.message, refs);
                    break;
                case "cuid2":
                    addPattern(res, zodPatterns.cuid2, check.message, refs);
                    break;
                case "startsWith":
                    addPattern(res, RegExp(`^${processPattern(check.value)}`), check.message, refs);
                    break;
                case "endsWith":
                    addPattern(res, RegExp(`${processPattern(check.value)}$`), check.message, refs);
                    break;
                case "datetime":
                    addFormat(res, "date-time", check.message, refs);
                    break;
                case "date":
                    addFormat(res, "date", check.message, refs);
                    break;
                case "time":
                    addFormat(res, "time", check.message, refs);
                    break;
                case "duration":
                    addFormat(res, "duration", check.message, refs);
                    break;
                case "length":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "includes": {
                    addPattern(res, RegExp(processPattern(check.value)), check.message, refs);
                    break;
                }
                case "ip": {
                    if (check.version !== "v6") {
                        addFormat(res, "ipv4", check.message, refs);
                    }
                    if (check.version !== "v4") {
                        addFormat(res, "ipv6", check.message, refs);
                    }
                    break;
                }
                case "emoji":
                    addPattern(res, zodPatterns.emoji, check.message, refs);
                    break;
                case "ulid": {
                    addPattern(res, zodPatterns.ulid, check.message, refs);
                    break;
                }
                case "base64": {
                    switch (refs.base64Strategy) {
                        case "format:binary": {
                            addFormat(res, "binary", check.message, refs);
                            break;
                        }
                        case "contentEncoding:base64": {
                            setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
                            break;
                        }
                        case "pattern:zod": {
                            addPattern(res, zodPatterns.base64, check.message, refs);
                            break;
                        }
                    }
                    break;
                }
                case "nanoid": {
                    addPattern(res, zodPatterns.nanoid, check.message, refs);
                }
            }
        }
    }
    return res;
}
const escapeNonAlphaNumeric = (value) => Array.from(value)
    .map((c) => (/[a-zA-Z0-9]/.test(c) ? c : `\\${c}`))
    .join("");
const addFormat = (schema, value, message, refs) => {
    if (schema.format || schema.anyOf?.some((x) => x.format)) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
        if (schema.format) {
            schema.anyOf.push({
                format: schema.format,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { format: schema.errorMessage.format },
                }),
            });
            delete schema.format;
            if (schema.errorMessage) {
                delete schema.errorMessage.format;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.anyOf.push({
            format: value,
            ...(message &&
                refs.errorMessages && { errorMessage: { format: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "format", value, message, refs);
    }
};
const addPattern = (schema, regex, message, refs) => {
    if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
        if (schema.pattern) {
            schema.allOf.push({
                pattern: schema.pattern,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { pattern: schema.errorMessage.pattern },
                }),
            });
            delete schema.pattern;
            if (schema.errorMessage) {
                delete schema.errorMessage.pattern;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.allOf.push({
            pattern: processRegExp(regex, refs),
            ...(message &&
                refs.errorMessages && { errorMessage: { pattern: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "pattern", processRegExp(regex, refs), message, refs);
    }
};
// Mutate z.string.regex() in a best attempt to accommodate for regex flags when applyRegexFlags is true
const processRegExp = (regex, refs) => {
    if (!refs.applyRegexFlags || !regex.flags)
        return regex.source;
    // Currently handled flags
    const flags = {
        i: regex.flags.includes("i"),
        m: regex.flags.includes("m"),
        s: regex.flags.includes("s"), // `.` matches newlines
    };
    // The general principle here is to step through each character, one at a time, applying mutations as flags require. We keep track when the current character is escaped, and when it's inside a group /like [this]/ or (also) a range like /[a-z]/. The following is fairly brittle imperative code; edit at your peril!
    const source = flags.i ? regex.source.toLowerCase() : regex.source;
    let pattern = "";
    let isEscaped = false;
    let inCharGroup = false;
    let inCharRange = false;
    for (let i = 0; i < source.length; i++) {
        if (isEscaped) {
            pattern += source[i];
            isEscaped = false;
            continue;
        }
        if (flags.i) {
            if (inCharGroup) {
                if (source[i].match(/[a-z]/)) {
                    if (inCharRange) {
                        pattern += source[i];
                        pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
                        inCharRange = false;
                    }
                    else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
                        pattern += source[i];
                        inCharRange = true;
                    }
                    else {
                        pattern += `${source[i]}${source[i].toUpperCase()}`;
                    }
                    continue;
                }
            }
            else if (source[i].match(/[a-z]/)) {
                pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                continue;
            }
        }
        if (flags.m) {
            if (source[i] === "^") {
                pattern += `(^|(?<=[\r\n]))`;
                continue;
            }
            else if (source[i] === "$") {
                pattern += `($|(?=[\r\n]))`;
                continue;
            }
        }
        if (flags.s && source[i] === ".") {
            pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
            continue;
        }
        pattern += source[i];
        if (source[i] === "\\") {
            isEscaped = true;
        }
        else if (inCharGroup && source[i] === "]") {
            inCharGroup = false;
        }
        else if (!inCharGroup && source[i] === "[") {
            inCharGroup = true;
        }
    }
    try {
        const regexTest = new RegExp(pattern);
    }
    catch {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
};

function parseRecordDef(def, refs) {
    if (refs.target === "openApi3" &&
        def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            type: "object",
            required: def.keyType._def.values,
            properties: def.keyType._def.values.reduce((acc, key) => ({
                ...acc,
                [key]: parseDef(def.valueType._def, {
                    ...refs,
                    currentPath: [...refs.currentPath, "properties", key],
                }) ?? {},
            }), {}),
            additionalProperties: false,
        };
    }
    const schema = {
        type: "object",
        additionalProperties: parseDef(def.valueType._def, {
            ...refs,
            currentPath: [...refs.currentPath, "additionalProperties"],
        }) ?? {},
    };
    if (refs.target === "openApi3") {
        return schema;
    }
    if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString &&
        def.keyType._def.checks?.length) {
        const keyType = Object.entries(parseStringDef(def.keyType._def, refs)).reduce((acc, [key, value]) => (key === "type" ? acc : { ...acc, [key]: value }), {});
        return {
            ...schema,
            propertyNames: keyType,
        };
    }
    else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            ...schema,
            propertyNames: {
                enum: def.keyType._def.values,
            },
        };
    }
    return schema;
}

function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") {
        return parseRecordDef(def, refs);
    }
    const keys = parseDef(def.keyType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "0"],
    }) || {};
    const values = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "1"],
    }) || {};
    return {
        type: "array",
        maxItems: 125,
        items: {
            type: "array",
            items: [keys, values],
            minItems: 2,
            maxItems: 2,
        },
    };
}

function parseNativeEnumDef(def) {
    const object = def.values;
    const actualKeys = Object.keys(def.values).filter((key) => {
        return typeof object[object[key]] !== "number";
    });
    const actualValues = actualKeys.map((key) => object[key]);
    const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
    return {
        type: parsedTypes.length === 1
            ? parsedTypes[0] === "string"
                ? "string"
                : "number"
            : ["string", "number"],
        enum: actualValues,
    };
}

function parseNeverDef() {
    return {
        not: {},
    };
}

function parseNullDef(refs) {
    return refs.target === "openApi3"
        ? {
            enum: ["null"],
            nullable: true,
        }
        : {
            type: "null",
        };
}

const primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null",
};
function parseUnionDef(def, refs) {
    if (refs.target === "openApi3")
        return asAnyOf(def, refs);
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    // This blocks tries to look ahead a bit to produce nicer looking schemas with type array instead of anyOf.
    if (options.every((x) => x._def.typeName in primitiveMappings &&
        (!x._def.checks || !x._def.checks.length))) {
        // all types in union are primitive and lack checks, so might as well squash into {type: [...]}
        const types = options.reduce((types, x) => {
            const type = primitiveMappings[x._def.typeName]; //Can be safely casted due to row 43
            return type && !types.includes(type) ? [...types, type] : types;
        }, []);
        return {
            type: types.length > 1 ? types : types[0],
        };
    }
    else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
        // all options literals
        const types = options.reduce((acc, x) => {
            const type = typeof x._def.value;
            switch (type) {
                case "string":
                case "number":
                case "boolean":
                    return [...acc, type];
                case "bigint":
                    return [...acc, "integer"];
                case "object":
                    if (x._def.value === null)
                        return [...acc, "null"];
                case "symbol":
                case "undefined":
                case "function":
                default:
                    return acc;
            }
        }, []);
        if (types.length === options.length) {
            // all the literals are primitive, as far as null can be considered primitive
            const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
            return {
                type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
                enum: options.reduce((acc, x) => {
                    return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
                }, []),
            };
        }
    }
    else if (options.every((x) => x._def.typeName === "ZodEnum")) {
        return {
            type: "string",
            enum: options.reduce((acc, x) => [
                ...acc,
                ...x._def.values.filter((x) => !acc.includes(x)),
            ], []),
        };
    }
    return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
    const anyOf = (def.options instanceof Map
        ? Array.from(def.options.values())
        : def.options)
        .map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", `${i}`],
    }))
        .filter((x) => !!x &&
        (!refs.strictUnions ||
            (typeof x === "object" && Object.keys(x).length > 0)));
    return anyOf.length ? { anyOf } : undefined;
};

function parseNullableDef(def, refs) {
    if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) &&
        (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        if (refs.target === "openApi3") {
            return {
                type: primitiveMappings[def.innerType._def.typeName],
                nullable: true,
            };
        }
        return {
            type: [
                primitiveMappings[def.innerType._def.typeName],
                "null",
            ],
        };
    }
    if (refs.target === "openApi3") {
        const base = parseDef(def.innerType._def, {
            ...refs,
            currentPath: [...refs.currentPath],
        });
        if (base && '$ref' in base)
            return { allOf: [base], nullable: true };
        return base && { ...base, nullable: true };
    }
    const base = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "0"],
    });
    return base && { anyOf: [base, { type: "null" }] };
}

function parseNumberDef(def, refs) {
    const res = {
        type: "number",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "int":
                res.type = "integer";
                addErrorMessage(res, "type", check.message, refs);
                break;
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function decideAdditionalProperties(def, refs) {
    if (refs.removeAdditionalStrategy === "strict") {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys !== "strict"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
    else {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys === "passthrough"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
}
function parseObjectDef(def, refs) {
    const result = {
        type: "object",
        ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
            if (propDef === undefined || propDef._def === undefined)
                return acc;
            const parsedDef = parseDef(propDef._def, {
                ...refs,
                currentPath: [...refs.currentPath, "properties", propName],
                propertyPath: [...refs.currentPath, "properties", propName],
            });
            if (parsedDef === undefined)
                return acc;
            return {
                properties: { ...acc.properties, [propName]: parsedDef },
                required: propDef.isOptional()
                    ? acc.required
                    : [...acc.required, propName],
            };
        }, { properties: {}, required: [] }),
        additionalProperties: decideAdditionalProperties(def, refs),
    };
    if (!result.required.length)
        delete result.required;
    return result;
}

const parseOptionalDef = (def, refs) => {
    if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
        return parseDef(def.innerType._def, refs);
    }
    const innerSchema = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "1"],
    });
    return innerSchema
        ? {
            anyOf: [
                {
                    not: {},
                },
                innerSchema,
            ],
        }
        : {};
};

const parsePipelineDef = (def, refs) => {
    if (refs.pipeStrategy === "input") {
        return parseDef(def.in._def, refs);
    }
    else if (refs.pipeStrategy === "output") {
        return parseDef(def.out._def, refs);
    }
    const a = parseDef(def.in._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", "0"],
    });
    const b = parseDef(def.out._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"],
    });
    return {
        allOf: [a, b].filter((x) => x !== undefined),
    };
};

function parsePromiseDef(def, refs) {
    return parseDef(def.type._def, refs);
}

function parseSetDef(def, refs) {
    const items = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items"],
    });
    const schema = {
        type: "array",
        uniqueItems: true,
        items,
    };
    if (def.minSize) {
        setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
    }
    if (def.maxSize) {
        setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
    }
    return schema;
}

function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
            additionalItems: parseDef(def.rest._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalItems"],
            }),
        };
    }
    else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
        };
    }
}

function parseUndefinedDef() {
    return {
        not: {},
    };
}

function parseUnknownDef() {
    return {};
}

const parseReadonlyDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDef(def, refs, forceResolution = false) {
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
        if (overrideResult !== ignoreOverride) {
            return overrideResult;
        }
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== undefined) {
            return seenSchema;
        }
    }
    const newItem = { def, path: refs.currentPath, jsonSchema: undefined };
    refs.seen.set(def, newItem);
    const jsonSchema = selectParser(def, def.typeName, refs);
    if (jsonSchema) {
        addMeta(def, refs, jsonSchema);
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
const get$ref = (item, refs) => {
    switch (refs.$refStrategy) {
        case "root":
            return { $ref: item.path.join("/") };
        case "relative":
            return { $ref: getRelativePath(refs.currentPath, item.path) };
        case "none":
        case "seen": {
            if (item.path.length < refs.currentPath.length &&
                item.path.every((value, index) => refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return {};
            }
            return refs.$refStrategy === "seen" ? {} : undefined;
        }
    }
};
const getRelativePath = (pathA, pathB) => {
    let i = 0;
    for (; i < pathA.length && i < pathB.length; i++) {
        if (pathA[i] !== pathB[i])
            break;
    }
    return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
    switch (typeName) {
        case ZodFirstPartyTypeKind.ZodString:
            return parseStringDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNumber:
            return parseNumberDef(def, refs);
        case ZodFirstPartyTypeKind.ZodObject:
            return parseObjectDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBigInt:
            return parseBigintDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBoolean:
            return parseBooleanDef();
        case ZodFirstPartyTypeKind.ZodDate:
            return parseDateDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUndefined:
            return parseUndefinedDef();
        case ZodFirstPartyTypeKind.ZodNull:
            return parseNullDef(refs);
        case ZodFirstPartyTypeKind.ZodArray:
            return parseArrayDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUnion:
        case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return parseUnionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodIntersection:
            return parseIntersectionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodTuple:
            return parseTupleDef(def, refs);
        case ZodFirstPartyTypeKind.ZodRecord:
            return parseRecordDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLiteral:
            return parseLiteralDef(def, refs);
        case ZodFirstPartyTypeKind.ZodEnum:
            return parseEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNativeEnum:
            return parseNativeEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNullable:
            return parseNullableDef(def, refs);
        case ZodFirstPartyTypeKind.ZodOptional:
            return parseOptionalDef(def, refs);
        case ZodFirstPartyTypeKind.ZodMap:
            return parseMapDef(def, refs);
        case ZodFirstPartyTypeKind.ZodSet:
            return parseSetDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLazy:
            return parseDef(def.getter()._def, refs);
        case ZodFirstPartyTypeKind.ZodPromise:
            return parsePromiseDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNaN:
        case ZodFirstPartyTypeKind.ZodNever:
            return parseNeverDef();
        case ZodFirstPartyTypeKind.ZodEffects:
            return parseEffectsDef(def, refs);
        case ZodFirstPartyTypeKind.ZodAny:
            return parseAnyDef();
        case ZodFirstPartyTypeKind.ZodUnknown:
            return parseUnknownDef();
        case ZodFirstPartyTypeKind.ZodDefault:
            return parseDefaultDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBranded:
            return parseBrandedDef(def, refs);
        case ZodFirstPartyTypeKind.ZodReadonly:
            return parseReadonlyDef(def, refs);
        case ZodFirstPartyTypeKind.ZodCatch:
            return parseCatchDef(def, refs);
        case ZodFirstPartyTypeKind.ZodPipeline:
            return parsePipelineDef(def, refs);
        case ZodFirstPartyTypeKind.ZodFunction:
        case ZodFirstPartyTypeKind.ZodVoid:
        case ZodFirstPartyTypeKind.ZodSymbol:
            return undefined;
        default:
            return ((_) => undefined)();
    }
};
const addMeta = (def, refs, jsonSchema) => {
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
            jsonSchema.markdownDescription = def.description;
        }
    }
    return jsonSchema;
};

const zodToJsonSchema = (schema, options) => {
    const refs = getRefs(options);
    const definitions = typeof options === "object" && options.definitions
        ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
            ...acc,
            [name]: parseDef(schema._def, {
                ...refs,
                currentPath: [...refs.basePath, refs.definitionPath, name],
            }, true) ?? {},
        }), {})
        : undefined;
    const name = typeof options === "string"
        ? options
        : options?.nameStrategy === "title"
            ? undefined
            : options?.name;
    const main = parseDef(schema._def, name === undefined
        ? refs
        : {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name],
        }, false) ?? {};
    const title = typeof options === "object" &&
        options.name !== undefined &&
        options.nameStrategy === "title"
        ? options.name
        : undefined;
    if (title !== undefined) {
        main.title = title;
    }
    const combined = name === undefined
        ? definitions
            ? {
                ...main,
                [refs.definitionPath]: definitions,
            }
            : main
        : {
            $ref: [
                ...(refs.$refStrategy === "relative" ? [] : refs.basePath),
                refs.definitionPath,
                name,
            ].join("/"),
            [refs.definitionPath]: {
                ...definitions,
                [name]: main,
            },
        };
    if (refs.target === "jsonSchema7") {
        combined.$schema = "http://json-schema.org/draft-07/schema#";
    }
    else if (refs.target === "jsonSchema2019-09") {
        combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
    }
    return combined;
};

var memoize$1;
var hasRequiredMemoize;

function requireMemoize () {
	if (hasRequiredMemoize) return memoize$1;
	hasRequiredMemoize = 1;
	function isPrimitive(value) {
	  return ((typeof value !== 'object') && (typeof value !== 'function')) || (value === null);
	}

	function MapTree() {
	  this.childBranches = new WeakMap();
	  this.primitiveKeys = new Map();
	  this.hasValue = false;
	  this.value = undefined;
	}

	MapTree.prototype.has = function has(key) {
	  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
	  return (keyObject ? this.childBranches.has(keyObject) : false);
	};

	MapTree.prototype.get = function get(key) {
	  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
	  return (keyObject ? this.childBranches.get(keyObject) : undefined);
	};

	MapTree.prototype.resolveBranch = function resolveBranch(key) {
	  if (this.has(key)) { return this.get(key); }
	  var newBranch = new MapTree();
	  var keyObject = this.createKey(key);
	  this.childBranches.set(keyObject, newBranch);
	  return newBranch;
	};

	MapTree.prototype.setValue = function setValue(value) {
	  this.hasValue = true;
	  return (this.value = value);
	};

	MapTree.prototype.createKey = function createKey(key) {
	  if (isPrimitive(key)) {
	    var keyObject = {};
	    this.primitiveKeys.set(key, keyObject);
	    return keyObject;
	  }
	  return key;
	};

	MapTree.prototype.clear = function clear() {
	  if (arguments.length === 0) {
	    this.childBranches = new WeakMap();
	    this.primitiveKeys.clear();
	    this.hasValue = false;
	    this.value = undefined;
	  } else if (arguments.length === 1) {
	    var key = arguments[0];
	    if (isPrimitive(key)) {
	      var keyObject = this.primitiveKeys.get(key);
	      if (keyObject) {
	        this.childBranches.delete(keyObject);
	        this.primitiveKeys.delete(key);
	      }
	    } else {
	      this.childBranches.delete(key);
	    }
	  } else {
	    var childKey = arguments[0];
	    if (this.has(childKey)) {
	      var childBranch = this.get(childKey);
	      childBranch.clear.apply(childBranch, Array.prototype.slice.call(arguments, 1));
	    }
	  }
	};

	memoize$1 = function memoize(fn) {
	  var argsTree = new MapTree();

	  function memoized() {
	    var args = Array.prototype.slice.call(arguments);
	    var argNode = args.reduce(function getBranch(parentBranch, arg) {
	      return parentBranch.resolveBranch(arg);
	    }, argsTree);
	    if (argNode.hasValue) { return argNode.value; }
	    var value = fn.apply(null, args);
	    return argNode.setValue(value);
	  }

	  memoized.clear = argsTree.clear.bind(argsTree);

	  return memoized;
	};
	return memoize$1;
}

var memoizeWeak;
var hasRequiredMemoizeWeak;

function requireMemoizeWeak () {
	if (hasRequiredMemoizeWeak) return memoizeWeak;
	hasRequiredMemoizeWeak = 1;
	memoizeWeak = requireMemoize();
	return memoizeWeak;
}

var memoizeWeakExports = requireMemoizeWeak();
var baseMemoize = /*@__PURE__*/getDefaultExportFromCjs(memoizeWeakExports);

const browser = BROWSER;
const loginScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
const registerScheme = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const slotScheme = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  capacity: z.number().int().positive(),
  date: z.object({
    starts_at: z.string().min(1).regex(/^[0-9]{2}:[0-9]{2}$/),
    //z.date(),
    ends_at: z.string().min(1).regex(/^[0-9]{2}:[0-9]{2}$/)
    //z.date(),
  })
});
function setPath(parent, key, value) {
  parent[key] = value;
  return "skip";
}
function isInvalidPath(originalPath, pathData) {
  return pathData.value !== void 0 && typeof pathData.value !== "object" && pathData.path.length < originalPath.length;
}
function pathExists(obj, path, options = {}) {
  if (!options.modifier) {
    options.modifier = (pathData) => isInvalidPath(path, pathData) ? void 0 : pathData.value;
  }
  const exists = traversePath(obj, path, options.modifier);
  if (!exists)
    return void 0;
  if (options.value === void 0)
    return exists;
  return options.value(exists.value) ? exists : void 0;
}
function traversePath(obj, realPath, modifier) {
  if (!realPath.length)
    return void 0;
  const path = [realPath[0]];
  let parent = obj;
  while (parent && path.length < realPath.length) {
    const key2 = path[path.length - 1];
    const value = modifier ? modifier({
      parent,
      key: String(key2),
      value: parent[key2],
      path: path.map((p) => String(p)),
      isLeaf: false,
      set: (v) => setPath(parent, key2, v)
    }) : parent[key2];
    if (value === void 0)
      return void 0;
    else
      parent = value;
    path.push(realPath[path.length]);
  }
  if (!parent)
    return void 0;
  const key = realPath[realPath.length - 1];
  return {
    parent,
    key: String(key),
    value: parent[key],
    path: realPath.map((p) => String(p)),
    isLeaf: true,
    set: (v) => setPath(parent, key, v)
  };
}
function traversePaths(parent, modifier, path = []) {
  for (const key in parent) {
    const value = parent[key];
    const isLeaf = value === null || typeof value !== "object";
    const pathData = {
      parent,
      key,
      value,
      path: path.concat([key]),
      // path.map(String).concat([key])
      isLeaf,
      set: (v) => setPath(parent, key, v)
    };
    const status = modifier(pathData);
    if (status === "abort")
      return status;
    else if (status === "skip")
      continue;
    else if (!isLeaf) {
      const status2 = traversePaths(value, modifier, pathData.path);
      if (status2 === "abort")
        return status2;
    }
  }
}
function eqSet(xs, ys) {
  return xs === ys || xs.size === ys.size && [...xs].every((x) => ys.has(x));
}
function comparePaths(newObj, oldObj) {
  const diffPaths = /* @__PURE__ */ new Map();
  function builtInDiff(one, other) {
    if (one instanceof Date && other instanceof Date && one.getTime() !== other.getTime())
      return true;
    if (one instanceof Set && other instanceof Set && !eqSet(one, other))
      return true;
    if (one instanceof File && other instanceof File && one !== other)
      return true;
    return false;
  }
  function isBuiltin(data) {
    return data instanceof Date || data instanceof Set || data instanceof File;
  }
  function checkPath(data, compareTo) {
    const otherData = compareTo ? traversePath(compareTo, data.path) : void 0;
    function addDiff() {
      diffPaths.set(data.path.join(" "), data.path);
      return "skip";
    }
    if (isBuiltin(data.value)) {
      if (!isBuiltin(otherData?.value) || builtInDiff(data.value, otherData.value)) {
        return addDiff();
      }
    }
    if (data.isLeaf) {
      if (!otherData || data.value !== otherData.value) {
        addDiff();
      }
    }
  }
  traversePaths(newObj, (data) => checkPath(data, oldObj));
  traversePaths(oldObj, (data) => checkPath(data, newObj));
  return Array.from(diffPaths.values());
}
function setPaths(obj, paths, value) {
  const isFunction = typeof value === "function";
  for (const path of paths) {
    const leaf = traversePath(obj, path, ({ parent, key, value: value2 }) => {
      if (value2 === void 0 || typeof value2 !== "object") {
        parent[key] = {};
      }
      return parent[key];
    });
    if (leaf)
      leaf.parent[leaf.key] = isFunction ? value(path, leaf) : value;
  }
}
function splitPath(path) {
  return path.toString().split(/[[\].]+/).filter((p) => p);
}
function mergePath(path) {
  return path.reduce((acc, next) => {
    const key = String(next);
    if (typeof next === "number" || /^\d+$/.test(key))
      acc += `[${key}]`;
    else if (!acc)
      acc += key;
    else
      acc += `.${key}`;
    return acc;
  }, "");
}
function clone$1(data) {
  return data && typeof data === "object" ? collectionClone(data) : data;
}
function assertSchema(schema, path) {
  if (typeof schema === "boolean") {
    throw new SchemaError("Schema property cannot be defined as boolean.", path);
  }
}
const conversionFormatTypes = ["unix-time", "bigint", "any", "symbol", "set"];
function schemaInfo(schema, isOptional, path) {
  assertSchema(schema, path);
  if (schema.allOf && schema.allOf.length) {
    return {
      ...merge$1.withOptions({ allowUndefinedOverrides: false }, ...schema.allOf.map((s) => schemaInfo(s, false, []))),
      schema
    };
  }
  const types = schemaTypes(schema, path);
  const array = schema.items && types.includes("array") ? (Array.isArray(schema.items) ? schema.items : [schema.items]).filter((s) => typeof s !== "boolean") : void 0;
  const additionalProperties = schema.additionalProperties && typeof schema.additionalProperties === "object" && types.includes("object") ? Object.fromEntries(Object.entries(schema.additionalProperties).filter(([, value]) => typeof value !== "boolean")) : void 0;
  const properties = schema.properties && types.includes("object") ? Object.fromEntries(Object.entries(schema.properties).filter(([, value]) => typeof value !== "boolean")) : void 0;
  const union = unionInfo(schema)?.filter((u) => u.type !== "null" && u.const !== null);
  return {
    types: types.filter((s) => s !== "null"),
    isOptional,
    isNullable: types.includes("null"),
    schema,
    union: union?.length ? union : void 0,
    array,
    properties,
    additionalProperties,
    required: schema.required
  };
}
function schemaTypes(schema, path) {
  assertSchema(schema, path);
  let types = schema.const === null ? ["null"] : [];
  if (schema.type) {
    types = Array.isArray(schema.type) ? schema.type : [schema.type];
  }
  if (schema.anyOf) {
    types = schema.anyOf.flatMap((s) => schemaTypes(s, path));
  }
  if (types.includes("array") && schema.uniqueItems) {
    const i = types.findIndex((t) => t != "array");
    types[i] = "set";
  } else if (schema.format && conversionFormatTypes.includes(schema.format)) {
    types.unshift(schema.format);
    if (schema.format == "unix-time") {
      const i = types.findIndex((t) => t == "integer");
      types.splice(i, 1);
    }
  }
  if (schema.const && schema.const !== null && typeof schema.const !== "function") {
    types.push(typeof schema.const);
  }
  return Array.from(new Set(types));
}
function unionInfo(schema) {
  if (!schema.anyOf || !schema.anyOf.length)
    return void 0;
  return schema.anyOf.filter((s) => typeof s !== "boolean");
}
function defaultValues(schema, isOptional = false, path = []) {
  return _defaultValues(schema, isOptional, path);
}
function _defaultValues(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  if (!info)
    return void 0;
  let objectDefaults = void 0;
  if ("default" in schema) {
    if (info.types.includes("object") && schema.default && typeof schema.default == "object" && !Array.isArray(schema.default)) {
      objectDefaults = schema.default;
    } else {
      if (info.types.length > 1) {
        if (info.types.includes("unix-time") && (info.types.includes("integer") || info.types.includes("number")))
          throw new SchemaError("Cannot resolve a default value with a union that includes a date and a number/integer.", path);
      }
      const [type] = info.types;
      return formatDefaultValue(type, schema.default);
    }
  }
  let _multiType;
  const isMultiTypeUnion = () => {
    if (!info.union || info.union.length < 2)
      return false;
    if (info.union.some((i) => i.enum))
      return true;
    if (!_multiType) {
      _multiType = new Set(info.types.map((i) => {
        return ["integer", "unix-time"].includes(i) ? "number" : i;
      }));
    }
    return _multiType.size > 1;
  };
  let output = {};
  if (!objectDefaults && info.union) {
    const singleDefault = info.union.filter((s) => typeof s !== "boolean" && s.default !== void 0);
    if (singleDefault.length == 1) {
      return _defaultValues(singleDefault[0], isOptional, path);
    } else if (singleDefault.length > 1) {
      throw new SchemaError("Only one default value can exist in a union, or set a default value for the whole union.", path);
    } else {
      if (info.isNullable)
        return null;
      if (info.isOptional)
        return void 0;
      if (isMultiTypeUnion()) {
        throw new SchemaError("Multi-type unions must have a default value, or exactly one of the union types must have.", path);
      }
      if (info.union.length && info.types[0] == "object") {
        output = info.union.length > 1 ? merge$1.withOptions({ allowUndefinedOverrides: true }, ...info.union.map((s) => _defaultValues(s, isOptional, path))) : _defaultValues(info.union[0], isOptional, path);
      }
    }
  }
  if (!objectDefaults) {
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  if (info.properties) {
    for (const [key, value] of Object.entries(info.properties)) {
      assertSchema(value, [...path, key]);
      const def = objectDefaults && objectDefaults[key] !== void 0 ? objectDefaults[key] : _defaultValues(value, !info.required?.includes(key), [...path, key]);
      output[key] = def;
    }
    return output;
  } else if (objectDefaults) {
    return objectDefaults;
  }
  if (schema.enum) {
    return schema.enum[0];
  }
  if (isMultiTypeUnion()) {
    throw new SchemaError("Default values cannot have more than one type.", path);
  } else if (info.types.length == 0) {
    return void 0;
  }
  const [formatType] = info.types;
  return defaultValue(formatType, schema.enum);
}
function formatDefaultValue(type, value) {
  switch (type) {
    case "set":
      return Array.isArray(value) ? new Set(value) : value;
    case "Date":
    case "date":
    case "unix-time":
      if (typeof value === "string" || typeof value === "number")
        return new Date(value);
      break;
    case "bigint":
      if (typeof value === "string" || typeof value === "number")
        return BigInt(value);
      break;
    case "symbol":
      if (typeof value === "string" || typeof value === "number")
        return Symbol(value);
      break;
  }
  return value;
}
function defaultValue(type, enumType) {
  switch (type) {
    case "string":
      return enumType && enumType.length > 0 ? enumType[0] : "";
    case "number":
    case "integer":
      return enumType && enumType.length > 0 ? enumType[0] : 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "null":
      return null;
    case "Date":
    case "date":
    case "unix-time":
      return void 0;
    case "bigint":
      return BigInt(0);
    case "set":
      return /* @__PURE__ */ new Set();
    case "symbol":
      return Symbol();
    case "undefined":
    case "any":
      return void 0;
    default:
      throw new SchemaError("Schema type or format not supported, requires explicit default value: " + type);
  }
}
function defaultTypes(schema, path = []) {
  return _defaultTypes(schema, false, path);
}
function _defaultTypes(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  const output = {
    __types: info.types
  };
  if (info.schema.items && typeof info.schema.items == "object" && !Array.isArray(info.schema.items)) {
    output.__items = _defaultTypes(info.schema.items, info.isOptional, path);
  }
  if (info.properties) {
    for (const [key, value] of Object.entries(info.properties)) {
      assertSchema(value, [...path, key]);
      output[key] = _defaultTypes(info.properties[key], !info.required?.includes(key), [
        ...path,
        key
      ]);
    }
  }
  if (info.additionalProperties && info.types.includes("object")) {
    const additionalInfo = schemaInfo(info.additionalProperties, info.isOptional, path);
    if (additionalInfo.properties && additionalInfo.types.includes("object")) {
      for (const [key] of Object.entries(additionalInfo.properties)) {
        output[key] = _defaultTypes(additionalInfo.properties[key], !additionalInfo.required?.includes(key), [...path, key]);
      }
    }
  }
  if (info.isNullable && !output.__types.includes("null")) {
    output.__types.push("null");
  }
  if (info.isOptional && !output.__types.includes("undefined")) {
    output.__types.push("undefined");
  }
  return output;
}
class SuperFormError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, SuperFormError.prototype);
  }
}
class SchemaError extends SuperFormError {
  path;
  constructor(message, path) {
    super((path && path.length ? `[${Array.isArray(path) ? path.join(".") : path}] ` : "") + message);
    this.path = Array.isArray(path) ? path.join(".") : path;
    Object.setPrototypeOf(this, SchemaError.prototype);
  }
}
function mapErrors(errors, shape) {
  const output = {};
  function addFormLevelError(error) {
    if (!("_errors" in output))
      output._errors = [];
    if (!Array.isArray(output._errors)) {
      if (typeof output._errors === "string")
        output._errors = [output._errors];
      else
        throw new SuperFormError("Form-level error was not an array.");
    }
    output._errors.push(error.message);
  }
  for (const error of errors) {
    if (!error.path || error.path.length == 1 && !error.path[0]) {
      addFormLevelError(error);
      continue;
    }
    const isLastIndexNumeric = /^\d$/.test(String(error.path[error.path.length - 1]));
    const objectError = !isLastIndexNumeric && pathExists(shape, error.path.filter((p) => /\D/.test(String(p))))?.value;
    const leaf = traversePath(output, error.path, ({ value, parent: parent2, key: key2 }) => {
      if (value === void 0)
        parent2[key2] = {};
      return parent2[key2];
    });
    if (!leaf) {
      addFormLevelError(error);
      continue;
    }
    const { parent, key } = leaf;
    if (objectError) {
      if (!(key in parent))
        parent[key] = {};
      if (!("_errors" in parent[key]))
        parent[key]._errors = [error.message];
      else
        parent[key]._errors.push(error.message);
    } else {
      if (!(key in parent))
        parent[key] = [error.message];
      else
        parent[key].push(error.message);
    }
  }
  return output;
}
function updateErrors(New, Previous, force) {
  if (force)
    return New;
  traversePaths(Previous, (errors) => {
    if (!Array.isArray(errors.value))
      return;
    errors.set(void 0);
  });
  traversePaths(New, (error) => {
    if (!Array.isArray(error.value) && error.value !== void 0)
      return;
    setPaths(Previous, [error.path], error.value);
  });
  return Previous;
}
function flattenErrors(errors) {
  return _flattenErrors(errors, []);
}
function _flattenErrors(errors, path) {
  const entries = Object.entries(errors);
  return entries.filter(([, value]) => value !== void 0).flatMap(([key, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      const currPath = path.concat([key]);
      return { path: mergePath(currPath), messages };
    } else {
      return _flattenErrors(errors[key], path.concat([key]));
    }
  });
}
function mergeDefaults(parsedData, defaults) {
  if (!parsedData)
    return clone$1(defaults);
  return merge$1.withOptions({ mergeArrays: false }, defaults, parsedData);
}
function replaceInvalidDefaults(Data, Defaults, _schema, Errors, preprocessed) {
  const defaultType = _schema.additionalProperties && typeof _schema.additionalProperties == "object" ? { __types: schemaInfo(_schema.additionalProperties, false, []).types } : void 0;
  const Types = defaultTypes(_schema);
  function Types_correctValue(dataValue, defValue, type) {
    const types = type.__types;
    if (!types.length || types.every((t) => t == "undefined" || t == "null" || t == "any")) {
      return dataValue;
    } else if (types.length == 1 && types[0] == "array" && !type.__items) {
      return dataValue;
    }
    const dateTypes = ["unix-time", "Date", "date"];
    for (const schemaType of types) {
      const defaultTypeValue = defaultValue(schemaType, void 0);
      const sameType = typeof dataValue === typeof defaultTypeValue || dateTypes.includes(schemaType) && dataValue instanceof Date;
      const sameExistance = sameType && dataValue === null === (defaultTypeValue === null);
      if (sameType && sameExistance) {
        return dataValue;
      } else if (type.__items) {
        return Types_correctValue(dataValue, defValue, type.__items);
      }
    }
    if (defValue === void 0 && types.includes("null")) {
      return null;
    }
    return defValue;
  }
  function Data_traverse() {
    traversePaths(Defaults, Defaults_traverseAndReplace);
    Errors_traverseAndReplace();
    return Data;
  }
  function Data_setValue(currentPath, newValue) {
    setPaths(Data, [currentPath], newValue);
  }
  function Errors_traverseAndReplace() {
    for (const error of Errors) {
      if (!error.path)
        continue;
      Defaults_traverseAndReplace({
        path: error.path,
        value: pathExists(Defaults, error.path)?.value
      });
    }
  }
  function Defaults_traverseAndReplace(defaultPath) {
    const currentPath = defaultPath.path;
    if (!currentPath || !currentPath[0])
      return;
    if (typeof currentPath[0] === "string" && preprocessed?.includes(currentPath[0]))
      return;
    const dataPath = pathExists(Data, currentPath);
    if (!dataPath && defaultPath.value !== void 0 || dataPath && dataPath.value === void 0) {
      Data_setValue(currentPath, defaultPath.value);
    } else if (dataPath) {
      const defValue = defaultPath.value;
      const dataValue = dataPath.value;
      if (defValue !== void 0 && typeof dataValue === typeof defValue && dataValue === null === (defValue === null)) {
        return;
      }
      const typePath = currentPath.filter((p) => /\D/.test(String(p)));
      const pathTypes = traversePath(Types, typePath, (path) => {
        return "__items" in path.value ? path.value.__items : path.value;
      });
      if (!pathTypes) {
        throw new SchemaError("No types found for defaults", currentPath);
      }
      const fieldType = pathTypes.value ?? defaultType;
      if (!fieldType) {
        throw new SchemaError("No default value specified for field (can be undefined, but must be explicit)", currentPath);
      }
      Data_setValue(currentPath, Types_correctValue(dataValue, defValue, fieldType));
    }
  }
  {
    return Data_traverse();
  }
}
function cancelFlash(options) {
  if (!options.flashMessage || !browser)
    return;
  if (!shouldSyncFlash(options))
    return;
  document.cookie = `flash=; Max-Age=0; Path=${options.flashMessage.cookiePath ?? "/"};`;
}
function shouldSyncFlash(options) {
  if (!options.flashMessage || !browser)
    return false;
  return options.syncFlashMessage;
}
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = parse(parsed.data);
  }
  return parsed;
}
function clone(element) {
  return (
    /** @type {T} */
    HTMLElement.prototype.cloneNode.call(element)
  );
}
function enhance(form_element, submit = () => {
}) {
  const fallback_callback = async ({
    action,
    result,
    reset = true,
    invalidateAll: shouldInvalidateAll = true
  }) => {
    if (result.type === "success") {
      if (reset) {
        HTMLFormElement.prototype.reset.call(form_element);
      }
      if (shouldInvalidateAll) {
        await invalidateAll();
      }
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction();
    }
  };
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formMethod
    ) : clone(form_element).method;
    if (method !== "post") return;
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : clone(form_element).action
    );
    const enctype = event.submitter?.hasAttribute("formenctype") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formEnctype
    ) : clone(form_element).enctype;
    const form_data = new FormData(form_element);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      formData: form_data,
      formElement: form_element,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled) return;
    let result;
    try {
      const headers = new Headers({
        accept: "application/json",
        "x-sveltekit-action": "true"
      });
      if (enctype !== "multipart/form-data") {
        headers.set(
          "Content-Type",
          /^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype) ? enctype : "application/x-www-form-urlencoded"
        );
      }
      const body = enctype === "multipart/form-data" ? form_data : new URLSearchParams(form_data);
      const response = await fetch(action, {
        method: "POST",
        headers,
        cache: "no-store",
        body,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error") result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      ) return;
      result = { type: "error", error };
    }
    callback({
      action,
      formData: form_data,
      formElement: form_element,
      update: (opts) => fallback_callback({
        action,
        result,
        reset: opts?.reset,
        invalidateAll: opts?.invalidateAll
      }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form_element, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form_element, "submit", handle_submit);
    }
  };
}
const noCustomValidityDataAttribute = "noCustomValidity";
async function updateCustomValidity(validityEl, errors) {
  if ("setCustomValidity" in validityEl) {
    validityEl.setCustomValidity("");
  }
  if (noCustomValidityDataAttribute in validityEl.dataset)
    return;
  setCustomValidity(validityEl, errors);
}
function setCustomValidityForm(formElement, errors) {
  for (const el of formElement.querySelectorAll("input,select,textarea,button")) {
    if (noCustomValidityDataAttribute in el.dataset) {
      continue;
    }
    const path = traversePath(errors, splitPath(el.name));
    const error = path && typeof path.value === "object" && "_errors" in path.value ? path.value._errors : path?.value;
    setCustomValidity(el, error);
    if (error)
      return;
  }
}
function setCustomValidity(el, errors) {
  const message = errors && errors.length ? errors.join("\n") : "";
  el.setCustomValidity(message);
  if (message)
    el.reportValidity();
}
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
const immediateInputTypes = ["checkbox", "radio", "range", "file"];
function inputInfo(el) {
  const immediate = !!el && (el instanceof HTMLSelectElement || el instanceof HTMLInputElement && immediateInputTypes.includes(el.type));
  const multiple = !!el && el instanceof HTMLSelectElement && el.multiple;
  const file = !!el && el instanceof HTMLInputElement && el.type == "file";
  return { immediate, multiple, file };
}
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
const activeTimers = /* @__PURE__ */ new Set();
function Form(formElement, timers, options) {
  let state = FetchStatus.Idle;
  let delayedTimeout, timeoutTimeout;
  const Timers = activeTimers;
  function Timers_start() {
    Timers_clear();
    Timers_setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
    delayedTimeout = window.setTimeout(() => {
      if (delayedTimeout && state == FetchStatus.Submitting)
        Timers_setState(FetchStatus.Delayed);
    }, options.delayMs);
    timeoutTimeout = window.setTimeout(() => {
      if (timeoutTimeout && state == FetchStatus.Delayed)
        Timers_setState(FetchStatus.Timeout);
    }, options.timeoutMs);
    Timers.add(Timers_clear);
  }
  function Timers_clear() {
    clearTimeout(delayedTimeout);
    clearTimeout(timeoutTimeout);
    delayedTimeout = timeoutTimeout = 0;
    Timers.delete(Timers_clear);
    Timers_setState(FetchStatus.Idle);
  }
  function Timers_clearAll() {
    Timers.forEach((t) => t());
    Timers.clear();
  }
  function Timers_setState(s) {
    state = s;
    timers.submitting.set(state >= FetchStatus.Submitting);
    timers.delayed.set(state >= FetchStatus.Delayed);
    timers.timeout.set(state >= FetchStatus.Timeout);
  }
  const ErrorTextEvents = formElement;
  function ErrorTextEvents__selectText(e) {
    const target = e.target;
    if (options.selectErrorText)
      target.select();
  }
  function ErrorTextEvents_addErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => {
      el.addEventListener("invalid", ErrorTextEvents__selectText);
    });
  }
  function ErrorTextEvents_removeErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => el.removeEventListener("invalid", ErrorTextEvents__selectText));
  }
  const Form2 = formElement;
  {
    ErrorTextEvents_addErrorTextListeners();
    const completed = (opts) => {
      if (!opts.clearAll)
        Timers_clear();
      else
        Timers_clearAll();
      if (!opts.cancelled)
        setTimeout(() => scrollToFirstError(Form2, options), 1);
    };
    onDestroy(() => {
      ErrorTextEvents_removeErrorTextListeners();
      completed({ cancelled: true });
    });
    return {
      submitting() {
        Timers_start();
      },
      completed,
      scrollToFirstError() {
        setTimeout(() => scrollToFirstError(Form2, options), 1);
      },
      isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
    };
  }
}
const scrollToFirstError = async (Form2, options) => {
  if (options.scrollToError == "off")
    return;
  const selector = options.errorSelector;
  if (!selector)
    return;
  await tick();
  let el;
  el = Form2.querySelector(selector);
  if (!el)
    return;
  el = el.querySelector(selector) ?? el;
  const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
  if (typeof options.scrollToError != "string") {
    el.scrollIntoView(options.scrollToError);
  } else if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
    scrollToAndCenter(el, void 0, options.scrollToError);
  }
  function Form_shouldAutoFocus(userAgent) {
    if (typeof options.autoFocusOnError === "boolean")
      return options.autoFocusOnError;
    else
      return !/iPhone|iPad|iPod|Android/i.test(userAgent);
  }
  if (!Form_shouldAutoFocus(navigator.userAgent))
    return;
  let focusEl;
  focusEl = el;
  if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
    focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
  }
  if (focusEl) {
    try {
      focusEl.focus({ preventScroll: true });
      if (options.selectErrorText && focusEl.tagName == "INPUT") {
        focusEl.select();
      }
    } catch (err) {
    }
  }
};
function updateProxyField(obj, path, updater) {
  const output = traversePath(obj, path, ({ parent, key, value }) => {
    if (value === void 0)
      parent[key] = /\D/.test(key) ? {} : [];
    return parent[key];
  });
  if (output) {
    const newValue = updater(output.value);
    output.parent[output.key] = newValue;
  }
  return obj;
}
function superFieldProxy(superForm2, path, baseOptions) {
  const form = superForm2.form;
  const path2 = splitPath(path);
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd, options) {
      form.update((data) => updateProxyField(data, path2, upd), options ?? baseOptions);
    },
    set(value, options) {
      form.update((data) => updateProxyField(data, path2, () => value), options ?? baseOptions);
    }
  };
}
function isSuperForm(form, options) {
  const isSuperForm2 = "form" in form;
  if (!isSuperForm2 && options?.taint !== void 0) {
    throw new SuperFormError("If options.taint is set, the whole superForm object must be used as a proxy.");
  }
  return isSuperForm2;
}
function fieldProxy(form, path, options) {
  const path2 = splitPath(path);
  if (isSuperForm(form, options)) {
    return superFieldProxy(form, path, options);
  }
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd) {
      form.update((data) => updateProxyField(data, path2, upd));
    },
    set(value) {
      form.update((data) => updateProxyField(data, path2, () => value));
    }
  };
}
function schemaShape(schema, path = []) {
  const output = _schemaShape(schema, path);
  if (!output)
    throw new SchemaError("No shape could be created for schema.", path);
  return output;
}
function _schemaShape(schema, path) {
  assertSchema(schema, path);
  const info = schemaInfo(schema, false, path);
  if (info.array || info.union) {
    const arr = info.array || [];
    const union = info.union || [];
    return arr.concat(union).reduce((shape, next) => {
      const nextShape = _schemaShape(next, path);
      if (nextShape)
        shape = { ...shape ?? {}, ...nextShape };
      return shape;
    }, arr.length ? {} : void 0);
  }
  if (info.properties) {
    const output = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const shape = _schemaShape(prop, [...path, key]);
      if (shape)
        output[key] = shape;
    }
    return output;
  }
  return info.types.includes("array") || info.types.includes("object") ? {} : void 0;
}
function shapeFromObject(obj) {
  let output = {};
  const isArray = Array.isArray(obj);
  for (const [key, value] of Object.entries(obj)) {
    if (!value || typeof value !== "object")
      continue;
    if (isArray)
      output = { ...output, ...shapeFromObject(value) };
    else
      output[key] = shapeFromObject(value);
  }
  return output;
}
const formIds = /* @__PURE__ */ new WeakMap();
const initialForms = /* @__PURE__ */ new WeakMap();
const defaultOnError = (event) => {
  console.warn("Unhandled error caught by Superforms, use onError event to handle it:", event.result.error);
};
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: true,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: '[aria-invalid="true"],[data-invalid]',
  selectErrorText: false,
  stickyNavbar: void 0,
  taintedMessage: false,
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: defaultOnError,
  dataType: "form",
  validators: void 0,
  customValidity: false,
  clearOnSubmit: "message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent",
  SPA: void 0,
  validationMethod: "auto"
};
let LEGACY_MODE = false;
try {
  if (SUPERFORMS_LEGACY)
    LEGACY_MODE = true;
} catch {
}
let STORYBOOK_MODE = false;
try {
  if (globalThis.STORIES)
    STORYBOOK_MODE = true;
} catch {
}
function superForm(form, formOptions) {
  let initialForm;
  let options = formOptions ?? {};
  let initialValidator = void 0;
  {
    if (options.legacy ?? LEGACY_MODE) {
      if (options.resetForm === void 0)
        options.resetForm = false;
      if (options.taintedMessage === void 0)
        options.taintedMessage = true;
    }
    if (STORYBOOK_MODE) {
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    if (typeof options.SPA === "string") {
      if (options.invalidateAll === void 0)
        options.invalidateAll = false;
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    initialValidator = options.validators;
    options = {
      ...defaultFormOptions,
      ...options
    };
    if ((options.SPA === true || typeof options.SPA === "object") && options.validators === void 0) {
      console.warn("No validators set for superForm in SPA mode. Add a validation adapter to the validators option, or set it to false to disable this warning.");
    }
    if (!form) {
      throw new SuperFormError("No form data sent to superForm. Make sure the output from superValidate is used (usually data.form) and that it's not null or undefined. Alternatively, an object with default values for the form can also be used, but then constraints won't be available.");
    }
    if (Context_isValidationObject(form) === false) {
      form = {
        id: options.id ?? Math.random().toString(36).slice(2, 10),
        valid: false,
        posted: false,
        errors: {},
        data: form,
        shape: shapeFromObject(form)
      };
    }
    form = form;
    const _initialFormId = form.id = options.id ?? form.id;
    const _currentPage = get_store_value(page) ?? (STORYBOOK_MODE ? {} : void 0);
    if (!initialForms.has(form)) {
      initialForms.set(form, form);
    }
    initialForm = initialForms.get(form);
    if (_currentPage.form && typeof _currentPage.form === "object") {
      const postedData = _currentPage.form;
      for (const postedForm of Context_findValidationForms(postedData).reverse()) {
        if (postedForm.id == _initialFormId && !initialForms.has(postedForm)) {
          initialForms.set(postedData, postedData);
          const pageDataForm = form;
          form = postedForm;
          form.constraints = pageDataForm.constraints;
          form.shape = pageDataForm.shape;
          if (form.valid && options.resetForm && (options.resetForm === true || options.resetForm())) {
            form = clone$1(pageDataForm);
            form.message = clone$1(postedForm.message);
          }
          break;
        }
      }
    } else {
      form = clone$1(initialForm);
    }
    onDestroy(() => {
      Unsubscriptions_unsubscribe();
      NextChange_clear();
      EnhancedForm_destroy();
      for (const events of Object.values(formEvents)) {
        events.length = 0;
      }
      formIds.get(_currentPage)?.delete(_initialFormId);
    });
    if (options.dataType !== "json") {
      const checkForNestedData = (key, value) => {
        if (!value || typeof value !== "object")
          return;
        if (Array.isArray(value)) {
          if (value.length > 0)
            checkForNestedData(key, value[0]);
        } else if (!(value instanceof Date) && !(value instanceof File) && !browser) {
          throw new SuperFormError(`Object found in form field "${key}". Set the dataType option to "json" and add use:enhance to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`);
        }
      };
      for (const [key, value] of Object.entries(form.data)) {
        checkForNestedData(key, value);
      }
    }
  }
  const __data = {
    formId: form.id,
    form: clone$1(form.data),
    constraints: form.constraints ?? {},
    posted: form.posted,
    errors: clone$1(form.errors),
    message: clone$1(form.message),
    tainted: void 0,
    valid: form.valid,
    submitting: false,
    shape: form.shape
  };
  const Data = __data;
  const FormId = writable(options.id ?? form.id);
  function Context_findValidationForms(data) {
    const forms = Object.values(data).filter((v) => Context_isValidationObject(v) !== false);
    return forms;
  }
  function Context_isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "errors" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : false;
  }
  const _formData = writable(form.data);
  const Form$1 = {
    subscribe: _formData.subscribe,
    set: (value, options2 = {}) => {
      const newData = clone$1(value);
      Tainted_update(newData, options2.taint ?? true);
      return _formData.set(newData);
    },
    update: (updater, options2 = {}) => {
      return _formData.update((value) => {
        const newData = updater(value);
        Tainted_update(newData, options2.taint ?? true);
        return newData;
      });
    }
  };
  function Form_isSPA() {
    return options.SPA === true || typeof options.SPA === "object";
  }
  async function Form_validate(opts = {}) {
    const dataToValidate = opts.formData ?? Data.form;
    let errors = {};
    let status;
    const validator = opts.adapter ?? options.validators;
    if (typeof validator == "object") {
      if (validator != initialValidator && !("jsonSchema" in validator)) {
        throw new SuperFormError('Client validation adapter found in options.validators. A full adapter must be used when changing validators dynamically, for example "zod" instead of "zodClient".');
      }
      status = await /* @__PURE__ */ validator.validate(dataToValidate);
      if (!status.success) {
        errors = mapErrors(status.issues, validator.shape ?? Data.shape ?? {});
      } else if (opts.recheckValidData !== false) {
        return Form_validate({ ...opts, recheckValidData: false });
      }
    } else {
      status = { success: true, data: {} };
    }
    const data = { ...Data.form, ...dataToValidate, ...status.success ? status.data : {} };
    return {
      valid: status.success,
      posted: false,
      errors,
      data,
      constraints: Data.constraints,
      message: void 0,
      id: Data.formId,
      shape: Data.shape
    };
  }
  function Form__changeEvent(event) {
    if (!options.onChange || !event.paths.length || event.type == "blur")
      return;
    let changeEvent;
    const paths = event.paths.map(mergePath);
    if (event.type && event.paths.length == 1 && event.formElement && event.target instanceof Element) {
      changeEvent = {
        path: paths[0],
        paths,
        formElement: event.formElement,
        target: event.target,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    } else {
      changeEvent = {
        paths,
        target: void 0,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    }
    options.onChange(changeEvent);
  }
  async function Form_clientValidation(event, force = false, adapter) {
    if (event) {
      if (options.validators == "clear") {
        Errors.update(($errors) => {
          setPaths($errors, event.paths, void 0);
          return $errors;
        });
      }
      setTimeout(() => Form__changeEvent(event));
    }
    let skipValidation = false;
    if (!force) {
      if (options.validationMethod == "onsubmit" || options.validationMethod == "submit-only") {
        skipValidation = true;
      } else if (options.validationMethod == "onblur" && event?.type == "input")
        skipValidation = true;
      else if (options.validationMethod == "oninput" && event?.type == "blur")
        skipValidation = true;
    }
    if (skipValidation || !event || !options.validators || options.validators == "clear") {
      if (event?.paths) {
        const formElement = event?.formElement ?? EnhancedForm_get();
        if (formElement)
          Form__clearCustomValidity(formElement);
      }
      return;
    }
    const result = await Form_validate({ adapter });
    if (result.valid && (event.immediate || event.type != "input")) {
      Form$1.set(result.data, { taint: "ignore" });
    }
    await tick();
    Form__displayNewErrors(result.errors, event, force);
    return result;
  }
  function Form__clearCustomValidity(formElement) {
    const validity = /* @__PURE__ */ new Map();
    if (options.customValidity && formElement) {
      for (const el of formElement.querySelectorAll(`[name]`)) {
        if (typeof el.name !== "string" || !el.name.length)
          continue;
        const message = "validationMessage" in el ? String(el.validationMessage) : "";
        validity.set(el.name, { el, message });
        updateCustomValidity(el, void 0);
      }
    }
    return validity;
  }
  async function Form__displayNewErrors(errors, event, force) {
    const { type, immediate, multiple, paths } = event;
    const previous = Data.errors;
    const output = {};
    let validity = /* @__PURE__ */ new Map();
    const formElement = event.formElement ?? EnhancedForm_get();
    if (formElement)
      validity = Form__clearCustomValidity(formElement);
    traversePaths(errors, (error) => {
      if (!Array.isArray(error.value))
        return;
      const currentPath = [...error.path];
      if (currentPath[currentPath.length - 1] == "_errors") {
        currentPath.pop();
      }
      const joinedPath = currentPath.join(".");
      function addError() {
        setPaths(output, [error.path], error.value);
        if (options.customValidity && isEventError && validity.has(joinedPath)) {
          const { el, message } = validity.get(joinedPath);
          if (message != error.value) {
            setTimeout(() => updateCustomValidity(el, error.value));
            validity.clear();
          }
        }
      }
      if (force)
        return addError();
      const lastPath = error.path[error.path.length - 1];
      const isObjectError = lastPath == "_errors";
      const isEventError = error.value && paths.some((path) => {
        return isObjectError ? currentPath && path && currentPath.length > 0 && currentPath[0] == path[0] : joinedPath == path.join(".");
      });
      if (isEventError && options.validationMethod == "oninput")
        return addError();
      if (immediate && !multiple && isEventError)
        return addError();
      if (multiple) {
        const errorPath = pathExists(get_store_value(Errors), error.path.slice(0, -1));
        if (errorPath?.value && typeof errorPath?.value == "object") {
          for (const errors2 of Object.values(errorPath.value)) {
            if (Array.isArray(errors2)) {
              return addError();
            }
          }
        }
      }
      const previousError = pathExists(previous, error.path);
      if (previousError && previousError.key in previousError.parent) {
        return addError();
      }
      if (isObjectError) {
        if (options.validationMethod == "oninput" || type == "blur" && Tainted_hasBeenTainted(mergePath(error.path.slice(0, -1)))) {
          return addError();
        }
      } else {
        if (type == "blur" && isEventError) {
          return addError();
        }
      }
    });
    Errors.set(output);
  }
  function Form_set(data, options2 = {}) {
    if (options2.keepFiles) {
      traversePaths(Data.form, (info) => {
        if (info.value instanceof File || browser) {
          const dataPath = pathExists(data, info.path);
          if (!dataPath || !(dataPath.key in dataPath.parent)) {
            setPaths(data, [info.path], info.value);
          }
        }
      });
    }
    return Form$1.set(data, options2);
  }
  function Form_shouldReset(validForm, successActionResult) {
    return validForm && successActionResult && options.resetForm && (options.resetForm === true || options.resetForm());
  }
  async function Form_updateFromValidation(form2, successResult) {
    if (form2.valid && successResult && Form_shouldReset(form2.valid, successResult)) {
      Form_reset({ message: form2.message, posted: true });
    } else {
      rebind({
        form: form2,
        untaint: successResult,
        keepFiles: true,
        // Check if the form data should be used for updating, or if the invalidateAll load function should be used:
        skipFormData: options.invalidateAll == "force"
      });
    }
    if (formEvents.onUpdated.length) {
      await tick();
    }
    for (const event of formEvents.onUpdated) {
      event({ form: form2 });
    }
  }
  function Form_reset(opts = {}) {
    if (opts.newState)
      initialForm.data = { ...initialForm.data, ...opts.newState };
    const resetData = clone$1(initialForm);
    resetData.data = { ...resetData.data, ...opts.data };
    if (opts.id !== void 0)
      resetData.id = opts.id;
    rebind({
      form: resetData,
      untaint: true,
      message: opts.message,
      keepFiles: false,
      posted: opts.posted,
      resetted: true
    });
  }
  async function Form_updateFromActionResult(result) {
    if (result.type == "error") {
      throw new SuperFormError(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (Form_shouldReset(true, true))
        Form_reset({ posted: true });
      return;
    }
    if (typeof result.data !== "object") {
      throw new SuperFormError("Non-object validation data returned from ActionResult.");
    }
    const forms = Context_findValidationForms(result.data);
    if (!forms.length) {
      throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== Data.formId)
        continue;
      await Form_updateFromValidation(newForm, result.status >= 200 && result.status < 300);
    }
  }
  const Message = writable(__data.message);
  const Constraints = writable(__data.constraints);
  const Posted = writable(__data.posted);
  const Shape = writable(__data.shape);
  const _errors = writable(form.errors);
  const Errors = {
    subscribe: _errors.subscribe,
    set(value, options2) {
      return _errors.set(updateErrors(value, Data.errors, options2?.force));
    },
    update(updater, options2) {
      return _errors.update((value) => {
        return updateErrors(updater(value), Data.errors, options2?.force);
      });
    },
    /**
     * To work with client-side validation, errors cannot be deleted but must
     * be set to undefined, to know where they existed before (tainted+error check in oninput)
     */
    clear: () => Errors.set({})
  };
  let NextChange = null;
  function NextChange_setHtmlEvent(event) {
    if (NextChange && event && Object.keys(event).length == 1 && event.paths?.length && NextChange.target && NextChange.target instanceof HTMLInputElement && NextChange.target.type.toLowerCase() == "file") {
      NextChange.paths = event.paths;
    } else {
      NextChange = event;
    }
    setTimeout(() => {
      Form_clientValidation(NextChange);
    }, 0);
  }
  function NextChange_additionalEventInformation(event, immediate, multiple, formElement, target) {
    if (NextChange === null) {
      NextChange = { paths: [] };
    }
    NextChange.type = event;
    NextChange.immediate = immediate;
    NextChange.multiple = multiple;
    NextChange.formElement = formElement;
    NextChange.target = target;
  }
  function NextChange_paths() {
    return NextChange?.paths ?? [];
  }
  function NextChange_clear() {
    NextChange = null;
  }
  const Tainted = {
    defaultMessage: "Leave page? Changes that you made may not be saved.",
    state: writable(),
    message: options.taintedMessage,
    clean: clone$1(form.data),
    // Important to clone form.data, so it's not comparing the same object,
    forceRedirection: false
  };
  function Tainted_enable() {
    options.taintedMessage = Tainted.message;
  }
  function Tainted_currentState() {
    return Tainted.state;
  }
  function Tainted_hasBeenTainted(path) {
    if (!Data.tainted)
      return false;
    if (!path)
      return !!Data.tainted;
    const field = pathExists(Data.tainted, splitPath(path));
    return !!field && field.key in field.parent;
  }
  function Tainted_isTainted(path) {
    if (!arguments.length)
      return Tainted__isObjectTainted(Data.tainted);
    if (typeof path === "boolean")
      return path;
    if (typeof path === "object")
      return Tainted__isObjectTainted(path);
    if (!Data.tainted || path === void 0)
      return false;
    const field = pathExists(Data.tainted, splitPath(path));
    return Tainted__isObjectTainted(field?.value);
  }
  function Tainted__isObjectTainted(obj) {
    if (!obj)
      return false;
    if (typeof obj === "object") {
      for (const obj2 of Object.values(obj)) {
        if (Tainted__isObjectTainted(obj2))
          return true;
      }
    }
    return obj === true;
  }
  function Tainted_update(newData, taintOptions) {
    if (taintOptions == "ignore")
      return;
    const paths = comparePaths(newData, Data.form);
    const newTainted = comparePaths(newData, Tainted.clean).map((path) => path.join());
    if (paths.length) {
      if (taintOptions == "untaint-all" || taintOptions == "untaint-form") {
        Tainted.state.set(void 0);
      } else {
        Tainted.state.update((currentlyTainted) => {
          if (!currentlyTainted)
            currentlyTainted = {};
          setPaths(currentlyTainted, paths, (path, data) => {
            if (!newTainted.includes(path.join()))
              return void 0;
            const currentValue = traversePath(newData, path);
            const cleanPath = traversePath(Tainted.clean, path);
            return currentValue && cleanPath && currentValue.value === cleanPath.value ? void 0 : taintOptions === true ? true : taintOptions === "untaint" ? void 0 : data.value;
          });
          return currentlyTainted;
        });
      }
    }
    NextChange_setHtmlEvent({ paths });
  }
  function Tainted_set(tainted, newClean) {
    Tainted.state.set(tainted);
    if (newClean)
      Tainted.clean = newClean;
  }
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const Unsubscriptions = [
    // eslint-disable-next-line dci-lint/private-role-access
    Tainted.state.subscribe((tainted) => __data.tainted = clone$1(tainted)),
    // eslint-disable-next-line dci-lint/private-role-access
    Form$1.subscribe((form2) => __data.form = clone$1(form2)),
    // eslint-disable-next-line dci-lint/private-role-access
    Errors.subscribe((errors) => __data.errors = clone$1(errors)),
    FormId.subscribe((id) => __data.formId = id),
    Constraints.subscribe((constraints2) => __data.constraints = constraints2),
    Posted.subscribe((posted) => __data.posted = posted),
    Message.subscribe((message) => __data.message = message),
    Submitting.subscribe((submitting) => __data.submitting = submitting),
    Shape.subscribe((shape) => __data.shape = shape)
  ];
  function Unsubscriptions_unsubscribe() {
    Unsubscriptions.forEach((unsub) => unsub());
  }
  let EnhancedForm;
  function EnhancedForm_get() {
    return EnhancedForm;
  }
  function EnhancedForm_setAction(action) {
    if (EnhancedForm)
      EnhancedForm.action = action;
  }
  function EnhancedForm_destroy() {
    if (EnhancedForm?.parentElement) {
      EnhancedForm.remove();
    }
    EnhancedForm = void 0;
  }
  const AllErrors = derived(Errors, ($errors) => $errors ? flattenErrors($errors) : []);
  options.taintedMessage = void 0;
  function rebind(opts) {
    const form2 = opts.form;
    const message = opts.message ?? form2.message;
    if (opts.untaint || opts.resetted) {
      Tainted_set(typeof opts.untaint === "boolean" ? void 0 : opts.untaint, form2.data);
    }
    if (opts.skipFormData !== true) {
      Form_set(form2.data, {
        taint: "ignore",
        keepFiles: opts.keepFiles
      });
    }
    Message.set(message);
    if (opts.resetted)
      Errors.update(() => ({}), { force: true });
    else
      Errors.set(form2.errors);
    FormId.set(form2.id);
    Posted.set(opts.posted ?? form2.posted);
    if (form2.constraints)
      Constraints.set(form2.constraints);
    if (form2.shape)
      Shape.set(form2.shape);
    __data.valid = form2.valid;
    if (options.flashMessage && shouldSyncFlash(options)) {
      const flash = options.flashMessage.module.getFlash(page);
      if (message && get_store_value(flash) === void 0) {
        flash.set(message);
      }
    }
  }
  const formEvents = {
    onSubmit: options.onSubmit ? [options.onSubmit] : [],
    onResult: options.onResult ? [options.onResult] : [],
    onUpdate: options.onUpdate ? [options.onUpdate] : [],
    onUpdated: options.onUpdated ? [options.onUpdated] : [],
    onError: options.onError ? [options.onError] : []
  };
  function superFormEnhance(FormElement, events) {
    if (options.SPA !== void 0 && FormElement.method == "get")
      FormElement.method = "post";
    if (typeof options.SPA === "string") {
      if (options.SPA.length && FormElement.action == document.location.href) {
        FormElement.action = options.SPA;
      }
    } else {
      EnhancedForm = FormElement;
    }
    if (events) {
      if (events.onError) {
        if (options.onError === "apply") {
          throw new SuperFormError('options.onError is set to "apply", cannot add any onError events.');
        } else if (events.onError === "apply") {
          throw new SuperFormError('Cannot add "apply" as onError event in use:enhance.');
        }
        formEvents.onError.push(events.onError);
      }
      if (events.onResult)
        formEvents.onResult.push(events.onResult);
      if (events.onSubmit)
        formEvents.onSubmit.push(events.onSubmit);
      if (events.onUpdate)
        formEvents.onUpdate.push(events.onUpdate);
      if (events.onUpdated)
        formEvents.onUpdated.push(events.onUpdated);
    }
    Tainted_enable();
    let lastInputChange;
    async function onInput(e) {
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      lastInputChange = NextChange_paths();
      NextChange_additionalEventInformation("input", info.immediate, info.multiple, FormElement, e.target ?? void 0);
    }
    async function onBlur(e) {
      if (Data.submitting)
        return;
      if (!lastInputChange || NextChange_paths() != lastInputChange) {
        return;
      }
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      Form_clientValidation({
        paths: lastInputChange,
        immediate: info.multiple,
        multiple: info.multiple,
        type: "blur",
        formElement: FormElement,
        target: e.target ?? void 0
      });
      lastInputChange = void 0;
    }
    FormElement.addEventListener("focusout", onBlur);
    FormElement.addEventListener("input", onInput);
    onDestroy(() => {
      FormElement.removeEventListener("focusout", onBlur);
      FormElement.removeEventListener("input", onInput);
    });
    const htmlForm = Form(FormElement, { submitting: Submitting, delayed: Delayed, timeout: Timeout }, options);
    let currentRequest;
    return enhance(FormElement, async (submitParams) => {
      let jsonData = void 0;
      let validationAdapter = options.validators;
      const submit = {
        ...submitParams,
        jsonData(data) {
          if (options.dataType !== "json") {
            throw new SuperFormError("options.dataType must be set to 'json' to use jsonData.");
          }
          jsonData = data;
        },
        validators(adapter) {
          validationAdapter = adapter;
        }
      };
      const _submitCancel = submit.cancel;
      let cancelled = false;
      function clientValidationResult(validation) {
        const validationResult = { ...validation, posted: true };
        const status = validationResult.valid ? 200 : (typeof options.SPA === "boolean" || typeof options.SPA === "string" ? void 0 : options.SPA?.failStatus) ?? 400;
        const data = { form: validationResult };
        const result = validationResult.valid ? { type: "success", status, data } : { type: "failure", status, data };
        setTimeout(() => validationResponse({ result }), 0);
      }
      function clearOnSubmit() {
        switch (options.clearOnSubmit) {
          case "errors-and-message":
            Errors.clear();
            Message.set(void 0);
            break;
          case "errors":
            Errors.clear();
            break;
          case "message":
            Message.set(void 0);
            break;
        }
      }
      function cancel(opts = {
        resetTimers: true
      }) {
        cancelled = true;
        if (opts.resetTimers && htmlForm.isSubmitting()) {
          htmlForm.completed({ cancelled });
        }
        return _submitCancel();
      }
      submit.cancel = cancel;
      if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
        cancel({ resetTimers: false });
      } else {
        if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
          if (currentRequest)
            currentRequest.abort();
        }
        htmlForm.submitting();
        currentRequest = submit.controller;
        for (const event of formEvents.onSubmit) {
          await event(submit);
        }
      }
      if (cancelled && options.flashMessage)
        cancelFlash(options);
      if (!cancelled) {
        const noValidate = !Form_isSPA() && (FormElement.noValidate || (submit.submitter instanceof HTMLButtonElement || submit.submitter instanceof HTMLInputElement) && submit.submitter.formNoValidate);
        let validation = void 0;
        const validateForm = async () => {
          return await Form_validate({ adapter: validationAdapter });
        };
        clearOnSubmit();
        if (!noValidate) {
          validation = await validateForm();
          if (!validation.valid) {
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          }
        }
        if (!cancelled) {
          if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message") && shouldSyncFlash(options)) {
            options.flashMessage.module.getFlash(page).set(void 0);
          }
          const submitData = "formData" in submit ? submit.formData : submit.data;
          lastInputChange = void 0;
          if (Form_isSPA()) {
            if (!validation)
              validation = await validateForm();
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          } else if (options.dataType === "json") {
            if (!validation)
              validation = await validateForm();
            const postData = clone$1(jsonData ?? validation.data);
            traversePaths(postData, (data) => {
              if (data.value instanceof File) {
                const key = "__superform_file_" + mergePath(data.path);
                submitData.append(key, data.value);
                return data.set(void 0);
              } else if (Array.isArray(data.value) && data.value.length && data.value.every((v) => v instanceof File)) {
                const key = "__superform_files_" + mergePath(data.path);
                for (const file of data.value) {
                  submitData.append(key, file);
                }
                return data.set(void 0);
              }
            });
            Object.keys(postData).forEach((key) => {
              if (typeof submitData.get(key) === "string") {
                submitData.delete(key);
              }
            });
            const chunks = chunkSubstr(stringify(postData), options.jsonChunkSize ?? 5e5);
            for (const chunk of chunks) {
              submitData.append("__superform_json", chunk);
            }
          }
          if (!submitData.has("__superform_id")) {
            const id = Data.formId;
            if (id !== void 0)
              submitData.set("__superform_id", id);
          }
          if (typeof options.SPA === "string") {
            EnhancedForm_setAction(options.SPA);
          }
        }
      }
      function chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substring(o, o + size);
        }
        return chunks;
      }
      async function validationResponse(event) {
        let cancelled2 = false;
        currentRequest = null;
        let result = "type" in event.result && "status" in event.result ? event.result : {
          type: "error",
          status: parseInt(String(event.result.status)) || 500,
          error: event.result.error instanceof Error ? event.result.error : event.result
        };
        const cancel2 = () => cancelled2 = true;
        const data = {
          result,
          formEl: FormElement,
          formElement: FormElement,
          cancel: cancel2
        };
        const unsubCheckforNav = STORYBOOK_MODE || !Form_isSPA() ? () => {
        } : navigating.subscribe(($nav) => {
          if (!$nav || $nav.from?.route.id === $nav.to?.route.id)
            return;
          cancel2();
        });
        for (const event2 of formEvents.onResult) {
          await event2(data);
        }
        result = data.result;
        if (!cancelled2) {
          if ((result.type === "success" || result.type == "failure") && result.data) {
            const forms = Context_findValidationForms(result.data);
            if (!forms.length) {
              throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
            }
            for (const newForm of forms) {
              if (newForm.id !== Data.formId)
                continue;
              const data2 = {
                form: newForm,
                formEl: FormElement,
                formElement: FormElement,
                cancel: () => cancelled2 = true,
                result
              };
              for (const event2 of formEvents.onUpdate) {
                await event2(data2);
              }
              result = data2.result;
              if (!cancelled2) {
                if (options.customValidity) {
                  setCustomValidityForm(FormElement, data2.form.errors);
                }
                if (Form_shouldReset(data2.form.valid, result.type == "success")) {
                  data2.formElement.querySelectorAll('input[type="file"]').forEach((e) => e.value = "");
                }
              }
            }
          }
          if (!cancelled2) {
            if (result.type !== "error") {
              if (result.type === "success" && options.invalidateAll) {
                await invalidateAll();
              }
              if (options.applyAction) {
                await applyAction();
              } else {
                await Form_updateFromActionResult(result);
              }
            } else {
              if (options.applyAction) {
                if (options.onError == "apply") {
                  await applyAction();
                } else {
                  ({
                    type: "failure",
                    status: Math.floor(result.status || 500),
                    data: result
                  });
                  await applyAction();
                }
              }
              if (options.onError !== "apply") {
                const data2 = { result, message: Message };
                for (const onErrorEvent of formEvents.onError) {
                  if (onErrorEvent !== "apply" && (onErrorEvent != defaultOnError || !options.flashMessage?.onError)) {
                    await onErrorEvent(data2);
                  }
                }
              }
            }
            if (options.flashMessage) {
              if (result.type == "error" && options.flashMessage.onError) {
                await options.flashMessage.onError({
                  result,
                  flashMessage: options.flashMessage.module.getFlash(page)
                });
              }
            }
          }
        }
        if (cancelled2 && options.flashMessage) {
          cancelFlash(options);
        }
        if (cancelled2 || result.type != "redirect") {
          htmlForm.completed({ cancelled: cancelled2 });
        } else if (STORYBOOK_MODE) {
          htmlForm.completed({ cancelled: cancelled2, clearAll: true });
        } else {
          const unsub = navigating.subscribe(($nav) => {
            if ($nav)
              return;
            setTimeout(() => {
              try {
                if (unsub)
                  unsub();
              } catch {
              }
            });
            if (htmlForm.isSubmitting()) {
              htmlForm.completed({ cancelled: cancelled2, clearAll: true });
            }
          });
        }
        unsubCheckforNav();
      }
      return validationResponse;
    });
  }
  function removeFiles(formData) {
    const paths = [];
    traversePaths(formData, (data2) => {
      if (data2.value instanceof File) {
        paths.push(data2.path);
        return "skip";
      } else if (Array.isArray(data2.value) && data2.value.length && data2.value.every((d) => d instanceof File)) {
        paths.push(data2.path);
        return "skip";
      }
    });
    if (!paths.length)
      return { data: formData, paths };
    const data = clone$1(formData);
    setPaths(data, paths, (path) => pathExists(initialForm.data, path)?.value);
    return { data, paths };
  }
  return {
    form: Form$1,
    formId: FormId,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    tainted: Tainted_currentState(),
    submitting: readonly(Submitting),
    delayed: readonly(Delayed),
    timeout: readonly(Timeout),
    options,
    capture() {
      const { data, paths } = removeFiles(Data.form);
      let tainted = Data.tainted;
      if (paths.length) {
        tainted = clone$1(tainted) ?? {};
        setPaths(tainted, paths, false);
      }
      return {
        valid: Data.valid,
        posted: Data.posted,
        errors: Data.errors,
        data,
        constraints: Data.constraints,
        message: Data.message,
        id: Data.formId,
        tainted,
        shape: Data.shape
      };
    },
    restore: (snapshot) => {
      rebind({ form: snapshot, untaint: snapshot.tainted ?? true });
    },
    async validate(path, opts = {}) {
      if (!options.validators) {
        throw new SuperFormError("options.validators must be set to use the validate method.");
      }
      if (opts.update === void 0)
        opts.update = true;
      if (opts.taint === void 0)
        opts.taint = false;
      if (typeof opts.errors == "string")
        opts.errors = [opts.errors];
      let data;
      const splittedPath = splitPath(path);
      if ("value" in opts) {
        if (opts.update === true || opts.update === "value") {
          Form$1.update(($form) => {
            setPaths($form, [splittedPath], opts.value);
            return $form;
          }, { taint: opts.taint });
          data = Data.form;
        } else {
          data = clone$1(Data.form);
          setPaths(data, [splittedPath], opts.value);
        }
      } else {
        data = Data.form;
      }
      const result = await Form_validate({ formData: data });
      const error = pathExists(result.errors, splittedPath);
      if (error && error.value && opts.errors) {
        error.value = opts.errors;
      }
      if (opts.update === true || opts.update == "errors") {
        Errors.update(($errors) => {
          setPaths($errors, [splittedPath], error?.value);
          return $errors;
        });
      }
      return error?.value;
    },
    async validateForm(opts = {}) {
      if (!options.validators && !opts.schema) {
        throw new SuperFormError("options.validators or the schema option must be set to use the validateForm method.");
      }
      const result = opts.update ? await Form_clientValidation({ paths: [] }, true, opts.schema) : Form_validate({ adapter: opts.schema });
      const enhancedForm = EnhancedForm_get();
      if (opts.update && enhancedForm) {
        setTimeout(() => {
          if (!enhancedForm)
            return;
          scrollToFirstError(enhancedForm, {
            ...options,
            scrollToError: opts.focusOnError === false ? "off" : options.scrollToError
          });
        }, 1);
      }
      return result || Form_validate({ adapter: opts.schema });
    },
    allErrors: AllErrors,
    posted: Posted,
    reset(options2) {
      return Form_reset({
        message: options2?.keepMessage ? Data.message : void 0,
        data: options2?.data,
        id: options2?.id,
        newState: options2?.newState
      });
    },
    submit(submitter) {
      const form2 = EnhancedForm_get() ? EnhancedForm_get() : submitter && submitter instanceof HTMLElement ? submitter.closest("form") : void 0;
      if (!form2) {
        throw new SuperFormError("use:enhance must be added to the form to use submit, or pass a HTMLElement inside the form (or the form itself) as an argument.");
      }
      if (!form2.requestSubmit) {
        return form2.submit();
      }
      const isSubmitButton = submitter && (submitter instanceof HTMLButtonElement && submitter.type == "submit" || submitter instanceof HTMLInputElement && ["submit", "image"].includes(submitter.type));
      form2.requestSubmit(isSubmitButton ? submitter : void 0);
    },
    isTainted: Tainted_isTainted,
    enhance: superFormEnhance
  };
}
function constraints(schema) {
  return _constraints(schemaInfo(schema, false, []), []);
}
function merge(...constraints2) {
  const filtered = constraints2.filter((c) => !!c);
  if (!filtered.length)
    return void 0;
  if (filtered.length == 1)
    return filtered[0];
  return merge$1(...filtered);
}
function _constraints(info, path) {
  if (!info)
    return void 0;
  let output = void 0;
  if (info.union && info.union.length) {
    const infos = info.union.map((s) => schemaInfo(s, info.isOptional, path));
    const merged = infos.map((i) => _constraints(i, path));
    output = merge(output, ...merged);
    if (output && (info.isNullable || info.isOptional || infos.some((i) => i?.isNullable || i?.isOptional))) {
      delete output.required;
    }
  }
  if (info.array) {
    output = merge(output, ...info.array.map((i) => _constraints(schemaInfo(i, info.isOptional, path), path)));
  }
  if (info.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      const propConstraint = _constraints(propInfo, [...path, key]);
      if (typeof propConstraint === "object" && Object.values(propConstraint).length > 0) {
        obj[key] = propConstraint;
      }
    }
    output = merge(output, obj);
  }
  return output ?? constraint(info);
}
function constraint(info) {
  const output = {};
  const schema = info.schema;
  const type = schema.type;
  const format = schema.format;
  if (type == "integer" && format == "unix-time") {
    const date = schema;
    if (date.minimum !== void 0)
      output.min = new Date(date.minimum).toISOString();
    if (date.maximum !== void 0)
      output.max = new Date(date.maximum).toISOString();
  } else if (type == "string") {
    const str = schema;
    const patterns = [
      str.pattern,
      ...str.allOf ? str.allOf.map((s) => typeof s == "boolean" ? void 0 : s.pattern) : []
    ].filter((s) => s !== void 0);
    if (patterns.length > 0)
      output.pattern = patterns[0];
    if (str.minLength !== void 0)
      output.minlength = str.minLength;
    if (str.maxLength !== void 0)
      output.maxlength = str.maxLength;
  } else if (type == "number" || type == "integer") {
    const num = schema;
    if (num.minimum !== void 0)
      output.min = num.minimum;
    else if (num.exclusiveMinimum !== void 0)
      output.min = num.exclusiveMinimum + (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.maximum !== void 0)
      output.max = num.maximum;
    else if (num.exclusiveMaximum !== void 0)
      output.max = num.exclusiveMaximum - (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.multipleOf !== void 0)
      output.step = num.multipleOf;
  } else if (type == "array") {
    const arr = schema;
    if (arr.minItems !== void 0)
      output.min = arr.minItems;
    if (arr.maxItems !== void 0)
      output.max = arr.maxItems;
  }
  if (!info.isNullable && !info.isOptional) {
    output.required = true;
  }
  return Object.keys(output).length > 0 ? output : void 0;
}
function schemaHash(schema) {
  return hashCode(_schemaHash(schemaInfo(schema, false, []), 0, []));
}
function _schemaHash(info, depth, path) {
  if (!info)
    return "";
  function tab() {
    return "  ".repeat(depth);
  }
  function mapSchemas(schemas) {
    return schemas.map((s) => _schemaHash(schemaInfo(s, info?.isOptional ?? false, path), depth + 1, path)).filter((s) => s).join("|");
  }
  function nullish() {
    const output = [];
    if (info?.isNullable)
      output.push("null");
    if (info?.isOptional)
      output.push("undefined");
    return !output.length ? "" : "|" + output.join("|");
  }
  if (info.union) {
    return "Union {\n  " + tab() + mapSchemas(info.union) + "\n" + tab() + "}" + nullish();
  }
  if (info.properties) {
    const output = [];
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      output.push(key + ": " + _schemaHash(propInfo, depth + 1, path));
    }
    return "Object {\n  " + tab() + output.join(",\n  ") + "\n" + tab() + "}" + nullish();
  }
  if (info.array) {
    return "Array[" + mapSchemas(info.array) + "]" + nullish();
  }
  return info.types.join("|") + nullish();
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (hash < 0)
    hash = hash >>> 0;
  return hash.toString(36);
}
// @__NO_SIDE_EFFECTS__
function createAdapter(adapter, jsonSchema) {
  if (!adapter || !("superFormValidationLibrary" in adapter)) {
    throw new SuperFormError('Superforms v2 requires a validation adapter for the schema. Import one of your choice from "sveltekit-superforms/adapters" and wrap the schema with it.');
  }
  if (!jsonSchema)
    jsonSchema = adapter.jsonSchema;
  return {
    ...adapter,
    constraints: adapter.constraints ?? constraints(jsonSchema),
    defaults: adapter.defaults ?? defaultValues(jsonSchema),
    shape: schemaShape(jsonSchema),
    id: schemaHash(jsonSchema)
  };
}
let legacyMode = false;
try {
  if (SUPERFORMS_LEGACY)
    legacyMode = true;
} catch {
}
const unionError = 'FormData parsing failed: Unions are only supported when the dataType option for superForm is set to "json".';
async function parseRequest(data, schemaData, options) {
  let parsed;
  if (data instanceof FormData) {
    parsed = parseFormData(data, schemaData, options);
  } else if (data instanceof URL || data instanceof URLSearchParams) {
    parsed = parseSearchParams(data, schemaData, options);
  } else if (data instanceof Request) {
    parsed = await tryParseFormData(data, schemaData, options);
  } else if (
    // RequestEvent
    data && typeof data === "object" && "request" in data && data.request instanceof Request
  ) {
    parsed = await tryParseFormData(data.request, schemaData, options);
  } else {
    parsed = {
      id: void 0,
      data,
      posted: false
    };
  }
  return parsed;
}
async function tryParseFormData(request, schemaData, options) {
  let formData = void 0;
  try {
    formData = await request.formData();
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("already been consumed")) {
      throw e;
    }
    return { id: void 0, data: void 0, posted: false };
  }
  return parseFormData(formData, schemaData, options);
}
function parseSearchParams(data, schemaData, options) {
  if (data instanceof URL)
    data = data.searchParams;
  const convert = new FormData();
  for (const [key, value] of data.entries()) {
    convert.append(key, value);
  }
  const output = parseFormData(convert, schemaData, options);
  output.posted = false;
  return output;
}
function parseFormData(formData, schemaData, options) {
  function tryParseSuperJson() {
    if (formData.has("__superform_json")) {
      try {
        const output = parse(formData.getAll("__superform_json").join("") ?? "");
        if (typeof output === "object") {
          const filePaths = Array.from(formData.keys());
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_file_"))) {
            const realPath = splitPath(path.substring(17));
            setPaths(output, [realPath], formData.get(path));
          }
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_files_"))) {
            const realPath = splitPath(path.substring(18));
            const allFiles = formData.getAll(path);
            setPaths(output, [realPath], Array.from(allFiles));
          }
          return output;
        }
      } catch {
      }
    }
    return null;
  }
  const data = tryParseSuperJson();
  const id = formData.get("__superform_id")?.toString();
  return data ? { id, data, posted: true } : {
    id,
    data: _parseFormData(formData, schemaData, options),
    posted: true
  };
}
function _parseFormData(formData, schema, options) {
  const output = {};
  let schemaKeys;
  if (options?.strict) {
    schemaKeys = new Set([...formData.keys()].filter((key) => !key.startsWith("__superform_")));
  } else {
    let unionKeys = [];
    if (schema.anyOf) {
      const info = schemaInfo(schema, false, []);
      if (info.union?.some((s) => s.type !== "object")) {
        throw new SchemaError("All form types must be an object if schema is a union.");
      }
      unionKeys = info.union?.flatMap((s) => Object.keys(s.properties ?? {})) ?? [];
    }
    schemaKeys = new Set([
      ...unionKeys,
      ...Object.keys(schema.properties ?? {}),
      ...schema.additionalProperties ? formData.keys() : []
    ].filter((key) => !key.startsWith("__superform_")));
  }
  function parseSingleEntry(key, entry, info) {
    if (options?.preprocessed && options.preprocessed.includes(key)) {
      return entry;
    }
    if (entry && typeof entry !== "string") {
      const allowFiles = legacyMode ? options?.allowFiles === true : options?.allowFiles !== false;
      return !allowFiles ? void 0 : entry.size ? entry : info.isNullable ? null : void 0;
    }
    if (info.types.length > 1) {
      throw new SchemaError(unionError, key);
    }
    const [type] = info.types;
    return parseFormDataEntry(key, entry, type ?? "any", info);
  }
  const defaultPropertyType = typeof schema.additionalProperties == "object" ? schema.additionalProperties : { type: "string" };
  for (const key of schemaKeys) {
    const property = schema.properties ? schema.properties[key] : defaultPropertyType;
    assertSchema(property, key);
    const info = schemaInfo(property ?? defaultPropertyType, !schema.required?.includes(key), [
      key
    ]);
    if (!info)
      continue;
    if (!info.types.includes("boolean") && !schema.additionalProperties && !formData.has(key)) {
      continue;
    }
    const entries = formData.getAll(key);
    if (info.union && info.union.length > 1) {
      throw new SchemaError(unionError, key);
    }
    if (info.types.includes("array") || info.types.includes("set")) {
      const items = property.items ?? (info.union?.length == 1 ? info.union[0] : void 0);
      if (!items || typeof items == "boolean" || Array.isArray(items) && items.length != 1) {
        throw new SchemaError('Arrays must have a single "items" property that defines its type.', key);
      }
      const arrayType = Array.isArray(items) ? items[0] : items;
      assertSchema(arrayType, key);
      const arrayInfo = schemaInfo(arrayType, info.isOptional, [key]);
      if (!arrayInfo)
        continue;
      const isFileArray = entries.length && entries.some((e) => e && typeof e !== "string");
      const arrayData = entries.map((e) => parseSingleEntry(key, e, arrayInfo));
      if (isFileArray && arrayData.every((file) => !file))
        arrayData.length = 0;
      output[key] = info.types.includes("set") ? new Set(arrayData) : arrayData;
    } else {
      output[key] = parseSingleEntry(key, entries[entries.length - 1], info);
    }
  }
  return output;
}
function parseFormDataEntry(key, value, type, info) {
  if (!value) {
    if (type == "boolean" && info.isOptional && info.schema.default === true) {
      return false;
    }
    const defaultValue2 = defaultValues(info.schema, info.isOptional, [key]);
    if (info.schema.enum && defaultValue2 !== null && defaultValue2 !== void 0) {
      return value;
    }
    if (defaultValue2 !== void 0)
      return defaultValue2;
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  function typeError() {
    throw new SchemaError(type[0].toUpperCase() + type.slice(1) + ` type found. Set the dataType option to "json" and add use:enhance on the client to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`, key);
  }
  switch (type) {
    case "string":
    case "any":
      return value;
    case "integer":
      return parseInt(value ?? "", 10);
    case "number":
      return parseFloat(value ?? "");
    case "boolean":
      return Boolean(value == "false" ? "" : value).valueOf();
    case "unix-time": {
      const date = new Date(value ?? "");
      return !isNaN(date) ? date : void 0;
    }
    case "bigint":
      return BigInt(value ?? ".");
    case "symbol":
      return Symbol(String(value));
    case "set":
    case "array":
    case "object":
      return typeError();
    default:
      throw new SuperFormError("Unsupported schema type for FormData: " + type);
  }
}
const memoize = baseMemoize;
const defaultOptions = {
  dateStrategy: "integer",
  pipeStrategy: "output",
  $refStrategy: "none"
};
const zodToJSONSchema = /* @__NO_SIDE_EFFECTS__ */ (...params) => {
  params[1] = typeof params[1] == "object" ? { ...defaultOptions, ...params[1] } : defaultOptions;
  return zodToJsonSchema(...params);
};
async function validate(schema, data, errorMap) {
  const result = await schema.safeParseAsync(data, { errorMap });
  if (result.success) {
    return {
      data: result.data,
      success: true
    };
  }
  return {
    issues: result.error.issues.map(({ message, path }) => ({ message, path })),
    success: false
  };
}
function _zod(schema, options) {
  return /* @__PURE__ */ createAdapter({
    superFormValidationLibrary: "zod",
    validate: async (data) => validate(schema, data, options?.errorMap),
    jsonSchema: options?.jsonSchema ?? /* @__PURE__ */ zodToJSONSchema(schema, options?.config),
    defaults: options?.defaults
  });
}
function _zodClient(schema, options) {
  return {
    superFormValidationLibrary: "zod",
    validate: async (data) => validate(schema, data, options?.errorMap)
  };
}
const zod = /* @__PURE__ */ memoize(_zod);
const zodClient = /* @__PURE__ */ memoize(_zodClient);

async function superValidate(data, adapter, options) {
  if (data && "superFormValidationLibrary" in data) {
    options = adapter;
    adapter = data;
    data = void 0;
  }
  const validator = adapter;
  const defaults = options?.defaults ?? validator.defaults;
  const jsonSchema = validator.jsonSchema;
  const parsed = await parseRequest(data, jsonSchema, options);
  const addErrors = options?.errors ?? (options?.strict ? true : !!parsed.data);
  const parsedData = options?.strict ? parsed.data ?? {} : mergeDefaults(parsed.data, defaults);
  let status;
  if (!!parsed.data || addErrors) {
    status = await /* @__PURE__ */ validator.validate(parsedData);
  } else {
    status = { success: false, issues: [] };
  }
  const valid = status.success;
  const errors = valid || !addErrors ? {} : mapErrors(status.issues, validator.shape);
  const dataWithDefaults = valid ? status.data : replaceInvalidDefaults(options?.strict ? mergeDefaults(parsedData, defaults) : parsedData, defaults, jsonSchema, status.issues, options?.preprocessed);
  let outputData;
  if (jsonSchema.additionalProperties === false) {
    outputData = {};
    for (const key of Object.keys(jsonSchema.properties ?? {})) {
      if (key in dataWithDefaults)
        outputData[key] = dataWithDefaults[key];
    }
  } else {
    outputData = dataWithDefaults;
  }
  const output = {
    id: parsed.id ?? options?.id ?? validator.id,
    valid,
    posted: parsed.posted,
    errors,
    data: outputData
  };
  if (!parsed.posted) {
    output.constraints = validator.constraints;
    if (Object.keys(validator.shape).length) {
      output.shape = validator.shape;
    }
  }
  return output;
}

var safeFormat;
var hasRequiredSafeFormat;

function requireSafeFormat () {
	if (hasRequiredSafeFormat) return safeFormat;
	hasRequiredSafeFormat = 1;

	class SafeString extends String {} // used for instanceof checks

	const compares = new Set(['<', '>', '<=', '>=']);
	const escapeCode = (code) => `\\u${code.toString(16).padStart(4, '0')}`;

	// Supports simple js variables only, i.e. constants and JSON-stringifiable
	// Converts a variable to be safe for inclusion in JS context
	// This works on top of JSON.stringify with minor fixes to negate the JS/JSON parsing differences
	const jsval = (val) => {
	  if ([Infinity, -Infinity, NaN, undefined, null].includes(val)) return `${val}`
	  const primitive = ['string', 'boolean', 'number'].includes(typeof val);
	  if (!primitive) {
	    if (typeof val !== 'object') throw new Error('Unexpected value type')
	    const proto = Object.getPrototypeOf(val);
	    const ok = (proto === Array.prototype && Array.isArray(val)) || proto === Object.prototype;
	    if (!ok) throw new Error('Unexpected object given as value')
	  }
	  return (
	    JSON.stringify(val)
	      // JSON context and JS eval context have different handling of __proto__ property name
	      // Refs: https://www.ecma-international.org/ecma-262/#sec-json.parse
	      // Refs: https://www.ecma-international.org/ecma-262/#sec-__proto__-property-names-in-object-initializers
	      // Replacement is safe because it's the only way that encodes __proto__ property in JSON and
	      // it can't occur inside strings or other properties, due to the leading `"` and traling `":`
	      .replace(/([{,])"__proto__":/g, '$1["__proto__"]:')
	      // The above line should cover all `"__proto__":` occurances except for `"...\"__proto__":`
	      .replace(/[^\\]"__proto__":/g, () => {
	        /* c8 ignore next */
	        throw new Error('Unreachable')
	      })
	      // https://v8.dev/features/subsume-json#security, e.g. {'\u2028':0} on Node.js 8
	      .replace(/[\u2028\u2029]/g, (char) => escapeCode(char.charCodeAt(0)))
	  )
	};

	const format = (fmt, ...args) => {
	  const res = fmt.replace(/%[%drscjw]/g, (match) => {
	    if (match === '%%') return '%'
	    if (args.length === 0) throw new Error('Unexpected arguments count')
	    const val = args.shift();
	    switch (match) {
	      case '%d':
	        if (typeof val === 'number') return val
	        throw new Error('Expected a number')
	      case '%r':
	        // String(regex) is not ok on Node.js 10 and below: console.log(String(new RegExp('\n')))
	        if (val instanceof RegExp) return format('new RegExp(%j, %j)', val.source, val.flags)
	        throw new Error('Expected a RegExp instance')
	      case '%s':
	        if (val instanceof SafeString) return val
	        throw new Error('Expected a safe string')
	      case '%c':
	        if (compares.has(val)) return val
	        throw new Error('Expected a compare op')
	      case '%j':
	        return jsval(val)
	      case '%w':
	        if (Number.isInteger(val) && val >= 0) return ' '.repeat(val)
	        throw new Error('Expected a non-negative integer for indentation')
	    }
	    /* c8 ignore next */
	    throw new Error('Unreachable')
	  });
	  if (args.length !== 0) throw new Error('Unexpected arguments count')
	  return new SafeString(res)
	};

	const safe = (string) => {
	  if (!/^[a-z][a-z0-9_]*$/i.test(string)) throw new Error('Does not look like a safe id')
	  return new SafeString(string)
	};

	// too dangereous to export, use with care
	const safewrap = (fun) => (...args) => {
	  if (!args.every((arg) => arg instanceof SafeString)) throw new Error('Unsafe arguments')
	  return new SafeString(fun(...args))
	};

	const safepriority = (arg) =>
	  // simple expression and single brackets can not break priority
	  /^[a-z][a-z0-9_().]*$/i.test(arg) || /^\([^()]+\)$/i.test(arg) ? arg : format('(%s)', arg);
	const safeor = safewrap(
	  (...args) => (args.some((arg) => `${arg}` === 'true') ? 'true' : args.join(' || ') || 'false')
	);
	const safeand = safewrap(
	  (...args) => (args.some((arg) => `${arg}` === 'false') ? 'false' : args.join(' && ') || 'true')
	);
	const safenot = (arg) => {
	  if (`${arg}` === 'true') return safe('false')
	  if (`${arg}` === 'false') return safe('true')
	  return format('!%s', safepriority(arg))
	};
	// this function is priority-safe, unlike safeor, hence it's exported and safeor is not atm
	const safenotor = (...args) => safenot(safeor(...args));

	safeFormat = { format, safe, safeand, safenot, safenotor };
	return safeFormat;
}

var scopeUtils;
var hasRequiredScopeUtils;

function requireScopeUtils () {
	if (hasRequiredScopeUtils) return scopeUtils;
	hasRequiredScopeUtils = 1;

	const { safe } = requireSafeFormat();

	const caches = new WeakMap();

	// Given a scope object, generates new symbol/loop/pattern/format/ref variable names,
	// also stores in-scope format/ref mapping to variable names

	const scopeMethods = (scope) => {
	  // cache meta info for known scope variables, per meta type
	  if (!caches.has(scope))
	    caches.set(scope, { sym: new Map(), ref: new Map(), format: new Map(), pattern: new Map() });
	  const cache = caches.get(scope);

	  // Generic variable names, requires a base name aka prefix
	  const gensym = (name) => {
	    if (!cache.sym.get(name)) cache.sym.set(name, 0);
	    const index = cache.sym.get(name);
	    cache.sym.set(name, index + 1);
	    return safe(`${name}${index}`)
	  };

	  // Regexp pattern names
	  const genpattern = (p) => {
	    if (cache.pattern.has(p)) return cache.pattern.get(p)
	    const n = gensym('pattern');
	    scope[n] = new RegExp(p, 'u');
	    cache.pattern.set(p, n);
	    return n
	  };

	  // Loop variable names
	  if (!cache.loop) cache.loop = 'ijklmnopqrstuvxyz'.split('');
	  const genloop = () => {
	    const v = cache.loop.shift();
	    cache.loop.push(`${v}${v[0]}`);
	    return safe(v)
	  };

	  // Reference (validator function) names
	  const getref = (sub) => cache.ref.get(sub);
	  const genref = (sub) => {
	    const n = gensym('ref');
	    cache.ref.set(sub, n);
	    return n
	  };

	  // Format validation function names
	  const genformat = (impl) => {
	    let n = cache.format.get(impl);
	    if (!n) {
	      n = gensym('format');
	      scope[n] = impl;
	      cache.format.set(impl, n);
	    }
	    return n
	  };

	  return { gensym, genpattern, genloop, getref, genref, genformat }
	};

	scopeUtils = { scopeMethods };
	return scopeUtils;
}

var scopeFunctions;
var hasRequiredScopeFunctions;

function requireScopeFunctions () {
	if (hasRequiredScopeFunctions) return scopeFunctions;
	hasRequiredScopeFunctions = 1;

	// for correct Unicode code points processing
	// https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
	const stringLength = (string) =>
	  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;

	// A isMultipleOf B: shortest decimal denoted as A % shortest decimal denoted as B === 0
	// Optimized, coherence checks and precomputation are outside of this method
	// If we get an Infinity when we multiply by the factor (which is always a power of 10), we just undo that instead of always returning false
	const isMultipleOf = (value, divisor, factor, factorMultiple) => {
	  if (value % divisor === 0) return true
	  let multiple = value * factor;
	  if (multiple === Infinity || multiple === -Infinity) multiple = value;
	  if (multiple % factorMultiple === 0) return true
	  const normal = Math.floor(multiple + 0.5);
	  return normal / factor === value && normal % factorMultiple === 0
	};

	// supports only JSON-stringifyable objects, defaults to false for unsupported
	// also uses ===, not Object.is, i.e. 0 === -0, NaN !== NaN
	// symbols and non-enumerable properties are ignored!
	const deepEqual = (obj, obj2) => {
	  if (obj === obj2) return true
	  if (!obj || !obj2 || typeof obj !== typeof obj2) return false
	  if (obj !== obj2 && typeof obj !== 'object') return false

	  const proto = Object.getPrototypeOf(obj);
	  if (proto !== Object.getPrototypeOf(obj2)) return false

	  if (proto === Array.prototype) {
	    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
	    if (obj.length !== obj2.length) return false
	    return obj.every((x, i) => deepEqual(x, obj2[i]))
	  } else if (proto === Object.prototype) {
	    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)];
	    if (keys.length !== keys2.length) return false
	    const keyset2 = new Set([...keys, ...keys2]);
	    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
	  }
	  return false
	};

	const unique = (array) => {
	  if (array.length < 2) return true
	  if (array.length === 2) return !deepEqual(array[0], array[1])
	  const objects = [];
	  const primitives = array.length > 20 ? new Set() : null;
	  let primitivesCount = 0;
	  let pos = 0;
	  for (const item of array) {
	    if (typeof item === 'object') {
	      objects.push(item);
	    } else if (primitives) {
	      primitives.add(item);
	      if (primitives.size !== ++primitivesCount) return false
	    } else {
	      if (array.indexOf(item, pos + 1) !== -1) return false
	    }
	    pos++;
	  }
	  for (let i = 1; i < objects.length; i++)
	    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
	  return true
	};

	const deBase64 = (string) => {
	  if (typeof Buffer !== 'undefined') return Buffer.from(string, 'base64').toString('utf-8')
	  const b = atob(string);
	  return new TextDecoder('utf-8').decode(new Uint8Array(b.length).map((_, i) => b.charCodeAt(i)))
	};

	const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
	// special handling for stringification
	hasOwn[Symbol.for('toJayString')] = 'Function.prototype.call.bind(Object.prototype.hasOwnProperty)';

	// Used for error generation. Affects error performance, optimized
	const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
	const toPointer = (path) => (path.length === 0 ? '#' : `#/${path.map(pointerPart).join('/')}`);

	const errorMerge = ({ keywordLocation, instanceLocation }, schemaBase, dataBase) => ({
	  keywordLocation: `${schemaBase}${keywordLocation.slice(1)}`,
	  instanceLocation: `${dataBase}${instanceLocation.slice(1)}`,
	});

	const propertyIn = (key, [properties, patterns]) =>
	  properties.includes(true) ||
	  properties.some((prop) => prop === key) ||
	  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));

	// id is verified to start with '#' at compile time, hence using plain objects is safe
	const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];

	const extraUtils = { toPointer, pointerPart, errorMerge, propertyIn, dynamicResolve };
	scopeFunctions = { stringLength, isMultipleOf, deepEqual, unique, deBase64, hasOwn, ...extraUtils };
	return scopeFunctions;
}

var javascript;
var hasRequiredJavascript;

function requireJavascript () {
	if (hasRequiredJavascript) return javascript;
	hasRequiredJavascript = 1;

	const { format, safe } = requireSafeFormat();
	const { scopeMethods } = requireScopeUtils();
	const functions = requireScopeFunctions();

	// for building into the validation function
	const types = new Map(
	  Object.entries({
	    null: (name) => format('%s === null', name),
	    boolean: (name) => format('typeof %s === "boolean"', name),
	    array: (name) => format('Array.isArray(%s)', name),
	    object: (n) => format('typeof %s === "object" && %s && !Array.isArray(%s)', n, n, n),
	    number: (name) => format('typeof %s === "number"', name),
	    integer: (name) => format('Number.isInteger(%s)', name),
	    string: (name) => format('typeof %s === "string"', name),
	  })
	);

	const buildName = ({ name, parent, keyval, keyname }) => {
	  if (name) {
	    if (parent || keyval || keyname) throw new Error('name can be used only stand-alone')
	    return name // top-level
	  }
	  if (!parent) throw new Error('Can not use property of undefined parent!')
	  const parentName = buildName(parent);
	  if (keyval !== undefined) {
	    if (keyname) throw new Error('Can not use key value and name together')
	    if (!['string', 'number'].includes(typeof keyval)) throw new Error('Invalid property path')
	    if (/^[a-z][a-z0-9_]*$/i.test(keyval)) return format('%s.%s', parentName, safe(keyval))
	    return format('%s[%j]', parentName, keyval)
	  } else if (keyname) {
	    return format('%s[%s]', parentName, keyname)
	  }
	  /* c8 ignore next */
	  throw new Error('Unreachable')
	};

	const jsonProtoKeys = new Set(
	  [].concat(
	    ...[Object, Array, String, Number, Boolean].map((c) => Object.getOwnPropertyNames(c.prototype))
	  )
	);

	const jsHelpers = (fun, scope, propvar, { unmodifiedPrototypes, isJSON }, noopRegExps) => {
	  const { gensym, genpattern, genloop } = scopeMethods(scope, propvar);

	  const present = (obj) => {
	    const name = buildName(obj); // also checks for coherence, do not remove
	    const { parent, keyval, keyname, inKeys, checked } = obj;
	    /* c8 ignore next */
	    if (checked || (inKeys && isJSON)) throw new Error('Unreachable: useless check for undefined')
	    if (inKeys) return format('%s !== undefined', name)
	    if (parent && keyname) {
	      scope.hasOwn = functions.hasOwn;
	      const pname = buildName(parent);
	      if (isJSON) return format('%s !== undefined && hasOwn(%s, %s)', name, pname, keyname)
	      return format('%s in %s && hasOwn(%s, %s)', keyname, pname, pname, keyname)
	    } else if (parent && keyval !== undefined) {
	      // numbers must be converted to strings for this check, hence `${keyval}` in check below
	      if (unmodifiedPrototypes && isJSON && !jsonProtoKeys.has(`${keyval}`))
	        return format('%s !== undefined', name)
	      scope.hasOwn = functions.hasOwn;
	      const pname = buildName(parent);
	      if (isJSON) return format('%s !== undefined && hasOwn(%s, %j)', name, pname, keyval)
	      return format('%j in %s && hasOwn(%s, %j)', keyval, pname, pname, keyval)
	    }
	    /* c8 ignore next */
	    throw new Error('Unreachable: present() check without parent')
	  };

	  const forObjectKeys = (obj, writeBody) => {
	    const key = gensym('key');
	    fun.block(format('for (const %s of Object.keys(%s))', key, buildName(obj)), () => {
	      writeBody(propvar(obj, key, true), key); // always own property here
	    });
	  };

	  const forArray = (obj, start, writeBody) => {
	    const i = genloop();
	    const name = buildName(obj);
	    fun.block(format('for (let %s = %s; %s < %s.length; %s++)', i, start, i, name, i), () => {
	      writeBody(propvar(obj, i, unmodifiedPrototypes, true), i); // own property in Array if proto not mangled
	    });
	  };

	  const patternTest = (pat, key) => {
	    // Convert common patterns to string checks, makes generated code easier to read (and a tiny perf bump)
	    const r = pat.replace(/[.^$|*+?(){}[\]\\]/gu, ''); // Special symbols: .^$|*+?(){}[]\
	    if (pat === `^${r}$`) return format('(%s === %j)', key, pat.slice(1, -1)) // ^abc$ -> === abc
	    if (noopRegExps.has(pat)) return format('true') // known noop

	    // All of the below will cause warnings in enforced string validation mode, but let's make what they actually do more visible
	    // note that /^.*$/u.test('\n') is false, so don't combine .* with anchors here!
	    if ([r, `${r}+`, `${r}.*`, `.*${r}.*`].includes(pat)) return format('%s.includes(%j)', key, r)
	    if ([`^${r}`, `^${r}+`, `^${r}.*`].includes(pat)) return format('%s.startsWith(%j)', key, r)
	    if ([`${r}$`, `.*${r}$`].includes(pat)) return format('%s.endsWith(%j)', key, r)

	    const subr = [...r].slice(0, -1).join(''); // without the last symbol, astral plane aware
	    if ([`${r}*`, `${r}?`].includes(pat))
	      return subr.length === 0 ? format('true') : format('%s.includes(%j)', key, subr) // abc*, abc? -> includes(ab)
	    if ([`^${r}*`, `^${r}?`].includes(pat))
	      return subr.length === 0 ? format('true') : format('%s.startsWith(%j)', key, subr) // ^abc*, ^abc? -> startsWith(ab)

	    // A normal reg-exp test
	    return format('%s.test(%s)', genpattern(pat), key)
	  };

	  const compare = (name, val) => {
	    if (!val || typeof val !== 'object') return format('%s === %j', name, val)

	    let type; // type is needed for speedup only, deepEqual rechecks that
	    // small plain object/arrays are fast cases and we inline those instead of calling deepEqual
	    const shouldInline = (arr) => arr.length <= 3 && arr.every((x) => !x || typeof x !== 'object');
	    if (Array.isArray(val)) {
	      type = types.get('array')(name);
	      if (shouldInline(val)) {
	        let k = format('%s.length === %d', name, val.length);
	        for (let i = 0; i < val.length; i++) k = format('%s && %s[%d] === %j', k, name, i, val[i]);
	        return format('%s && %s', type, k)
	      }
	    } else {
	      type = types.get('object')(name);
	      const [keys, values] = [Object.keys(val), Object.values(val)];
	      if (shouldInline(values)) {
	        let k = format('Object.keys(%s).length === %d', name, keys.length);
	        if (keys.length > 0) scope.hasOwn = functions.hasOwn;
	        for (const key of keys) k = format('%s && hasOwn(%s, %j)', k, name, key);
	        for (const key of keys) k = format('%s && %s[%j] === %j', k, name, key, val[key]);
	        return format('%s && %s', type, k)
	      }
	    }

	    scope.deepEqual = functions.deepEqual;
	    return format('%s && deepEqual(%s, %j)', type, name, val)
	  };

	  return { present, forObjectKeys, forArray, patternTest, compare, propvar }
	};

	// Stringifcation of functions and regexps, for scope
	const isArrowFnWithParensRegex = /^\([^)]*\) *=>/;
	const isArrowFnWithoutParensRegex = /^[^=]*=>/;
	const toJayString = Symbol.for('toJayString');
	function jaystring(item) {
	  if (typeof item === 'function') {
	    if (item[toJayString]) return item[toJayString] // this is supported only for functions

	    if (Object.getPrototypeOf(item) !== Function.prototype)
	      throw new Error('Can not stringify: a function with unexpected prototype')

	    const stringified = `${item}`;
	    if (item.prototype) {
	      if (!/^function[ (]/.test(stringified)) throw new Error('Unexpected function')
	      return stringified // normal function
	    }
	    if (isArrowFnWithParensRegex.test(stringified) || isArrowFnWithoutParensRegex.test(stringified))
	      return stringified // Arrow function

	    // Shortened ES6 object method declaration
	    throw new Error('Can not stringify: only either normal or arrow functions are supported')
	  } else if (typeof item === 'object') {
	    const proto = Object.getPrototypeOf(item);
	    if (item instanceof RegExp && proto === RegExp.prototype) return format('%r', item)
	    throw new Error('Can not stringify: an object with unexpected prototype')
	  }
	  throw new Error(`Can not stringify: unknown type ${typeof item}`)
	}

	javascript = { types, buildName, jsHelpers, jaystring };
	return javascript;
}

var generateFunction;
var hasRequiredGenerateFunction;

function requireGenerateFunction () {
	if (hasRequiredGenerateFunction) return generateFunction;
	hasRequiredGenerateFunction = 1;

	const { format, safe, safenot } = requireSafeFormat();
	const { jaystring } = requireJavascript();

	/*
	 * Construct a function from lines/blocks/if conditions.
	 *
	 * Returns a Function instance (makeFunction) or code in text format (makeModule).
	 */

	const INDENT_START = /[{[]/;
	const INDENT_END = /[}\]]/;

	generateFunction = () => {
	  const lines = [];
	  let indent = 0;

	  const pushLine = (line) => {
	    if (INDENT_END.test(line.trim()[0])) indent--;
	    lines.push({ indent, code: line });
	    if (INDENT_START.test(line[line.length - 1])) indent++;
	  };

	  const build = () => {
	    if (indent !== 0) throw new Error('Unexpected indent at build()')
	    const joined = lines.map((line) => format('%w%s', line.indent * 2, line.code)).join('\n');
	    return /^[a-z][a-z0-9]*$/i.test(joined) ? `return ${joined}` : `return (${joined})`
	  };

	  const processScope = (scope) => {
	    const entries = Object.entries(scope);
	    for (const [key, value] of entries) {
	      if (!/^[a-z][a-z0-9]*$/i.test(key)) throw new Error('Unexpected scope key!')
	      if (!(typeof value === 'function' || value instanceof RegExp))
	        throw new Error('Unexpected scope value!')
	    }
	    return entries
	  };

	  return {
	    optimizedOut: false, // some branch of code has been optimized out
	    size: () => lines.length,

	    write(fmt, ...args) {
	      if (typeof fmt !== 'string') throw new Error('Format must be a string!')
	      if (fmt.includes('\n')) throw new Error('Only single lines are supported')
	      pushLine(format(fmt, ...args));
	      return true // code was written
	    },

	    block(prefix, writeBody, noInline = false) {
	      const oldIndent = indent;
	      this.write('%s {', prefix);
	      const length = lines.length;
	      writeBody();
	      if (length === lines.length) {
	        // no lines inside block, unwind the block
	        lines.pop();
	        indent = oldIndent;
	        return false // nothing written
	      } else if (length === lines.length - 1 && !noInline) {
	        // a single line has been written, inline it if opt-in allows
	        const { code } = lines[lines.length - 1];
	        // check below is just for generating more readable code, it's safe to inline all !noInline
	        if (!/^(if|for) /.test(code)) {
	          lines.length -= 2;
	          indent = oldIndent;
	          return this.write('%s %s', prefix, code)
	        }
	      }
	      return this.write('}')
	    },

	    if(condition, writeBody, writeElse) {
	      if (`${condition}` === 'false') {
	        if (writeElse) writeElse();
	        if (writeBody) this.optimizedOut = true;
	      } else if (`${condition}` === 'true') {
	        if (writeBody) writeBody();
	        if (writeElse) this.optimizedOut = true;
	      } else if (writeBody && this.block(format('if (%s)', condition), writeBody, !!writeElse)) {
	        if (writeElse) this.block(format('else'), writeElse); // !!writeElse above ensures {} wrapping before `else`
	      } else if (writeElse) {
	        this.if(safenot(condition), writeElse);
	      }
	    },

	    makeModule(scope = {}) {
	      const scopeDefs = processScope(scope).map(
	        ([key, val]) => `const ${safe(key)} = ${jaystring(val)};`
	      );
	      return `(function() {\n'use strict'\n${scopeDefs.join('\n')}\n${build()}})()`
	    },

	    makeFunction(scope = {}) {
	      const scopeEntries = processScope(scope);
	      const keys = scopeEntries.map((entry) => entry[0]);
	      const vals = scopeEntries.map((entry) => entry[1]);
	      // eslint-disable-next-line no-new-func
	      return Function(...keys, `'use strict'\n${build()}`)(...vals)
	    },
	  }
	};
	return generateFunction;
}

var knownKeywords_1;
var hasRequiredKnownKeywords;

function requireKnownKeywords () {
	if (hasRequiredKnownKeywords) return knownKeywords_1;
	hasRequiredKnownKeywords = 1;

	const knownKeywords = [
	  ...['$schema', '$vocabulary'], // version
	  ...['id', '$id', '$anchor', '$ref', 'definitions', '$defs'], // pointers
	  ...['$recursiveRef', '$recursiveAnchor', '$dynamicAnchor', '$dynamicRef'],
	  ...['type', 'required', 'default'], // generic
	  ...['enum', 'const'], // constant values
	  ...['not', 'allOf', 'anyOf', 'oneOf', 'if', 'then', 'else'], // logical checks
	  ...['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf', 'divisibleBy'], // numbers
	  ...['items', 'maxItems', 'minItems', 'additionalItems', 'prefixItems'], // arrays, basic
	  ...['contains', 'minContains', 'maxContains', 'uniqueItems'], // arrays, complex
	  ...['maxLength', 'minLength', 'format', 'pattern'], // strings
	  ...['contentEncoding', 'contentMediaType', 'contentSchema'], // strings content
	  ...['properties', 'maxProperties', 'minProperties', 'additionalProperties', 'patternProperties'], // objects
	  ...['propertyNames'], // objects
	  ...['dependencies', 'dependentRequired', 'dependentSchemas', 'propertyDependencies'], // objects (dependencies)
	  ...['unevaluatedProperties', 'unevaluatedItems'], // see-through
	  // Unused meta keywords not affecting validation (annotations and comments)
	  // https://json-schema.org/understanding-json-schema/reference/generic.html
	  // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9
	  ...['title', 'description', 'deprecated', 'readOnly', 'writeOnly', 'examples', '$comment'], // unused meta
	  ...['example'], // unused meta, OpenAPI
	  'discriminator', // optimization hint and error filtering only, does not affect validation result
	  'removeAdditional', // optional keyword for { removeAdditional: 'keyword' } config, to target specific objects
	];

	// Order is important, newer first!
	const schemaDrafts = [
	  ...['draft/next'], // not recommended to use, might change / break in an unexpected way
	  ...['draft/2020-12', 'draft/2019-09'], // new
	  ...['draft-07', 'draft-06', 'draft-04', 'draft-03'], // historic
	];
	const schemaVersions = schemaDrafts.map((draft) => `https://json-schema.org/${draft}/schema`);

	const vocab2019 = ['core', 'applicator', 'validation', 'meta-data', 'format', 'content'];
	const vocab2020 = [
	  ...['core', 'applicator', 'unevaluated', 'validation'],
	  ...['meta-data', 'format-annotation', 'format-assertion', 'content'],
	];
	const knownVocabularies = [
	  ...vocab2019.map((v) => `https://json-schema.org/draft/2019-09/vocab/${v}`),
	  ...vocab2020.map((v) => `https://json-schema.org/draft/2020-12/vocab/${v}`),
	];

	knownKeywords_1 = { knownKeywords, schemaVersions, knownVocabularies };
	return knownKeywords_1;
}

var pointer;
var hasRequiredPointer;

function requirePointer () {
	if (hasRequiredPointer) return pointer;
	hasRequiredPointer = 1;

	const { knownKeywords } = requireKnownKeywords();

	/*
	 * JSON pointer collection/resolution logic
	 */

	function safeSet(map, key, value, comment = 'keys') {
	  if (!map.has(key)) return map.set(key, value)
	  if (map.get(key) !== value) throw new Error(`Conflicting duplicate ${comment}: ${key}`)
	}

	function untilde(string) {
	  if (!string.includes('~')) return string
	  return string.replace(/~[01]/g, (match) => {
	    switch (match) {
	      case '~1':
	        return '/'
	      case '~0':
	        return '~'
	    }
	    /* c8 ignore next */
	    throw new Error('Unreachable')
	  })
	}

	function get(obj, pointer, objpath) {
	  if (typeof obj !== 'object') throw new Error('Invalid input object')
	  if (typeof pointer !== 'string') throw new Error('Invalid JSON pointer')
	  const parts = pointer.split('/');
	  if (!['', '#'].includes(parts.shift())) throw new Error('Invalid JSON pointer')
	  if (parts.length === 0) return obj

	  let curr = obj;
	  for (const part of parts) {
	    if (typeof part !== 'string') throw new Error('Invalid JSON pointer')
	    if (objpath) objpath.push(curr); // does not include target itself, but includes head
	    const prop = untilde(part);
	    if (typeof curr !== 'object') return undefined
	    if (!Object.prototype.hasOwnProperty.call(curr, prop)) return undefined
	    curr = curr[prop];
	  }
	  return curr
	}

	const protocolRegex = /^https?:\/\//;

	function joinPath(baseFull, sub) {
	  if (typeof baseFull !== 'string' || typeof sub !== 'string') throw new Error('Unexpected path!')
	  if (sub.length === 0) return baseFull
	  const base = baseFull.replace(/#.*/, '');
	  if (sub.startsWith('#')) return `${base}${sub}`
	  if (!base.includes('/') || protocolRegex.test(sub)) return sub
	  if (protocolRegex.test(base)) return `${new URL(sub, base)}`
	  if (sub.startsWith('/')) return sub
	  return [...base.split('/').slice(0, -1), sub].join('/')
	}

	function objpath2path(objpath) {
	  const ids = objpath.map((obj) => (obj && (obj.$id || obj.id)) || '');
	  return ids.filter((id) => id && typeof id === 'string').reduce(joinPath, '')
	}

	const withSpecialChilds = ['properties', 'patternProperties', '$defs', 'definitions'];
	const skipChilds = ['const', 'enum', 'examples', 'example', 'comment'];
	const sSkip = Symbol('skip');

	function traverse(schema, work) {
	  const visit = (sub, specialChilds = false) => {
	    if (!sub || typeof sub !== 'object') return
	    const res = work(sub);
	    if (res !== undefined) return res === sSkip ? undefined : res
	    for (const k of Object.keys(sub)) {
	      if (!specialChilds && !Array.isArray(sub) && !knownKeywords.includes(k)) continue
	      if (!specialChilds && skipChilds.includes(k)) continue
	      const kres = visit(sub[k], !specialChilds && withSpecialChilds.includes(k));
	      if (kres !== undefined) return kres
	    }
	  };
	  return visit(schema)
	}

	// Returns a list of resolved entries, in a form: [schema, root, basePath]
	// basePath doesn't contain the target object $id itself
	function resolveReference(root, schemas, ref, base = '') {
	  const ptr = joinPath(base, ref);
	  const results = [];

	  const [main, hash = ''] = ptr.split('#');
	  const local = decodeURI(hash);

	  // Find in self by id path
	  const visit = (sub, oldPath, specialChilds = false, dynamic = false) => {
	    if (!sub || typeof sub !== 'object') return

	    const id = sub.$id || sub.id;
	    let path = oldPath;
	    if (id && typeof id === 'string') {
	      path = joinPath(path, id);
	      if (path === ptr || (path === main && local === '')) {
	        results.push([sub, root, oldPath]);
	      } else if (path === main && local[0] === '/') {
	        const objpath = [];
	        const res = get(sub, local, objpath);
	        if (res !== undefined) results.push([res, root, joinPath(oldPath, objpath2path(objpath))]);
	      }
	    }
	    const anchor = dynamic ? sub.$dynamicAnchor : sub.$anchor;
	    if (anchor && typeof anchor === 'string') {
	      if (anchor.includes('#')) throw new Error("$anchor can't include '#'")
	      if (anchor.startsWith('/')) throw new Error("$anchor can't start with '/'")
	      path = joinPath(path, `#${anchor}`);
	      if (path === ptr) results.push([sub, root, oldPath]);
	    }

	    for (const k of Object.keys(sub)) {
	      if (!specialChilds && !Array.isArray(sub) && !knownKeywords.includes(k)) continue
	      if (!specialChilds && skipChilds.includes(k)) continue
	      visit(sub[k], path, !specialChilds && withSpecialChilds.includes(k));
	    }
	    if (!dynamic && sub.$dynamicAnchor) visit(sub, oldPath, specialChilds, true);
	  };
	  visit(root, main);

	  // Find in self by pointer
	  if (main === base.replace(/#$/, '') && (local[0] === '/' || local === '')) {
	    const objpath = [];
	    const res = get(root, local, objpath);
	    if (res !== undefined) results.push([res, root, objpath2path(objpath)]);
	  }

	  // Find in additional schemas
	  if (schemas.has(main) && schemas.get(main) !== root) {
	    const additional = resolveReference(schemas.get(main), schemas, `#${hash}`, main);
	    results.push(...additional.map(([res, rRoot, rPath]) => [res, rRoot, joinPath(main, rPath)]));
	  }

	  // Full refs to additional schemas
	  if (schemas.has(ptr)) results.push([schemas.get(ptr), schemas.get(ptr), ptr]);

	  return results
	}

	function getDynamicAnchors(schema) {
	  const results = new Map();
	  traverse(schema, (sub) => {
	    if (sub !== schema && (sub.$id || sub.id)) return sSkip // base changed, no longer in the same resource
	    const anchor = sub.$dynamicAnchor;
	    if (anchor && typeof anchor === 'string') {
	      if (anchor.includes('#')) throw new Error("$dynamicAnchor can't include '#'")
	      if (!/^[a-zA-Z0-9_-]+$/.test(anchor)) throw new Error(`Unsupported $dynamicAnchor: ${anchor}`)
	      safeSet(results, anchor, sub, '$dynamicAnchor');
	    }
	  });
	  return results
	}

	const hasKeywords = (schema, keywords) =>
	  traverse(schema, (s) => Object.keys(s).some((k) => keywords.includes(k)) || undefined) || false;

	const addSchemasArrayToMap = (schemas, input, optional = false) => {
	  if (!Array.isArray(input)) throw new Error('Expected an array of schemas')
	  // schema ids are extracted from the schemas themselves
	  for (const schema of input) {
	    traverse(schema, (sub) => {
	      const idRaw = sub.$id || sub.id;
	      const id = idRaw && typeof idRaw === 'string' ? idRaw.replace(/#$/, '') : null; // # is allowed only as the last symbol here
	      if (id && id.includes('://') && !id.includes('#')) {
	        safeSet(schemas, id, sub, "schema $id in 'schemas'");
	      } else if (sub === schema && !optional) {
	        throw new Error("Schema with missing or invalid $id in 'schemas'")
	      }
	    });
	  }
	  return schemas
	};

	const buildSchemas = (input, extra) => {
	  if (extra) return addSchemasArrayToMap(buildSchemas(input), extra, true)
	  if (input) {
	    switch (Object.getPrototypeOf(input)) {
	      case Object.prototype:
	        return new Map(Object.entries(input))
	      case Map.prototype:
	        return new Map(input)
	      case Array.prototype:
	        return addSchemasArrayToMap(new Map(), input)
	    }
	  }
	  throw new Error("Unexpected value for 'schemas' option")
	};

	pointer = { get, joinPath, resolveReference, getDynamicAnchors, hasKeywords, buildSchemas };
	return pointer;
}

var formats;
var hasRequiredFormats;

function requireFormats () {
	if (hasRequiredFormats) return formats;
	hasRequiredFormats = 1;

	const core = {
	  // matches ajv + length checks + does not start with a dot
	  // note that quoted emails are deliberately unsupported (as in ajv), who would want \x01 in email
	  // first check is an additional fast path with lengths: 20+(1+21)*2 = 64, (1+61+1)+((1+60+1)+1)*3 = 252 < 253, that should cover most valid emails
	  // max length is 64 (name) + 1 (@) + 253 (host), we want to ensure that prior to feeding to the fast regex
	  // the second regex checks for quoted, starting-leading dot in name, and two dots anywhere
	  email: (input) => {
	    if (input.length > 318) return false
	    const fast = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,20}(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,21}){0,2}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i;
	    if (fast.test(input)) return true
	    if (!input.includes('@') || /(^\.|^"|\.@|\.\.)/.test(input)) return false
	    const [name, host, ...rest] = input.split('@');
	    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
	    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
	    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
	  },
	  // matches ajv + length checks
	  hostname: (input) => {
	    if (input.length > (input.endsWith('.') ? 254 : 253)) return false
	    const hostname = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.?$/i;
	    return hostname.test(input)
	  },

	  // 'time' matches ajv + length checks, 'date' matches ajv full
	  // date: https://tools.ietf.org/html/rfc3339#section-5.6
	  // date-time: https://tools.ietf.org/html/rfc3339#section-5.6
	  // leap year: https://tools.ietf.org/html/rfc3339#appendix-C
	  // 11: 1990-01-01, 1: T, 9: 00:00:00., 12: maxiumum fraction length (non-standard), 6: +00:00
	  date: (input) => {
	    if (input.length !== 10) return false
	    if (input[5] === '0' && input[6] === '2') {
	      if (/^\d\d\d\d-02-(?:[012][1-8]|[12]0|[01]9)$/.test(input)) return true
	      const matches = input.match(/^(\d\d\d\d)-02-29$/);
	      if (!matches) return false
	      const year = matches[1] | 0;
	      return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
	    }
	    if (input.endsWith('31')) return /^\d\d\d\d-(?:0[13578]|1[02])-31$/.test(input)
	    return /^\d\d\d\d-(?:0[13-9]|1[012])-(?:[012][1-9]|[123]0)$/.test(input)
	  },
	  // leap second handling is special, we check it's 23:59:60.*
	  time: (input) => {
	    if (input.length > 9 + 12 + 6) return false
	    const time = /^(?:2[0-3]|[0-1]\d):[0-5]\d:(?:[0-5]\d|60)(?:\.\d+)?(?:z|[+-](?:2[0-3]|[0-1]\d)(?::?[0-5]\d)?)?$/i;
	    if (!time.test(input)) return false
	    if (!/:60/.test(input)) return true
	    const p = input.match(/([0-9.]+|[^0-9.])/g);
	    let hm = Number(p[0]) * 60 + Number(p[2]);
	    if (p[5] === '+') hm += 24 * 60 - Number(p[6] || 0) * 60 - Number(p[8] || 0);
	    else if (p[5] === '-') hm += Number(p[6] || 0) * 60 + Number(p[8] || 0);
	    return hm % (24 * 60) === 23 * 60 + 59
	  },
	  // first two lines specific to date-time, then tests for unanchored (at end) date, code identical to 'date' above
	  // input[17] === '6' is a check for :60
	  'date-time': (input) => {
	    if (input.length > 10 + 1 + 9 + 12 + 6) return false
	    const full = /^\d\d\d\d-(?:0[1-9]|1[0-2])-(?:[0-2]\d|3[01])[t\s](?:2[0-3]|[0-1]\d):[0-5]\d:(?:[0-5]\d|60)(?:\.\d+)?(?:z|[+-](?:2[0-3]|[0-1]\d)(?::?[0-5]\d)?)$/i;
	    const feb = input[5] === '0' && input[6] === '2';
	    if ((feb && input[8] === '3') || !full.test(input)) return false
	    if (input[17] === '6') {
	      const p = input.slice(11).match(/([0-9.]+|[^0-9.])/g);
	      let hm = Number(p[0]) * 60 + Number(p[2]);
	      if (p[5] === '+') hm += 24 * 60 - Number(p[6] || 0) * 60 - Number(p[8] || 0);
	      else if (p[5] === '-') hm += Number(p[6] || 0) * 60 + Number(p[8] || 0);
	      if (hm % (24 * 60) !== 23 * 60 + 59) return false
	    }
	    if (feb) {
	      if (/^\d\d\d\d-02-(?:[012][1-8]|[12]0|[01]9)/.test(input)) return true
	      const matches = input.match(/^(\d\d\d\d)-02-29/);
	      if (!matches) return false
	      const year = matches[1] | 0;
	      return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
	    }
	    if (input[8] === '3' && input[9] === '1') return /^\d\d\d\d-(?:0[13578]|1[02])-31/.test(input)
	    return /^\d\d\d\d-(?:0[13-9]|1[012])-(?:[012][1-9]|[123]0)/.test(input)
	  },

	  /* ipv4 and ipv6 are from ajv with length restriction */
	  // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
	  ipv4: (ip) =>
	    ip.length <= 15 &&
	    /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)$/.test(ip),
	  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
	  // max length: 1000:1000:1000:1000:1000:1000:255.255.255.255
	  // we parse ip6 format with a simple scan, leaving embedded ipv4 validation to a regex
	  // s0=count(:), s1=count(.), hex=count(a-zA-Z0-9), short=count(::)>0
	  // 48-57: '0'-'9', 97-102, 65-70: 'a'-'f', 'A'-'F', 58: ':', 46: '.'
	  /* eslint-disable one-var */
	  // prettier-ignore
	  ipv6: (input) => {
	    if (input.length > 45 || input.length < 2) return false
	    let s0 = 0, s1 = 0, hex = 0, short = false, letters = false, last = 0, start = true;
	    for (let i = 0; i < input.length; i++) {
	      const c = input.charCodeAt(i);
	      if (i === 1 && last === 58 && c !== 58) return false
	      if (c >= 48 && c <= 57) {
	        if (++hex > 4) return false
	      } else if (c === 46) {
	        if (s0 > 6 || s1 >= 3 || hex === 0 || letters) return false
	        s1++;
	        hex = 0;
	      } else if (c === 58) {
	        if (s1 > 0 || s0 >= 7) return false
	        if (last === 58) {
	          if (short) return false
	          short = true;
	        } else if (i === 0) start = false;
	        s0++;
	        hex = 0;
	        letters = false;
	      } else if ((c >= 97 && c <= 102) || (c >= 65 && c <= 70)) {
	        if (s1 > 0) return false
	        if (++hex > 4) return false
	        letters = true;
	      } else return false
	      last = c;
	    }
	    if (s0 < 2 || (s1 > 0 && (s1 !== 3 || hex === 0))) return false
	    if (short && input.length === 2) return true
	    if (s1 > 0 && !/(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(input)) return false
	    const spaces = s1 > 0 ? 6 : 7;
	    if (!short) return s0 === spaces && start && hex > 0
	    return (start || hex > 0) && s0 < spaces
	  },
	  /* eslint-enable one-var */
	  // matches ajv with optimization
	  uri: /^[a-z][a-z0-9+\-.]*:(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
	  // matches ajv with optimization
	  'uri-reference': /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/?(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
	  // ajv has /^(([^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?(,([a-z0-9_]|%[0-9a-f]{2})+(:[1-9][0-9]{0,3}|\*)?)*\})*$/i
	  // this is equivalent
	  // uri-template: https://tools.ietf.org/html/rfc6570
	  // eslint-disable-next-line no-control-regex
	  'uri-template': /^(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2}|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,

	  // ajv has /^(\/([^~/]|~0|~1)*)*$/, this is equivalent
	  // JSON-pointer: https://tools.ietf.org/html/rfc6901
	  'json-pointer': /^(?:|\/(?:[^~]|~0|~1)*)$/,
	  // ajv has /^(0|[1-9][0-9]*)(#|(\/([^~/]|~0|~1)*)*)$/, this is equivalent
	  // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
	  'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:|#|\/(?:[^~]|~0|~1)*)$/,

	  // uuid: http://tools.ietf.org/html/rfc4122
	  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,

	  // length restriction is an arbitrary safeguard
	  // first regex checks if this a week duration (can't be combined with others)
	  // second regex verifies symbols, no more than one fraction, at least 1 block is present, and T is not last
	  // third regex verifies structure
	  duration: (input) =>
	    input.length > 1 &&
	    input.length < 80 &&
	    (/^P\d+([.,]\d+)?W$/.test(input) ||
	      (/^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(input) &&
	        /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input))),

	  // TODO: iri, iri-reference, idn-email, idn-hostname
	};

	const extra = {
	  // basic
	  alpha: /^[a-zA-Z]+$/,
	  alphanumeric: /^[a-zA-Z0-9]+$/,

	  // hex
	  'hex-digits': /^[0-9a-f]+$/i,
	  'hex-digits-prefixed': /^0x[0-9a-f]+$/i,
	  'hex-bytes': /^([0-9a-f][0-9a-f])+$/i,
	  'hex-bytes-prefixed': /^0x([0-9a-f][0-9a-f])+$/i,

	  base64: (input) => input.length % 4 === 0 && /^[a-z0-9+/]*={0,3}$/i.test(input),

	  // ajv has /^#(\/([a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, this is equivalent
	  // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
	  'json-pointer-uri-fragment': /^#(|\/(\/|[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)$/i,

	  // draft3 backwards compat
	  'host-name': core.hostname,
	  'ip-address': core.ipv4,

	  // manually cleaned up from is-my-json-valid, CSS 2.1 colors only per draft03 spec
	  color: /^(#[0-9A-Fa-f]{3,6}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|rgb\(\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*\)|rgb\(\s*(\d?\d%|100%)\s*,\s*(\d?\d%|100%)\s*,\s*(\d?\d%|100%)\s*\))$/,

	  // style is deliberately unsupported, don't accept untrusted styles
	};

	const weak = {
	  // In weak because don't accept regexes from untrusted sources, using them can cause DoS
	  // matches ajv + length checks
	  // eslint comment outside because we don't want comments in functions, those affect output
	  /* eslint-disable no-new */
	  regex: (str) => {
	    if (str.length > 1e5) return false
	    const Z_ANCHOR = /[^\\]\\Z/;
	    if (Z_ANCHOR.test(str)) return false
	    try {
	      new RegExp(str, 'u');
	      return true
	    } catch (e) {
	      return false
	    }
	  },
	  /* eslint-enable no-new */
	};

	formats = { core, extra, weak };
	return formats;
}

var tracing;
var hasRequiredTracing;

function requireTracing () {
	if (hasRequiredTracing) return tracing;
	hasRequiredTracing = 1;

	/* This file implements operations for static tracing of evaluated items/properties, which is also
	 * used to determine whether dynamic evaluated tracing is required or the schema can be compiled
	 * with only statical checks.
	 *
	 * That is done by keeping track of evaluated and potentially evaluated and accounting to that
	 * while doing merges and intersections.
	 *
	 * isDynamic() checks that all potentially evaluated are also definitely evaluated, seperately
	 * for items and properties, for use with unevaluatedItems and unevaluatedProperties.
	 *
	 * WARNING: it is important that this doesn't produce invalid information. i.e.:
	 *  * Extra properties or patterns, too high items
	 *  * Missing dyn.properties or dyn.patterns, too low dyn.items
	 *  * Extra fullstring flag or required entries
	 *  * Missing types, if type is present
	 *  * Missing unknown or dyn.item
	 *
	 * The other way around is non-optimal but safe.
	 *
	 * null means any type (i.e. any type is possible, not validated)
	 * true in properties means any property (i.e. all properties were evaluated)
	 * fullstring means that the object is not an unvalidated string (i.e. is either validated or not a string)
	 * unknown means that there could be evaluated items or properties unknown to both top-level or dyn
	 * dyn.item (bool) means there could be possible specific evaluated items, e.g. from "contains".
	 *
	 * For normalization:
	 *   1. If type is applicable:
	 *     * dyn.items >= items,
	 *     * dyn.properties includes properties
	 *     * dyn.patterns includes patterns.
	 *   2. If type is not applicable, the following rules apply:
	 *     * `fullstring = true` if `string` type is not applicable
	 *     * `items = Infinity`, `dyn.item = false`, `dyn.items = 0` if `array` type is not applicable
	 *     * `properties = [true]`, `dyn.properties = []` if `object` type is not applicable
	 *     * `patterns = dyn.patterns = []` if `object` type is not applicable
	 *     * `required = []` if `object` type is not applicable
	 *
	 * That allows to simplify the `or` operation.
	 */

	const merge = (a, b) => [...new Set([...a, ...b])].sort();
	const intersect = (a, b) => a.filter((x) => b.includes(x));
	const wrapArgs = (f) => (...args) => f(...args.map(normalize));
	const wrapFull = (f) => (...args) => normalize(f(...args.map(normalize)));
	const typeIsNot = (type, t) => type && !type.includes(t); // type=null means any and includes anything

	const normalize = ({ type = null, dyn: d = {}, ...A }) => ({
	  type: type ? [...type].sort() : type,
	  items: typeIsNot(type, 'array') ? Infinity : A.items || 0,
	  properties: typeIsNot(type, 'object') ? [true] : [...(A.properties || [])].sort(),
	  patterns: typeIsNot(type, 'object') ? [] : [...(A.patterns || [])].sort(),
	  required: typeIsNot(type, 'object') ? [] : [...(A.required || [])].sort(),
	  fullstring: typeIsNot(type, 'string') || A.fullstring || false,
	  dyn: {
	    item: typeIsNot(type, 'array') ? false : d.item || false,
	    items: typeIsNot(type, 'array') ? 0 : Math.max(A.items || 0, d.items || 0),
	    properties: typeIsNot(type, 'object') ? [] : merge(A.properties || [], d.properties || []),
	    patterns: typeIsNot(type, 'object') ? [] : merge(A.patterns || [], d.patterns || []),
	  },
	  unknown: (A.unknown && !(typeIsNot(type, 'object') && typeIsNot(type, 'array'))) || false,
	});

	const initTracing = () => normalize({});

	// Result means that both sets A and B are correct
	// type is intersected, lists of known properties are merged
	const andDelta = wrapFull((A, B) => ({
	  type: A.type && B.type ? intersect(A.type, B.type) : A.type || B.type || null,
	  items: Math.max(A.items, B.items),
	  properties: merge(A.properties, B.properties),
	  patterns: merge(A.patterns, B.patterns),
	  required: merge(A.required, B.required),
	  fullstring: A.fullstring || B.fullstring,
	  dyn: {
	    item: A.dyn.item || B.dyn.item,
	    items: Math.max(A.dyn.items, B.dyn.items),
	    properties: merge(A.dyn.properties, B.dyn.properties),
	    patterns: merge(A.dyn.patterns, B.dyn.patterns),
	  },
	  unknown: A.unknown || B.unknown,
	}));

	const regtest = (pattern, value) => value !== true && new RegExp(pattern, 'u').test(value);

	const intersectProps = ({ properties: a, patterns: rega }, { properties: b, patterns: regb }) => {
	  // properties
	  const af = a.filter((x) => b.includes(x) || b.includes(true) || regb.some((p) => regtest(p, x)));
	  const bf = b.filter((x) => a.includes(x) || a.includes(true) || rega.some((p) => regtest(p, x)));
	  // patterns
	  const ar = rega.filter((x) => regb.includes(x) || b.includes(true));
	  const br = regb.filter((x) => rega.includes(x) || a.includes(true));
	  return { properties: merge(af, bf), patterns: merge(ar, br) }
	};

	const inProperties = ({ properties: a, patterns: rega }, { properties: b, patterns: regb }) =>
	  b.every((x) => a.includes(x) || a.includes(true) || rega.some((p) => regtest(p, x))) &&
	  regb.every((x) => rega.includes(x) || a.includes(true));

	// Result means that at least one of sets A and B is correct
	// type is merged, lists of known properties are intersected, lists of dynamic properties are merged
	const orDelta = wrapFull((A, B) => ({
	  type: A.type && B.type ? merge(A.type, B.type) : null,
	  items: Math.min(A.items, B.items),
	  ...intersectProps(A, B),
	  required:
	    (typeIsNot(A.type, 'object') && B.required) ||
	    (typeIsNot(B.type, 'object') && A.required) ||
	    intersect(A.required, B.required),
	  fullstring: A.fullstring && B.fullstring,
	  dyn: {
	    item: A.dyn.item || B.dyn.item,
	    items: Math.max(A.dyn.items, B.dyn.items),
	    properties: merge(A.dyn.properties, B.dyn.properties),
	    patterns: merge(A.dyn.patterns, B.dyn.patterns),
	  },
	  unknown: A.unknown || B.unknown,
	}));

	const applyDelta = (stat, delta) => Object.assign(stat, andDelta(stat, delta));

	const isDynamic = wrapArgs(({ unknown, items, dyn, ...stat }) => ({
	  items: items !== Infinity && (unknown || dyn.items > items || dyn.item),
	  properties: !stat.properties.includes(true) && (unknown || !inProperties(stat, dyn)),
	}));

	tracing = { initTracing, andDelta, orDelta, applyDelta, isDynamic, inProperties };
	return tracing;
}

var compile_1;
var hasRequiredCompile;

function requireCompile () {
	if (hasRequiredCompile) return compile_1;
	hasRequiredCompile = 1;

	const { format, safe, safeand, safenot, safenotor } = requireSafeFormat();
	const genfun = requireGenerateFunction();
	const { resolveReference, joinPath, getDynamicAnchors, hasKeywords } = requirePointer();
	const formats = requireFormats();
	const { toPointer, ...functions } = requireScopeFunctions();
	const { scopeMethods } = requireScopeUtils();
	const { buildName, types, jsHelpers } = requireJavascript();
	const { knownKeywords, schemaVersions, knownVocabularies } = requireKnownKeywords();
	const { initTracing, andDelta, orDelta, applyDelta, isDynamic, inProperties } = requireTracing();

	const noopRegExps = new Set(['^[\\s\\S]*$', '^[\\S\\s]*$', '^[^]*$', '', '.*', '^', '$']);
	const primitiveTypes = ['null', 'boolean', 'number', 'integer', 'string'];

	// for checking schema parts in consume()
	const schemaTypes = new Map(
	  Object.entries({
	    boolean: (arg) => typeof arg === 'boolean',
	    array: (arg) => Array.isArray(arg) && Object.getPrototypeOf(arg) === Array.prototype,
	    object: (arg) => arg && Object.getPrototypeOf(arg) === Object.prototype,
	    finite: (arg) => Number.isFinite(arg),
	    natural: (arg) => Number.isInteger(arg) && arg >= 0,
	    string: (arg) => typeof arg === 'string',
	    jsonval: (arg) => functions.deepEqual(arg, JSON.parse(JSON.stringify(arg))),
	  })
	);
	const isPlainObject = schemaTypes.get('object');
	const isSchemaish = (arg) => isPlainObject(arg) || typeof arg === 'boolean';
	const deltaEmpty = (delta) => functions.deepEqual(delta, { type: [] });

	const schemaIsOlderThan = ($schema, ver) =>
	  schemaVersions.indexOf($schema) > schemaVersions.indexOf(`https://json-schema.org/${ver}/schema`);

	const schemaIsUnkownOrOlder = ($schema, ver) => {
	  const normalized = `${$schema}`.replace(/^http:\/\//, 'https://').replace(/#$/, '');
	  if (!schemaVersions.includes(normalized)) return true
	  return schemaIsOlderThan(normalized, ver)
	};

	// Helper methods for semi-structured paths
	const propvar = (parent, keyname, inKeys = false, number = false) =>
	  Object.freeze({ parent, keyname, inKeys, number }); // property by variable
	const propimm = (parent, keyval, checked = false) => Object.freeze({ parent, keyval, checked }); // property by immediate value

	const evaluatedStatic = Symbol('evaluatedStatic');
	const optDynamic = Symbol('optDynamic');
	const optDynAnchors = Symbol('optDynAnchors');
	const optRecAnchors = Symbol('optRecAnchors');

	const constantValue = (schema) => {
	  if (typeof schema === 'boolean') return schema
	  if (isPlainObject(schema) && Object.keys(schema).length === 0) return true
	  return undefined
	};

	const refsNeedFullValidation = new Set(); // cleared before and after each full compilation
	const rootMeta = new Map(); // cleared before and after each full compilation
	const generateMeta = (root, $schema, enforce, requireSchema) => {
	  if ($schema) {
	    const version = $schema.replace(/^http:\/\//, 'https://').replace(/#$/, '');
	    enforce(schemaVersions.includes(version), 'Unexpected schema version:', version);
	    rootMeta.set(root, {
	      exclusiveRefs: schemaIsOlderThan(version, 'draft/2019-09'),
	      contentValidation: schemaIsOlderThan(version, 'draft/2019-09'),
	      dependentUnsupported: schemaIsOlderThan(version, 'draft/2019-09'),
	      newItemsSyntax: !schemaIsOlderThan(version, 'draft/2020-12'),
	      containsEvaluates: !schemaIsOlderThan(version, 'draft/2020-12'),
	      objectContains: !schemaIsOlderThan(version, 'draft/next'),
	      bookending: schemaIsOlderThan(version, 'draft/next'),
	    });
	  } else {
	    enforce(!requireSchema, '[requireSchema] $schema is required');
	    rootMeta.set(root, {});
	  }
	};

	const compileSchema = (schema, root, opts, scope, basePathRoot = '') => {
	  const {
	    mode = 'default',
	    useDefaults = false,
	    removeAdditional = false, // supports additionalProperties: false and additionalItems: false
	    includeErrors = false,
	    allErrors = false,
	    contentValidation,
	    dryRun, // unused, just for rest siblings
	    lint: lintOnly = false,
	    allowUnusedKeywords = opts.mode === 'lax' || opts.mode === 'spec',
	    allowUnreachable = opts.mode === 'lax' || opts.mode === 'spec',
	    requireSchema = opts.mode === 'strong',
	    requireValidation = opts.mode === 'strong',
	    requireStringValidation = opts.mode === 'strong',
	    forbidNoopValues = opts.mode === 'strong', // e.g. $recursiveAnchor: false (it's false by default)
	    complexityChecks = opts.mode === 'strong',
	    unmodifiedPrototypes = false, // assumes no mangled Object/Array prototypes
	    isJSON = false, // assume input to be JSON, which e.g. makes undefined impossible
	    $schemaDefault = null,
	    formatAssertion = opts.mode !== 'spec' || schemaIsUnkownOrOlder(root.$schema, 'draft/2019-09'),
	    formats: optFormats = {},
	    weakFormats = opts.mode !== 'strong',
	    extraFormats = false,
	    schemas, // always a Map, produced at wrapper
	    ...unknown
	  } = opts;
	  const fmts = {
	    ...formats.core,
	    ...(weakFormats ? formats.weak : {}),
	    ...(extraFormats ? formats.extra : {}),
	    ...optFormats,
	  };
	  if (Object.keys(unknown).length !== 0)
	    throw new Error(`Unknown options: ${Object.keys(unknown).join(', ')}`)

	  if (!['strong', 'lax', 'default', 'spec'].includes(mode)) throw new Error(`Invalid mode: ${mode}`)
	  if (!includeErrors && allErrors) throw new Error('allErrors requires includeErrors to be enabled')
	  if (requireSchema && $schemaDefault) throw new Error('requireSchema forbids $schemaDefault')
	  if (mode === 'strong') {
	    const validation = { requireValidation, requireStringValidation };
	    const strong = { ...validation, formatAssertion, complexityChecks, requireSchema };
	    const weak = { weakFormats, allowUnusedKeywords };
	    for (const [k, v] of Object.entries(strong)) if (!v) throw new Error(`Strong mode demands ${k}`)
	    for (const [k, v] of Object.entries(weak)) if (v) throw new Error(`Strong mode forbids ${k}`)
	  }

	  const { gensym, getref, genref, genformat } = scopeMethods(scope);

	  const buildPath = (prop) => {
	    const path = [];
	    let curr = prop;
	    while (curr) {
	      if (!curr.name) path.unshift(curr);
	      curr = curr.parent || curr.errorParent;
	    }

	    // fast case when there are no variables inside path
	    if (path.every((part) => part.keyval !== undefined))
	      return format('%j', toPointer(path.map((part) => part.keyval)))

	    // Be very careful while refactoring, this code significantly affects includeErrors performance
	    // It attempts to construct fast code presentation for paths, e.g. "#/abc/"+pointerPart(key0)+"/items/"+i0
	    const stringParts = ['#'];
	    const stringJoined = () => {
	      const value = stringParts.map(functions.pointerPart).join('/');
	      stringParts.length = 0;
	      return value
	    };
	    let res = null;
	    for (const { keyname, keyval, number } of path) {
	      if (keyname) {
	        if (!number) scope.pointerPart = functions.pointerPart;
	        const value = number ? keyname : format('pointerPart(%s)', keyname);
	        const str = `${stringJoined()}/`;
	        res = res ? format('%s+%j+%s', res, str, value) : format('%j+%s', str, value);
	      } else if (keyval) stringParts.push(keyval);
	    }
	    return stringParts.length > 0 ? format('%s+%j', res, `/${stringJoined()}`) : res
	  };

	  const funname = genref(schema);
	  let validate = null; // resolve cyclic dependencies
	  const wrap = (...args) => {
	    const res = validate(...args);
	    wrap.errors = validate.errors;
	    return res
	  };
	  scope[funname] = wrap;

	  const hasRefs = hasKeywords(schema, ['$ref', '$recursiveRef', '$dynamicRef']);
	  const hasDynAnchors = opts[optDynAnchors] && hasRefs && hasKeywords(schema, ['$dynamicAnchor']);
	  const dynAnchorsHead = () => {
	    if (!opts[optDynAnchors]) return format('')
	    return hasDynAnchors ? format(', dynAnchors = []') : format(', dynAnchors')
	  };
	  const recAnchorsHead = opts[optRecAnchors] ? format(', recursive') : format('');

	  const fun = genfun();
	  fun.write('function validate(data%s%s) {', recAnchorsHead, dynAnchorsHead());
	  if (includeErrors) fun.write('validate.errors = null');
	  if (allErrors) fun.write('let errorCount = 0');
	  if (opts[optDynamic]) fun.write('validate.evaluatedDynamic = null');

	  let dynamicAnchorsNext = opts[optDynAnchors] ? format(', dynAnchors') : format('');
	  if (hasDynAnchors) {
	    fun.write('const dynLocal = [{}]');
	    dynamicAnchorsNext = format(', [...dynAnchors, dynLocal[0] || []]');
	  }

	  const helpers = jsHelpers(fun, scope, propvar, { unmodifiedPrototypes, isJSON }, noopRegExps);
	  const { present, forObjectKeys, forArray, patternTest, compare } = helpers;

	  const recursiveLog = [];
	  const getMeta = () => rootMeta.get(root);
	  const basePathStack = basePathRoot ? [basePathRoot] : [];
	  const visit = (errors, history, current, node, schemaPath, trace = {}, { constProp } = {}) => {
	    // e.g. top-level data and property names, OR already checked by present() in history, OR in keys and not undefined
	    const isSub = history.length > 0 && history[history.length - 1].prop === current;
	    const queryCurrent = () => history.filter((h) => h.prop === current);
	    const definitelyPresent =
	      !current.parent || current.checked || (current.inKeys && isJSON) || queryCurrent().length > 0;

	    const name = buildName(current);
	    const currPropImm = (...args) => propimm(current, ...args);

	    const error = ({ path = [], prop = current, source, suberr }) => {
	      const schemaP = toPointer([...schemaPath, ...path]);
	      const dataP = includeErrors ? buildPath(prop) : null;
	      if (includeErrors === true && errors && source) {
	        // we can include absoluteKeywordLocation later, perhaps
	        scope.errorMerge = functions.errorMerge;
	        const args = [source, schemaP, dataP];
	        if (allErrors) {
	          fun.write('if (validate.errors === null) validate.errors = []');
	          fun.write('validate.errors.push(...%s.map(e => errorMerge(e, %j, %s)))', ...args);
	        } else fun.write('validate.errors = [errorMerge(%s[0], %j, %s)]', ...args);
	      } else if (includeErrors === true && errors) {
	        const errorJS = format('{ keywordLocation: %j, instanceLocation: %s }', schemaP, dataP);
	        if (allErrors) {
	          fun.write('if (%s === null) %s = []', errors, errors);
	          fun.write('%s.push(%s)', errors, errorJS);
	        } else fun.write('%s = [%s]', errors, errorJS); // Array assignment is significantly faster, do not refactor the two branches
	      }
	      if (suberr) mergeerror(suberr); // can only happen in allErrors
	      if (allErrors) fun.write('errorCount++');
	      else fun.write('return false');
	    };
	    const errorIf = (condition, errorArgs) => fun.if(condition, () => error(errorArgs));

	    if (lintOnly && !scope.lintErrors) scope.lintErrors = []; // we can do this as we don't build functions in lint-only mode
	    const fail = (msg, value) => {
	      const comment = value !== undefined ? ` ${JSON.stringify(value)}` : '';
	      const keywordLocation = joinPath(basePathRoot, toPointer(schemaPath));
	      const message = `${msg}${comment} at ${keywordLocation}`;
	      if (lintOnly) return scope.lintErrors.push({ message, keywordLocation, schema }) // don't fail if we are just collecting all errors
	      throw new Error(message)
	    };
	    const patternTestSafe = (pat, key) => {
	      try {
	        return patternTest(pat, key)
	      } catch (e) {
	        fail(e.message);
	        return format('false') // for lint-only mode
	      }
	    };
	    const enforce = (ok, ...args) => ok || fail(...args);
	    const laxMode = (ok, ...args) => enforce(mode === 'lax' || mode === 'spec' || ok, ...args);
	    const enforceMinMax = (a, b) => laxMode(!(node[b] < node[a]), `Invalid ${a} / ${b} combination`);
	    const enforceValidation = (msg, suffix = 'should be specified') =>
	      enforce(!requireValidation, `[requireValidation] ${msg} ${suffix}`);
	    const subPath = (...args) => [...schemaPath, ...args];
	    const uncertain = (msg) =>
	      enforce(!removeAdditional && !useDefaults, `[removeAdditional/useDefaults] uncertain: ${msg}`);
	    const complex = (msg, arg) => enforce(!complexityChecks, `[complexityChecks] ${msg}`, arg);
	    const saveMeta = ($sch) => generateMeta(root, $sch || $schemaDefault, enforce, requireSchema);

	    // evaluated tracing
	    const stat = initTracing();
	    const evaluateDelta = (delta) => applyDelta(stat, delta);

	    if (typeof node === 'boolean') {
	      if (node === true) {
	        enforceValidation('schema = true', 'is not allowed'); // any is valid here
	        return { stat } // nothing is evaluated for true
	      }
	      errorIf(definitelyPresent || current.inKeys ? true : present(current), {}); // node === false
	      evaluateDelta({ type: [] }); // everything is evaluated for false
	      return { stat }
	    }

	    enforce(isPlainObject(node), 'Schema is not an object');
	    for (const key of Object.keys(node))
	      enforce(knownKeywords.includes(key) || allowUnusedKeywords, 'Keyword not supported:', key);

	    if (Object.keys(node).length === 0) {
	      enforceValidation('empty rules node', 'is not allowed');
	      return { stat } // nothing to validate here, basically the same as node === true
	    }

	    const unused = new Set(Object.keys(node));
	    const multiConsumable = new Set();
	    const consume = (prop, ...ruleTypes) => {
	      enforce(multiConsumable.has(prop) || unused.has(prop), 'Unexpected double consumption:', prop);
	      enforce(functions.hasOwn(node, prop), 'Is not an own property:', prop);
	      enforce(ruleTypes.every((t) => schemaTypes.has(t)), 'Invalid type used in consume');
	      enforce(ruleTypes.some((t) => schemaTypes.get(t)(node[prop])), 'Unexpected type for', prop);
	      unused.delete(prop);
	    };
	    const get = (prop, ...ruleTypes) => {
	      if (node[prop] !== undefined) consume(prop, ...ruleTypes);
	      return node[prop]
	    };
	    const handle = (prop, ruleTypes, handler, errorArgs = {}) => {
	      if (node[prop] === undefined) return false
	      // opt-out on null is explicit in both places here, don't set default
	      consume(prop, ...ruleTypes);
	      if (handler !== null) {
	        try {
	          const condition = handler(node[prop]);
	          if (condition !== null) errorIf(condition, { path: [prop], ...errorArgs });
	        } catch (e) {
	          if (lintOnly && !e.message.startsWith('[opt] ')) {
	            fail(e.message); // for lint-only mode, but not processing special re-run errors
	          } else {
	            throw e
	          }
	        }
	      }
	      return true
	    };

	    if (node === root) {
	      saveMeta(get('$schema', 'string'));
	      handle('$vocabulary', ['object'], ($vocabulary) => {
	        for (const [vocab, flag] of Object.entries($vocabulary)) {
	          if (flag === false) continue
	          enforce(flag === true && knownVocabularies.includes(vocab), 'Unknown vocabulary:', vocab);
	        }
	        return null
	      });
	    } else if (!getMeta()) saveMeta(root.$schema);

	    if (getMeta().objectContains) {
	      // When object contains is enabled, contains-related keywords can be consumed two times: in object branch and in array branch
	      for (const prop of ['contains', 'minContains', 'maxContains']) multiConsumable.add(prop);
	    }

	    handle('examples', ['array'], null); // unused, meta-only
	    handle('example', ['jsonval'], null); // unused, meta-only, OpenAPI
	    for (const ignore of ['title', 'description', '$comment']) handle(ignore, ['string'], null); // unused, meta-only strings
	    for (const ignore of ['deprecated', 'readOnly', 'writeOnly']) handle(ignore, ['boolean'], null); // unused, meta-only flags

	    handle('$defs', ['object'], null) || handle('definitions', ['object'], null); // defs are allowed, those are validated on usage

	    const compileSub = (sub, subR, path) =>
	      sub === schema ? safe('validate') : getref(sub) || compileSchema(sub, subR, opts, scope, path);
	    const basePath = () => (basePathStack.length > 0 ? basePathStack[basePathStack.length - 1] : '');
	    const basePathStackLength = basePathStack.length; // to restore at exit
	    const setId = ($id) => {
	      basePathStack.push(joinPath(basePath(), $id));
	      return null
	    };

	    // None of the below should be handled if an exlusive pre-2019-09 $ref is present
	    if (!getMeta().exclusiveRefs || !node.$ref) {
	      handle('$id', ['string'], setId) || handle('id', ['string'], setId);
	      handle('$anchor', ['string'], null); // $anchor is used only for ref resolution, on usage
	      handle('$dynamicAnchor', ['string'], null); // handled separately and on ref resolution

	      if (node.$recursiveAnchor || !forbidNoopValues) {
	        handle('$recursiveAnchor', ['boolean'], (isRecursive) => {
	          if (isRecursive) recursiveLog.push([node, root, basePath()]);
	          return null
	        });
	      }
	    }

	    // handle schema-wide dynamic anchors
	    const isDynScope = hasDynAnchors && (node === schema || node.id || node.$id);
	    if (isDynScope) {
	      const allDynamic = getDynamicAnchors(node);
	      if (node !== schema) fun.write('dynLocal.unshift({})'); // inlined at top level
	      for (const [key, subcheck] of allDynamic) {
	        const resolved = resolveReference(root, schemas, `#${key}`, basePath());
	        const [sub, subRoot, path] = resolved[0] || [];
	        enforce(sub === subcheck, `Unexpected $dynamicAnchor resolution: ${key}`);
	        const n = compileSub(sub, subRoot, path);
	        fun.write('dynLocal[0][%j] = %s', `#${key}`, n);
	      }
	    }

	    // evaluated: declare dynamic
	    const needUnevaluated = (rule) =>
	      opts[optDynamic] && (node[rule] || node[rule] === false || node === schema);
	    const local = Object.freeze({
	      item: needUnevaluated('unevaluatedItems') ? gensym('evaluatedItem') : null,
	      items: needUnevaluated('unevaluatedItems') ? gensym('evaluatedItems') : null,
	      props: needUnevaluated('unevaluatedProperties') ? gensym('evaluatedProps') : null,
	    });
	    const dyn = Object.freeze({
	      item: local.item || trace.item,
	      items: local.items || trace.items,
	      props: local.props || trace.props,
	    });
	    const canSkipDynamic = () =>
	      (!dyn.items || stat.items === Infinity) && (!dyn.props || stat.properties.includes(true));
	    const evaluateDeltaDynamic = (delta) => {
	      // Skips applying those that have already been proved statically
	      if (dyn.item && delta.item && stat.items !== Infinity)
	        fun.write('%s.push(%s)', dyn.item, delta.item);
	      if (dyn.items && delta.items > stat.items) fun.write('%s.push(%d)', dyn.items, delta.items);
	      if (dyn.props && (delta.properties || []).includes(true) && !stat.properties.includes(true)) {
	        fun.write('%s[0].push(true)', dyn.props);
	      } else if (dyn.props) {
	        const inStat = (properties, patterns) => inProperties(stat, { properties, patterns });
	        const properties = (delta.properties || []).filter((x) => !inStat([x], []));
	        const patterns = (delta.patterns || []).filter((x) => !inStat([], [x]));
	        if (properties.length > 0) fun.write('%s[0].push(...%j)', dyn.props, properties);
	        if (patterns.length > 0) fun.write('%s[1].push(...%j)', dyn.props, patterns);
	        for (const sym of delta.propertiesVars || []) fun.write('%s[0].push(%s)', dyn.props, sym);
	      }
	    };
	    const applyDynamicToDynamic = (target, item, items, props) => {
	      if (isDynamic(stat).items && target.item && item)
	        fun.write('%s.push(...%s)', target.item, item);
	      if (isDynamic(stat).items && target.items && items)
	        fun.write('%s.push(...%s)', target.items, items);
	      if (isDynamic(stat).properties && target.props && props) {
	        fun.write('%s[0].push(...%s[0])', target.props, props);
	        fun.write('%s[1].push(...%s[1])', target.props, props);
	      }
	    };

	    const makeRecursive = () => {
	      if (!opts[optRecAnchors]) return format('') // recursive anchors disabled
	      if (recursiveLog.length === 0) return format(', recursive') // no recursive default, i.e. no $recursiveAnchor has been set in this schema
	      return format(', recursive || %s', compileSub(...recursiveLog[0]))
	    };
	    const applyRef = (n, errorArgs) => {
	      // evaluated: propagate static from ref to current, skips cyclic.
	      // Can do this before the call as the call is just a write
	      const delta = (scope[n] && scope[n][evaluatedStatic]) || { unknown: true }; // assume unknown if ref is cyclic
	      evaluateDelta(delta);
	      const call = format('%s(%s%s%s)', n, name, makeRecursive(), dynamicAnchorsNext);
	      if (!includeErrors && canSkipDynamic()) return format('!%s', call) // simple case
	      const res = gensym('res');
	      const err = gensym('err'); // Save and restore errors in case of recursion (if needed)
	      const suberr = gensym('suberr');
	      if (includeErrors) fun.write('const %s = validate.errors', err);
	      fun.write('const %s = %s', res, call);
	      if (includeErrors) fun.write('const %s = %s.errors', suberr, n);
	      if (includeErrors) fun.write('validate.errors = %s', err);
	      errorIf(safenot(res), { ...errorArgs, source: suberr });
	      // evaluated: propagate dynamic from ref to current
	      fun.if(res, () => {
	        const item = isDynamic(delta).items ? format('%s.evaluatedDynamic[0]', n) : null;
	        const items = isDynamic(delta).items ? format('%s.evaluatedDynamic[1]', n) : null;
	        const props = isDynamic(delta).properties ? format('%s.evaluatedDynamic[2]', n) : null;
	        applyDynamicToDynamic(dyn, item, items, props);
	      });

	      return null
	    };

	    /* Preparation and methods, post-$ref validation will begin at the end of the function */

	    // This is used for typechecks, null means * here
	    const allIn = (arr, valid) => arr && arr.every((s) => valid.includes(s)); // all arr entries are in valid
	    const someIn = (arr, possible) => possible.some((x) => arr === null || arr.includes(x)); // all possible are in arrs

	    const parentCheckedType = (...valid) => queryCurrent().some((h) => allIn(h.stat.type, valid));
	    const definitelyType = (...valid) => allIn(stat.type, valid) || parentCheckedType(...valid);
	    const typeApplicable = (...possible) =>
	      someIn(stat.type, possible) && queryCurrent().every((h) => someIn(h.stat.type, possible));

	    const enforceRegex = (source, target = node) => {
	      enforce(typeof source === 'string', 'Invalid pattern:', source);
	      if (requireValidation || requireStringValidation)
	        enforce(/^\^.*\$$/.test(source), 'Should start with ^ and end with $:', source);
	      if (/([{+*].*[{+*]|\)[{+*]|^[^^].*[{+*].)/.test(source) && target.maxLength === undefined)
	        complex('maxLength should be specified for pattern:', source);
	    };

	    // Those checks will need to be skipped if another error is set in this block before those ones
	    const havePattern = node.pattern && !noopRegExps.has(node.pattern); // we won't generate code for noop
	    const haveComplex = node.uniqueItems || havePattern || node.patternProperties || node.format;
	    const prev = allErrors && haveComplex ? gensym('prev') : null;
	    const prevWrap = (shouldWrap, writeBody) =>
	      fun.if(shouldWrap && prev !== null ? format('errorCount === %s', prev) : true, writeBody);

	    const nexthistory = () => [...history, { stat, prop: current }];
	    // Can not be used before undefined check! The one performed by present()
	    const rule = (...args) => visit(errors, nexthistory(), ...args).stat;
	    const subrule = (suberr, ...args) => {
	      if (args[0] === current) {
	        const constval = constantValue(args[1]);
	        if (constval === true) return { sub: format('true'), delta: {} }
	        if (constval === false) return { sub: format('false'), delta: { type: [] } }
	      }
	      const sub = gensym('sub');
	      fun.write('const %s = (() => {', sub);
	      if (allErrors) fun.write('let errorCount = 0'); // scoped error counter
	      const { stat: delta } = visit(suberr, nexthistory(), ...args);
	      if (allErrors) {
	        fun.write('return errorCount === 0');
	      } else fun.write('return true');
	      fun.write('})()');
	      return { sub, delta }
	    };

	    const suberror = () => {
	      const suberr = includeErrors && allErrors ? gensym('suberr') : null;
	      if (suberr) fun.write('let %s = null', suberr);
	      return suberr
	    };
	    const mergeerror = (suberr) => {
	      if (errors === null || suberr === null) return // suberror can be null e.g. on failed empty contains, errors can be null in e.g. not or if
	      fun.if(suberr, () => fun.write('%s.push(...%s)', errors, suberr));
	    };

	    // Extracted single additional(Items/Properties) rules, for reuse with unevaluated(Items/Properties)
	    const willRemoveAdditional = () => {
	      if (!removeAdditional) return false
	      if (removeAdditional === true) return true
	      if (removeAdditional === 'keyword') {
	        if (!node.removeAdditional) return false
	        consume('removeAdditional', 'boolean');
	        return true
	      }
	      throw new Error(`Invalid removeAdditional: ${removeAdditional}`)
	    };
	    const additionalItems = (rulePath, limit, extra) => {
	      const handled = handle(rulePath, ['object', 'boolean'], (ruleValue) => {
	        if (ruleValue === false && willRemoveAdditional()) {
	          fun.write('if (%s.length > %s) %s.length = %s', name, limit, name, limit);
	          return null
	        }
	        if (ruleValue === false && !extra) return format('%s.length > %s', name, limit)
	        forArray(current, limit, (prop, i) => {
	          if (extra) fun.write('if (%s) continue', extra(i));
	          return rule(prop, ruleValue, subPath(rulePath))
	        });
	        return null
	      });
	      if (handled) evaluateDelta({ items: Infinity });
	    };
	    const additionalProperties = (rulePath, condition) => {
	      const handled = handle(rulePath, ['object', 'boolean'], (ruleValue) => {
	        forObjectKeys(current, (sub, key) => {
	          fun.if(condition(key), () => {
	            if (ruleValue === false && willRemoveAdditional()) fun.write('delete %s[%s]', name, key);
	            else rule(sub, ruleValue, subPath(rulePath));
	          });
	        });
	        return null
	      });
	      if (handled) evaluateDelta({ properties: [true] });
	    };
	    const additionalCondition = (key, properties, patternProperties) =>
	      safeand(
	        ...properties.map((p) => format('%s !== %j', key, p)),
	        ...patternProperties.map((p) => safenot(patternTestSafe(p, key)))
	      );
	    const lintRequired = (properties, patterns) => {
	      const regexps = patterns.map((p) => new RegExp(p, 'u'));
	      const known = (key) => properties.includes(key) || regexps.some((r) => r.test(key));
	      for (const key of stat.required) enforce(known(key), `Unknown required property:`, key);
	    };
	    const finalLint = [];

	    /* Checks inside blocks are independent, they are happening on the same code depth */

	    const checkNumbers = () => {
	      const minMax = (value, operator) => format('!(%d %c %s)', value, operator, name); // don't remove negation, accounts for NaN

	      if (Number.isFinite(node.exclusiveMinimum)) {
	        handle('exclusiveMinimum', ['finite'], (min) => minMax(min, '<'));
	      } else {
	        handle('minimum', ['finite'], (min) => minMax(min, node.exclusiveMinimum ? '<' : '<='));
	        handle('exclusiveMinimum', ['boolean'], null); // handled above
	      }

	      if (Number.isFinite(node.exclusiveMaximum)) {
	        handle('exclusiveMaximum', ['finite'], (max) => minMax(max, '>'));
	        enforceMinMax('minimum', 'exclusiveMaximum');
	        enforceMinMax('exclusiveMinimum', 'exclusiveMaximum');
	      } else if (node.maximum !== undefined) {
	        handle('maximum', ['finite'], (max) => minMax(max, node.exclusiveMaximum ? '>' : '>='));
	        handle('exclusiveMaximum', ['boolean'], null); // handled above
	        enforceMinMax('minimum', 'maximum');
	        enforceMinMax('exclusiveMinimum', 'maximum');
	      }

	      const multipleOf = node.multipleOf === undefined ? 'divisibleBy' : 'multipleOf'; // draft3 support
	      handle(multipleOf, ['finite'], (value) => {
	        enforce(value > 0, `Invalid ${multipleOf}:`, value);
	        const [part, exp] = `${value}`.split('e-');
	        const frac = `${part}.`.split('.')[1];
	        const e = frac.length + (exp ? Number(exp) : 0);
	        if (Number.isInteger(value * 2 ** e)) return format('%s %% %d !== 0', name, value) // exact
	        scope.isMultipleOf = functions.isMultipleOf;
	        const args = [name, value, e, Math.round(value * Math.pow(10, e))]; // precompute for performance
	        return format('!isMultipleOf(%s, %d, 1e%d, %d)', ...args)
	      });
	    };

	    const checkStrings = () => {
	      handle('maxLength', ['natural'], (max) => {
	        scope.stringLength = functions.stringLength;
	        return format('%s.length > %d && stringLength(%s) > %d', name, max, name, max)
	      });
	      handle('minLength', ['natural'], (min) => {
	        scope.stringLength = functions.stringLength;
	        return format('%s.length < %d || stringLength(%s) < %d', name, min, name, min)
	      });
	      enforceMinMax('minLength', 'maxLength');

	      prevWrap(true, () => {
	        const checkFormat = (fmtname, target, formatsObj = fmts) => {
	          const known = typeof fmtname === 'string' && functions.hasOwn(formatsObj, fmtname);
	          enforce(known, 'Unrecognized format used:', fmtname);
	          const formatImpl = formatsObj[fmtname];
	          const valid = formatImpl instanceof RegExp || typeof formatImpl === 'function';
	          enforce(valid, 'Invalid format used:', fmtname);
	          if (!formatAssertion) return null
	          if (formatImpl instanceof RegExp) {
	            // built-in formats are fine, check only ones from options
	            if (functions.hasOwn(optFormats, fmtname)) enforceRegex(formatImpl.source);
	            return format('!%s.test(%s)', genformat(formatImpl), target)
	          }
	          return format('!%s(%s)', genformat(formatImpl), target)
	        };

	        handle('format', ['string'], (value) => {
	          evaluateDelta({ fullstring: true });
	          return checkFormat(value, name)
	        });

	        handle('pattern', ['string'], (pattern) => {
	          enforceRegex(pattern);
	          evaluateDelta({ fullstring: true });
	          return noopRegExps.has(pattern) ? null : safenot(patternTestSafe(pattern, name))
	        });

	        enforce(node.contentSchema !== false, 'contentSchema cannot be set to false');
	        const cV = contentValidation === undefined ? getMeta().contentValidation : contentValidation;
	        const haveContent = node.contentEncoding || node.contentMediaType || node.contentSchema;
	        const contentErr =
	          '"content*" keywords are disabled by default per spec, enable with { contentValidation = true } option (see doc/Options.md for more info)';
	        enforce(!haveContent || cV || allowUnusedKeywords, contentErr);
	        if (haveContent && cV) {
	          const dec = gensym('dec');
	          if (node.contentMediaType) fun.write('let %s = %s', dec, name);

	          if (node.contentEncoding === 'base64') {
	            errorIf(checkFormat('base64', name, formats.extra), { path: ['contentEncoding'] });
	            if (node.contentMediaType) {
	              scope.deBase64 = functions.deBase64;
	              fun.write('try {');
	              fun.write('%s = deBase64(%s)', dec, dec);
	            }
	            consume('contentEncoding', 'string');
	          } else enforce(!node.contentEncoding, 'Unknown contentEncoding:', node.contentEncoding);

	          let json = false;
	          if (node.contentMediaType === 'application/json') {
	            fun.write('try {');
	            fun.write('%s = JSON.parse(%s)', dec, dec);
	            json = true;
	            consume('contentMediaType', 'string');
	          } else enforce(!node.contentMediaType, 'Unknown contentMediaType:', node.contentMediaType);

	          if (node.contentSchema) {
	            enforce(json, 'contentSchema requires contentMediaType application/json');
	            const decprop = Object.freeze({ name: dec, errorParent: current });
	            rule(decprop, node.contentSchema, subPath('contentSchema')); // TODO: isJSON true for speed?
	            consume('contentSchema', 'object', 'array');
	            evaluateDelta({ fullstring: true });
	          }
	          if (node.contentMediaType) {
	            fun.write('} catch (e) {');
	            error({ path: ['contentMediaType'] });
	            fun.write('}');
	            if (node.contentEncoding) {
	              fun.write('} catch (e) {');
	              error({ path: ['contentEncoding'] });
	              fun.write('}');
	            }
	          }
	        }
	      });
	    };

	    const checkArrays = () => {
	      handle('maxItems', ['natural'], (max) => {
	        const prefixItemsName = getMeta().newItemsSyntax ? 'prefixItems' : 'items';
	        if (Array.isArray(node[prefixItemsName]) && node[prefixItemsName].length > max)
	          fail(`Invalid maxItems: ${max} is less than ${prefixItemsName} array length`);
	        return format('%s.length > %d', name, max)
	      });
	      handle('minItems', ['natural'], (min) => format('%s.length < %d', name, min)); // can be higher that .items length with additionalItems
	      enforceMinMax('minItems', 'maxItems');

	      const checkItemsArray = (items) => {
	        for (let p = 0; p < items.length; p++) rule(currPropImm(p), items[p], subPath(`${p}`));
	        evaluateDelta({ items: items.length });
	        return null
	      };
	      if (getMeta().newItemsSyntax) {
	        handle('prefixItems', ['array'], checkItemsArray);
	        additionalItems('items', format('%d', (node.prefixItems || []).length));
	      } else if (Array.isArray(node.items)) {
	        handle('items', ['array'], checkItemsArray);
	        additionalItems('additionalItems', format('%d', node.items.length));
	      } else {
	        handle('items', ['object', 'boolean'], (items) => {
	          forArray(current, format('0'), (prop) => rule(prop, items, subPath('items')));
	          evaluateDelta({ items: Infinity });
	          return null
	        });
	        // If items is not an array, additionalItems is allowed, but ignored per some spec tests!
	        // We do nothing and let it throw except for in allowUnusedKeywords mode
	        // As a result, omitting .items is not allowed by default, only in allowUnusedKeywords mode
	      }

	      checkContains((run) => {
	        forArray(current, format('0'), (prop, i) => {
	          run(prop, () => {
	            evaluateDelta({ dyn: { item: true } });
	            evaluateDeltaDynamic({ item: i });
	          });
	        });
	      });

	      const itemsSimple = (ischema) => {
	        if (!isPlainObject(ischema)) return false
	        if (ischema.enum || functions.hasOwn(ischema, 'const')) return true
	        if (ischema.type) {
	          const itemTypes = Array.isArray(ischema.type) ? ischema.type : [ischema.type];
	          if (itemTypes.every((itemType) => primitiveTypes.includes(itemType))) return true
	        }
	        if (ischema.$ref) {
	          const [sub] = resolveReference(root, schemas, ischema.$ref, basePath())[0] || [];
	          if (itemsSimple(sub)) return true
	        }
	        return false
	      };
	      const itemsSimpleOrFalse = (ischema) => ischema === false || itemsSimple(ischema);
	      const uniqueSimple = () => {
	        if (node.maxItems !== undefined || itemsSimpleOrFalse(node.items)) return true
	        // In old format, .additionalItems requires .items to have effect
	        if (Array.isArray(node.items) && itemsSimpleOrFalse(node.additionalItems)) return true
	        return false
	      };
	      prevWrap(true, () => {
	        handle('uniqueItems', ['boolean'], (uniqueItems) => {
	          if (uniqueItems === false) return null
	          if (!uniqueSimple()) complex('maxItems should be specified for non-primitive uniqueItems');
	          Object.assign(scope, { unique: functions.unique, deepEqual: functions.deepEqual });
	          return format('!unique(%s)', name)
	        });
	      });
	    };

	    // if allErrors is false, we can skip present check for required properties validated before
	    const checked = (p) =>
	      !allErrors &&
	      (stat.required.includes(p) || queryCurrent().some((h) => h.stat.required.includes(p)));

	    const checkObjects = () => {
	      const propertiesCount = format('Object.keys(%s).length', name);
	      handle('maxProperties', ['natural'], (max) => format('%s > %d', propertiesCount, max));
	      handle('minProperties', ['natural'], (min) => format('%s < %d', propertiesCount, min));
	      enforceMinMax('minProperties', 'maxProperties');

	      handle('propertyNames', ['object', 'boolean'], (s) => {
	        forObjectKeys(current, (sub, key) => {
	          // Add default type for non-ref schemas, so strong mode is fine with omitting it
	          const nameSchema = typeof s === 'object' && !s.$ref ? { type: 'string', ...s } : s;
	          const nameprop = Object.freeze({ name: key, errorParent: sub, type: 'string' });
	          rule(nameprop, nameSchema, subPath('propertyNames'));
	        });
	        return null
	      });

	      handle('required', ['array'], (required) => {
	        for (const req of required) {
	          if (checked(req)) continue
	          const prop = currPropImm(req);
	          errorIf(safenot(present(prop)), { path: ['required'], prop });
	        }
	        evaluateDelta({ required });
	        return null
	      });

	      for (const dependencies of ['dependencies', 'dependentRequired', 'dependentSchemas']) {
	        if (dependencies !== 'dependencies' && getMeta().dependentUnsupported) continue
	        handle(dependencies, ['object'], (value) => {
	          for (const key of Object.keys(value)) {
	            const deps = typeof value[key] === 'string' ? [value[key]] : value[key];
	            const item = currPropImm(key, checked(key));
	            if (Array.isArray(deps) && dependencies !== 'dependentSchemas') {
	              const clauses = deps.filter((k) => !checked(k)).map((k) => present(currPropImm(k)));
	              const condition = safenot(safeand(...clauses));
	              const errorArgs = { path: [dependencies, key] };
	              if (clauses.length === 0) {
	                // nothing to do
	              } else if (item.checked) {
	                errorIf(condition, errorArgs);
	                evaluateDelta({ required: deps });
	              } else {
	                errorIf(safeand(present(item), condition), errorArgs);
	              }
	            } else if (isSchemaish(deps) && dependencies !== 'dependentRequired') {
	              uncertain(dependencies); // TODO: we don't always need this, remove when no uncertainity?
	              fun.if(item.checked ? true : present(item), () => {
	                const delta = rule(current, deps, subPath(dependencies, key), dyn);
	                evaluateDelta(orDelta({}, delta));
	                evaluateDeltaDynamic(delta);
	              });
	            } else fail(`Unexpected ${dependencies} entry`);
	          }
	          return null
	        });
	      }

	      handle('propertyDependencies', ['object'], (propertyDependencies) => {
	        for (const [key, variants] of Object.entries(propertyDependencies)) {
	          enforce(isPlainObject(variants), 'propertyDependencies must be an object');
	          uncertain('propertyDependencies'); // TODO: we don't always need this, remove when no uncertainity?
	          const item = currPropImm(key, checked(key));
	          // NOTE: would it be useful to also check if it's a string?
	          fun.if(item.checked ? true : present(item), () => {
	            for (const [val, deps] of Object.entries(variants)) {
	              enforce(isSchemaish(deps), 'propertyDependencies must contain schemas');
	              fun.if(compare(buildName(item), val), () => {
	                // TODO: we already know that we have an object here, optimize?
	                const delta = rule(current, deps, subPath('propertyDependencies', key, val), dyn);
	                evaluateDelta(orDelta({}, delta));
	                evaluateDeltaDynamic(delta);
	              });
	            }
	          });
	        }
	        return null
	      });

	      handle('properties', ['object'], (properties) => {
	        for (const p of Object.keys(properties)) {
	          if (constProp === p) continue // checked in discriminator, avoid double-check
	          rule(currPropImm(p, checked(p)), properties[p], subPath('properties', p));
	        }
	        evaluateDelta({ properties: Object.keys(properties) });
	        return null
	      });

	      prevWrap(node.patternProperties, () => {
	        handle('patternProperties', ['object'], (patternProperties) => {
	          forObjectKeys(current, (sub, key) => {
	            for (const p of Object.keys(patternProperties)) {
	              enforceRegex(p, node.propertyNames || {});
	              fun.if(patternTestSafe(p, key), () => {
	                rule(sub, patternProperties[p], subPath('patternProperties', p));
	              });
	            }
	          });
	          evaluateDelta({ patterns: Object.keys(patternProperties) });
	          return null
	        });
	        if (node.additionalProperties || node.additionalProperties === false) {
	          const properties = Object.keys(node.properties || {});
	          const patternProperties = Object.keys(node.patternProperties || {});
	          if (node.additionalProperties === false) {
	            // Postpone the check to the end when all nested .required are collected
	            finalLint.push(() => lintRequired(properties, patternProperties));
	          }
	          const condition = (key) => additionalCondition(key, properties, patternProperties);
	          additionalProperties('additionalProperties', condition);
	        }
	      });

	      if (getMeta().objectContains) {
	        checkContains((run) => {
	          forObjectKeys(current, (prop, i) => {
	            run(prop, () => {
	              evaluateDelta({ dyn: { properties: [true] } });
	              evaluateDeltaDynamic({ propertiesVars: [i] });
	            });
	          });
	        });
	      }
	    };

	    const checkConst = () => {
	      const handledConst = handle('const', ['jsonval'], (val) => safenot(compare(name, val)));
	      if (handledConst && !allowUnusedKeywords) return true // enum can't be present, this is rechecked by allowUnusedKeywords
	      const handledEnum = handle('enum', ['array'], (vals) => {
	        const objects = vals.filter((value) => value && typeof value === 'object');
	        const primitive = vals.filter((value) => !(value && typeof value === 'object'));
	        return safenotor(...[...primitive, ...objects].map((value) => compare(name, value)))
	      });
	      return handledConst || handledEnum
	    };

	    const checkContains = (iterate) => {
	      // This can be called two times, 'object' and 'array' separately
	      handle('contains', ['object', 'boolean'], () => {
	        uncertain('contains');

	        if (getMeta().objectContains && typeApplicable('array') && typeApplicable('object')) {
	          enforceValidation("possible type confusion in 'contains',", "forbid 'object' or 'array'");
	        }

	        const passes = gensym('passes');
	        fun.write('let %s = 0', passes);

	        const suberr = suberror();
	        iterate((prop, evaluate) => {
	          const { sub } = subrule(suberr, prop, node.contains, subPath('contains'));
	          fun.if(sub, () => {
	            fun.write('%s++', passes);
	            if (getMeta().containsEvaluates) {
	              enforce(!removeAdditional, 'Can\'t use removeAdditional with draft2020+ "contains"');
	              evaluate();
	            }
	          });
	        });

	        if (!handle('minContains', ['natural'], (mn) => format('%s < %d', passes, mn), { suberr }))
	          errorIf(format('%s < 1', passes), { path: ['contains'], suberr });

	        handle('maxContains', ['natural'], (max) => format('%s > %d', passes, max));
	        enforceMinMax('minContains', 'maxContains');
	        return null
	      });
	    };

	    const checkGeneric = () => {
	      handle('not', ['object', 'boolean'], (not) => subrule(null, current, not, subPath('not')).sub);
	      if (node.not) uncertain('not');

	      const thenOrElse = node.then || node.then === false || node.else || node.else === false;
	      // if we allow lone "if" to be present with allowUnusedKeywords, then we must process it to do the evaluation
	      // TODO: perhaps we can optimize this out if dynamic evaluation isn't needed _even with this if processed_
	      if (thenOrElse || allowUnusedKeywords)
	        handle('if', ['object', 'boolean'], (ifS) => {
	          uncertain('if/then/else');
	          const { sub, delta: deltaIf } = subrule(null, current, ifS, subPath('if'), dyn);
	          let handleElse, handleThen, deltaElse, deltaThen;
	          handle('else', ['object', 'boolean'], (elseS) => {
	            handleElse = () => {
	              deltaElse = rule(current, elseS, subPath('else'), dyn);
	              evaluateDeltaDynamic(deltaElse);
	            };
	            return null
	          });
	          handle('then', ['object', 'boolean'], (thenS) => {
	            handleThen = () => {
	              deltaThen = rule(current, thenS, subPath('then'), dyn);
	              evaluateDeltaDynamic(andDelta(deltaIf, deltaThen));
	            };
	            return null
	          });
	          if (!handleThen && !deltaEmpty(deltaIf)) handleThen = () => evaluateDeltaDynamic(deltaIf);
	          fun.if(sub, handleThen, handleElse);
	          evaluateDelta(orDelta(deltaElse || {}, andDelta(deltaIf, deltaThen || {})));
	          return null
	        });

	      const performAllOf = (allOf, rulePath = 'allOf') => {
	        enforce(allOf.length > 0, `${rulePath} cannot be empty`);
	        for (const [key, sch] of Object.entries(allOf))
	          evaluateDelta(rule(current, sch, subPath(rulePath, key), dyn));
	        return null
	      };
	      handle('allOf', ['array'], (allOf) => performAllOf(allOf));

	      let handleDiscriminator = null;
	      handle('discriminator', ['object'], (discriminator) => {
	        const seen = new Set();
	        const fix = (check, message, arg) => enforce(check, `[discriminator]: ${message}`, arg);
	        const { propertyName: pname, mapping: map, ...e0 } = discriminator;
	        const prop = currPropImm(pname);
	        fix(pname && !node.oneOf !== !node.anyOf, 'need propertyName, oneOf OR anyOf');
	        fix(Object.keys(e0).length === 0, 'only "propertyName" and "mapping" are supported');
	        const keylen = (obj) => (isPlainObject(obj) ? Object.keys(obj).length : null);
	        handleDiscriminator = (branches, ruleName) => {
	          const runDiscriminator = () => {
	            fun.write('switch (%s) {', buildName(prop)); // we could also have used ifs for complex types
	            let delta;
	            for (const [i, branch] of Object.entries(branches)) {
	              const { const: myval, enum: myenum, ...e1 } = (branch.properties || {})[pname] || {};
	              let vals = myval !== undefined ? [myval] : myenum;
	              if (!vals && branch.$ref) {
	                const [sub] = resolveReference(root, schemas, branch.$ref, basePath())[0] || [];
	                enforce(isPlainObject(sub), 'failed to resolve $ref:', branch.$ref);
	                const rprop = (sub.properties || {})[pname] || {};
	                vals = rprop.const !== undefined ? [rprop.const] : rprop.enum;
	              }
	              const ok1 = Array.isArray(vals) && vals.length > 0;
	              fix(ok1, 'branches should have unique string const or enum values for [propertyName]');
	              const ok2 = Object.keys(e1).length === 0 && (!myval || !myenum);
	              fix(ok2, 'only const OR enum rules are allowed on [propertyName] in branches');
	              for (const val of vals) {
	                const okMapping = !map || (functions.hasOwn(map, val) && map[val] === branch.$ref);
	                fix(okMapping, 'mismatching mapping for', val);
	                const valok = typeof val === 'string' && !seen.has(val);
	                fix(valok, 'const/enum values for [propertyName] should be unique strings');
	                seen.add(val);
	                fun.write('case %j:', val);
	              }
	              const subd = rule(current, branch, subPath(ruleName, i), dyn, { constProp: pname });
	              evaluateDeltaDynamic(subd);
	              delta = delta ? orDelta(delta, subd) : subd;
	              fun.write('break');
	            }
	            fix(map === undefined || keylen(map) === seen.size, 'mismatching mapping size');
	            evaluateDelta(delta);
	            fun.write('default:');
	            error({ path: [ruleName] });
	            fun.write('}');
	          };
	          const propCheck = () => {
	            if (!checked(pname)) {
	              const errorPath = ['discriminator', 'propertyName'];
	              fun.if(present(prop), runDiscriminator, () => error({ path: errorPath, prop }));
	            } else runDiscriminator();
	          };
	          if (allErrors || !functions.deepEqual(stat.type, ['object'])) {
	            fun.if(types.get('object')(name), propCheck, () => error({ path: ['discriminator'] }));
	          } else propCheck();
	          // can't evaluateDelta on type and required to not break the checks below, but discriminator
	          // is usually used with refs anyway so those won't be of much use
	          fix(functions.deepEqual(stat.type, ['object']), 'has to be checked for type:', 'object');
	          fix(stat.required.includes(pname), 'propertyName should be placed in required:', pname);
	          return null
	        };
	        return null
	      });

	      // Mark the schema as uncertain if the path taken is not determined solely by the branch type
	      const uncertainBranchTypes = (key, arr) => {
	        // In general, { const: [] } can interfere with other { type: 'array' }
	        // Same for { const: {} } and { type: 'object' }
	        // So this check doesn't treat those as non-conflicting, and instead labels those as uncertain conflicts
	        const btypes = arr.map((x) => x.type || (Array.isArray(x.const) ? 'array' : typeof x.const)); // typeof can be 'undefined', but we don't care
	        const maybeObj = btypes.filter((x) => !primitiveTypes.includes(x) && x !== 'array').length;
	        const maybeArr = btypes.filter((x) => !primitiveTypes.includes(x) && x !== 'object').length;
	        if (maybeObj > 1 || maybeArr > 1) uncertain(`${key}, use discriminator to make it certain`);
	      };

	      handle('anyOf', ['array'], (anyOf) => {
	        enforce(anyOf.length > 0, 'anyOf cannot be empty');
	        if (anyOf.length === 1) return performAllOf(anyOf)
	        if (handleDiscriminator) return handleDiscriminator(anyOf, 'anyOf')
	        const suberr = suberror();
	        if (!canSkipDynamic()) {
	          uncertainBranchTypes('anyOf', anyOf); // const sorting for removeAdditional is not supported in dynamic mode
	          // In this case, all have to be checked to gather evaluated properties
	          const entries = Object.entries(anyOf).map(([key, sch]) =>
	            subrule(suberr, current, sch, subPath('anyOf', key), dyn)
	          );
	          evaluateDelta(entries.map((x) => x.delta).reduce((acc, cur) => orDelta(acc, cur)));
	          errorIf(safenotor(...entries.map(({ sub }) => sub)), { path: ['anyOf'], suberr });
	          for (const { delta, sub } of entries) fun.if(sub, () => evaluateDeltaDynamic(delta));
	          return null
	        }
	        // We sort the variants to perform const comparisons first, then primitives/array/object/unknown
	        // This way, we can be sure that array/object + removeAdditional do not affect const evaluation
	        // Note that this _might_ e.g. remove all elements of an array in a 2nd branch _and_ fail with `const: []` in the 1st, but that's expected behavior
	        // This can be done because we can stop on the first match in anyOf if we don't need dynamic evaluation
	        const constBlocks = anyOf.filter((x) => functions.hasOwn(x, 'const'));
	        const otherBlocks = anyOf.filter((x) => !functions.hasOwn(x, 'const'));
	        uncertainBranchTypes('anyOf', otherBlocks);
	        const blocks = [...constBlocks, ...otherBlocks];
	        let delta;

	        if (!getMeta().exclusiveRefs) {
	          // Under unevaluated* support, we can't optimize out branches using simple rules, see below
	          const entries = Object.entries(anyOf).map(([key, sch]) =>
	            subrule(suberr, current, sch, subPath('anyOf', key), dyn)
	          );
	          delta = entries.map((x) => x.delta).reduce((acc, cur) => orDelta(acc, cur));
	          errorIf(safenotor(...entries.map(({ sub }) => sub)), { path: ['anyOf'], suberr });
	        } else {
	          // Optimization logic below isn't stable under unevaluated* presence, as branches can be the sole reason of
	          // causing dynamic evaluation, and optimizing them out can miss the `if (!canSkipDynamic()) {` check above
	          let body = () => error({ path: ['anyOf'], suberr });
	          for (const [key, sch] of Object.entries(blocks).reverse()) {
	            const oldBody = body;
	            body = () => {
	              const { sub, delta: deltaVar } = subrule(suberr, current, sch, subPath('anyOf', key));
	              fun.if(safenot(sub), oldBody); // this can exclude branches, see note above
	              delta = delta ? orDelta(delta, deltaVar) : deltaVar;
	            };
	          }
	          body();
	        }

	        evaluateDelta(delta);
	        return null
	      });

	      handle('oneOf', ['array'], (oneOf) => {
	        enforce(oneOf.length > 0, 'oneOf cannot be empty');
	        if (oneOf.length === 1) return performAllOf(oneOf)
	        if (handleDiscriminator) return handleDiscriminator(oneOf, 'oneOf')
	        uncertainBranchTypes('oneOf', oneOf);
	        const passes = gensym('passes');
	        fun.write('let %s = 0', passes);
	        const suberr = suberror();
	        let delta;
	        let i = 0;
	        const entries = Object.entries(oneOf).map(([key, sch]) => {
	          if (!includeErrors && i++ > 1) errorIf(format('%s > 1', passes), { path: ['oneOf'] });
	          const entry = subrule(suberr, current, sch, subPath('oneOf', key), dyn);
	          fun.if(entry.sub, () => fun.write('%s++', passes));
	          delta = delta ? orDelta(delta, entry.delta) : entry.delta;
	          return entry
	        });
	        evaluateDelta(delta);
	        errorIf(format('%s !== 1', passes), { path: ['oneOf'] });
	        fun.if(format('%s === 0', passes), () => mergeerror(suberr)); // if none matched, dump all errors
	        for (const entry of entries) fun.if(entry.sub, () => evaluateDeltaDynamic(entry.delta));
	        return null
	      });
	    };

	    const typeWrap = (checkBlock, validTypes, queryType) => {
	      const [funSize, unusedSize] = [fun.size(), unused.size];
	      fun.if(definitelyType(...validTypes) ? true : queryType, checkBlock);
	      // enforce check that non-applicable blocks are empty and no rules were applied
	      if (funSize !== fun.size() || unusedSize !== unused.size)
	        enforce(typeApplicable(...validTypes), `Unexpected rules in type`, node.type);
	    };

	    // Unevaluated validation
	    const checkArraysFinal = () => {
	      if (stat.items === Infinity) {
	        // Everything is statically evaluated, so this check is unreachable. Allow only 'false' rule here.
	        if (node.unevaluatedItems === false) consume('unevaluatedItems', 'boolean');
	      } else if (node.unevaluatedItems || node.unevaluatedItems === false) {
	        if (isDynamic(stat).items) {
	          if (!opts[optDynamic]) throw new Error('[opt] Dynamic unevaluated tracing not enabled')
	          const limit = format('Math.max(%d, ...%s)', stat.items, dyn.items);
	          const extra = (i) => format('%s.includes(%s)', dyn.item, i);
	          additionalItems('unevaluatedItems', limit, getMeta().containsEvaluates ? extra : null);
	        } else {
	          additionalItems('unevaluatedItems', format('%d', stat.items));
	        }
	      }
	    };
	    const checkObjectsFinal = () => {
	      prevWrap(stat.patterns.length > 0 || stat.dyn.patterns.length > 0 || stat.unknown, () => {
	        if (stat.properties.includes(true)) {
	          // Everything is statically evaluated, so this check is unreachable. Allow only 'false' rule here.
	          if (node.unevaluatedProperties === false) consume('unevaluatedProperties', 'boolean');
	        } else if (node.unevaluatedProperties || node.unevaluatedProperties === false) {
	          const notStatic = (key) => additionalCondition(key, stat.properties, stat.patterns);
	          if (isDynamic(stat).properties) {
	            if (!opts[optDynamic]) throw new Error('[opt] Dynamic unevaluated tracing not enabled')
	            scope.propertyIn = functions.propertyIn;
	            const notDynamic = (key) => format('!propertyIn(%s, %s)', key, dyn.props);
	            const condition = (key) => safeand(notStatic(key), notDynamic(key));
	            additionalProperties('unevaluatedProperties', condition);
	          } else {
	            if (node.unevaluatedProperties === false) lintRequired(stat.properties, stat.patterns);
	            additionalProperties('unevaluatedProperties', notStatic);
	          }
	        }
	      });
	    };

	    const performValidation = () => {
	      if (prev !== null) fun.write('const %s = errorCount', prev);
	      if (checkConst()) {
	        const typeKeys = [...types.keys()]; // we don't extract type from const/enum, it's enough that we know that it's present
	        evaluateDelta({ properties: [true], items: Infinity, type: typeKeys, fullstring: true }); // everything is evaluated for const
	        if (!allowUnusedKeywords) {
	          // const/enum shouldn't have any other validation rules except for already checked type/$ref
	          enforce(unused.size === 0, 'Unexpected keywords mixed with const or enum:', [...unused]);
	          // If it does though, we should not short-circuit validation. This could be optimized by extracting types, but not significant
	          return
	        }
	      }

	      typeWrap(checkNumbers, ['number', 'integer'], types.get('number')(name));
	      typeWrap(checkStrings, ['string'], types.get('string')(name));
	      typeWrap(checkArrays, ['array'], types.get('array')(name));
	      typeWrap(checkObjects, ['object'], types.get('object')(name));

	      checkGeneric();

	      // evaluated: apply static + dynamic
	      typeWrap(checkArraysFinal, ['array'], types.get('array')(name));
	      typeWrap(checkObjectsFinal, ['object'], types.get('object')(name));

	      for (const lint of finalLint) lint();

	      // evaluated: propagate dynamic to parent dynamic (aka trace)
	      // static to parent is merged via return value
	      applyDynamicToDynamic(trace, local.item, local.items, local.props);
	    };

	    // main post-presence check validation function
	    const writeMain = () => {
	      if (local.item) fun.write('const %s = []', local.item);
	      if (local.items) fun.write('const %s = [0]', local.items);
	      if (local.props) fun.write('const %s = [[], []]', local.props);

	      // refs
	      handle('$ref', ['string'], ($ref) => {
	        const resolved = resolveReference(root, schemas, $ref, basePath());
	        const [sub, subRoot, path] = resolved[0] || [];
	        if (!sub && sub !== false) {
	          fail('failed to resolve $ref:', $ref);
	          if (lintOnly) return null // failures are just collected in linter mode and don't throw, this makes a ref noop
	        }
	        const n = compileSub(sub, subRoot, path);
	        const rn = sub === schema ? funname : n; // resolve to actual name
	        if (!scope[rn]) throw new Error('Unexpected: coherence check failed')
	        if (!scope[rn][evaluatedStatic] && sub.type) {
	          const type = Array.isArray(sub.type) ? sub.type : [sub.type];
	          evaluateDelta({ type });
	          if (requireValidation) {
	            // We are inside a cyclic ref, label it as a one that needs full validation to support assumption in next clause
	            refsNeedFullValidation.add(rn);
	            // If validation is required, then a cyclic $ref is guranteed to validate all items and properties
	            if (type.includes('array')) evaluateDelta({ items: Infinity });
	            if (type.includes('object')) evaluateDelta({ properties: [true] });
	          }
	          if (requireStringValidation && type.includes('string')) {
	            refsNeedFullValidation.add(rn);
	            evaluateDelta({ fullstring: true });
	          }
	        }
	        return applyRef(n, { path: ['$ref'] })
	      });
	      if (getMeta().exclusiveRefs) {
	        enforce(!opts[optDynamic], 'unevaluated* is supported only on draft2019-09 and above');
	        if (node.$ref) return // ref overrides any sibling keywords for older schemas
	      }
	      handle('$recursiveRef', ['string'], ($recursiveRef) => {
	        if (!opts[optRecAnchors]) throw new Error('[opt] Recursive anchors are not enabled')
	        enforce($recursiveRef === '#', 'Behavior of $recursiveRef is defined only for "#"');
	        // Resolve to recheck that recursive ref is enabled
	        const resolved = resolveReference(root, schemas, '#', basePath());
	        const [sub, subRoot, path] = resolved[0];
	        laxMode(sub.$recursiveAnchor, '$recursiveRef without $recursiveAnchor');
	        const n = compileSub(sub, subRoot, path);
	        // Apply deep recursion from here only if $recursiveAnchor is true, else just run self
	        const nrec = sub.$recursiveAnchor ? format('(recursive || %s)', n) : n;
	        return applyRef(nrec, { path: ['$recursiveRef'] })
	      });
	      handle('$dynamicRef', ['string'], ($dynamicRef) => {
	        if (!opts[optDynAnchors]) throw new Error('[opt] Dynamic anchors are not enabled')
	        laxMode(/^[^#]*#[a-zA-Z0-9_-]+$/.test($dynamicRef), 'Unsupported $dynamicRef format');
	        const dynamicTail = $dynamicRef.replace(/^[^#]+/, '');
	        const resolved = resolveReference(root, schemas, $dynamicRef, basePath());
	        if (!resolved[0] && !getMeta().bookending) {
	          // TODO: this is draft/next only atm, recheck if dynamicResolve() can fail in runtime and what should happen
	          // We have this allowed in lax mode only for now
	          // Ref: https://github.com/json-schema-org/json-schema-spec/issues/1064#issuecomment-947223332
	          // Ref: https://github.com/json-schema-org/json-schema-spec/pull/1139
	          // Ref: https://github.com/json-schema-org/json-schema-spec/issues/1140 (unresolved)
	          laxMode(false, '$dynamicRef bookending resolution failed (even though not required)');
	          scope.dynamicResolve = functions.dynamicResolve;
	          const nrec = format('dynamicResolve(dynAnchors || [], %j)', dynamicTail);
	          return applyRef(nrec, { path: ['$dynamicRef'] })
	        }
	        enforce(resolved[0], '$dynamicRef bookending resolution failed', $dynamicRef);
	        const [sub, subRoot, path] = resolved[0];
	        const ok = sub.$dynamicAnchor && `#${sub.$dynamicAnchor}` === dynamicTail;
	        laxMode(ok, '$dynamicRef without $dynamicAnchor in the same scope');
	        const n = compileSub(sub, subRoot, path);
	        scope.dynamicResolve = functions.dynamicResolve;
	        const nrec = ok ? format('(dynamicResolve(dynAnchors || [], %j) || %s)', dynamicTail, n) : n;
	        return applyRef(nrec, { path: ['$dynamicRef'] })
	      });

	      // typecheck
	      let typeCheck = null;
	      handle('type', ['string', 'array'], (type) => {
	        const typearr = Array.isArray(type) ? type : [type];
	        for (const t of typearr) enforce(typeof t === 'string' && types.has(t), 'Unknown type:', t);
	        if (current.type) {
	          enforce(functions.deepEqual(typearr, [current.type]), 'One type allowed:', current.type);
	          evaluateDelta({ type: [current.type] });
	          return null
	        }
	        if (parentCheckedType(...typearr)) return null
	        const filteredTypes = typearr.filter((t) => typeApplicable(t));
	        if (filteredTypes.length === 0) fail('No valid types possible');
	        evaluateDelta({ type: typearr }); // can be safely done here, filteredTypes already prepared
	        typeCheck = safenotor(...filteredTypes.map((t) => types.get(t)(name)));
	        return null
	      });

	      // main validation block
	      // if type validation was needed and did not return early, wrap this inside an else clause.
	      if (typeCheck && allErrors) {
	        fun.if(typeCheck, () => error({ path: ['type'] }), performValidation);
	      } else {
	        if (typeCheck) errorIf(typeCheck, { path: ['type'] });
	        performValidation();
	      }

	      // account for maxItems to recheck if they limit items. TODO: perhaps we could keep track of this in stat?
	      if (stat.items < Infinity && node.maxItems <= stat.items) evaluateDelta({ items: Infinity });
	    };

	    // presence check and call main validation block
	    if (node.default !== undefined && useDefaults) {
	      if (definitelyPresent) fail('Can not apply default value here (e.g. at root)');
	      const defvalue = get('default', 'jsonval');
	      fun.if(present(current), writeMain, () => fun.write('%s = %j', name, defvalue));
	    } else {
	      handle('default', ['jsonval'], null); // unused
	      fun.if(definitelyPresent ? true : present(current), writeMain);
	    }

	    basePathStack.length = basePathStackLength; // restore basePath

	    // restore recursiveAnchor history if it's not empty and ends with current node
	    if (recursiveLog[0] && recursiveLog[recursiveLog.length - 1][0] === node) recursiveLog.pop();
	    if (isDynScope && node !== schema) fun.write('dynLocal.shift()'); // restore dynamic scope, no need on top-level

	    // Checks related to static schema analysis
	    if (!allowUnreachable) enforce(!fun.optimizedOut, 'some checks are never reachable');
	    if (isSub) {
	      const logicalOp = ['not', 'if', 'then', 'else'].includes(schemaPath[schemaPath.length - 1]);
	      const branchOp = ['oneOf', 'anyOf', 'allOf'].includes(schemaPath[schemaPath.length - 2]);
	      const depOp = ['dependencies', 'dependentSchemas'].includes(schemaPath[schemaPath.length - 2]);
	      const propDepOp = ['propertyDependencies'].includes(schemaPath[schemaPath.length - 3]);
	      // Coherence check, unreachable, double-check that we came from expected path
	      enforce(logicalOp || branchOp || depOp || propDepOp, 'Unexpected logical path');
	    } else if (!schemaPath.includes('not')) {
	      // 'not' does not mark anything as evaluated (unlike even if/then/else), so it's safe to exclude from these
	      // checks, as we are sure that everything will be checked without it. It can be viewed as a pure add-on.
	      const isRefTop = schema !== root && node === schema; // We are at the top-level of an opaque ref inside the schema object
	      if (!isRefTop || refsNeedFullValidation.has(funname)) {
	        refsNeedFullValidation.delete(funname);
	        if (!stat.type) enforceValidation('type');
	        // This can't be true for top-level schemas, only references with #/...
	        if (typeApplicable('array') && stat.items !== Infinity)
	          enforceValidation(node.items ? 'additionalItems or unevaluatedItems' : 'items rule');
	        if (typeApplicable('object') && !stat.properties.includes(true))
	          enforceValidation('additionalProperties or unevaluatedProperties');
	        if (!stat.fullstring && requireStringValidation) {
	          const stringWarning = 'pattern, format or contentSchema should be specified for strings';
	          fail(`[requireStringValidation] ${stringWarning}, use pattern: ^[\\s\\S]*$ to opt-out`);
	        }
	      }
	      if (typeof node.propertyNames !== 'object')
	        for (const sub of ['additionalProperties', 'unevaluatedProperties'])
	          if (node[sub]) enforceValidation(`wild-card ${sub}`, 'requires propertyNames');
	    }
	    if (node.properties && !node.required) enforceValidation('if properties is used, required');
	    enforce(unused.size === 0 || allowUnusedKeywords, 'Unprocessed keywords:', [...unused]);

	    return { stat, local } // return statically evaluated
	  };

	  const { stat, local } = visit(format('validate.errors'), [], { name: safe('data') }, schema, []);
	  if (refsNeedFullValidation.has(funname)) throw new Error('Unexpected: unvalidated cyclic ref')

	  // evaluated: return dynamic for refs
	  if (opts[optDynamic] && (isDynamic(stat).items || isDynamic(stat).properties)) {
	    if (!local) throw new Error('Failed to trace dynamic properties') // Unreachable
	    fun.write('validate.evaluatedDynamic = [%s, %s, %s]', local.item, local.items, local.props);
	  }

	  if (allErrors) fun.write('return errorCount === 0');
	  else fun.write('return true');

	  fun.write('}');

	  if (!lintOnly) {
	    validate = fun.makeFunction(scope);
	    delete scope[funname]; // more logical key order
	    scope[funname] = validate;
	  }
	  scope[funname][evaluatedStatic] = stat; // still needed even in non-compiled lint for recursive refs check
	  return funname
	};

	const compile = (schemas, opts) => {
	  if (!Array.isArray(schemas)) throw new Error('Expected an array of schemas')
	  try {
	    const scope = Object.create(null);
	    const { getref } = scopeMethods(scope);
	    refsNeedFullValidation.clear(); // for isolation/safeguard
	    rootMeta.clear(); // for isolation/safeguard
	    const refs = schemas.map((s) => getref(s) || compileSchema(s, s, opts, scope));
	    if (refsNeedFullValidation.size !== 0) throw new Error('Unexpected: not all refs are validated')
	    return { scope, refs }
	  } catch (e) {
	    // For performance, we try to build the schema without dynamic tracing first, then re-run with
	    // it enabled if needed. Enabling it without need can give up to about 40% performance drop.
	    if (!opts[optDynamic] && e.message === '[opt] Dynamic unevaluated tracing not enabled')
	      return compile(schemas, { ...opts, [optDynamic]: true })
	    // Also enable dynamic and recursive refs only if needed
	    if (!opts[optDynAnchors] && e.message === '[opt] Dynamic anchors are not enabled')
	      return compile(schemas, { ...opts, [optDynAnchors]: true })
	    if (!opts[optRecAnchors] && e.message === '[opt] Recursive anchors are not enabled')
	      return compile(schemas, { ...opts, [optRecAnchors]: true })
	    throw e
	  } finally {
	    refsNeedFullValidation.clear(); // for gc
	    rootMeta.clear(); // for gc
	  }
	};

	compile_1 = { compile };
	return compile_1;
}

var src;
var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;

	const genfun = requireGenerateFunction();
	const { buildSchemas } = requirePointer();
	const { compile } = requireCompile();
	const { deepEqual } = requireScopeFunctions();

	const jsonCheckWithErrors = (validate) =>
	  function validateIsJSON(data) {
	    if (!deepEqual(data, JSON.parse(JSON.stringify(data)))) {
	      validateIsJSON.errors = [{ instanceLocation: '#', error: 'not JSON compatible' }];
	      return false
	    }
	    const res = validate(data);
	    validateIsJSON.errors = validate.errors;
	    return res
	  };

	const jsonCheckWithoutErrors = (validate) => (data) =>
	  deepEqual(data, JSON.parse(JSON.stringify(data))) && validate(data);

	const validator = (
	  schema,
	  { parse = false, multi = false, jsonCheck = false, isJSON = false, schemas = [], ...opts } = {}
	) => {
	  if (jsonCheck && isJSON) throw new Error('Can not specify both isJSON and jsonCheck options')
	  if (parse && (jsonCheck || isJSON))
	    throw new Error('jsonCheck and isJSON options are not applicable in parser mode')
	  const mode = parse ? 'strong' : 'default'; // strong mode is default in parser, can be overriden
	  const willJSON = isJSON || jsonCheck || parse;
	  const arg = multi ? schema : [schema];
	  const options = { mode, ...opts, schemas: buildSchemas(schemas, arg), isJSON: willJSON };
	  const { scope, refs } = compile(arg, options); // only a single ref
	  if (opts.dryRun) return
	  if (opts.lint) return scope.lintErrors
	  const fun = genfun();
	  if (parse) {
	    scope.parseWrap = opts.includeErrors ? parseWithErrors : parseWithoutErrors;
	  } else if (jsonCheck) {
	    scope.deepEqual = deepEqual;
	    scope.jsonCheckWrap = opts.includeErrors ? jsonCheckWithErrors : jsonCheckWithoutErrors;
	  }
	  if (multi) {
	    fun.write('[');
	    for (const ref of refs.slice(0, -1)) fun.write('%s,', ref);
	    if (refs.length > 0) fun.write('%s', refs[refs.length - 1]);
	    fun.write(']');
	    if (parse) fun.write('.map(parseWrap)');
	    else if (jsonCheck) fun.write('.map(jsonCheckWrap)');
	  } else {
	    if (parse) fun.write('parseWrap(%s)', refs[0]);
	    else if (jsonCheck) fun.write('jsonCheckWrap(%s)', refs[0]);
	    else fun.write('%s', refs[0]);
	  }
	  const validate = fun.makeFunction(scope);
	  validate.toModule = ({ semi = true } = {}) => fun.makeModule(scope) + (semi ? ';' : '');
	  validate.toJSON = () => schema;
	  return validate
	};

	const parseWithErrors = (validate) => (src) => {
	  if (typeof src !== 'string') return { valid: false, error: 'Input is not a string' }
	  try {
	    const value = JSON.parse(src);
	    if (!validate(value)) {
	      const { keywordLocation, instanceLocation } = validate.errors[0];
	      const keyword = keywordLocation.slice(keywordLocation.lastIndexOf('/') + 1);
	      const error = `JSON validation failed for ${keyword} at ${instanceLocation}`;
	      return { valid: false, error, errors: validate.errors }
	    }
	    return { valid: true, value }
	  } catch ({ message }) {
	    return { valid: false, error: message }
	  }
	};

	const parseWithoutErrors = (validate) => (src) => {
	  if (typeof src !== 'string') return { valid: false }
	  try {
	    const value = JSON.parse(src);
	    if (!validate(value)) return { valid: false }
	    return { valid: true, value }
	  } catch (e) {
	    return { valid: false }
	  }
	};

	const parser = function(schema, { parse = true, ...opts } = {}) {
	  if (!parse) throw new Error('can not disable parse in parser')
	  return validator(schema, { parse, ...opts })
	};

	const lint = function(schema, { lint: lintOption = true, ...opts } = {}) {
	  if (!lintOption) throw new Error('can not disable lint option in lint()')
	  return validator(schema, { lint: lintOption, ...opts })
	};

	src = { validator, parser, lint };
	return src;
}

requireSrc();

export { slotScheme as a, superForm as b, zodClient as c, loginScheme as l, registerScheme as r, superValidate as s, zod as z };
//# sourceMappingURL=index-DCHBw7tG.js.map
