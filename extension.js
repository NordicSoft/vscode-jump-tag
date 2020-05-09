// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

function next() {
    const editor = vscode.window.activeTextEditor;

    // check if editor exists
    if (!editor) {
        vscode.window.showInformationMessage("Jump Tag: no active text editor");
        return; // No open text editor
    }

    let cursorPosition = editor.selection.active, // current cursor position
        lineNumber = cursorPosition.line, // current line number
        characterNumber = cursorPosition.character, // current character number
        line = editor.document.lineAt(lineNumber), // get current line object
        newPosition; // new position object

    while (line) {
        console.log(line.text);
        characterNumber = line.text.indexOf(">", characterNumber);
        if (characterNumber !== -1) {
            // next tag found
            newPosition = new vscode.Position(lineNumber, characterNumber + 1);
            break;
        }

        // next tag not found on the current line, go to the next
        lineNumber++;
        characterNumber = 0;

        if (lineNumber < editor.document.lineCount) {
            line = editor.document.lineAt(lineNumber);
        } else {
            // next line is not available
            line = null;
        }
    }

    // set new cursor position if found
    if (newPosition) {
        editor.selections = [new vscode.Selection(newPosition, newPosition)];
    }
}

function activate(context) {
    let nextCommand = vscode.commands.registerCommand("jumpTag.next", next);

    context.subscriptions.push(nextCommand);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
