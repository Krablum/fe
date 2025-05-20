import * as vscode from 'vscode';
import * as multiCurEx from './lib';


export function activate(context: vscode.ExtensionContext) {	

	console.log(vscode.SymbolInformation);

	const mediaPath = (() : string =>{	

		const path = (__dirname.split('\\'));
		path.pop(); //To take out \out

		/**
		 ** ^^^^^^^^^^
		 ** This may need to be configured for different folder directories.
		 */

		 return path.join('\\') + '\\media\\origin.svg';
	})();
	

	
	const disposablePadding = vscode.commands.registerCommand("multicursorex.padding.pad" ,  multiCurEx.Padding.pad(mediaPath));	
	const disposableOriginUp = vscode.commands.registerCommand("multicursorex.padding.originUp" , multiCurEx.Padding.originUp(mediaPath));	
	const disposableOriginDown = vscode.commands.registerCommand("multicursorex.padding.originDown" , multiCurEx.Padding.originDown(mediaPath));	
	const disposableShowOrigin = vscode.commands.registerCommand("multicursorex.padding.originShow" , multiCurEx.Padding.showOrigin(mediaPath));
	const disposableLockOriginToMedian =  vscode.commands.registerCommand("multicursorex.padding.lockOriginToMedian" , multiCurEx.Padding.lockOriginToMedian(mediaPath));	

	context.subscriptions.push(disposablePadding, disposableOriginUp, disposableOriginDown, disposableShowOrigin, disposableLockOriginToMedian);

	const disposableScopeOn = vscode.commands.registerCommand("multicursorex.scope.on", multiCurEx.Scope.modes.on());
	const disposableScopeOff = vscode.commands.registerCommand("multicursorex.scope.off", multiCurEx.Scope.modes.off());
	const disposableScopeSwitch = vscode.commands.registerCommand("multicursorex.scope.switch", multiCurEx.Scope.modes.switch());

	context.subscriptions.push(disposableScopeOn, disposableScopeOff, disposableScopeSwitch);
	
}

export function deactivate() {

	multiCurEx.Padding.disposeAllDecoration();

}