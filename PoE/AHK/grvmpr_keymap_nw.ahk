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
#IfWinActive New World
#SingleInstance force
#NoEnv  
#Warn  
#Persistent 

~Ctrl::
	; pass-thru and start timer for flask 1
	Send {Shift}
	Sleep, 100
	Send {0}
	return

;~1::
;	Send {1}
;	Sleep, 5
;	Send {f}
;	Sleep, 5
;	Send {r}
;	return

;~2::
;	Send {2}
;	Sleep, 5
;	Send {r}
;	Sleep, 5
;	Send {q}
;	return