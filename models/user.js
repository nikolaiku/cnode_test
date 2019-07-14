const Model = require('./main')

class User extends Model {
    constructor(form = {}) {
        super()
        this.id = form.id
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
    }

    validateLogin() {
        const u = User.findOne({
            username: this.username
        })
        return u !== null && u.password === this.password
    }

    validateRegister() {
        const validForm = this.username.length > 2 && this.password.length > 2
        const uniqueUser = User.findOne('username', this.username) === null
        return validForm && uniqueUser
    }
}

const test = () => {

}

if (require.main === module) {
    test()
}

module.exports = User