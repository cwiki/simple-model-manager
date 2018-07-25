module.exports = {
    __table: "order_detail",
    __primary: "id",
    id: [Number, 11, false], // auto increment field
    order_id: [Number, 11, true], // must be supplied
    date: [String, 18, false], // has a default of current timestam
    item: [String, 50, true]
}