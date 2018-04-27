const webpack = require("webpack");
const config = require("./webpack.config");
const path = require("path");
const MFS = require("memory-fs");
const { createBundleRenderer } = require('vue-server-renderer')

/**
 * 
 * @param {Object} webpackConfig 
 * @returns {Promise<String>}
 */
function build(webpackConfig) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig)
        const mfs = new MFS();
        compiler.outputFileSystem = mfs;
        compiler.run((err, stats) => {
            if (err) { reject(err) }
            if (stats.hasErrors()) { 
                reject(new Error("has errors"));
            } else {
                const bundle = mfs.readFileSync(path.join(__dirname, "dist", "main.js"), "utf-8");
                if (!bundle) {
                    reject(new Error("Couldn't load bundle"));
                }
                resolve(bundle);
            }
        })        
    });
}


build(config)
.then(bundle => {
    const rendererOptions = {
        runInNewContext: false,
    }
    const renderer = createBundleRenderer(bundle, rendererOptions)
    renderer.renderToString({}, (err, html) => {
        if (err) {
            console.error(err);
        } else {
            console.log(html);
        }
    })
})
.catch(error => {
    console.error(error);
})
