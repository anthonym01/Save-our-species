const fs = require('fs');

module.exports = {
    write_file: async function write_file(filepath, data) {//write file to file system
        fs.writeFile(filepath, data, 'utf8', (err) => {
            if (err) {
                console.warn("An error occurred creating the file" + err.message)
            } else {
                console.log("Wrote: ", data, " to: ", filepath);
            }
        })
    }
}