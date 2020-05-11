// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const jumpDirection = {
    PREV: "prev",
    NEXT: "next",
}

// covers both prev & next commands depending on `direction` parameter
function jump(direction) {
    return () => {
        const editor = vscode.window.activeTextEditor;

        // check if editor exists
        if (!editor) {
            vscode.window.showInformationMessage(
                "Jump Tag: no active text editor"
            );
            return; // no open text editor
        }

        let cursorPosition = editor.selection.active, // current cursor position
            lineNumber = cursorPosition.line, // current line number
            characterNumber = cursorPosition.character, // current character number
            line = editor.document.lineAt(lineNumber), // get current line object
            newPosition; // new position object

        while (line) {
            if (direction === jumpDirection.NEXT) {
                characterNumber = line.text.indexOf(">", characterNumber);
            } else {
                characterNumber = line.text.slice(0, characterNumber).lastIndexOf("<", characterNumber);
            }
            if (characterNumber !== -1) {
                // jump tag found
                newPosition = new vscode.Position(
                    lineNumber,
                    characterNumber + (direction === jumpDirection.NEXT ? 1 : 0)
                );
                break;
            }

            // jump tag not found on the current line, go to the next/prev
            if (direction === jumpDirection.NEXT) {
                lineNumber++;
            } else {
                lineNumber--;
            }

            if (lineNumber >= 0 && lineNumber < editor.document.lineCount) {
                line = editor.document.lineAt(lineNumber);
                characterNumber = direction === jumpDirection.NEXT ? 0 : line.text.length;
            } else {
                // next line is not available
                line = null;
            }
        }

        // set new cursor position if found
        if (newPosition) {
            editor.selections = [
                new vscode.Selection(newPosition, newPosition),
            ];
        }
    };
}

function activate(context) {
    // register `Jump Tag - Next` command
    let nextCommand = vscode.commands.registerCommand("jumpTag.next", jump("next"));
    context.subscriptions.push(nextCommand);

    // register `Jump Tag - Previous` command
    let prevCommand = vscode.commands.registerCommand("jumpTag.prev", jump("prev"));
    context.subscriptions.push(prevCommand);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
