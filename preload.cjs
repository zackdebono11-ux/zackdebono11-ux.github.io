// ==========================================
// 🌴 JUNGLESCRIPT ELECTRON PRELOAD
// ==========================================

const {
    contextBridge,
    ipcRenderer
} = require("electron");

// ==========================================
// 🌴 JUNGLE HELPER
// ==========================================

contextBridge.exposeInMainWorld(
    "jungleAI",
    {

        start: () =>
            ipcRenderer.invoke(
                "jungle-ai-start"
            ),

        send: (message) =>
            ipcRenderer.invoke(
                "jungle-ai-send",
                message
            ),

        onOutput: (callback) => {

            ipcRenderer.on(
                "jungle-ai-output",
                (event, text) => {

                    callback(text);
                }
            );
        },

        onStatus: (callback) => {

            ipcRenderer.on(
                "jungle-ai-status",
                (event, status) => {

                    callback(status);
                }
            );
        }
    }
);

contextBridge.exposeInMainWorld("jungleTerminal", {
    start: () =>
        ipcRenderer.invoke("jungle-terminal-start"),

    run: (command) =>
        ipcRenderer.invoke("jungle-terminal-command", command),

    stop: () =>
        ipcRenderer.invoke("jungle-terminal-stop"),

    onOutput: (callback) => {
        const listener = (_event, output) => callback(output);

        ipcRenderer.on("jungle-terminal-output", listener);

        return () => {
    ipcRenderer.removeListener(
        "jungle-terminal-output",
        listener
    );
};
    },

    onStatus: (callback) => {
        const listener = (_event, status) => callback(status);

        ipcRenderer.on("jungle-terminal-status", listener);

        return () => {
            ipcRenderer.removeListener(
                "jungle-terminal-status",
                listener
            );
        };
    }
});
