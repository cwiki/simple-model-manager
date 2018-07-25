const sid = require('./simple-uuid')

test("creates uuid hash", () => {
    expect(sid.encode('user', 32)).toEqual('dXNlcg==.MzI=')
})

test("decodes uuid hash", () => {
    expect(sid.decode('dXNlcg==.MzI=')).toEqual(['user', 32])
})

test("encode accepts array syntax", () => {
    expect(sid.encode(['user', 32])).toEqual('dXNlcg==.MzI=')
})

test("encode can encode and decode many values", () => {
    const code = ['user', 32, 'haru', 'bridge', 44]
    expect(sid.decode(sid.encode(code))).toEqual(code)
})

