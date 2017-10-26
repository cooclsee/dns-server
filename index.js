const dgram = require('dgram')
const packet = require('dns-packet')

const DNSADDRESS = '8.8.8.8'
const DNSPORT = '53'

console.log(`DNS Server: ${DNSADDRESS}:${DNSPORT}`)

dgram.createSocket('udp4', function (msg, rinfo) {
    var server = this
    var client = dgram.createSocket('udp4')
    var address = rinfo.address
    var port = rinfo.port
    client.send(msg, 0, msg.length, DNSPORT, DNSADDRESS)
    var tid = 0
    client.on('message', function (message) {
        if (tid) clearTimeout(tid)
        tid = setTimeout(function() {
            console.log(packet.decode(message))
            tid = 0
            server.send(message, 0, message.length, port, address)
            client.close()
        }, 15)
    })
}).bind(53, '127.0.0.1')