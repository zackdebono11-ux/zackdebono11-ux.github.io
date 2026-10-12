
 // ==========================================
 // 🌴 JUNGLE HELPER AI TAB
 // ==========================================

const aiTabButton = document.getElementById("aiTabButton");
const aiPanel = document.getElementById("aiPanel");
const aiInput = document.getElementById("aiInput");
const aiSendButton = document.getElementById("aiSendButton");
const aiMessages = document.getElementById("aiMessages");
const aiStatus = document.getElementById("aiStatus");

let aiRunning = false;
let aiSending = false;

// ==========================================
// OPEN / CLOSE AI
// ==========================================

if (aiTabButton && aiPanel) {
    aiTabButton.addEventListener("click", async () => {
        aiPanel.classList.toggle("aiOpen");

        if (aiPanel.classList.contains("aiOpen")) {
            if (aiInput) aiInput.focus();
            if (!aiRunning) await startJungleHelper();
        }
    });
}

// ==========================================
// START JUNGLE HELPER
// ==========================================

async function startJungleHelper() {
    if (aiRunning) return true;

    if (!window.jungleAI) {
        setAIStatus("Offline");
        addAIMessage(
            "system",
            "Jungle Helper is unavailable because the AI bridge is not connected."
        );
        return false;
    }

    setAIStatus("Starting...");

    try {
        const result = await window.jungleAI.start();

        if (!result || !result.success) {
            aiRunning = false;
            setAIStatus("Offline");

            addAIMessage(
                "system",
                "Could not start Jungle Helper: " +
                (result?.error || "Unknown error.")
            );

            return false;
        }

        aiRunning = true;
        setAIStatus("Online");
        return true;

    } catch (error) {
        aiRunning = false;
        setAIStatus("Offline");

        addAIMessage(
            "system",
            "Jungle Helper startup error: " + error.message
        );

        return false;
    }
}

// ==========================================
// SEND MESSAGE
// ==========================================

async function sendAIMessage() {
    if (aiSending || !aiInput || !aiSendButton) return;

    const message = aiInput.value.trim();
    if (!message) return;

    if (!aiRunning) {
        const started = await startJungleHelper();
        if (!started) return;
    }

    aiSending = true;
    addAIMessage("user", message);
    aiInput.value = "";

    aiSendButton.disabled = true;
    aiInput.disabled = true;

    const thinkingMessage = addAIMessage("assistant", "Thinking...");

    try {
        const result = await window.jungleAI.send(message);

        if (thinkingMessage) thinkingMessage.remove();

        if (result && result.success) {
            addAIMessage(
                "assistant",
                result.response || "Jungle Helper returned an empty response."
            );
        } else {
            addAIMessage(
                "system",
                "Jungle Helper error: " +
                (result?.error || "Unknown error.")
            );
        }

    } catch (error) {
        if (thinkingMessage) thinkingMessage.remove();

        addAIMessage(
            "system",
            "AI connection error: " + error.message
        );
    } finally {
        aiSending = false;
        aiSendButton.disabled = false;
        aiInput.disabled = false;
        aiInput.focus();
    }
}

// ==========================================
// SEND BUTTON AND ENTER KEY
// ==========================================

if (aiSendButton) {
    aiSendButton.addEventListener("click", sendAIMessage);
}

if (aiInput) {
    aiInput.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendAIMessage();
        }
    });
}

// ==========================================
// STATUS
// ==========================================

function setAIStatus(status) {
    if (!aiStatus) return;

    aiStatus.textContent = status;

    if (status === "Online") {
        aiStatus.className = "aiStatus online";
    } else if (status === "Starting...") {
        aiStatus.className = "aiStatus starting";
    } else {
        aiStatus.className = "aiStatus offline";
    }
}

// ==========================================
// EXTRACT CODE FROM AI RESPONSE
// ==========================================

function extractCodeBlock(response) {
    const match = response.match(
        /```[^\n]*\n([\s\S]*?)```/
    );

    return match ? match[1].replace(/\n$/, "") : null;
}

// ==========================================
// COPY CODE
// ==========================================

async function copyCode(code, button) {
    try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied!";
    } catch (error) {
        // Fallback for environments without Clipboard API access.
        const temporaryBox = document.createElement("textarea");
        temporaryBox.value = code;
        temporaryBox.style.position = "fixed";
        temporaryBox.style.opacity = "0";

        document.body.appendChild(temporaryBox);
        temporaryBox.select();

        const copied = document.execCommand("copy");
        temporaryBox.remove();

        button.textContent = copied ? "Copied!" : "Copy failed";

        if (!copied) {
            addAIMessage(
                "system",
                "Could not copy automatically. Select the code and copy it manually."
            );
        }
    }
}

