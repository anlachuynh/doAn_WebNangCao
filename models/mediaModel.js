// Đại diện các tệp đa phương tiện
const mongoose = require('mongoose')
const MediaSchema = mongoose.Schema({
    originalname: {type: String, default: ''},
    uri: {type: String, required: true},
    type: {type: String, required: true, default: 'image'},
    timeStamp: {type: Date, default: Date.now()},
})

const fs = require('fs')
const path = require('path')
MediaSchema.pre('insertMany', function(next, document){
    document = document.map(doc => {
        let newDir = path.join(__dirname, '..', 'FileUpload', `${doc.user}`)
        if(!fs.existsSync(newDir)){
            fs.mkdirSync(newDir)
        }
        let newPath = path.join(newDir, doc.originalname)
        let name = doc.originalname.replace(/\.\w+$/ig, '')
        let ext = doc.originalname.match(/\.\w+$/ig)
        let i = 1
        while(fs.existsSync(newPath)){
            newPath = path.join(newDir, `${name}(${i})${ext}`)
            i++
        }
        fs.renameSync(doc.uri, newPath)
        doc.uri = newPath
        return doc
    })
    next()
})

const Media = mongoose.model('Media', MediaSchema)

module.exports = Media