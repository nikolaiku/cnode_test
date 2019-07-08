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
        retusn instance
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
}