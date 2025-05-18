import { rejects, throws } from 'assert';
import {assert, Console, error } from 'console';
import { promises } from 'dns';
import { resolve } from 'path';
import { callbackify } from 'util';
import * as vscode from 'vscode';

//todo: Make symbols as a class.

class symbolUtils{
    
    document: vscode.TextDocument;

    symbols : vscode.DocumentSymbol[] = [];


    constructor(document: vscode.TextDocument){

        this.document = document;
    
    }

    async getSymbols(){

        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', this.document.uri); //Executes a command which provides symbols which are like functions, variables, classes, etc...

        if(symbols === undefined){ //Symbols can possibly return as undefined

            vscode.window.showErrorMessage('Error: Something Went Wrong | Scope/getSymbols: "symbols" returns as "undefined"');
            throw error('Scope/getSymbols: "symbols" returns as "undefined"');

        }

        this.symbols = symbols; 

        return symbols;

    }

    findSymbol(selection: vscode.Selection | undefined){

        if(selection ===  undefined){

            vscode.window.showErrorMessage('Error: Something Went Wrong | Scope/findSymbol: "selection" returns as undefined');
            throw error('Scope/findSymbols: "selection" returns as undefined');

        }
        
        for(let symbol of this.symbols){

            if(symbol.range.intersection(selection)){
                return symbol;
            }
        }
    }
}

class Modes{

    ifOn: boolean = false;
    callbackOn?: () => void;
    callbackOff?: () => void;
    callbackSwitch?: () => void;

    constructor(callbackOn?: () => void, callbackOff?: () => void, callbackSwitch?: () => void){ //Allow functions wiithin the modes methods 

        this.callbackOn = callbackOn;
        this.callbackOff = callbackOff;
        this.callbackSwitch = callbackSwitch;

    }

    on(){

        return ()=>{

            this.ifOn = true;
            this.callbackOn!();

        };
    }

    off(){

        return ()=>{

            this.ifOn = false;
            this.callbackOff!();

        };
    }

    switch(){
        return ()=>{

            this.ifOn = !this.ifOn;
            this.callbackSwitch!();

        };
    }
}

export class Scope{

    private static currentSymbol: vscode.DocumentSymbol | undefined = undefined;
    private static changeEventListener: vscode.Event<vscode.TextEditorSelectionChangeEvent> | undefined;

    constructor(){

    }

    static async getCurrentSymbol(){


        const symbol = new symbolUtils(vscode.window.activeTextEditor?.document!);
        await symbol.getSymbols(); 
        this.currentSymbol = symbol.findSymbol(vscode.window.activeTextEditor?.selection);

        console.log(this.currentSymbol);

    }

    static modes = new Modes(this.getCurrentSymbol);

}