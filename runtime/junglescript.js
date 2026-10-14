// ==========================================
// 🌴 JUNGLESCRIPT RUNTIME v1.0
// ==========================================

class JungleScriptRuntime {

    constructor(assets = {}) {

        // ==========================================
        // 📦 RUNTIME STATE
        // ==========================================

        this.modules = new Set();
        this.assets = assets;

        this.currentAudio = null;

        this.variables = {};
        this.functions = {};
        this.pathHandlers = {};
        this.stopRequested = false;
this.currentFileRunning = false;

        this.gameRuntime = null;
        this.game3D = null;
        this.serverSize = 200;
this.serverRunning = false;

        this.outputElement = null;
        this.html = null;

        console.log(
            "🌴 JungleScript Runtime v1.0 loaded!"
        );

    }


    // ==========================================
    // ▶ RUN PROGRAM
    // ==========================================

   async run(code) {

    if (typeof code !== "string") {

        this.error(
            0,
            "Program must be text."
        );

        return;

    }

    // ==========================================
    // ▶ START PROGRAM
    // ==========================================

    this.stopRequested = false;
    this.currentFileRunning = true;

    const lines =
        code.split("\n");

    try {

        await this.executeBlock(
            lines,
            0,
            lines.length
        );

    } finally {

        this.currentFileRunning = false;

    }

}
// ==========================================
// ⏹ STOP CURRENT FILE
// ==========================================

stopCurrentFile() {

    if (!this.currentFileRunning) {

        console.log(
            "⏹️ No JungleScript file is currently running."
        );

        return;

    }

    this.stopRequested = true;

    console.log(
        "⏹️ Current JungleScript file stopped."
    );

    // Stop currently playing audio
    if (this.currentAudio) {

        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;

    }

}


// ==========================================
// ⏹ STOP ALL
// ==========================================

stopAll() {

    this.stopRequested = true;

    this.currentFileRunning = false;

    // Stop currently playing audio
    if (this.currentAudio) {

        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;

    }

    // Stop game runtime if available
    if (this.gameRuntime) {

        if (
            typeof this.gameRuntime.stop === "function"
        ) {

            this.gameRuntime.stop();

        }

        this.gameRuntime = null;

    }

    // Stop 3D runtime if available
    if (this.game3D) {

        if (
            typeof this.game3D.stop === "function"
        ) {

            this.game3D.stop();

        }

        this.game3D = null;

    }

    console.log(
        "⏹️ All JungleScript execution stopped."
    );

}


    // ==========================================
    // 🧠 EXECUTE BLOCK
    // ==========================================

