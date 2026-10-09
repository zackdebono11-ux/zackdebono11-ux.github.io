// ==========================================
// 🌴 JUNGLESCRIPT EDITOR v0.2
// ==========================================


// ==========================================
// 🔗 DOM ELEMENTS
// ==========================================

const codeBox =
    document.getElementById("code");

const runButton =
    document.getElementById("runButton");

const runMenuButton =
    document.getElementById("runMenuButton");

const runMenuOptions =
    document.getElementById("runMenuOptions");

const runCurrentFileButton =
    document.getElementById("runCurrentFileButton");

const runAllFilesButton =
    document.getElementById("runAllFilesButton");

const downloadButton =
    document.getElementById("downloadButton");

const previewOutput =
    document.getElementById("previewOutput");

const consoleOutput =
    document.getElementById("consoleOutput");

const lineNumbers =
    document.getElementById("lineNumbers");

const highlightedCode =
    document.getElementById("highlightedCode");

const fileList =
    document.getElementById("fileList");

const newFileButton =
    document.getElementById("newFileButton");

const assetList =
    document.getElementById("assetList");

const addAssetButton =
    document.getElementById("addAssetButton");

const addUpgradeButton =
    document.getElementById("addUpgradeButton");

const loadCodeButton =
    document.getElementById("loadCodeButton");
    const terminalType = document.getElementById("terminalType");
const terminalOutput = document.getElementById("terminalOutput");
const terminalInput = document.getElementById("terminalInput");
const terminalPrompt = document.getElementById("terminalPrompt");
const clearTerminalButton = document.getElementById("clearTerminalButton");
const minimizeTerminalButton =
    document.getElementById("minimizeTerminalButton");
    


// ==========================================
// 📦 ASSETS
// ==========================================

const assets = {};
// ==========================================
// 🆙 JUNGLESCRIPT UPGRADES
// ==========================================
//
// Upgrade files are stored here for the current
// browser session. EXE files are NEVER executed
// by the Online IDE.
//

const upgrades = {};
window.jungleScriptUpgrades = upgrades;


// ==========================================
// 🎨 THEME SYSTEM
// ==========================================

const themeButtons =
    document.querySelectorAll(
        ".themeButtons button"
    );


function setTheme(theme) {

    document.body.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "junglescript-theme",
        theme
    );


    // Highlight active theme button
    themeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );

    });


    console.log(
        `🎨 Theme changed to: ${theme}`
    );
}


// Jungle is the default theme.
const savedTheme =
    localStorage.getItem(
        "junglescript-theme"
    ) || "jungle";


// Connect theme buttons
themeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            setTheme(
                button.dataset.theme
            );

        }
    );

});


// Apply initial theme
setTheme(savedTheme);


// ==========================================
// 🎵 SHARED AUDIO CONTROLLER
// ==========================================
//
// This allows the editor preview and the
// JungleScript runtime to share the same audio.
//
// runtime/junglescript.js can use:
//
// window.jungleScriptAudio.audio
//
// ==========================================

window.jungleScriptAudio =
    window.jungleScriptAudio || {
        audio: null,
        url: null
    };


// ==========================================
// 📁 FILE SYSTEM
// ==========================================

const files = {
    "main.jls": codeBox
        ? codeBox.value
        : ""
};

let currentFile =
    "main.jls";


// ==========================================
// 🔢 LINE NUMBERS
// ==========================================

function updateLineNumbers() {

    if (!codeBox || !lineNumbers) {
        return;
    }


    const lines =
        codeBox.value.split("\n").length;

    let numbers = "";


    for (
        let i = 1;
        i <= lines;
        i++
    ) {

        numbers +=
            i + "\n";

    }


    lineNumbers.textContent =
        numbers;
}


// ==========================================
// 💾 SAVE CURRENT FILE
// ==========================================

function saveCurrentFile() {

    if (
        !currentFile ||
        !codeBox
    ) {

        return;
    }


    files[currentFile] =
        codeBox.value;
}


// ==========================================
// 🧠 CONSOLE
// ==========================================

