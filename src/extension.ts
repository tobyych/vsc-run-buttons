import * as vscode from 'vscode';

// activate is called when VS Code detected there is a .vscode/tasks.json
export async function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vsc-task-buttons" is now active!');

    const mapping: Array<[string, string]> = [
        ['TaskButtons.run', 'workbench.action.tasks.runTask'],
        ['TaskButtons.rerun', 'workbench.action.tasks.reRunTask'],
    ]

    mapping.forEach(([buttonName, action]) => {
        let disposable = vscode.commands.registerCommand(buttonName, () => {
            vscode.commands.executeCommand(action);
        });
        context.subscriptions.push(disposable);
    });

}

export function deactivate() { }
