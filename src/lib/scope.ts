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
        
        (async() =>{

            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', document.uri);

            if(symbols === undefined){ //Symbols can possibly return as undefined

                vscode.window.showErrorMessage('Error: Something Went Wrong | Scope: Symbols returns as "undefined"');
                throw error('Scope: symbols returns as "undefined"');

            }

            this.symbols = symbols;

            return symbols;

        })();
    
    }

    async getSymbols(){

        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', this.document.uri);

        if(symbols === undefined){ //Symbols can possibly return as undefined

            vscode.window.showErrorMessage('Error: Something Went Wrong | Scope: Symbols returns as "undefined"');
            throw error('Scope: symbols returns as "undefined"');

        }

        this.symbols = symbols;

        return symbols;

    }

    findSymbol(selection: vscode.Selection){
        
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

    constructor(callbackOn?: () => void, callbackOff?: () => void, callbackSwitch?: () => void){

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

    static getCurrentSymbol(){

        this.currentSymbol = new symbolUtils(vscode.window.activeTextEditor?.document!).findSymbol(vscode.window.activeTextEditor?.selection!);

    }

    static modes = new Modes();

}