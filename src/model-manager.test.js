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
        let newUser = { name: 'charlie' }
        mm.get('user', newUser)
            .catch(console.error)
            .then(data => {
                expect(data).toEqual(Object.assign({ __uuid: 'dXNlcg==', __state: 3820375274, id: null }, newUser))
            })
    })

    test('can create a uid from target config primary key', () => {
        const StarfishMapping = Object.assign({}, mapping)
        StarfishMapping.__table = 'starfish'
        StarfishMapping.__primary = 'special_id'
        StarfishMapping.special_id = [String, 11, false]
        mm.register(StarfishMapping)
        cap.je.mockReturnValue('haiku')
        let newStarfish = { name: 'patrick', special_id: 44 }
        mm.get('starfish', newStarfish)
            .catch(console.error)
            .then(response => {
                expect(response.__uuid).toEqual('c3RhcmZpc2g=.NDQ=')
            })
    })

    test('empty lookup returns null', () => {
        mm.register(UserMapping)
        cap.je.mockReturnValue(undefined)
        mm.get('user', 1)
            .catch(console.error)
            .then(response => {
                expect(response).toBeNull()
            })
    })
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
        expect.assertions(1)
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        mm.get('user', factory.user())
            .catch(console.error)
            .then(user1 => {
                user1.name += '.change' // forces update
                mm.save(user1)
                expect(cap.je.mock.calls[0][0]).toEqual([{ id: user1.id, source: 'user', model: user1 }])
            })
    })

    test('a models fields not listed in register are removed', () => {
        expect.assertions(1)
        cap.je.mockReturnValue(Promise.resolve('haiku'))
        mm.register(UserMapping)
        mm.get('user', factory.user())
            .catch(console.error)
            .then(user1 => {
                const userMod = Object.assign({}, user1)
                userMod.badField = 'bad'
                mm.save(userMod).catch(console.error)
                expect(userMod.badField).toEqual(undefined)
            })
    })

    test('multiple models can be saved to the respective source', async () => {
        expect.assertions(1)
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        let user1 = await mm.get('user', factory.user())
            .catch(console.error)
        let user2 = await mm.get('user', factory.user())
            .catch(console.error)
        user1.name += '.change' // forces update
        user2.name += '.change' // forces update
        await mm.save(user1, user2)
            .catch(console.error)
        await expect(cap.je.mock.calls[0][0])
            .toEqual([{ id: user1.id, source: 'user', model: user1 },
            { id: user2.id, source: 'user', model: user2 }])
    })

    test('multiple models of different types can be saved to the respective source', async () => {
        expect.assertions(1)
        let user1, user2, order
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping, OrderMapping)
        user1 = await mm.get('user', factory.user())
            .catch(console.error)
        user2 = await mm.get('user', factory.user())
            .catch(console.error)
        order = await mm.get('order', factory.order())
            .catch(console.error)
        user1.name += '.change' // forces update
        user2.name += '.change' // forces update
        order.ticket += 1 // forces update
        await mm.save(user1, user2, order)
            .catch(console.error)
        await expect(cap.je.mock.calls)
            .toEqual(
                [
                    [[{ id: user1.id, source: 'user', model: user1 },
                    { id: user2.id, source: 'user', model: user2 }]],
                    [[{ id: order.id, source: 'order', model: order }]]
                ]
            )
    })

    test('saving a object only occrus if the source has not changed', async () => {
        expect.assertions(1)
        let user1, user2
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = await mm.get('user', factory.user())
            .catch(console.error)
        user2 = await mm.get('user', factory.user())
            .catch(console.error)
        user2.email = 'cake.loves@yahoo.com'
        await mm.save(user1, user2)
            .catch(console.error)
        await expect(cap.je.mock.calls[0][0])
            .toEqual([{ id: user2.id, source: 'user', model: user2 }])
    })

    test('saving a modified object changes state', async () => {
        expect.assertions(1)
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        let user = await mm.get('user', factory.user())
            .catch(console.error)
        user.email = 'cake.loves@yahoo.com'
        const clone = Object.assign({}, user)
        clone.__state = mm._getState(user) // new state property after update
        await mm.save(user)
            .catch(console.error)
        expect(user).toEqual(clone)
    })
})

describe('delete', () => {
    test('submitting models to delete removes them from the data source', async () => {
        expect.assertions(1)
        let user1
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = await mm.get('user', factory.user())
            .catch(console.error)
        const key = user1.id
        await mm.delete(user1)
            .catch(console.error)
        expect(cap.je.mock.calls[0][0]).toEqual([{ key, source: 'user' }])
    })


    test('submitting multiple models to delete removes them from the data source', async () => {
        expect.assertions(1)
        let user1, order
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping, OrderMapping)
        user1 = await mm.get('user', factory.user())
            .catch(console.error)
        order = await mm.get('order', factory.order())
            .catch(console.error)
        const userKey = user1.id
        const orderKey = order.id
        await mm.delete(user1, order)
            .catch(console.error)
        expect(cap.je.mock.calls[0][0])
            .toEqual([{ key: userKey, source: 'user' }, { key: orderKey, source: 'order' }])

    })

    test('submitting models to delete removes erases the object', async () => {
        expect.assertions(1)
        let user1
        cap.je.mockReturnValue('haiku')
        mm.register(UserMapping)
        user1 = await mm.get('user', factory.user())
        await mm.delete(user1)
            .catch(console.error)
        expect(user1.id).toBe(null)
    })
})