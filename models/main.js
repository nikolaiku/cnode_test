const fs = require('fs')
const log = require('../utils')


const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

const load = (path) => {
    const options = {
        encoding: 'utf8'
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.txt`
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((itm) => {
            const cls = this
            const instance = cls.create(itm)
            return instance
        })
        return ms
    }

    static create(form = {}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }

    static findOne(key, value) {
        const all = this.all()
        let m = all.find((e) => {
            return e[key] === value
        })

        if (m === undefined) {
            m = null
        }

        return m
    }

    static find(key, value) {
        const all = this.all()
        let models = []
        all.forEach((m) => {
            if (m[key] === value) {
                models.push(m)
            }
        })

        return models
    }

    static get(id) {
        id = parseInt(id, 10)
        console.log('debug id', id)
        return this.findOne('id', id)
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id == undefined) {
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                this.id = 0
            }
            models.push(this)
        } else {
            let index = -1
            for (let i = 0; i < models.length; i++) {
                const m = models[i]
                if (m.id === this.id) {
                    index = i
                    break
                }
            }
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    static remove(id) {
        const cls = this
        const models = cls.all()
        const index = models.findeIndex((e) => {
            return e.id === id
        })
        if (index > -1) {
            models.splice(index, 1)
        }
        const path = cls.dbPath()
        save(models, path)
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

module.exports = Model