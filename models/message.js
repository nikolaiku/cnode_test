const Model = require('./main')

class Message extends Model {
    constructor(form) {
        super()
        this.author = form.author || ''
        this.Message = form.Message || ''
    }
}

module.exports = Message