function consoleMessage(
    message,
    type = "info"
) {

    if (!consoleOutput) {
        return;
    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        "consoleLine " + type;


    line.textContent =
        "> " + message;


    consoleOutput.appendChild(
        line
    );


    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ==========================================
// 📂 UPDATE ACTIVE FILE
// ==========================================

function updateActiveFile() {

    document
        .querySelectorAll(".file")
        .forEach(file => {

            file.classList.remove(
                "active"
            );

        });


    const selectedFile =
        document.querySelector(
            `[data-file="${CSS.escape(currentFile)}"]`
        );


    if (selectedFile) {

        selectedFile.classList.add(
            "active"
        );

    }


    const currentFileName =
        document.getElementById(
            "currentFileName"
        );


    if (currentFileName) {

        currentFileName.textContent =
            currentFile;

    }
}


// ==========================================
// 📂 OPEN FILE
// ==========================================

function openFile(filename) {

    if (
        !Object.prototype.hasOwnProperty.call(
            files,
            filename
        )
    ) {

        consoleMessage(
            `File "${filename}" does not exist.`,
            "error"
        );

        return;
    }


    saveCurrentFile();


    currentFile =
        filename;


    if (codeBox) {

        codeBox.value =
            files[filename];

    }


    updateLineNumbers();

    updateActiveFile();


    consoleMessage(
        `Opened ${filename}`,
        "success"
    );
}


// ==========================================
// 📜 EXISTING FILES
// ==========================================

document
    .querySelectorAll(".file")
    .forEach(file => {

        file.addEventListener(
            "click",
            () => {

                const filename =
                    file.dataset.file;

                openFile(
                    filename
                );

            }
        );

    });


// ==========================================
// ▶ RUN CURRENT FILE
// ==========================================

async function runCurrentFile() {

    saveCurrentFile();


    const code =
        files[currentFile] || "";


    if (previewOutput) {

        previewOutput.innerHTML =
            "";

    }


    if (consoleOutput) {

        consoleOutput.innerHTML =
            "";

    }


    consoleMessage(
        `🌴 Running ${currentFile}...`,
        "info"
    );


    try {

        const jungle =
            new JungleScriptRuntime(
                assets
            );
            window.jungleScriptRuntime = jungle;


        await jungle.run(
            code
        );


        consoleMessage(
            `✅ ${currentFile} finished.`,
            "success"
        );

    } catch (error) {

        consoleMessage(
            `❌ ${error.message}`,
            "error"
        );


        console.error(
            error
        );

    }
}


// ==========================================
// ▶ RUN ALL FILES
// ==========================================

function runAllFiles() {

    saveCurrentFile();


    if (previewOutput) {

        previewOutput.innerHTML =
            "";

    }


    if (consoleOutput) {

        consoleOutput.innerHTML =
            "";

    }


    consoleMessage(
        "🌴 Running all JungleScript files...",
        "info"
    );


    const filenames =
        Object.keys(files);


    if (
        filenames.length === 0
    ) {

        consoleMessage(
            "No JungleScript files to run.",
            "error"
        );

        return;
    }


    // One runtime for the entire project.
    // This allows runtime state to continue
    // between files.

    const jungle =
        new JungleScriptRuntime(
            assets
        );


    for (
        const filename of filenames
    ) {

        consoleMessage(
            `▶ Running ${filename}`,
            "info"
        );


        try {

            jungle.run(
                files[filename]
            );


            consoleMessage(
                `✅ ${filename} finished.`,
                "success"
            );

        } catch (error) {

            consoleMessage(
                `❌ ${filename}: ${error.message}`,
                "error"
            );


            console.error(
                error
            );

        }

    }


    consoleMessage(
        "🏁 All files finished.",
        "success"
    );
}


// ==========================================
// ▶ MAIN RUN BUTTON
// ==========================================

if (runButton) {

    runButton.addEventListener(
        "click",
        runCurrentFile
    );

}


// ==========================================
// 🔽 RUN MENU
// ==========================================

if (
    runMenuButton &&
    runMenuOptions
) {

    runMenuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            runMenuOptions.classList.toggle(
                "show"
            );

        }
    );

}


// ==========================================
// ▶ RUN CURRENT FROM MENU
// ==========================================

if (runCurrentFileButton) {

    runCurrentFileButton.addEventListener(
        "click",
        () => {

            if (runMenuOptions) {

                runMenuOptions.classList.remove(
                    "show"
                );

            }


            runCurrentFile();

        }
    );

}


// ==========================================
// ▶ RUN ALL FROM MENU
// ==========================================

if (runAllFilesButton) {

    runAllFilesButton.addEventListener(
        "click",
        () => {

            if (runMenuOptions) {

                runMenuOptions.classList.remove(
                    "show"
                );

            }


            runAllFiles();

        }
    );

}
// ==========================================
// ⏹ STOP CURRENT FILE
// ==========================================

if (stopCurrentFileButton) {

    stopCurrentFileButton.addEventListener(
        "click",
        () => {

            if (runMenuOptions) {
                runMenuOptions.classList.remove("show");
            }

            if (window.jungleScriptRuntime) {
                window.jungleScriptRuntime.stopCurrentFile();
            }

        }
    );

}