   async executeBlock(lines, start, end) {
            // ==========================================
        // ⏹ STOP REQUEST
        // ==========================================

        if (this.stopRequested) {
            return;
        }

    let i = start;

    while (i < end) {
         if (this.stopRequested) {
        return;
    }
     // Give the browser time to process buttons/events
    await new Promise(resolve => setTimeout(resolve, 0));

    if (this.stopRequested) {
        return;
    }

      
        let line =
            lines[i].trim();

        const lineNumber =
            i + 1;
            // ------------------------------------------
            // EMPTY LINE
            // ------------------------------------------

            if (line === "") {

                i++;

                continue;

            }


            // ------------------------------------------
            // COMMENTS
            // ------------------------------------------

            if (
                line.startsWith("//") ||
                line.startsWith("#")
            ) {

                i++;

                continue;

            }




// ------------------------------------------
// IF / ELSE IF / ELSE
// ------------------------------------------

if (line.startsWith("if ")) {

    const result =
        await this.findIfBlock(
            lines,
            i
        );

    if (!result) {

        this.error(
            lineNumber,
            'Missing "end" for if statement.'
        );

        return;

    }

    const condition =
        line
            .substring(3)
            .trim();

    let executed = false;

    // First IF
    if (
        this.evaluateCondition(
            condition
        )
    ) {

       await this.executeBlock(
            lines,
            i + 1,
            result.elseIfs.length > 0
                ? result.elseIfs[0].index
                : result.elseIndex !== -1
                    ? result.elseIndex
                    : result.end
        );

        executed = true;

    }

    // ELSE IF
    if (!executed) {

        for (
            let j = 0;
            j < result.elseIfs.length;
            j++
        ) {

            const current =
                result.elseIfs[j];

            if (
                this.evaluateCondition(
                    current.condition
                )
            ) {

                const next =
                    j + 1 <
                    result.elseIfs.length
                        ? result.elseIfs[j + 1].index
                        : result.elseIndex !== -1
                            ? result.elseIndex
                            : result.end;

                await this.executeBlock(
                    lines,
                    current.index + 1,
                    next
                );

                executed = true;
                break;

            }

        }

    }

    // ELSE
    if (
        !executed &&
        result.elseIndex !== -1
    ) {

        await this.executeBlock(
            lines,
            result.elseIndex + 1,
            result.end
        );

    }

    i =
        result.end + 1;

    continue;

}
// ------------------------------------------
// 🔁 REPEAT LOOP
// ------------------------------------------

if (line.startsWith("repeat ")) {

    const countExpression =
        line.substring(7).trim();

    const count =
        this.evaluateExpression(
            countExpression
        );

    const result =
        this.findBlock(
            lines,
            i,
            "repeat"
        );

    if (!result) {

        this.error(
            lineNumber,
            'Missing "end" for repeat loop.'
        );

        return;

    }

    if (
        typeof count !== "number" ||
        !Number.isFinite(count)
    ) {

        this.error(
            lineNumber,
            "Repeat count must be a number."
        );

        i =
            result.end + 1;

        continue;

    }

    const repetitions =
        Math.max(
            0,
            Math.floor(count)
        );

    for (
        let repeatIndex = 0;
        repeatIndex < repetitions;
        repeatIndex++
        
    ) {
                if (this.stopRequested) {
            return;
        }

        this.variables.repeatIndex =
            repeatIndex + 1;

        await this.executeBlock(
            lines,
            i + 1,
            result.end
        );
        if (this.breakRequested) {
            this.breakRequested = false;
            break;
        }

    }

    i =
        result.end + 1;

    continue;

}
// ------------------------------------------
// 🔄 WHILE LOOP
// ------------------------------------------



if (line.startsWith("while ")) {

    const condition =
        line.substring(6).trim();

    const result =
        this.findBlock(
            lines,
            i,
            "while"
        );

    if (!result) {

        this.error(
            lineNumber,
            'Missing "end" for while loop.'
        );

        return;

    }

    let iterations = 0;
    const MAX_ITERATIONS = 10000;

    while (
        this.evaluateCondition(condition)
    ) {
           if (this.stopRequested) {
        return;
    }

        if (iterations >= MAX_ITERATIONS) {

            this.error(
                lineNumber,
                `While loop exceeded ${MAX_ITERATIONS} iterations.`
            );

            break;

        }

        this.variables.whileIndex =
            iterations + 1;

        this.breakRequested = false;

       await this.executeBlock(
            lines,
            i + 1,
            result.end
        );
        await new Promise(
    resolve => setTimeout(resolve, 0)
);

        if (this.breakRequested) {

            this.breakRequested = false;

            break;

        }

        iterations++;

    }

    i =
        result.end + 1;

    continue;

}
// ==========================================
// 🛤️ ON PATH BLOCK
// ==========================================

if (line.startsWith("onPath(")) {

    const match =
        line.match(
            /^onPath\(["'](.+)["']\)$/
        );

    if (!match) {

        this.error(
            lineNumber,
            'Invalid onPath() syntax.'
        );

        return;

    }

    const pathName =
        match[1];

    const result =
        this.findBlock(
            lines,
            i,
            "onPath"
        );

    if (!result) {

        this.error(
            lineNumber,
            'Missing "end" for onPath.'
        );

        return;

    }

    this.pathHandlers[pathName] =
        lines.slice(
            i + 1,
            result.end
        );

    console.log(
        `🛤️ Path handler created: ${pathName}`
    );

    i =
        result.end + 1;

    continue;

}

            // ------------------------------------------
            // FUNCTION
            // ------------------------------------------

            if (
                line.startsWith("function ")
            ) {

                const match =
                    line.match(
                        /^function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)$/
                    );

                if (!match) {

                    this.error(
                        lineNumber,
                        "Invalid function syntax."
                    );

                    i++;

                    continue;

                }

                const name =
                    match[1];

                const parameters =
                    match[2]
                        .split(",")
                        .map(
                            value =>
                                value.trim()
                        )
                        .filter(Boolean);

                const result =
                    this.findBlock(
                        lines,
                        i,
                        "function"
                    );

                if (!result) {

                    this.error(
                        lineNumber,
                        'Missing "end" for function.'
                    );

                    return;

                }

                this.functions[name] = {

                    parameters,

                    lines:
                        lines.slice(
                            i + 1,
                            result.end
                        )

                };

                console.log(
                    `🧩 Function created: ${name}()`
                );

                i =
                    result.end + 1;

                continue;

            }


            // ------------------------------------------
            // UNEXPECTED END
            // ------------------------------------------

            if (line === "end") {

                this.error(
                    lineNumber,
                    '"end" does not have a matching block.'
                );

                i++;

                continue;

            }


            // ------------------------------------------
            // NORMAL COMMAND
            // ------------------------------------------

           await this.executeLine(
                line,
                lineNumber
            );

            i++;

        }

    }


    // ==========================================
    // 🔎 FIND BLOCK
    // ==========================================

    findBlock(lines, start, type) {

    let depth = 1;

    for (let i = start + 1; i < lines.length; i++) {

        const line = lines[i].trim();

        // Any block-opening command increases depth
        if (
            line.startsWith("if ") ||
            line.startsWith("function ") ||
            line.startsWith("repeat ") ||
            line.startsWith("while ") || 
            line.startsWith("onPath(") 
        ) {
            depth++;
        }

        // Any "end" closes one block
        if (line === "end") {

            depth--;

            if (depth === 0) {
                return {
                    end: i
                };
            }
        }
    }

    return null;
}

// ==========================================
// 🔎 FIND IF / ELSE IF / ELSE BLOCK
// ==========================================

findIfBlock(lines, start) {

    let depth = 1;
    let elseIndex = -1;
    let elseIfs = [];

    let i = start + 1;

    while (i < lines.length) {

        const line =
            lines[i].trim();

        // Nested if
        if (line.startsWith("if ")) {
            depth++;
        }

        // End
        if (line === "end") {

            depth--;

            if (depth === 0) {

                return {
                    end: i,
                    elseIndex,
                    elseIfs
                };

            }

        }

        // else if / elif
        if (
            depth === 1 &&
            (
                line.startsWith("else if ") ||
                line.startsWith("elif ")
            )
        ) {

            const condition =
                line.startsWith("else if ")
                    ? line.substring(8).trim()
                    : line.substring(5).trim();

            elseIfs.push({
                index: i,
                condition
            });

        }

        // else
        if (
            depth === 1 &&
            line === "else"
        ) {

            elseIndex = i;

        }

        i++;

    }

    return null;

}


    // ==========================================
    // 🧠 EVALUATE CONDITION
    // ==========================================

    evaluateCondition(condition) {

        const value =
            this.evaluateExpression(
                condition
            );

        return Boolean(value);

    }


    // ==========================================
    // 🧮 EVALUATE EXPRESSION
    // ==========================================

    evaluateExpression(expression) {

        expression =
            expression.trim();


        // ------------------------------------------
        // BOOLEAN
        // ------------------------------------------

        if (expression === "true") {
            return true;
        }

        if (expression === "false") {
            return false;
        }


        // ------------------------------------------
        // NULL
        // ------------------------------------------

        if (expression === "null") {
            return null;
        }


        // ------------------------------------------
        // RANDOM
        // ------------------------------------------

        if (expression === "random") {

            return Math.floor(
                Math.random() * 100
            ) + 1;

        }


        // ------------------------------------------
        // STRING
        // ------------------------------------------

        if (
            expression.startsWith('"') &&
            expression.endsWith('"')
        ) {

            return expression.slice(
                1,
                -1
            );

        }

        if (
            expression.startsWith("'") &&
            expression.endsWith("'")
        ) {

            return expression.slice(
                1,
                -1
            );

        }


        // ------------------------------------------
        // NUMBER
        // ------------------------------------------

        if (
            /^-?\d+(?:\.\d+)?$/.test(
                expression
            )
        ) {

            return Number(
                expression
            );

        }


        // ------------------------------------------
        // VARIABLE
        // ------------------------------------------

        if (
            Object.prototype.hasOwnProperty.call(
                this.variables,
                expression
            )
        ) {

            return this.variables[
                expression
            ];

        }


        // ------------------------------------------
        // COMPARISONS
        // ------------------------------------------

        const comparison =
            this.findOperator(
                expression,
                [
                    "===",
                    "!==",
                    ">=",
                    "<=",
                    "==",
                    "!=",
                    ">",
                    "<"
                ]
            );

        if (comparison) {

            const left =
                this.evaluateExpression(
                    comparison.left
                );

            const right =
                this.evaluateExpression(
                    comparison.right
                );

            switch (comparison.operator) {

                case "===":
                case "==":
                    return left === right;

                case "!==":
                case "!=":
                    return left !== right;

                case ">":
                    return left > right;

                case "<":
                    return left < right;

                case ">=":
                    return left >= right;

                case "<=":
                    return left <= right;

            }

        }


        // ------------------------------------------
        // LOGICAL OPERATORS
        // ------------------------------------------

        const orParts =
            this.splitOperator(
                expression,
                " or "
            );

        if (orParts.length > 1) {

            return orParts.some(
                part =>
                    Boolean(
                        this.evaluateExpression(
                            part
                        )
                    )
            );

        }


        const andParts =
            this.splitOperator(
                expression,
                " and "
            );

        if (andParts.length > 1) {

            return andParts.every(
                part =>
                    Boolean(
                        this.evaluateExpression(
                            part
                        )
                    )
            );

        }


        // ------------------------------------------
        // MATH
        // ------------------------------------------

        const mathResult =
            this.evaluateMath(
                expression
            );

        if (mathResult !== null) {

            return mathResult;

        }


        // ------------------------------------------
        // UNKNOWN
        // ------------------------------------------

        return expression;

    }


    // ==========================================
    // ➗ MATH
    // ==========================================

    evaluateMath(expression) {

        let converted =
            expression;

        for (
            const name in this.variables
        ) {

            const value =
                this.variables[name];

            if (
                typeof value === "number"
            ) {

                const regex =
                    new RegExp(
                        `\\b${name}\\b`,
                        "g"
                    );

                converted =
                    converted.replace(
                        regex,
                        String(value)
                    );

            }

        }


        // Only allow safe mathematical expressions

        if (
            !/^[0-9+\-*/%().\s]+$/.test(
                converted
            )
        ) {

            return null;

        }

        try {

            const result =
                Function(
                    `"use strict"; return (${converted})`
                )();

            if (
                typeof result === "number" &&
                Number.isFinite(result)
            ) {

                return result;

            }

        }
        catch {

            return null;

        }

        return null;

    }


    // ==========================================
    // 🔍 FIND OPERATOR
    // ==========================================

    findOperator(
        expression,
        operators
    ) {

        for (
            const operator of operators
        ) {

            const index =
                expression.indexOf(
                    operator
                );

            if (index !== -1) {

                return {

                    left:
                        expression
                            .substring(
                                0,
                                index
                            ),

                    operator,

                    right:
                        expression
                            .substring(
                                index +
                                operator.length
                            )

                };

            }

        }

        return null;

    }


    // ==========================================
    // 🔍 SPLIT OPERATOR
    // ==========================================

    splitOperator(
        expression,
        operator
    ) {

        return expression
            .split(operator)
            .map(
                part =>
                    part.trim()
            );

    }


    // ==========================================
    // 🧩 EXECUTE LINE
    // ==========================================

    async executeLine(line, lineNumber) {

        // ==========================================
        // 📦 VARIABLES
        // ==========================================

        const variableMatch =
            line.match(
                /^(?:set\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
            );

        if (variableMatch) {

            const variableName =
                variableMatch[1];

            const expression =
                variableMatch[2].trim();

            const value =
                this.evaluateExpression(
                    expression
                );

            this.variables[
                variableName
            ] = value;

            console.log(
                `📦 ${variableName} =`,
                value
            );

            return;

        }


        // ==========================================
        // 📢 SAY
        // ==========================================

        if (
            line.startsWith("say(")
        ) {

            const match =
                line.match(
                    /^say\((.*)\)$/
                );

            if (!match) {

                this.error(
                    lineNumber,
                    "Invalid say() syntax."
                );

                return;

            }

            const value =
                this.evaluateExpression(
                    match[1]
                );

            console.log(
                value
            );

            return;

        }
        // ==========================================
// 🖥️ server-size()
// ==========================================

const serverSizeMatch =
    line.match(
        /^server-size\((.+)\)$/
    );

if (serverSizeMatch) {

    const sizeExpression =
        serverSizeMatch[1].trim();

    const size =
        this.evaluateExpression(
            sizeExpression
        );

    if (
        typeof size !== "number" ||
        !Number.isFinite(size) ||
        !Number.isInteger(size) ||
        size < 1
    ) {

        this.error(
            lineNumber,
            "server-size() must contain a positive whole number."
        );

        return;

    }

    this.serverSize = size;

    console.log(
        `🖥️ Server capacity set to ${size} connections.`
    );

    return;

}
// ==========================================
// 🖥️ server-start()
// ==========================================

if (line === "server-start()") {

    if (
        !window.jungleElectron ||
        typeof window.jungleElectron.startServer !== "function"
    ) {

        this.error(
            lineNumber,
            "server-start() is only available in the JungleScript desktop app."
        );

        return;
    }

    const result =
        await window.jungleElectron.startServer(
            this.serverSize
        );

    if (!result.success) {

        this.error(
            lineNumber,
            result.error ||
            "Failed to start JungleScript server."
        );

        return;
    }

    this.serverRunning = true;

    console.log(
        `🌴 ${result.message}`
    );

    return;
}


        // ==========================================
        // 📄 file_name()
        // ==========================================

        const fileNameMatch =
            line.match(
                /^file_name\("(.+)"\)$/
            );

        if (fileNameMatch) {

            console.log(
                `📄 JungleScript file: ${fileNameMatch[1]}`
            );

            return;

        }


        // ==========================================
        // 🌴 use()
        // ==========================================

        const useMatch =
            line.match(
                /^use\("(.+)"\)$/
            );

        if (useMatch) {

            const moduleName =
                useMatch[1];

            this.modules.add(
                moduleName
            );

            console.log(
                `🌴 Loaded module: ${moduleName}`
            );
     if (
    moduleName === "HTML" ||
    moduleName === "JungleWeb"
) {

    if (!window.JungleHTML) {

        this.error(
            0,
            "JungleHTML module is not loaded."
        );

        return;

    }

    this.html =
        new window.JungleHTML();

    console.log(
        "🌐 JungleScript connected to JungleHTML!"
    );

    return;

}


            // ==========================================
            // 🎮 CONNECT JUNGLEGAME
            // ==========================================

            if (
                moduleName === "JungleGame" &&
                typeof JungleGameRuntime !==
                    "undefined"
            ) {

                const preview =
                    document.getElementById(
                        "previewOutput"
                    );

                this.gameRuntime =
                    new JungleGameRuntime(
                        preview
                    );

                console.log(
                    "🎮 JungleGame engine connected!"
                );

            }

            return;

        }


        // ==========================================
        // 🌐 page()
        // ==========================================

        const pageMatch =
            line.match(
                /^page\("(.+)"\)$/
            );

        if (pageMatch) {

            if (
                !this.modules.has(
                    "JungleWeb"
                )
            ) {

                this.error(
                    lineNumber,
                    "JungleWeb must be loaded before using page()"
                );

                return;

            }

            document.title =
                pageMatch[1];

            console.log(
                `🌐 Page: ${pageMatch[1]}`
            );

            return;

        }


        // ==========================================
        // 📝 heading()
        // ==========================================

       
        // ==========================================
        // 📦 grabAsset()
        // ==========================================

        const grabAssetMatch =
            line.match(
                /^grabAsset\("(.+)"\)$/
            );

        if (grabAssetMatch) {

            const filename =
                grabAssetMatch[1];

            if (!this.assets[filename]) {

                this.error(
                    lineNumber,
                    `Asset "${filename}" was not found.`
                );

                return;

            }

            console.log(
                `📦 Grabbed asset: ${filename}`
            );

            return;

        }
        // ==========================================
// 🆙 upgrade()
// ==========================================
//
// Registers/uses a JungleScript upgrade.
//
// Example:
//
// upgrade("JungleScript-Test-Installer.exe")
//
// The Online IDE NEVER executes the EXE.
// It only verifies that the upgrade exists.
//

const upgradeMatch =
    line.match(
        /^upgrade\(["'](.+)["']\)$/
    );

if (upgradeMatch) {

    const upgradeName =
        upgradeMatch[1];

    const upgradeStore =
        window.jungleScriptUpgrades;

    if (!upgradeStore) {

        this.error(
            lineNumber,
            "JungleScript upgrade system is not available."
        );

        return;

    }

    const upgrade =
        upgradeStore[upgradeName];

    if (!upgrade) {

        this.error(
            lineNumber,
            `Upgrade "${upgradeName}" was not found. Add it with 🆙 Add Upgrade first.`
        );

        return;

    }

    const lowerName =
        upgrade.name.toLowerCase();

    const isExe =
        lowerName.endsWith(".exe");

    const isJDKSU =
        lowerName.endsWith(".jdksu");

    console.log(
        "🆙 JungleScript Upgrade"
    );

    console.log(
        `📦 ${upgrade.name}`
    );

    console.log(
        `📏 Size: ${upgrade.size.toLocaleString()} bytes`
    );

    console.log(
        `📄 Type: ${upgrade.type || "unknown"}`
    );

    if (isExe) {

        console.log(
            "🖥️ Windows executable detected."
        );

    }
    else if (isJDKSU) {

        console.log(
            "🆙 JungleScript JDKSU upgrade detected."
        );

    }

    console.log(
        "✅ Upgrade found."
    );

    console.log(
        "🔒 Online IDE execution is disabled."
    );

    return;
}
// ==========================================
// 🚀 launchUpgrade()
// ==========================================
//
// Example:
//
// launchUpgrade("JungleScript-Test-Installer.exe")
//
// Launches a registered upgrade in the
// JungleScript desktop runtime.
//
// The Online IDE cannot launch EXE files.
// ==========================================

const launchUpgradeMatch =
    line.match(
        /^launchUpgrade\(["'](.+)["']\)$/
    );

if (launchUpgradeMatch) {

    const upgradeName =
        launchUpgradeMatch[1];

    const upgradeStore =
        window.jungleScriptUpgrades;

    // ==========================================
    // 🆙 CHECK UPGRADE SYSTEM
    // ==========================================

    if (!upgradeStore) {

        this.error(
            lineNumber,
            "JungleScript upgrade system is not available."
        );

        return;
    }

    // ==========================================
    // 🔎 FIND UPGRADE
    // ==========================================

    const upgrade =
        upgradeStore[upgradeName];

    if (!upgrade) {

        this.error(
            lineNumber,
            `Upgrade "${upgradeName}" was not found. Add it with 🆙 Add Upgrade first.`
        );

        return;
    }

    console.log(
        `🚀 Launch requested: ${upgrade.name}`
    );

    // ==========================================
    // 🌐 ONLINE IDE / BROWSER
    // ==========================================

    if (
        !window.jungleElectron ||
        typeof window.jungleElectron.launchUpgrade !==
            "function"
    ) {

        console.log(
            "🌐 Online IDE detected."
        );

        console.log(
            "🔒 Browser security prevents launching EXE files directly."
        );

        console.log(
            "💻 Use the JungleScript desktop runtime."
        );

        return;
    }

    // ==========================================
    // 📍 GET REAL FILE PATH
    // ==========================================

    const filePath =
        upgrade.junglePath;

    if (!filePath) {

        this.error(
            lineNumber,
            `No local file path was stored for "${upgrade.name}". Please remove the upgrade and add it again.`
        );

        return;
    }

    console.log(
        `📍 Launch path: ${filePath}`
    );

    // ==========================================
    // 🚀 SEND TO ELECTRON
    // ==========================================

    try {

        const result =
    await window.jungleElectron.startServer(
        this.serverSize
    );

        if (
            result &&
            result.success
        ) {

            console.log(
                `✅ Launched: ${upgrade.name}`
            );

        }
        else {

            this.error(
                lineNumber,
                result?.error ||
                `Could not launch "${upgrade.name}".`
            );

        }

    }
    catch (error) {

        this.error(
            lineNumber,
            `Could not launch "${upgrade.name}": ${error.message}`
        );

    }

    return;
}


        // ==========================================
        // ▶ playAsset()
        // ==========================================

        const playAssetMatch =
            line.match(
                /^playAsset\("(.+)"\)$/
            );

        if (playAssetMatch) {

            const filename =
                playAssetMatch[1];

            const file =
                this.assets[filename];

            if (!file) {

                this.error(
                    lineNumber,
                    `Asset "${filename}" was not found.`
                );

                return;

            }

            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                this.error(
                    lineNumber,
                    `"${filename}" is not an audio asset.`
                );

                return;

            }

            if (this.currentAudio) {

                this.currentAudio.pause();

                this.currentAudio.currentTime =
                    0;

            }

            const audioURL =
                URL.createObjectURL(
                    file
                );

            this.currentAudio =
                new Audio(
                    audioURL
                );

            this.currentAudio.volume =
                1.0;

            this.currentAudio
                .play()
                .then(() => {

                    console.log(
                        `🎵 Playing asset: ${filename}`
                    );

                })
                .catch(error => {

                    this.error(
                        lineNumber,
                        `Could not play "${filename}": ${error.message}`
                    );

                });

            return;

        }


        // ==========================================
        // ⏹ stopAsset()
        // ==========================================

        const stopAssetMatch =
            line.match(
                /^stopAsset\("(.+)"\)$/
            );

        if (stopAssetMatch) {

            if (this.currentAudio) {

                this.currentAudio.pause();

                this.currentAudio.currentTime =
                    0;

                this.currentAudio =
                    null;

                console.log(
                    `⏹️ Stopped asset: ${stopAssetMatch[1]}`
                );

            }
            else {

                console.log(
                    "⏹️ No audio is currently playing."
                );

            }

            return;

        }


        // ==========================================
        // 🤖 AI CREATE GAME
        // ==========================================

        if (
            line.startsWith(
                "aiCreateGame("
            )
        ) {

            const match =
                line.match(
                    /^aiCreateGame\(["'](.*)["']\)$/
                );

            if (!match) {

                this.error(
                    lineNumber,
                    "Invalid aiCreateGame() syntax."
                );

                return;

            }

            if (
                this.gameRuntime &&
                typeof this.gameRuntime.aiCreateGame ===
                    "function"
            ) {

                this.gameRuntime.aiCreateGame(
                    match[1]
                );

                console.log(
                    "🤖 AI game generation started!"
                );

            }
            else {

                this.error(
                    lineNumber,
                    'JungleGame is not loaded. Use use("JungleGame") first.'
                );

            }

            return;

        }
        
        // ==========================================
        // 🌟 realistic()
        // ==========================================

        if (line === "realistic()") {

            if (!this.modules.has("3D")) {

                this.error(
                    lineNumber,
                    'Load the 3D module first with use("3D").'
                );

                return;

            }

            if (!this.game3D) {

                this.error(
                    lineNumber,
                    'Start the 3D engine first with 3D().'
                );

                return;

            }

            if (
                typeof this.game3D.enableRealisticMode !==
                "function"
            ) {

                this.error(
                    lineNumber,
                    'Realistic mode is not yet implemented in 3d/3d.js.'
                );

                return;

            }

            this.game3D.enableRealisticMode();

            console.log(
                "🌟 JungleScript realistic mode enabled!"
            );

            return;

        }



        // ==========================================
        // 🧊 3D()
        // ==========================================

        if (line === "3D()") {

            if (
                this.modules.has("3D") &&
                typeof Jungle3D !==
                    "undefined"
            ) {

                this.game3D =
                    new Jungle3D(
                        document.getElementById(
                            "previewOutput"
                        )
                    );

                this.game3D.start();

                console.log(
                    "🧊 Jungle 3D mode started!"
                );

            }
            else {

                this.error(
                    lineNumber,
                    '3D engine not loaded. Use use("3D") first.'
                );

            }

            return;

        }


        // ==========================================
        // 🎮 JUNGLEGAME
        // ==========================================

        if (
            this.modules.has("JungleGame") &&
            this.gameRuntime
        ) {

            const handled =
                this.gameRuntime.execute(
                    line
                );

            if (handled) {

                return;

            }

        }
        // ==========================================
// 🌐 HTML COMMANDS
// ==========================================

if (this.html) {

    let match;

    match = line.match(/^heading\("([\s\S]*)"\)$/);

    if (match) {

        const html =
            this.html.heading(match[1]);

        const preview =
            document.getElementById("previewOutput");

        if (preview) {
            preview.innerHTML += html;
        }

        return;
    }


    match = line.match(/^text\("([\s\S]*)"\)$/);

    if (match) {

        const html =
            this.html.text(match[1]);

        const preview =
            document.getElementById("previewOutput");

        if (preview) {
            preview.innerHTML += html;
        }

        return;
    }


    match = line.match(/^button\("([\s\S]*)"\)$/);

    if (match) {

        const html =
            this.html.button(match[1]);

        const preview =
            document.getElementById("previewOutput");

        if (preview) {
            preview.innerHTML += html;
        }

        return;
    }

}
// ==========================================
// 🛤️ PATH CHOICES
// ==========================================

if (line.startsWith("path(")) {

    const match =
        line.match(
            /^path\((.*)\)$/
        );

    if (!match) {

        this.error(
            lineNumber,
            'Invalid path() syntax.'
        );

        return;

    }

    const argumentText =
        match[1].trim();

    if (argumentText === "") {

        this.error(
            lineNumber,
            "path() needs at least one choice."
        );

        return;

    }

    // Split the arguments
    const choices =
        argumentText
            .split(",")
            .map(
                value =>
                    value.trim()
                        .replace(/^["']|["']$/g, "")
            )
            .filter(Boolean);

    if (choices.length === 0) {

        this.error(
            lineNumber,
            "No valid paths were provided."
        );

        return;

    }

    const preview =
        document.getElementById(
            "previewOutput"
        );

    if (!preview) {

        this.error(
            lineNumber,
            "Game preview was not found."
        );

        return;

    }

    // Create path container
    const pathContainer =
        document.createElement("div");

    pathContainer.className =
        "junglescript-paths";

    pathContainer.style.display =
        "flex";

    pathContainer.style.flexDirection =
        "column";

    pathContainer.style.gap =
        "10px";

    pathContainer.style.margin =
        "20px 0";

    // Create one button for each path
    choices.forEach(
        choice => {

            const button =
                document.createElement("button");

            button.textContent =
                "🛤️ " + choice;

            button.style.padding =
                "12px 20px";

            button.style.fontSize =
                "18px";

            button.style.cursor =
                "pointer";

            button.style.borderRadius =
                "8px";

            button.style.border =
                "1px solid #555";

            button.addEventListener(
                "click",
                () => {

                    this.variables.path =
                        choice;
                        if (
    this.pathHandlers[choice]
) {

    console.log(
        `🛤️ Running path: ${choice}`
    );

    this.executeBlock(
        this.pathHandlers[choice],
        0,
        this.pathHandlers[choice].length
    );

}

                    console.log(
                        `🛤️ Player chose: ${choice}`
                    );

                    // Remove the choices after selecting
                    pathContainer.remove();

                    // Show the selected path
                    const selected =
                        document.createElement("div");

                   

                    selected.style.margin =
                        "10px 0";

                    selected.style.fontWeight =
                        "bold";

                    preview.appendChild(
                        selected
                    );

                }
            );

            pathContainer.appendChild(
                button
            );

        }
    );

    preview.appendChild(
        pathContainer
    );

    console.log(
        `🛤️ Created ${choices.length} path choices.`
    );

    return;

}


// ==========================================
// 🧩 FUNCTION CALL
// ==========================================

const functionMatch =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)$/
    );

if (functionMatch) {

    const functionName =
        functionMatch[1];

    const argumentText =
        functionMatch[2].trim();

    if (
        Object.prototype.hasOwnProperty.call(
            this.functions,
            functionName
        )
    ) {

        const func =
            this.functions[functionName];

        let argumentsList = [];

        if (argumentText !== "") {

            argumentsList =
                argumentText
                    .split(",")
                    .map(
                        value =>
                            this.evaluateExpression(
                                value.trim()
                            )
                    );

        }

        const localVariables = {
            ...this.variables
        };

        func.parameters.forEach(
            (parameter, index) => {

                this.variables[parameter] =
                    argumentsList[index];

            }
        );

        console.log(
            `🧩 Running function: ${functionName}()`
        );

        this.executeBlock(
            func.lines,
            0,
            func.lines.length
        );

        this.variables =
            localVariables;

        return;

    }

}
// ==========================================
// 🛑 BREAK
// ==========================================

if (line === "break") {

    this.breakRequested = true;

    console.log(
        "🛑 Loop break requested."
    );

    return;

}

    // ==========================================
    // 🎮 JUNGLEGAME RUNTIME BRIDGE
    // ==========================================

    if (typeof JungleGameRuntime !== "undefined") {
        const gamePreview =
            document.getElementById("previewOutput") ||
            document.getElementById("gamePreview") ||
            document.getElementById("jungleGamePreview");

        if (gamePreview) {
            if (!this.gameRuntime) {
                this.gameRuntime =
                    new JungleGameRuntime(gamePreview);
            }

            const handled =
                this.gameRuntime.execute(line);

            if (handled) {
                return;
            }
        }
    }



// ==========================================
// ❌ UNKNOWN COMMAND
// ==========================================

this.error(
    lineNumber,
    `Unknown command: ${line}`
);


}
    


    // ==========================================
    // ❌ ERROR
    // ==========================================

    error(
        lineNumber,
        message
    ) {

        console.error(
            `JungleScript Error on line ${lineNumber}: ${message}`
        );

    }
    // ==========================================
// 🌐 HTML COMMANDS
// ==========================================


}


// ==========================================
// 🌎 GLOBAL RUNTIME
// ==========================================

window.JungleScriptRuntime =
    JungleScriptRuntime;

console.log(
    "🌴 JungleScript v1.0 is ready!"
);