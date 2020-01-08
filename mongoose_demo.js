// mongoose 是用来操作 mongodb 的一个工具, 相对裸的 mongodb 驱动,
// mongoose 更加方便, 内置了不少功能
const log = console.log.bind(console)
const mongoose = require('mongoose')
// test 是数据库
// mongoose.connect('mongodb://localhost:27017/test')
mongoose.connect('mongodb://root:Maggieg401447282@106.15.226.201:27017/ku_database')
// 套路, 要用一个 promise 来赋值为 mongoose.Promise, 这样 mongoose 的操作
// 返回的就是 promise, 就不需要用回调的形式
// global 是 node 下面的全局顶层变量, 相当于浏览器里面的 window
mongoose.Promise = global.Promise

var db = mongoose.connection;

db.on('connected', function (res) {
    log('Mongoose >>>>> connection done:' + res)
})

db.on('error', function (err) {
    log('Mongoose >>>>> connection error:' + err)
})


// // name 是指 field 字段, String 是这个字段的类型
// const Cat = mongoose.model('Cat', {
//     name: String,
//     // 也可以写成下面的形式
//     // name: {
//     //     type: String,
//     // },
// })

// const kitty = new Cat({
//     name: 'Zildjian',
// })

// kitty.save().then(() => {
//     log('meow')
// }).catch((error) => {
//     log(error)
// })
// // 也可以换成下面的写法
// kitty.save().then(() => {
//     log('meow')
// }, (error) => {
//     log(error)
// })

// const main = () => {
//     const kittySchema = mongoose.Schema({
//         name: String,
//     })

//     // 用 Schema 的形式来写, 可以在 methods 上面添加一个方法
//     // 所有 new 出来的实例都可以调用这个方法
//     // 相当于 Func.prototype.method = function() {}
//     // 需要注意的是, 这个添加方法的操作一定要在 mongoose.model 之前完成
//     kittySchema.methods.speak = function() {
//         const greeting = this.name ? `Meow name is ${this.name}` : "I don't have a name"
//         // const greeting = this.name ? 'Meow name is' + this.name : "I don't have a name"
//         log('greeting', greeting)
//     }

//     // 数据库的 collection 的名称是 model 后面的那个值决定的
//     // 比如 Kitten -> kittens
//     const Kitten1 = mongoose.model('knife', kittySchema)
//     const silence = new Kitten1({
//         name: 'Silence'
//     })

//     const fluffy = new Kitten1({
//         name: 'fluffy',
//     })
//     log(silence.name)
//     fluffy.speak()

//     const p = new Kitten1({
//         name: 'p1'
//     })
//     p.save().then(() => {
//         log('save 成功')
//     })

//     Kitten1.findOne({
//         name: 'p1',
//     }).then((d) => {
//         log('debug d', d)
//     })
// }

// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// // 其实应该写成下面这样
// db.on('error', () => {
//     console.error('connection error:')
// })
// db.once('open', () => {
//     main()
// })

// // ! 就是取反
// // !function(){}(function(){})
// //
// // 相当于下面的形式
// // var a = function() {
// //     function() {
// //
// //     }
// // }
// //
// // !a