// ==========================================
// ⏹ STOP ALL
// ==========================================

if (stopAllButton) {

    stopAllButton.addEventListener(
        "click",
        () => {

            if (runMenuOptions) {
                runMenuOptions.classList.remove("show");
            }

            if (window.jungleScriptRuntime) {
                window.jungleScriptRuntime.stopAll();
            }

        }
    );

}


// ==========================================
// 🖱️ CLOSE RUN MENU
// ==========================================

document.addEventListener(
    "click",
    () => {

        if (runMenuOptions) {

            runMenuOptions.classList.remove(
                "show"
            );

        }

    }
);
function downloadJungleFile(filename, content) {
    const blob = new Blob(
        [content],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// ==========================================
// 💾 DOWNLOAD CURRENT FILE
// ==========================================

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        () => {

            saveCurrentFile();


            let filename =
                currentFile;


            if (
                !filename.endsWith(".jls")
            ) {

                filename +=
                    ".jls";

            }


            downloadJungleFile(
                filename,
                files[currentFile]
            );


            consoleMessage(
                `Downloaded ${filename}`,
                "success"
            );

        }
    );

}


// ==========================================
// 📂 LOAD JUNGLESCRIPT CODE
// ==========================================

if (loadCodeButton) {

    loadCodeButton.addEventListener(
        "click",
        () => {

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "file";


            input.accept =
                ".jls";


            input.addEventListener(
                "change",
                () => {

                    const file =
                        input.files[0];


                    if (!file) {
                        return;
                    }


                    if (
                        !file.name
                            .toLowerCase()
                            .endsWith(".jls")
                    ) {

                        consoleMessage(
                            "Only .jls files can be loaded.",
                            "error"
                        );

                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        () => {

                            const code =
                                reader.result;


                            saveCurrentFile();


                            files[file.name] =
                                code;


                            currentFile =
                                file.name;


                            if (codeBox) {

                                codeBox.value =
                                    code;

                            }


                            updateLineNumbers();

                            updateActiveFile();


                            // Add file to explorer
                            if (
                                !document.querySelector(
                                    `[data-file="${CSS.escape(file.name)}"]`
                                )
                            ) {

                                addFileToExplorer(
                                    file.name
                                );

                            }


                            consoleMessage(
                                `📂 Loaded ${file.name}`,
                                "success"
                            );

                        };


                    reader.readAsText(
                        file
                    );

                }
            );


            input.click();

        }
    );

}


// ==========================================
// ➕ ADD FILE TO EXPLORER
// ==========================================

function addFileToExplorer(
    filename
) {

    if (!fileList) {
        return;
    }


    const fileElement =
        document.createElement(
            "div"
        );


    fileElement.className =
        "file";


    fileElement.dataset.file =
        filename;


    const icon =
        document.createElement(
            "span"
        );


    icon.className =
        "fileIcon";


    icon.textContent =
        "📄 ";


    const name =
        document.createElement(
            "span"
        );


    name.textContent =
        filename;


    fileElement.appendChild(
        icon
    );


    fileElement.appendChild(
        name
    );


    fileElement.addEventListener(
        "click",
        () => {

            openFile(
                filename
            );

        }
    );


    fileList.appendChild(
        fileElement
    );
}


// ==========================================
// ➕ NEW FILE
// ==========================================

if (newFileButton) {

    newFileButton.addEventListener(
        "click",
        () => {

            let filename =
                prompt(
                    "Enter a filename:",
                    "newfile.jls"
                );


            if (!filename) {
                return;
            }


            filename =
                filename.trim();


            if (!filename) {
                return;
            }


            if (
                !filename
                    .toLowerCase()
                    .endsWith(".jls")
            ) {

                filename +=
                    ".jls";

            }


            if (
                Object.prototype.hasOwnProperty.call(
                    files,
                    filename
                )
            ) {

                consoleMessage(
                    `File "${filename}" already exists.`,
                    "error"
                );

                return;
            }


            saveCurrentFile();


            files[filename] =
                "";


            addFileToExplorer(
                filename
            );


            consoleMessage(
                `Created ${filename}`,
                "success"
            );


            openFile(
                filename
            );

        }
    );

}


// ==========================================
// 📄 CREATE FILE FROM JUNGLESCRIPT
// ==========================================
//
// Allows:
//
// createFile("game.jls")
//
// ==========================================

function createEditorFile(
    filename
) {

    if (
        Object.prototype.hasOwnProperty.call(
            files,
            filename
        )
    ) {

        consoleMessage(
            `File "${filename}" already exists.`,
            "error"
        );

        return false;
    }


    files[filename] =
        "";


    addFileToExplorer(
        filename
    );


    consoleMessage(
        `Created ${filename}`,
        "success"
    );


    return true;
}


// Make it available to other scripts if needed.
window.createEditorFile =
    createEditorFile;


// ==========================================
// ⌨️ TAB SUPPORT
// ==========================================

if (codeBox) {

    codeBox.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Tab"
            ) {

                return;

            }


            event.preventDefault();


            const start =
                codeBox.selectionStart;

            const end =
                codeBox.selectionEnd;


            codeBox.value =
                codeBox.value.substring(
                    0,
                    start
                ) +
                "    " +
                codeBox.value.substring(
                    end
                );


            codeBox.selectionStart =
                start + 4;


            codeBox.selectionEnd =
                start + 4;


            updateLineNumbers();

            saveCurrentFile();

        }
    );

}


