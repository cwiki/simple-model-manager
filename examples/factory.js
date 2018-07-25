const faker = require('faker')

function user(id) {
    return {
        id: id || faker.random.number(),
        name: faker.name.findName(),
        date: faker.date.past(),
        email: faker.internet.email()
    }
}

function order(id, user_id) {
    return {
        id: id || faker.random.number(),
        ticket: faker.random.number(),
        date: faker.date.past(),
        user_id: user_id || faker.random.number()
    }
}

function orderLine(id, order_id) {
    return {
        id: id || faker.random.number(),
        order_id: order_id || faker.random.number(),
        date: faker.date.past(),
        line: faker.lorem.words()
    }
}

module.exports = { user, order, orderLine }