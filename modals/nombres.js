const { model, Schema } = require("mongoose")

const schema = new Schema({
    bot: { 
        type: Number
    },
    total: {
        type: Number
    }
})

module.exports = model("nombres", schema)