// ==========================================
// ✏️ CODE CHANGES
// ==========================================

if (codeBox) {

    codeBox.addEventListener(
        "input",
        () => {

            updateLineNumbers();

            saveCurrentFile();

        }
    );

}


// ==========================================
// 📜 SYNCHRONIZED SCROLLING
// ==========================================

if (codeBox) {

    codeBox.addEventListener(
        "scroll",
        () => {

            if (lineNumbers) {

                lineNumbers.scrollTop =
                    codeBox.scrollTop;

            }


            if (highlightedCode) {

                highlightedCode.scrollTop =
                    codeBox.scrollTop;


                highlightedCode.scrollLeft =
                    codeBox.scrollLeft;

            }

        }
    );

}


// ==========================================
// 🎵 STOP SHARED AUDIO
// ==========================================

function stopSharedAudio() {

    const controller =
        window.jungleScriptAudio;


    if (
        controller &&
        controller.audio
    ) {

        controller.audio.pause();


        controller.audio.currentTime =
            0;


        if (
            controller.url
        ) {

            URL.revokeObjectURL(
                controller.url
            );

        }


        controller.audio =
            null;


        controller.url =
            null;


        return true;
    }


    return false;
}


// ==========================================
// 🎵 ADD ASSET
// ==========================================

if (addAssetButton) {

    addAssetButton.addEventListener(
        "click",
        () => {

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "file";


            input.accept =
                "*/*";


            input.addEventListener(
                "change",
                () => {

                    const file =
                        input.files[0];


                    if (!file) {
                        return;
                    }


                    assets[file.name] =
                        file;


                    const assetElement =
                        document.createElement(
                            "div"
                        );


                    assetElement.className =
                        "asset";


                    // ==========================================
                    // 🖼️ ASSET ICON
                    // ==========================================

                    const icon =
                        document.createElement(
                            "span"
                        );


                    if (
                        file.type.startsWith(
                            "audio/"
                        )
                    ) {

                        icon.textContent =
                            "🎵 ";

                    } else if (
                        file.type.startsWith(
                            "image/"
                        )
                    ) {

                        icon.textContent =
                            "🖼️ ";

                    } else {

                        icon.textContent =
                            "📄 ";

                    }


                    const name =
                        document.createElement(
                            "span"
                        );


                    name.textContent =
                        file.name;


                    assetElement.appendChild(
                        icon
                    );


                    assetElement.appendChild(
                        name
                    );


                    // ==========================================
                    // 🎵 AUDIO CONTROLS
                    // ==========================================

                    if (
                        file.type.startsWith(
                            "audio/"
                        )
                    ) {

                        let audio =
                            null;


                        let audioURL =
                            null;


                        // ▶ PLAY

                        const playButton =
                            document.createElement(
                                "button"
                            );


                        playButton.className =
                            "toolbarButton";


                        playButton.textContent =
                            "▶";


                        playButton.title =
                            "Play asset";


                        playButton.addEventListener(
                            "click",
                            () => {

                                stopSharedAudio();


                                audioURL =
                                    URL.createObjectURL(
                                        file
                                    );


                                audio =
                                    new Audio(
                                        audioURL
                                    );


                                window
                                    .jungleScriptAudio
                                    .audio =
                                    audio;


                                window
                                    .jungleScriptAudio
                                    .url =
                                    audioURL;


                                audio.play()
                                    .then(
                                        () => {

                                            consoleMessage(
                                                `▶ Playing ${file.name}`,
                                                "success"
                                            );

                                        }
                                    )
                                    .catch(
                                        error => {

                                            consoleMessage(
                                                `❌ Could not play ${file.name}: ${error.message}`,
                                                "error"
                                            );

                                        }
                                    );


                                audio.onended =
                                    () => {

                                        if (
                                            window
                                                .jungleScriptAudio
                                                .audio ===
                                            audio
                                        ) {

                                            window
                                                .jungleScriptAudio
                                                .audio =
                                                null;


                                            if (
                                                window
                                                    .jungleScriptAudio
                                                    .url
                                            ) {

                                                URL.revokeObjectURL(
                                                    window
                                                        .jungleScriptAudio
                                                        .url
                                                );

                                            }


                                            window
                                                .jungleScriptAudio
                                                .url =
                                                null;

                                        }

                                    };

                            }
                        );


                        // ⏹ STOP

                        const stopButton =
                            document.createElement(
                                "button"
                            );


                        stopButton.className =
                            "toolbarButton";


                        stopButton.textContent =
                            "⏹";


                        stopButton.title =
                            "Stop asset";


                        stopButton.addEventListener(
                            "click",
                            () => {

                                if (
                                    audio &&
                                    !audio.paused
                                ) {

                                    stopSharedAudio();


                                    consoleMessage(
                                        `⏹ Stopped ${file.name}`,
                                        "info"
                                    );

                                } else {

                                    consoleMessage(
                                        `⏹ ${file.name} is not playing.`,
                                        "info"
                                    );

                                }

                            }
                        );


                        assetElement.appendChild(
                            playButton
                        );


                        assetElement.appendChild(
                            stopButton
                        );

                    }


                    // ==========================================
                    // 📋 GRAB ASSET
                    // ==========================================

                    const grabButton =
                        document.createElement(
                            "button"
                        );


                    grabButton.className =
                        "toolbarButton";


                    grabButton.textContent =
                        "Grab";


                    grabButton.title =
                        "Insert grabAsset()";


                    grabButton.addEventListener(
                        "click",
                        () => {

                            if (!codeBox) {
                                return;
                            }


                            const command =
                                `grabAsset("${file.name}")`;


                            const start =
                                codeBox.selectionStart;


                            const end =
                                codeBox.selectionEnd;


                            const before =
                                codeBox.value.substring(
                                    0,
                                    start
                                );


                            const after =
                                codeBox.value.substring(
                                    end
                                );


                            const needsNewLineBefore =
                                before.length > 0 &&
                                !before.endsWith(
                                    "\n"
                                );


                            const needsNewLineAfter =
                                after.length > 0 &&
                                !after.startsWith(
                                    "\n"
                                );


                            const insertedCommand =
                                (
                                    needsNewLineBefore
                                        ? "\n"
                                        : ""
                                ) +
                                command +
                                (
                                    needsNewLineAfter
                                        ? "\n"
                                        : ""
                                );


                            codeBox.value =
                                before +
                                insertedCommand +
                                after;


                            const newCursorPosition =
                                before.length +
                                insertedCommand.length;


                            codeBox.selectionStart =
                                newCursorPosition;


                            codeBox.selectionEnd =
                                newCursorPosition;


                            updateLineNumbers();

                            saveCurrentFile();

                            codeBox.focus();


                            consoleMessage(
                                `Inserted grabAsset("${file.name}")`,
                                "success"
                            );

                        }
                    );


                    assetElement.appendChild(
                        grabButton
                    );


                    // ==========================================
                    // 📦 ADD ASSET TO LIST
                    // ==========================================

                    if (assetList) {

                        assetList.appendChild(
                            assetElement
                        );

                    }


                    consoleMessage(
                        `Added asset: ${file.name}`,
                        "success"
                    );

                }
            );


            input.click();

        }
    );

}



