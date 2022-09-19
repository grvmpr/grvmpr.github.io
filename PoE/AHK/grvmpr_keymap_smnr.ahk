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

;~q::
;	; curse
;	Send {F2}
;	Sleep, 5
;	Send, {Rbutton}
;	Sleep, 5
;	Send {F1}
;	return

;~w::
;	; skele
;	Send {F8}
;	Sleep, 5
;	Send, {Rbutton}
;	Sleep, 5
;	Send {F1}
;	return

;~e::
;	; golem
;	Send {F7}
;	Sleep, 5
;	Send, {Rbutton}
;	Sleep, 5
;	Send {F1}
;	return

;~r::
	; revive
;	Send {F6}
;	Sleep, 5
;	Send, {Rbutton}
;	Sleep, 5
;	Send {F1}
;	return
;~t::
	; revive
;	Send {F5}
;	Sleep, 5
;	Send, {Rbutton}
;	Sleep, 5
;	Send {F1}
;	return
~u::
	Send {Enter}
	Send {Text}/players 3
;	Send {Enter}
	return
~5::
	Send +{1} ; Shift+1
	return		
~6::
	Send +{2} ; Shift+2
	return
~y::
	Send {c}
	;Sleep, 5
	;Send, {Rbutton}
	;Sleep, 50
	;Send {c}
	return
;~Tab::
;	Send {Alt}
; ~2::
; 	FlaskLastUsed[2] := A_TickCount
; 	Random, VariableDelay, -99, 99
; 	FlaskDuration[2] := FlaskDurationInit[2] + VariableDelay ; randomize duration to simulate human
; 	return