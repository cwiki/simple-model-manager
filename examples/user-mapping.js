module.exports = {
    __table: "user",
    __primary: "id",
    id: [Number, 11, false], // auto increment field
    name: [String, 35, true], // must be supplied
    date: [String, 18, false], // has a default of current timestam
    email: [String, 25, false]
}