// ==========================================
// 🆙 ADD UPGRADE
// ==========================================
//
// The Online IDE can REGISTER an EXE upgrade,
// but it never executes the EXE.
//

if (addUpgradeButton) {

    addUpgradeButton.addEventListener(
        "click",
        () => {

            const input =
                document.createElement("input");

            input.type = "file";

            // Supported JungleScript upgrade files
            input.accept = ".exe,.jdksu,.msi,.bat,.cmd,.sh,.app,.jar,.py,.pl,.rb,.php,.js,.ts,.go,.rs,.c,.cpp,.h,.cs,.swift,.kt,.kts,.lua,.r,.jl,.dart,.vbs,.ps1,.psm1,.psd1,.psd1,.psm1,.ps1xml,.psc1,.psc2,.pssc,.psrc,.psrc.xml,.psd1,.psm1,.ps1xml,.psc1,.psc2,.pssc,.psrc,.psrc.xml,.psd1,.psm1,.ps1xml,.psc1,.psc2,.pssc,.psrc,.psrc.xml";

            input.addEventListener(
                "change",
                () => {

                    const file =
                        input.files[0];

                    if (!file) {
                        return;
                    }

                    const name =
                        file.name.toLowerCase();

                    const isExe =
                        name.endsWith(".exe");

                    const isJDKSU =
                        name.endsWith(".jdksu");

                    if (!isExe && !isJDKSU) {

                        consoleMessage(
                            "❌ Only .exe and .jdksu upgrade files are allowed.",
                            "error"
                        );

                        return;
                    }

                    // Store the upgrade in memory.
                    upgrades[file.name] = file;

if (
    window.jungleElectron &&
    typeof window.jungleElectron.getFilePath ===
        "function"
) {

    try {

        const filePath =
            window.jungleElectron.getFilePath(
                file
            );

        upgrades[file.name].junglePath =
            filePath;

        console.log(
            `📍 Upgrade path: ${filePath}`
        );

    } catch (error) {

        console.error(
            "❌ Could not get upgrade path:",
            error
        );

    }

}
                    consoleMessage(
                        `🆙 Upgrade registered: ${file.name}`,
                        "success"
                    );

                    consoleMessage(
                        `📦 Size: ${file.size.toLocaleString()} bytes`,
                        "info"
                    );

                    consoleMessage(
                        `📄 Type: ${file.type || "unknown"}`,
                        "info"
                    );

                    consoleMessage(
                        "🔒 EXE execution is disabled in the Online IDE.",
                        "info"
                    );

                    const upgradeElement =
                        document.createElement("div");

                    upgradeElement.className =
                        "asset upgradeAsset";

                    // ==========================================
                    // ICON
                    // ==========================================

                    const icon =
                        document.createElement("span");

                    icon.textContent =
                        isExe
                            ? "🖥️ "
                            : "🆙 ";

                    upgradeElement.appendChild(icon);

                    // ==========================================
                    // NAME
                    // ==========================================

                    const nameElement =
                        document.createElement("span");

                    nameElement.textContent =
                        file.name;

                    upgradeElement.appendChild(
                        nameElement
                    );

                    // ==========================================
                    // STATUS
                    // ==========================================

                    const status =
                        document.createElement("span");

                    status.textContent =
                        " • Registered";

                    status.style.opacity = "0.7";

                    upgradeElement.appendChild(
                        status
                    );

                    // ==========================================
                    // INFO BUTTON
                    // ==========================================

                    const infoButton =
                        document.createElement("button");

                    infoButton.className =
                        "toolbarButton";

                    infoButton.textContent =
                        "Info";

                    infoButton.title =
                        "Show upgrade information";

                    infoButton.addEventListener(
                        "click",
                        () => {

                            consoleMessage(
                                `🆙 Upgrade: ${file.name}`,
                                "info"
                            );

                            consoleMessage(
                                `📦 Size: ${file.size.toLocaleString()} bytes`,
                                "info"
                            );

                            consoleMessage(
                                `🔒 Status: Registered, not executed`,
                                "info"
                            );

                        }
                    );

                    upgradeElement.appendChild(
                        infoButton
                    );

                    // ==========================================
                    // ADD TO ASSET/UPGRADE LIST
                    // ==========================================

                    if (assetList) {

                        assetList.appendChild(
                            upgradeElement
                        );

                    }

                }
            );

            input.click();

        }
    );

}
// ==========================================
// 🟣 CLOJURE BRIDGE TEST
// ==========================================

