# Multi-Cursor++
Multi-cursor++ adds new features to the multi-cursor functionality within Visual Studio Code to give that extra convenience while programming.

## Currently in Early Development
Right now, Multi-Cursor++ is not planned to be in productive use yet. However, new features and developments are coming

## Errors
Errors within in this extension are indicate through the vscode frontend aswell as the extension controller itself

Errors are specificed like `Error: actionNeeded | module/classMember: errorMessage` wheres:

- `actionNeeded` will describe the needed action for the user to fix the said error, if `actionNeeded` is shown as `"Something Went Wrong"` then this error is not repairable through the user-side.

- `module` describes the `modules` within lib API where the error was returned in, if the error was initiated within a constructer of a class then the error message will be structure as `classConstructer`.

- `classMember` describes the specific member of a certain class; it can be either a property or a method.

- `errorMessage` describes the error aswell as stating the rationale behind it. 

> **Note:** The previous GitHub repo was too unmanageable, so I made this new one (just for a heads up)