// ==========================================
// PREVIEW AND APPLY CODE
// ==========================================

function createCodeActions(message, code) {
    const actions = document.createElement("div");
    actions.className = "aiCodeActions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "aiCodeButton";
    copyButton.textContent = "📋 Copy Code";

    copyButton.addEventListener("click", () => {
        copyCode(code, copyButton);
    });

    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "aiCodeButton";
    previewButton.textContent = "👀 Preview Changes";

    actions.appendChild(copyButton);
    actions.appendChild(previewButton);
    message.appendChild(actions);

    let previewPanel = null;

    previewButton.addEventListener("click", () => {
        if (previewPanel) {
            previewPanel.remove();
            previewPanel = null;
            previewButton.textContent = "👀 Preview Changes";
            return;
        }

        previewPanel = document.createElement("div");
        previewPanel.className = "aiCodePreview";

        const title = document.createElement("strong");
        title.textContent = "Proposed code changes";

        const description = document.createElement("p");
        description.textContent =
            "Review the code below. Applying it replaces the contents of your currently open file.";

        const codePreview = document.createElement("pre");
        codePreview.className = "aiCodePreviewText";
        codePreview.textContent = code;

        const buttons = document.createElement("div");
        buttons.className = "aiCodeActions";

        const applyButton = document.createElement("button");
        applyButton.type = "button";
        applyButton.className = "aiCodeButton";
        applyButton.textContent = "✅ Apply Changes";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "aiCodeButton";
        cancelButton.textContent = "Cancel";

        applyButton.addEventListener("click", () => {
            const editor = window.jungleScriptEditor;

            if (
                !editor ||
                typeof editor.applyCode !== "function"
            ) {
                addAIMessage(
                    "system",
                    "The editor connection is unavailable. Check that script.js loaded correctly."
                );
                return;
            }

            const filename = editor.getCurrentFile();

            if (!confirm(
                `Replace the contents of "${filename}" with the proposed code?`
            )) {
                return;
            }

            const applied = editor.applyCode(code);

            if (applied) {
                addAIMessage(
                    "system",
                    `✅ Applied the proposed code to ${filename}.`
                );

                applyButton.disabled = true;
                applyButton.textContent = "Changes Applied";
            }
        });

        cancelButton.addEventListener("click", () => {
            previewPanel.remove();
            previewPanel = null;
            previewButton.textContent = "👀 Preview Changes";
        });

        buttons.appendChild(applyButton);
        buttons.appendChild(cancelButton);

        previewPanel.appendChild(title);
        previewPanel.appendChild(description);
        previewPanel.appendChild(codePreview);
        previewPanel.appendChild(buttons);

        message.appendChild(previewPanel);
        previewButton.textContent = "Hide Preview";
    });
}

// ==========================================
// DISPLAY MESSAGE
// ==========================================

function addAIMessage(type, text) {
    if (!aiMessages) return null;

    const message = document.createElement("div");
    message.className = "aiMessage aiMessage-" + type;

    const name = document.createElement("div");
    name.className = "aiMessageName";

    if (type === "user") {
        name.textContent = "You";
    } else if (type === "assistant") {
        name.textContent = "🌴 Jungle Helper";
    } else {
        name.textContent = "System";
    }

    const content = document.createElement("div");
    content.className = "aiMessageText";
    content.textContent = text;

    message.appendChild(name);
    message.appendChild(content);

    // Add code tools when the response contains a fenced code block.
    if (type === "assistant") {
        const code = extractCodeBlock(text);

        if (code !== null && code.trim()) {
            createCodeActions(message, code);
        }
    }

    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    return message;
}

// ==========================================
// ELECTRON STATUS EVENTS
// ==========================================

if (window.jungleAI) {
    window.jungleAI.onStatus(status => {
        if (status === "started") {
            aiRunning = true;
            setAIStatus("Online");
        }

        if (status === "stopped") {
            aiRunning = false;
            setAIStatus("Offline");
        }
    });

    window.jungleAI.onOutput(text => {
        if (text) {
            console.log("[Jungle Helper]", text);
        }
    });
}
