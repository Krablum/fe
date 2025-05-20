export * from "./padding";
export * from "./scope";
import * as vscode from "vscode";
export class MultiCursorUtils{

    static editorIsDefined(){ //check if any editor is opened/focused

        if(vscode.window.activeTextEditor !== undefined){

            return true;

        }

        if(vscode.workspace.textDocuments.length > 0){

            vscode.window.showErrorMessage('Error: Something Went Wrong | Scope/editorIsDefined: "vscode.window.activeTextEditor" returns as undefined and "vscode.workspace.textDocuments.length is greater then 0"');
            console.error('"vscode.window.activeTextEditor" returns as undefined and "vscode.workspace.textDocuments.length is greater then 0"');

            return false;

        }

        vscode.window.showErrorMessage('Error: No text document is created | Scope/editorIsDefined: "vscode.window.activeTextEditor" returns as undefined and "vscode.workspace.textDocuments.length is less then or equal to 0"');
        console.error('Scope/editorIsDefined: "vscode.window.activeTextEditor" returns as undefined and "vscode.workspace.textDocuments.length is less then or equal to 0"');

        return false;

    }

}

