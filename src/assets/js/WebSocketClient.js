exports.init = function (options) {
  console.log(options)
  let connected = false
  let events = {}
  let messageCache = []
  let _ws = ''
  const init = () => {
    this._ws = new window.WebSocket(options.path)
    _ws = this._ws
    this._ws.onopen = (e) => {
      connected = true;
      console.log("连接成功")
      // options._open()
      // options.open.call(this, e)
    }
    this._ws.onmessage = (e) => {
      console.log(e)
      const message = JSON.parse(e.data)
      event('message', message)
      // if (message.id) {
      //   event(message.id, message)
      // } else {
      //   event(message.type, message.data)
      // }
    }
    this._ws.onclose = (e) => {
      connected = false
      options._close()
      options.close.call(this, e)
    }
    this._ws.onerror = (e) => {
      options.error.call(this, e)
    }
  }

  const opt = {
    open () {},
    _open () { sendMessageCache() },
    _close () {
      setTimeout(init, 5000)
    },
    close () {},
    message () {},
    error () {}
  }
  options = {...opt, ...options}

  this.send = (method,data) => {
    console.log(method,data)
    let msg = {method,data}
    sendMsg(msg)
  }

  function sendMessageCache () {
    if (messageCache.length) {
      let msg = messageCache.shift()
      sendMsg(msg)
      sendMessageCache()
    }
  }

  function sendMsg (msg) {
    console.log(msg)
    if (connected) {
      _ws.send(JSON.stringify(msg))
    } else {
      messageCache.push(msg)
    }
  }

  this.request = (data, type) => {
    console.log(data)
    return new Promise((resolve, reject) => {
      try {
        const messageId = type + '_' + new Date().getTime()
        const msg = {data, type, id: messageId}
        console.log(99999)
        this.on(messageId, ({data, error}) => {
          if (error === true) {
            reject(data)
          }
          resolve(data)
          delete events[messageId]
        })
        sendMsg(msg)
      } catch (e) {
        reject(e)
      }
    })
  }

  this.on = (name, fn) => {
    console.log(name)
    if (typeof fn === 'function') {
      if (!events[name]) events[name] = []
      events[name].push(fn)
    }
  }

  this.off = (name, fn) => {
    const eventsArray = events[name]
    if (eventsArray) {
      eventsArray.every(eventFn => {
        if (eventFn === fn) {
          eventsArray.splice(eventsArray.indexOf(eventFn), 1)
          return false
        }
        return true
      })
    }
  }

  function event (name, data) {
    let eventsArray = events[name]
    eventsArray && eventsArray.forEach(fn => fn(data))
  }

  init()
  return this;
}
