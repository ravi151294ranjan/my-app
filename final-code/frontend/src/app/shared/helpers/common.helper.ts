/**
 * Author: Dhanabalan.cs
 * Common functions
 * Purpose: common function used accross application
 */
import {Injectable} from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: "root",
})

export class CommonHelper {

  constructor(private sanitized: DomSanitizer,) {}

  /** Set Default Language for Spell Checker in CKEditor
  This function returns the Language Code Identifier for the selected Language (Ex: Spanish-es_ES)
  **/
   setCKEditorSpellCheckerDefaultLang(selectedLang, languageList):string {
    let resLang=''    
    let matchedLang = languageList.find((langItem) => {
      if (langItem.name === selectedLang) return true;
    })
    if(matchedLang) {
      resLang=matchedLang['language_code_identifier']
    }
    return resLang;
  }

    /**
   * PARASE HTML Tag content to display in Preview Popup
   * @param value
  */
    sanitizeHTML(value) : any {
      return this.sanitized.bypassSecurityTrustHtml(value);
    }
  
}