async function testClojureBridge() {

    if (
        !window.jungleElectron
    ) {

        console.log(
            "❌ JungleScript is not running inside Electron."
        );

        return;
    }


    if (
        typeof window
            .jungleElectron
            .runClojure !==
        "function"
    ) {

        console.log(
            "❌ Clojure bridge is not available."
        );

        return;
    }


    try {

        const result =
            await window
                .jungleElectron
                .runClojure(
                    '(println "Hello from JungleScript!")'
                );


        console.log(
            "🟣 Clojure result:",
            result
        );

    } catch (error) {

        console.error(
            "❌ Clojure bridge error:",
            error
        );

    }

}


// ==========================================
// 🚀 STARTUP
// ==========================================

updateLineNumbers();

updateActiveFile();


consoleMessage(
    "🌴 JungleScript ready!",
    "success"
);


console.log(
    "🌴 JungleScript v0.2 loaded!"
);



// ==========================================
// 🧪 TEST ELECTRON BRIDGE
// ==========================================

testClojureBridge();
// ==========================================
// 🌋 ONLINE TERMINAL
// ==========================================

let currentTerminalType = "jungle";
let terminalDirectory = "C:\\JungleScript";

function terminalPrint(text, type = "result") {
    if (!terminalOutput) return;

    const line = document.createElement("div");
    line.className = `terminal-line terminal-${type}`;
    line.textContent = text;

    terminalOutput.appendChild(line);

    const terminal = document.getElementById("onlineTerminal");

    if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
    }
}

