const Factory = require('./factory')
const dataFactory = require('./../../examples/factory')

let FF
beforeEach(() => {
    FF = new Factory()
})

describe('get', () => {
    test('supplying id returns a generic model with that id', () => {
        expect(FF.get({ source: 'user', key: 1 }).id).toBe(1)
    })

    test('model looks up return same object if supplied same values', () => {
        expect(FF.get({ source: 'user', key: 32 }))
            .toBe(FF.get({ source: 'user', key: 32 }))
    })

    test('supplying id returns a generic model with that id with field limits', () => {
        const fields = ['id', 'email']
        const user1 = FF.get({ source: 'user', key: 1, fields })
        expect(user1.date).toBeUndefined()
        expect(user1.name).toBeUndefined()
    })
})

describe('save', () => {
    test('saving a user makes', () => {
        const user32 = { key: 32, email: 'hamtaro@ham.com' }
        FF.save({ source: 'user', key: 32, model: user32 })
        expect(FF.get({ source: 'user', key: 32 })).toEqual(user32)
    })

    test('saving multiple entries', () => {
        const user32 = { id: 32, email: 'hamtaro@ham.com' }
        const user44 = { id: 44, email: 'hamtaro@ham.com' }
        FF.save({ source: 'user', key: user32.id, model: user32 },
            { source: 'user', key: user44.id, model: user44 })
        expect(FF.get({ source: 'user', key: 44 })).toEqual(user44)
    })
})

describe('delete', () => {
    test('saving a user makes', () => {
        const user32 = { id: 32, email: 'hamtaro@ham.com' }
        FF.cache.set('user32', user32)
        FF.delete({ source: 'user', key: 32 })
        expect(FF.cache.get('user32')).toBeUndefined()
    })
})