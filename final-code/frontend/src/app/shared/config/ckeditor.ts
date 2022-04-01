/**
 * Author: Dhanabalan.cs
 * Class : ckEditorConfig
 * Purpose: CKEDITOR Configuaration
 * You can set the new config for CKEDITOR
*/
export const ckEditorConfig = {
   
  baseConfig : {
  font_names : 'Gotham;Trebuchet MS;Lucida Sans Unicode;Lucida Grande;Lucida Sans;Arial;sans-serif', // Limited Font set,
  toolbarGroups:  [
  { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
  { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
  { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
  { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
  { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
  { name: 'styles', groups: [ 'styles' ] },
  { name: 'colors', groups: [ 'colors' ] },
  { name: 'tools', groups: [ 'tools' ] },
  { name: 'others', groups: [ 'others' ] },
  { name: 'about', groups: [ 'about' ] }
  ],
    extraPlugins: "colorbutton,colordialog,panelbutton,font",
    removeButtons  : 'Table,Maximize,Styles,Image,Flash,Smiley,SpecialChar,Iframe,PageBreak,Anchor,Language,Blockquote,CreateDiv,RemoveFormat,CopyFormatting,Subscript,Superscript,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,SelectAll,Find,Replace,PasteFromWord,PasteText,Templates,Save,NewPage,ExportPdf,Preview,Print,Source,About',
    scayt_autoStartup:true,
    scayt_disableOptionsStorage:'all',
    scayt_sLang :'en_US',
 },
};