function updateTerminalPrompt() {
    if (!terminalPrompt) return;

    if (currentTerminalType === "jungle") {
        terminalPrompt.textContent = "JLS>";
    } else {
        terminalPrompt.textContent = `PS ${terminalDirectory}>`;
    }
}

function printTerminalCommand(command) {
    const prompt =
        currentTerminalType === "jungle"
            ? "JLS>"
            : `PS ${terminalDirectory}>`;

    terminalPrint(`${prompt} ${command}`, "command");
}

function runJungleTerminalCommand(command) {
    switch (command) {
        case "":
            return;

        case "help":
            terminalPrint("🌋 JungleScript Terminal commands:");
            terminalPrint("  help              Show available commands");
            terminalPrint("  version           Show JungleScript version");
            terminalPrint("  modules           Show available modules");
            terminalPrint("  assets            Show project assets");
            terminalPrint("  run <file>        Run a JungleScript file");
            terminalPrint("  clear             Clear terminal");
            terminalPrint("  owner             Show the JungleScript owner");
            terminalPrint("  youtube           Show the YouTube channel");
            terminalPrint("  exit              Close terminal mode");
            break;

        case "version":
            terminalPrint("JungleScript v1.0", "success");
            break;

        case "owner":
            terminalPrint("🌴 JungleScript Owner");
            terminalPrint("Created by zackdebono11-ux on github");
            break;

        case "my youtube":
            terminalPrint("📺 YouTube");
            terminalPrint("https://www.youtube.com/@JUNGLESCRIPT");
            break;

        case "modules":
            terminalPrint("📦 Available modules:");
            terminalPrint("  JungleWeb");
            terminalPrint("  JungleGame");
            terminalPrint("  JungleOS");
            break;

        case "assets":
            terminalPrint("📁 Project assets:");

            const assetNames = Object.keys(
                typeof assets !== "undefined" ? assets : {}
            );

            if (assetNames.length === 0) {
                terminalPrint("  No assets loaded.");
            } else {
                assetNames.forEach(name => {
                    terminalPrint(`  ${name}`);
                });
            }

            break;

        case "clear":
            clearOnlineTerminal();
            break;

        case "exit":
            terminalPrint("🌴 Terminal remains open. Use the dropdown to switch modes.");
            break;

        default:
            if (command.startsWith("run ")) {
                const fileName = command.substring(4).trim();

                if (!fileName) {
                    terminalPrint("❌ Please specify a file.", "error");
                    return;
                }

                if (typeof files !== "undefined" && files[fileName] !== undefined) {
                    terminalPrint(`▶ Running ${fileName}...`, "info");

                    if (typeof runCurrentFile === "function") {
                        const oldFile = currentFile;

                        currentFile = fileName;

                        Promise.resolve(runCurrentFile())
                            .then(() => {
                                terminalPrint(`✅ ${fileName} finished.`, "success");
                                currentFile = oldFile;
                            })
                            .catch(error => {
                                terminalPrint(`❌ ${error.message}`, "error");
                                currentFile = oldFile;
                            });
                    } else {
                        terminalPrint("❌ JungleScript runtime is unavailable.", "error");
                    }
                } else {
                    terminalPrint(`❌ File "${fileName}" was not found.`, "error");
                }

                return;
            }

            terminalPrint(
                `❌ Unknown JungleScript command: ${command}`,
                "error"
            );
            terminalPrint("Type 'help' for available commands.");
    }
}
if (minimizeTerminalButton) {
    minimizeTerminalButton.addEventListener("click", () => {
        const terminalPanel =
            document.querySelector(".terminal-panel");

        if (!terminalPanel) return;

        terminalPanel.classList.toggle("minimized");

        if (terminalPanel.classList.contains("minimized")) {
            minimizeTerminalButton.textContent = "^";
            minimizeTerminalButton.title = "Restore terminal";
        } else {
            minimizeTerminalButton.textContent = "v";
            minimizeTerminalButton.title = "Minimize terminal";

            if (terminalInput) {
                terminalInput.focus();
            }
        }
    });
}

