module.exports = {
    __table: "order",
    __primary: "id",
    id: [Number, 11, false], // auto increment field
    ticket: [String, 11, true], // must be supplied
    date: [String, 18, false], // has a default of current timestam
    user_id: [Number, 11, true]
}
