// caches are used to reduce the amount of repeat work for uuid lookups
const encodeCache = new Map()
const decodeCache = new Map()

/**
 * Takes in a set of paramenters and encodes them to base64 then concatonates them
 * @param params 
 */
function encode(...params) {
    params = [].concat(...params)
    const enBuff = v => Buffer.from(String(v)).toString('base64')
    const source = params.shift()

    if (!encodeCache.has(source)) {
        encodeCache.set(source, enBuff(source))
    }

    params = params.map(enBuff)
    return ([encodeCache.get(source)].concat(params)).join('.')
}

/**
 * Attempts to decode a hash stirng given to it.
 * If uses a map to decode/encode first entries which should be text
 * @param param 
 */
function decode(param) {
    const deBuff = v => Buffer.from(v, 'base64').toString('ascii')
    let params = param.split('.')

    // resolve first var using a buffer
    const source = params.shift()
    if (!decodeCache.has(source)) {
        decodeCache.set(source, deBuff(source))
    }

    // resolve other params without buffer
    params = params.map(deBuff).map(v => (isNaN(v) ? v : Number(v)))

    return [decodeCache.get(source)].concat(params)
}

module.exports = { encode, decode }