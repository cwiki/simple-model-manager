const ModelManager = require('./model-manager')
const AssertionError = require('assert').AssertionError
const UserMapping = require('../examples/user-mapping')
const OrderMapping = require('../examples/order-mapping')
const factory = require('../examples/factory')

class Capture {
    constructor() {
        this.je = jest.fn()
    }
    get(args) {
        return this.je(args)
    }

    save(...models) {
        return this.je(models)
    }

    delete(...models) {
        return this.je(models)
    }
}

const mapping = {
    __table: "order",
    __primary: "id",
    id: [Number, 11, false], // auto increment field
    ticket: [String, 11, true], // must be supplied
    date: [String, 18, false], // has a default of current timestam
    user_id: [Number, 11, true]
}


let cap, mm;
beforeEach(() => {
    cap = new Capture()
    mm = new ModelManager(cap)
})

describe('get', () => {
    test('can get/retrieve a user', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue('haiku')
        mm.get('user', 1)
        expect(cap.je.mock.calls[0][0]).toEqual({ source: 'user', key: 1, fields: undefined })
    })

    test('can get/retrieve a user from UID', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue('haiku')
        mm.get('dXNlcg==.MQ==')
        expect(cap.je.mock.calls[0][0]).toEqual({ source: 'user', key: 1, fields: undefined })
    })


    test('can get/retrieve a user with fields', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue('haiku')
        mm.get('user', 1, ['cake', 'muffins'])
        expect(cap.je.mock.calls[0][0]).toEqual({ source: 'user', key: 1, fields: ['cake', 'muffins'] })
    })

    test('can get/retrieve a user from UID with fields', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue('haiku')
        mm.get('dXNlcg==.MQ==', ['cake', 'muffins'])
        expect(cap.je.mock.calls[0][0]).toEqual({ source: 'user', key: 1, fields: ['cake', 'muffins'] })
    })

    test('can create a object from meta data', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue('haiku')
        let newUser = { name: 'charlie'}
        expect(mm.get('user', newUser))
            .toEqual(Object.assign({ __uuid: 'dXNlcg==', __state: 3820375274, id: null }, newUser))
    })
    test('can create a uid from target config primary key', () => {
        const StarfishMapping = Object.assign({}, mapping)
        StarfishMapping.__table = 'starfish'
        StarfishMapping.__primary = 'special_id'
        StarfishMapping.special_id = [String, 11, false]
        mm.register(StarfishMapping)
        cap.je.mockReturnValue('haiku')
        let newStarfish = { name: 'patrick', special_id: 44 }
        expect(mm.get('starfish', newStarfish).__uuid).toEqual('c3RhcmZpc2g=.NDQ=')
    })

    // todo add test no result return null
})


describe('register', () => {
    test('adds a new object mapping', () => {
        mm.register(mapping)
        expect(mm.registry.get('order')).toEqual(mapping)
    })

    test('adds multiple mappings', () => {
        const mapping2 = Object.assign({}, mapping)
        mapping2.__table = 'swordfish'
        mm.register(mapping, mapping2)
        expect(mm.registry.get('order')).toEqual(mapping)
        expect(mm.registry.get('swordfish')).toEqual(mapping2)
    })

    test('throws exception when mapping has no table attribute', () => {
        const mapping2 = Object.assign({}, mapping)
        delete mapping2.__table
        const t = function () {
            mm.register(mapping2)
        }
        expect(t).toThrow(AssertionError)
    })

    test('throws exception when mapping has no primary attribute', () => {
        const mapping2 = Object.assign({}, mapping)
        delete mapping2.__primary
        const t = () => mm.register(mapping2)
        expect(t).toThrow(AssertionError)
    })
})


describe('save', () => {
    test('a model can be saved to the respective source', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        user1.name += '.change' // forces update
        mm.save(user1)
        expect(cap.je.mock.calls[0][0]).toEqual([{ id: user1.id, source: 'user', model: user1 }])
    })

    test('a models fields not listed in register are removed', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        const userMod = Object.assign({}, user1)
        userMod.badField = 'bad'
        mm.save(userMod)
        expect(userMod.badField).toEqual(undefined)
    })

    test('multiple models can be saved to the respective source', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        user2 = mm.get('user', factory.user())
        user1.name += '.change' // forces update
        user2.name += '.change' // forces update
        mm.save(user1, user2)
        expect(cap.je.mock.calls[0][0])
            .toEqual([{ id: user1.id, source: 'user', model: user1 },
            { id: user2.id, source: 'user', model: user2 }])
    })

    test('multiple models of different types can be saved to the respective source', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping, OrderMapping)
        user1 = mm.get('user', factory.user())
        user2 = mm.get('user', factory.user())
        order = mm.get('order', factory.order())
        user1.name += '.change' // forces update
        user2.name += '.change' // forces update
        order.ticket += 1 // forces update
        mm.save(user1, user2, order)
        expect(cap.je.mock.calls)
            .toEqual(
                [
                    [[{ id: user1.id, source: 'user', model: user1 },
                    { id: user2.id, source: 'user', model: user2 }]],
                    [[{ id: order.id, source: 'order', model: order }]]
                ]
            )
    })

    test('saving a object only occrus if the source has not changed', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        user2 = mm.get('user', factory.user())
        user2.email = 'cake.loves@yahoo.com'
        mm.save(user1, user2)
        expect(cap.je.mock.calls[0][0])
            .toEqual([{ id: user2.id, source: 'user', model: user2 }])
    })

    test('saving a modified object changes state', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user = mm.get('user', factory.user())
        user.email = 'cake.loves@yahoo.com'
        const clone = Object.assign({}, user)
        clone.__state = mm._getState(user) // new state property after update
        mm.save(user)
        expect(user).toEqual(clone)
    })

})

describe('delete', () => {
    test('submitting models to delete removes them from the data source', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        const key = user1.id
        mm.delete(user1)
        expect(cap.je.mock.calls[0][0]).toEqual([{ key, source: 'user' }])
    })

    test('submitting multiple models to delete removes them from the data source', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping, OrderMapping)
        user1 = mm.get('user', factory.user())
        order = mm.get('order', factory.order())
        const userKey = user1.id
        const orderKey = order.id
        mm.delete(user1, order)
        expect(cap.je.mock.calls[0][0])
            .toEqual([{ key: userKey, source: 'user' }, { key: orderKey, source: 'order' }])
    })

    test('submitting models to delete removes erases the object', () => {
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = mm.get('user', factory.user())
        mm.delete(user1)
        expect(user1.id).toBe(null)
    })
})