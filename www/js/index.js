/*
*
* (C) obook 2020-2024
*
*/

import { Preview } from "./preview.js";
import { MakeGift } from "./gift.js";
import { MakeXML } from "./xml.js";
import { EncodeSnippet, Html2GiftFilter, GetFirstLine} from "./snippet.js";

export {Init, SetFormatOutput, SetBankOutput, Process};

var delay = 2
var counter = delay;
var clockId;
var old_header = "";
var format_gift = true;
var print_bank = true;

function Init() {
  $("#sliderOutput").val('GIFT');
  $("#sliderBank").val('OFF');
  Process(true, print_bank);
  clockId = setInterval(clock, 1000);
}

function clock() {
    counter--;
    if(counter == 0)
    {
        Process(false, print_bank);
        counter = delay+1;
    }
}

function SetFormatOutput(value) {
    if (value == 'GIFT') {
        console.log("SetFormatOutput:GIFT");
        format_gift = true;
        Process(true, print_bank);
    }
    else {
        console.log("SetFormatOutput:XML");
        format_gift = false;
        Process(true, print_bank); 
    }
}

function SetBankOutput(value) {
  if (value == 'OFF') {
      console.log("SetBankOutput:TRUE");
      print_bank = true;
      Process(true, print_bank);
  }
  else {
      console.log("SetBankOutput:FALSE");
      print_bank = false;
      Process(true, print_bank);
  }
}

function Process(force=false, bank=true)
{
	console.log("Process start...");
	var question_object = $("#id_question");
	var numero = $("#id_numero").val();
	var theme = $("#id_theme").val();
  var titre = numero+ " - " + GetFirstLine(question_object.val());
  // Réglage du titre de la fenêtre
  $(document).prop('title', theme);


  if ($("#sliderOutput").val() == 'GIFT') {
    format_gift = true;
  }
  else {
    format_gift = false;
  }

	var header = theme + " : Q" + titre;
  if( old_header != header )
  {
      $("#id_header").html(header);
      old_header = header;
  }

  Preview();

  if(format_gift)
    MakeGift(force, bank);
  else
    MakeXML(force, bank);

  console.log("Process ended.");
}

Init();
