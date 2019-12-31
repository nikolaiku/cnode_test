var ajaxK = (method, path, data, callback) => {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function () {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}
