/*
*
* (C) obook 2020-2024
*
*/ 

import { Html2GiftFilter, Html2AnswerFilter, GetFirstLine, EncodeSnippet} from "./snippet.js";
import { GetCurrentQuestion, GetQuestion } from "./question.js";
export { PrintGift, SaveGift };

let old_code = "";
let current_code = "";
let bToFile = true;
let bToHtml = false;

/*
Print Gift code in div
*/
function PrintGift(force=false, question_only=true) {
let code = "";

    const questionobj = GetCurrentQuestion();

    if(!questionobj)
    {
        $("#id_code").html("");
        old_code = "";
        return;
    }

    if(!question_only) {
        let theme = $("#id_theme").val();
        code = code + "//Category\n";
        code = code + "$CATEGORY: $course$/" + theme + "\n\n";
    }

    code = code + EncodeGift(questionobj, bToHtml);

    if( old_code != code || force )
    {
        $("#id_code").html("<pre><code>"+code+"</code></pre>");
        current_code = code;
        old_code = code;
    }

}
/*

Make GIFT code for web and for save to file

*/
function EncodeGift(questionobj, tofile=false) { /* tofile is for put in exported text file */
let code = "";
let numero = questionobj.number.padStart(2, '0');
let titre = numero+ " - " + GetFirstLine(questionobj.text);
let endline = '\n';

    let question = EncodeSnippet(questionobj.text, tofile);

    code = code + "// Question "+numero+endline;
    code = code + "::" + Html2GiftFilter( titre ) + endline;
    code = code + "::[html] " + Html2GiftFilter(question, tofile) + endline;

    /* aller cherche plutot dans la config ? */

    let type = $("#id_question_type").val(); /* 1,2,3 ou 4 bonnes réponses */
    let penality = $("#sliderPenality").val(); /* OFF= sans points négatifs, ON = avec points négatifs */  

    if( type == 1 ) { // Une bonne réponse
        if (penality == 'ON') { /* Points négatifs */
            code = code + "// One correct awswer : n°1, With negative points"+endline+"{"+endline;
            code = code + " = " + Html2AnswerFilter( questionobj.answer1, tofile) + endline;
            code = code + " ~ %-33.33333% " + Html2AnswerFilter( questionobj.answer2, tofile)  + endline;
            code = code + " ~ %-33.33333% " + Html2AnswerFilter( questionobj.answer3, tofile)  + endline;
            code = code + " ~ %-33.33333% " +  Html2AnswerFilter( questionobj.answer4, tofile)  + endline;
        }
        else {
            code = code + "// One correct awswer : n°1, Without negative points"+endline+"{"+endline;
            code = code + " = " + Html2AnswerFilter( questionobj.answer1, tofile)  + endline;
            code = code + " ~ " + Html2AnswerFilter( questionobj.answer2, tofile)  + endline;
            code = code + " ~ " + Html2AnswerFilter( questionobj.answer3, tofile)  + endline;
            code = code + " ~ " +  Html2AnswerFilter( questionobj.answer4, tofile)  + endline;
        }
    }
    else if( type == 2 ) { // Deux bonnes réponses
        if (penality  == 'ON') { /* Points négatifs */
            code = code + "// Two correct awswers : n°1 et n°2, With negative points"+endline+"{"+endline;
            code = code + " ~ %50% " + Html2AnswerFilter( questionobj.answer1, tofile , tofile)  + endline;
            code = code + " ~ %50% " + Html2AnswerFilter( questionobj.answer2, tofile , tofile)  + endline;
            code = code + " ~ %-33.33333% " + Html2AnswerFilter( questionobj.answer3, tofile , tofile)  + endline;
            code = code + " ~ %-33.33333% " +  Html2AnswerFilter( questionobj.answer4, tofile , tofile)  + endline;
        }
        else {
            code = code + "// Two correct awswers : n°1 et n°2, Without negative points"+endline+"{"+endline;
            code = code + " ~ %50% " + Html2AnswerFilter( questionobj.answer1, tofile , tofile)  + endline;
            code = code + " ~ %50% " + Html2AnswerFilter( questionobj.answer2, tofile , tofile)  + endline;
            code = code + " ~ " + Html2AnswerFilter( questionobj.answer3, tofile , tofile)  + endline;
            code = code + " ~ " +  Html2AnswerFilter( questionobj.answer4, tofile , tofile)  + endline;
        }
    }
    else if( type == 3 ) { // Trois bonnes réponses
        if (penality  == 'ON') { /* Points négatifs */
            code = code + "// Three correct awswers : n°1, n°2 et n°3, With negative points"+endline+"{"+endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer1, tofile , tofile)  + endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer2, tofile , tofile)  + endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer3, tofile , tofile)  + endline;
            code = code + " ~ %-100% " +  Html2AnswerFilter( questionobj.answer4, tofile , tofile)  + endline;
        }
        else {
            code = code + "// Three correct awswers : n°1, n°2 et n°3, Without negative points"+endline+"{"+endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer1, tofile , tofile)  + endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer2, tofile , tofile)  + endline;
            code = code + " ~ %33.33333% " + Html2AnswerFilter( questionobj.answer3, tofile , tofile)  + endline;
            code = code + " ~ " +  Html2AnswerFilter( questionobj.answer4, tofile , tofile)  + endline;
        }
    }
    else {// Quatre bonnes réponses
        code = code + "// Four correct awswers"+endline+"{"+endline;
        code = code + " ~ %25% " + Html2AnswerFilter( questionobj.answer1, tofile , tofile)  + endline;
        code = code + " ~ %25% " + Html2AnswerFilter( questionobj.answer2, tofile , tofile)  + endline;
        code = code + " ~ %25% " + Html2AnswerFilter( questionobj.answer3, tofile , tofile)  + endline;
        code = code + " ~ %25% " +  Html2AnswerFilter( questionobj.answer4, tofile , tofile)  + endline;
    }
    
    if( questionobj.feedback )
         code = code + " #### [html] " + Html2AnswerFilter( questionobj.feedback, tofile ) + endline;
    
	code = code + "}";

return(code);
}

const SaveGift = (filename) => {
let questions = "";

    let theme = $("#id_theme").val();
    questions = "// Category\n";
    questions = questions + "$CATEGORY: $course$/" + theme ;

    let index = 0;

    while (true) {
        let questionobj = GetQuestion(index+1);
        if(questionobj) {
            let question = EncodeGift(questionobj, bToFile);
            questions = questions+"\n\n"+question;
            index++;
        }
        else {
            break;
        }
    }

    if(!index) {
        alert("No any question");
        return;
    }

    const link = document.createElement("a");
    const file = new Blob([questions], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = filename+".txt";
    link.click();
    URL.revokeObjectURL(link.href);
 };