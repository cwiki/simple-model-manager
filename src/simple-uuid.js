function encode(...param) {
    param = [].concat(...param)
    return param.map(value => {
        return Buffer.from(String(value)).toString('base64')
    }).join('.')
}

function decode(param){
    return param.split('.').map(value => {
        let ascii = Buffer.from(value, 'base64').toString('ascii')
        if (!isNaN(ascii)){
            ascii = Number(ascii)
        }
        return ascii
    })
}

module.exports = {encode, decode}