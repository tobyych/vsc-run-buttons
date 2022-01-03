import * as vscode from 'vscode';

// activate is called when VS Code detected there is a .vscode/launch.json
export async function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vsc-run-buttons" is now active!');

    let currentWorkspace: vscode.WorkspaceFolder;
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        currentWorkspace = vscode.workspace.workspaceFolders[0];
    }

    let currentSelection: string;
    context.subscriptions.push(vscode.commands.registerCommand('RunButtons.list', () => {
        const config: Array<any>  = vscode.workspace.getConfiguration(
            'launch',
            currentWorkspace.uri
        ).configurations;
        if (config.length === 0) {
            vscode.window.showErrorMessage("No run configuration in `launch.json` file!");
            return;
        }
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = config.map(x => ({'label': x.name}));
        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                quickPick.hide();
                currentSelection = selection[0].label;
            }
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('RunButtons.run', () => {
        if (currentSelection) {
            vscode.debug.startDebugging(currentWorkspace, currentSelection, {'noDebug': true});
        } else {
            vscode.window.showErrorMessage("No selected run configuration. Please use the menu button on the right to select one.");
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('RunButtons.debug', () => {
        if (currentSelection) {
            vscode.debug.startDebugging(currentWorkspace, currentSelection);
        } else {
            vscode.window.showErrorMessage("No selected run configuration. Please use the menu button on the right to select one.");
        }
    }));

}

export function deactivate() { }
