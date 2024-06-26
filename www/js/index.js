/*
*
* (C) obook 2020-2024
*
*/

import { MakePreview } from "./preview.js";
import { PrintGift, SaveGift } from "./gift.js";
import { PrintXML, SaveXML } from "./xml.js";
import { ClearCurrentQuestion, StoreQuestion, RecallQuestion } from "./question.js";
import { GetFirstLine} from "./snippet.js";
import { StorageExists, StorageClear} from "./storage.js";
import { ConfigTheme, ConfigFormatOutput, ConfigQuestionOnly, ConfigCorrectAnswers, ConfigPenality, ConfigClear} from "./config.js";

export {Init, Process, SetFormatOutput, SetPenality, SetCorrectAnswers, SetQuestionOnly, QuestionNumberChanged, ClearAll, SaveCode};

var delay = 2
var counter = delay;
var clockId;
var old_header = "";
var format_gift = true;
var question_only = true;
var actual_question_number = 1;
var penality = 'ON';

function Init() {
  $("#sliderOutput").val(ConfigFormatOutput());
  question_only = ConfigQuestionOnly(); /* true or false */

  if(question_only)
    $("#sliderBank").val('ON');
  else
    $("#sliderBank").val('OFF');

  $("#sliderPenality").val(ConfigPenality());

  $("#id_question_type").val(ConfigCorrectAnswers());

  $("#id_theme").val(ConfigTheme());
  RecallQuestion(actual_question_number);
  SetCorrectAnswers();
  Process(true, question_only);
  clockId = setInterval(clock, 1000);
}

function ClearAll() {
  StorageClear();
  ConfigClear();
  ClearCurrentQuestion(1);
}

function clock() {
    counter--;
    if(counter == 0) {
        Process(false, question_only);
        counter = delay+1;
    }
}

function SetPenality(value) {
  if (value == 'OFF')
    penality = false;
  else
    penality = true;
  ConfigPenality(value);
}

function SetCorrectAnswers(correctanswers) {
  if (correctanswers)
    ConfigCorrectAnswers(correctanswers);
  else
    correctanswers = ConfigCorrectAnswers();

  $(id_pointsreponse1).text("");
  $(id_pointsreponse2).text("");
  $(id_pointsreponse3).text("");
  $(id_pointsreponse4).text("");

  $(id_label_reponse1).removeClass("class_correct_answer");
  $(id_label_reponse2).removeClass("class_correct_answer");
  $(id_label_reponse3).removeClass("class_correct_answer");
  $(id_label_reponse4).removeClass("class_correct_answer");

  $(id_label_reponse1).removeClass("class_incorrect_answer");
  $(id_label_reponse2).removeClass("class_incorrect_answer");
  $(id_label_reponse3).removeClass("class_incorrect_answer");
  $(id_label_reponse4).removeClass("class_incorrect_answer");

  penality = ConfigPenality();

  if ( correctanswers == 1 ) {
      $(id_label_reponse1).addClass("class_correct_answer");
      $(id_label_reponse2).addClass("class_incorrect_answer");
      $(id_label_reponse3).addClass("class_incorrect_answer");
      $(id_label_reponse4).addClass("class_incorrect_answer");
      if(penality=='ON') {
          $(id_pointsreponse1).text("+100%");
          $(id_pointsreponse2).text("-33.33%");
          $(id_pointsreponse3).text("-33.33%");
          $(id_pointsreponse4).text("-33.33%");
      }
  } else if ( correctanswers == 2 ) {
      $(id_label_reponse1).addClass("class_correct_answer");
      $(id_label_reponse2).addClass("class_correct_answer");
      $(id_label_reponse3).addClass("class_incorrect_answer");
      $(id_label_reponse4).addClass("class_incorrect_answer");
      if(penality=='ON') {
          $(id_pointsreponse1).text("+50%");
          $(id_pointsreponse2).text("+50%");
          $(id_pointsreponse3).text("-50%");
          $(id_pointsreponse4).text("-50%");
      }
  } else if ( correctanswers == 3 ) {
      $(id_pointsreponse1).text("+33.33%");
      $(id_pointsreponse2).text("+33.33%");
      $(id_pointsreponse3).text("+33.33%");
      $(id_label_reponse1).addClass("class_correct_answer");
      $(id_label_reponse2).addClass("class_correct_answer");
      $(id_label_reponse3).addClass("class_correct_answer");
      $(id_label_reponse4).addClass("class_incorrect_answer");
      if(penality=='ON') {
          $(id_pointsreponse4).text("-100%");
      }
  } else if ( correctanswers == 4 ) {
      $(id_label_reponse1).addClass("class_correct_answer");
      $(id_label_reponse2).addClass("class_correct_answer");
      $(id_label_reponse3).addClass("class_correct_answer");
      $(id_label_reponse4).addClass("class_correct_answer");
      if(penality=='ON') {
        $(id_pointsreponse1).text("+25%");
        $(id_pointsreponse2).text("+25%");
        $(id_pointsreponse3).text("+25%");
        $(id_pointsreponse4).text("+25%");
    }
  }
}

function SetFormatOutput(value) {
    if (value == 'GIFT')
        format_gift = true;
    else
        format_gift = false;

    ConfigFormatOutput(value);
    Process(true, question_only);
}

function SetQuestionOnly(value) {
  if (value == 'OFF')
      question_only = false;
  else
      question_only = true;
    
  ConfigQuestionOnly(question_only);
  Process(true, question_only);
}

function QuestionNumberChanged(number) {
  if( StorageExists(number) ) {
    RecallQuestion(number);
    /* Resize textarea */
    $("#id_question").height("0px");
    $("#id_question").height( $("#id_question")[0].scrollHeight);
  }
  else {
    ClearCurrentQuestion();
  }

  Process();
}

function Process(force=false, question_only=false) {
	//console.log("Process start...");
	var question_object = $("#id_question");
	var numero = $("#id_numero").val();
	var theme = $("#id_theme").val();
  var titre = numero.padStart(2, '0')+ " - " + GetFirstLine(question_object.val());
  // Réglage du titre de la fenêtre
  // $(document).prop('title', theme);

  if ($("#sliderOutput").val() == 'GIFT') {
    format_gift = true;
    $("#id_outype").html("GIFT");
    $("#id_exporttype").html("GIFT");
  }
  else {
    format_gift = false;
    $("#id_outype").html("XML");
    $("#id_exporttype").html("XML");
  }

	var header = theme + " : Q" + titre;
  if( old_header != header )  {
      $("#id_header").html(header);
      old_header = header;
  }

  MakePreview();

  if(format_gift)
    PrintGift(force, question_only);
  else
    PrintXML(force, question_only);

  StoreQuestion(numero);
  ConfigTheme(theme);

  //console.log("Process ended.");
}

function SaveCode() {
  if(format_gift)
    SaveGift(ConfigTheme());
  else
    SaveXMLSaveGift(ConfigTheme());
}

Init();
