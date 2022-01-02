import * as vscode from 'vscode';

// activate is called when VS Code detected there is a .vscode/tasks.json
export async function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vsc-task-buttons" is now active!');

    let currentWorkspace: vscode.WorkspaceFolder;
    let uri;
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        currentWorkspace = vscode.workspace.workspaceFolders[0];
        uri = currentWorkspace.uri;
    }

    const config: Array<any>  = vscode.workspace.getConfiguration(
        'launch',
        uri
    ).configurations;

    let lastSelection: string;

    const runCommand = vscode.commands.registerCommand('RunButtons.run', () => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = config.map(x => ({'label': x.name}));
        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                quickPick.hide();
                if (!lastSelection) {
                    vscode.commands.executeCommand('setContext', 'hasLastSelection', true);
                }
                lastSelection = selection[0].label;
                vscode.debug.startDebugging(currentWorkspace, selection[0].label);
            }
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    });

    context.subscriptions.push(runCommand);
    
    const rerunCommand = vscode.commands.registerCommand('RunButtons.rerun', () => {
        if (lastSelection) {
            vscode.debug.startDebugging(currentWorkspace, lastSelection);
        }
    });

    context.subscriptions.push(rerunCommand);

}

export function deactivate() { }
