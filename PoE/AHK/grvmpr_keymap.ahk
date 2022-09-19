;----------------------------------------------------------------------
; PoE Flasks macro for AutoHotKey
;
; Keys used and monitored:
; F2  - activate automatic flask usage
; F3  - cycle through your characters
; right mouse button - primary attack skills
; 1-5 - number keys to manually use a specific flask
; ` (backtick) - use all flasks, now
; "e", "r" and "t"  for casting buffs
;----------------------------------------------------------------------
#IfWinActive Diablo II: Resurrected
#SingleInstance force
#NoEnv  
#Warn  
#Persistent 

~q::
	; pass-thru and start timer for flask 1
	Send {F2}
	Sleep, 10
	Send, {Rbutton}
	Sleep, 10
	Send {F1}
	return

~w::
	; pass-thru and start timer for flask 1
	Send {F3}
	return

~e::
	; pass-thru and start timer for flask 1
	Send {F4}
	return
~5::
	; pass-thru and start timer for flask 1
	Send {F4}
	return
~6::
	Send +{3} ; Shift+3
	return
;~Tab::
;	Send {Alt}
; ~2::
; 	FlaskLastUsed[2] := A_TickCount
; 	Random, VariableDelay, -99, 99
; 	FlaskDuration[2] := FlaskDurationInit[2] + VariableDelay ; randomize duration to simulate human
; 	return