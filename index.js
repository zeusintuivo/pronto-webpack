const webpack = require("webpack");
const config = require("./webpack.config");
const path = require("path");
const MFS = require("memory-fs");
const { createBundleRenderer } = require('vue-server-renderer')

const app = `import Vue from 'vue'
import App from './App.vue'

// export a factory function for creating fresh app, router and store
// instances
export function createApp () {
  const app = new Vue({
    // the root instance simply renders the App component.
    render: h => h(App)
  })
  return { app }
}`;

const server = `import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return app
}
`;

const cwd = path.join(__dirname, "src");

/**
 * 
 * @param {Object} webpackConfig 
 * @returns {Promise<String>}
 * @throws {Error[]}
 */
function build(webpackConfig) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig)
        const mfs = new MFS();
        // mfs.mkdirpSync(cwd);
        // mfs.writeFileSync(path.join(cwd, "app.js"), app, "utf-8");
        // mfs.writeFileSync(path.join(cwd, "entry-server.js"), server, "utf-8")
        // compiler.inputFileSystem = mfs;
        compiler.outputFileSystem = mfs;
        compiler.run((err, stats) => {
            if (err) { reject(err) }
            if (stats.hasErrors()) {
                reject(stats.compilation.errors);
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
    .catch(errors => {
        errors.forEach(err => {
            console.error(err);
        });
    })
