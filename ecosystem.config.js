module.exports = {
    apps: [
        {
            name: "pp_bot",
            exec_mode: "cluster",
            instances: "max",
            script: "./index.js",
            args: "start"
        }
    ]
};
