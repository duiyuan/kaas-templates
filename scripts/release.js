const fs = require('fs')
const archiver = require('archiver')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const ChromeExtension = require('crx')

const paths = require('./paths')
const argv = yargs(hideBin(process.argv)).argv
const { resolveApp } = require('./tools/utils')
const { errorlog, successlog, infolog, warnlog } = require('./tools/logger')

const { appBuild } = paths
const crx = new ChromeExtension()
const filename = 'wallet'

async function start() {
  const source = resolveApp(appBuild)
  const type = argv.type

  return type === 'zip' ? packZip(source) : packCrx(source)
}

function packZip(source) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(resolveApp(filename + '.zip'))
    const archive = archiver('zip', {
      // Sets the compression level.
      zlib: { level: 9 },
    })

    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
      infolog(archive.pointer() + ' total bytes')
      infolog(
        'archiver has been finalized and the output file descriptor has closed.'
      )
      resolve()
    })

    // This event is fired when the source source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
      infolog('Data has been drained')
    })

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        // log warning
        warnlog(err)
      } else {
        // throw error
        throw err
      }
    })

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      reject(err)
    })

    // pipe archive data to the file
    archive.pipe(output)

    // append files from dist
    archive.directory('dist/', false)

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize()
  })
}

async function packCrx(source) {
  const packer = await crx.load(source)
  const buffer = await packer.pack()
  const updateXML = crx.generateUpdateXML()

  fs.writeFileSync(resolveApp('update.xml'), updateXML)
  fs.writeFileSync(resolveApp(filename + '.crx'), buffer)

  successlog('Packed successfuly')
}

start().catch((err) => {
  errorlog('Pack failed: ' + err)
})
