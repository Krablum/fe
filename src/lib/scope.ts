import { rejects, throws } from 'assert';
import {assert, Console, error } from 'console';
import { promises } from 'dns';
import { resolve } from 'path';
import { callbackify } from 'util';
import * as vscode from 'vscode';
import { activate } from '../extension';
import { MultiCursorUtils } from './index';

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

            console.log(selection);

            vscode.window.showErrorMessage('Error: Something Went Wrong | Scope/findSymbol: "selection" returns as undefined');
            throw error('Scope/findSymbols: "selection" returns as undefined');

        }
        
        for(let symbol of this.symbols){


            if(symbol.range.intersection(selection) !== undefined){
                

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
    private static changeEventListener: vscode.Disposable | undefined;
    private static hasRan = false;

    constructor(){

    }

    private static async getCurrentSymbol(selection: vscode.Selection | undefined){

        const symbolTools = new symbolUtils(vscode.window.activeTextEditor?.document!);
        await symbolTools.getSymbols(); 
        if(this.currentSymbol === undefined){

            this.currentSymbol = symbolTools.findSymbol(selection);

            return;

        }

        this.currentSymbol = symbolTools.symbols.find(element => {return element.name === this.currentSymbol?.name!;});

    }

    static modes = new Modes(async()=>{// This callback is for the "on" method 

        MultiCursorUtils.editorIsDefined();

        let symbolSelections: vscode.Selection[] = [];
        let prevSelection: vscode.Selection | undefined = undefined; // if there is only one selections and we went out of the scope we define the selection to prevSelection

        if(this.changeEventListener !== undefined){

            this.changeEventListener.dispose();

        }

        await this.getCurrentSymbol(vscode.window.activeTextEditor?.selections.at(-1));

        if(this.hasRan === false){ //to check all selection only for the first activation so we can save computational resources in the future.

            if(this.currentSymbol === undefined){

                vscode.window.showErrorMessage('Error: Most recent selection or cursor is not overlapping on a symbol(etc. Function, Class, ...) | Scope/onCallback: "currentSymbol" returns as undefined');
                console.error('Scope/onCallback: "currentSymbol" returns as undefined');

            }

            for(let selection of vscode.window.activeTextEditor?.selections!){ // checking all selections

                if(selection.intersection(this.currentSymbol?.range!) !== undefined){ // see if any selection is overlapping the symbol range

                    symbolSelections.push(selection); 

                }    
            
            }

            vscode.window.activeTextEditor!.selections = symbolSelections; // change all selections to only ones that are overlapping the symbol range
            symbolSelections = [];

            this.hasRan = true;

        }


        this.changeEventListener = vscode.window.onDidChangeTextEditorSelection(async(event) =>{ // checking everytime selections changes for only the selections that did change, aswell for that the previous selection change clean up for outliers

           await this.getCurrentSymbol(vscode.window.activeTextEditor?.selections.at(-1)); //todo: fix bug

            for(let selection of event.selections){

                if(selection.intersection(this.currentSymbol?.range!) !== undefined){ // see if any changed selection is overlapping the symbol range

                    symbolSelections.push(selection);
                        
                    if(vscode.window.activeTextEditor?.selections.length! === 1){

                        prevSelection = vscode.window.activeTextEditor?.selection;
                        
                    }
                    continue;
                }

                if(prevSelection !== undefined && vscode.window.activeTextEditor?.selections.length! === 1){

                    vscode.window.activeTextEditor!.selection = prevSelection;
                    prevSelection = undefined;

                }
               

            }

                vscode.window.activeTextEditor!.selections = symbolSelections;
                console.log(symbolSelections);
                symbolSelections = [];

        });
    });
}