function runNormalTerminalCommand(command) {
    switch (command) {
        case "":
            return;

        case "help":
            terminalPrint("🖥️ Normal Terminal commands:");
            terminalPrint("  help       Show available commands");
            terminalPrint("  pwd        Show current directory");
            terminalPrint("  dir        List project files");
            terminalPrint("  cls        Clear terminal");
            terminalPrint("  clear      Clear terminal");
            terminalPrint("  whoami     Show current user");
            terminalPrint("  cd <path>  Change virtual directory");
            terminalPrint("  exit       Leave Normal mode");
            break;

        case "pwd":
            terminalPrint(terminalDirectory);
            break;

        case "dir":
            terminalPrint("");
            terminalPrint(`    Directory: ${terminalDirectory}`);
            terminalPrint("");
            terminalPrint("Mode        Name");
            terminalPrint("----        ----");
            terminalPrint("d----       OnlineTerminal");
            terminalPrint("d----       runtime");
            terminalPrint("d----       GameBuilder");
            terminalPrint("d----       jungleGame");
            terminalPrint("-a---       editor.html");
            terminalPrint("-a---       script.js");
            terminalPrint("-a---       style.css");
            break;

        case "whoami":
            terminalPrint("JungleScript Online User");
            break;

        case "cls":
        case "clear":
            clearOnlineTerminal();
            break;

        case "exit":
            terminalPrint("🖥️ Normal terminal mode remains available.");
            break;

        default:
            if (command.startsWith("cd ")) {
                const newDirectory = command.substring(3).trim();

                if (!newDirectory) {
                    terminalPrint("❌ Please specify a directory.", "error");
                } else {
                    terminalDirectory = newDirectory;
                    updateTerminalPrompt();
                }

                return;
            }

            terminalPrint(
                `'${command}' is not available in the Online Terminal.`,
                "error"
            );
            terminalPrint("Type 'help' to see supported commands.");
    }
}

function executeOnlineTerminalCommand(command) {
    printTerminalCommand(command);

    if (currentTerminalType === "jungle") {
        runJungleTerminalCommand(command);
    } else {
        runNormalTerminalCommand(command);
    }
}

function clearOnlineTerminal() {
    if (terminalOutput) {
        terminalOutput.innerHTML = "";
    }
}

if (terminalInput) {
    terminalInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            const command = terminalInput.value.trim();

            terminalInput.value = "";

            executeOnlineTerminalCommand(command);
        }
    });
}

if (terminalType) {
    terminalType.addEventListener("change", () => {
        currentTerminalType = terminalType.value;

        updateTerminalPrompt();

        terminalPrint(
            currentTerminalType === "jungle"
                ? "🌋 Switched to Jungle Terminal."
                : "🖥️ Switched to Normal Terminal.",
            "info"
        );

        if (terminalInput) {
            terminalInput.focus();
        }
    });
}

if (clearTerminalButton) {
    clearTerminalButton.addEventListener("click", () => {
        clearOnlineTerminal();

        if (terminalInput) {
            terminalInput.focus();
        }
    });
}
// ==========================================
// 🌴 JUNGLESCRIPT SYNTAX HIGHLIGHTING
// ==========================================

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function highlightJungleScript(source) {
    if (!source) {
        return "";
    }

    let html = escapeHtml(source);

    // Comments
    html = html.replace(
        /(\/\/.*)/g,
        '<span class="syntax-comment">$1</span>'
    );

    // Strings
    html = html.replace(
        /(&quot;.*?&quot;)/g,
        '<span class="syntax-string">$1</span>'
    );

    // JungleScript functions
    html = html.replace(
        /\b(file_name|use|page|heading|text|button|download|createFile|uploadcomputerdata)\b/g,
        '<span class="syntax-function">$1</span>'
    );

    // JungleScript modules
    html = html.replace(
        /\b(JungleWeb|JungleGame|JungleOS)\b/g,
        '<span class="syntax-module">$1</span>'
    );

    // Numbers
    html = html.replace(
        /\b\d+(\.\d+)?\b/g,
        '<span class="syntax-number">$&</span>'
    );

    return html;
}

function updateSyntaxHighlighting() {
    if (!codeBox || !highlightedCode) {
        return;
    }

    highlightedCode.innerHTML =
        highlightJungleScript(codeBox.value) + "\n";
}
if (codeBox) {
    codeBox.addEventListener("input", updateSyntaxHighlighting);
}
updateSyntaxHighlighting();

updateTerminalPrompt();

if (terminalOutput) {
    terminalPrint("🌴 JungleScript Online Terminal", "success");
    terminalPrint("Type 'help' to get started.");
}