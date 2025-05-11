import * as vscode from 'vscode';
import * as multiCurEx from './lib';


export function activate(context: vscode.ExtensionContext) {	

	const mediaPath = (() : string =>{	

		const path = (__dirname.split('\\'));
		path.pop(); //To take out \out

		/**
		 ** ^^^^^^^^^^
		 ** This may need to be configured for different folder directories.
		 */

		 return path.join('\\') + '\\media\\origin.svg';
	})();
	
	const disposablePadding = vscode.commands.registerCommand("multicursorex.padding.pad" ,  multiCurEx.padding.pad(mediaPath));	
	const disposableOriginUp = vscode.commands.registerCommand("multicursorex.padding.originUp" , multiCurEx.padding.originUp(mediaPath));	
	const disposableOriginDown = vscode.commands.registerCommand("multicursorex.padding.originDown" , multiCurEx.padding.originDown(mediaPath));	
	const disposableShowOrigin = vscode.commands.registerCommand("multicursorex.padding.originShow" , multiCurEx.padding.showOrigin(mediaPath));
	const disposableLockOriginToMedian =  vscode.commands.registerCommand("multicursorex.padding.lockOriginToMedian" , multiCurEx.padding.lockOriginToMedian(mediaPath));	
	
	context.subscriptions.push(disposablePadding, disposableOriginUp, disposableOriginDown, disposableShowOrigin, disposableLockOriginToMedian);
	

}

export function deactivate() {

	multiCurEx.padding.disposeAllDecoration();

}