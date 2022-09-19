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
#IfWinActive Path of Exile
#SingleInstance force
#NoEnv  
#Warn  
#Persistent 

CDn := []
CDs := []
;----------------------------------------------------------------------
; CONFIG HERE
;----------------------------------------------------------------------	
CDn[0]			:= "ED"
CDn[1]			:= "ED CI"
CDn[2]			:= "Totem"
CDn[3]			:= "General"
;					1     2     3     4     5     e     r     t     ^q    ^w    ^e    ^r    ^t
CDs[0] 			:= [0000, 4300, 4800, 5400, 6300, 0000, 0000, 0000, 0000, 0000, 0000, 0000, 0000]
CDs[1] 			:= [6000, 4800, 4800, 5400, 6300, 0000, 0000, 0000, 0000, 0000, 0000, 0000, 4100]
CDs[2] 			:= [0000, 6400, 4800, 4000, 4800, 0000, 0000, 0000, 0000, 0000, 0000, 0000, 0000]
CDs[3] 			:= [0000, 0000, 0000, 0000, 0800, 0000, 0000, 2300, 0000, 0000, 0000, 0000, 0000]

;----------------------------------------------------------------------
aLen :=0
cIndex :=0
FlaskDurationInit := []
;----------------------------------------------------------------------
; Set the duration of each flask, in ms, below.  For example, if the 
; flask in slot 3 has a duration of "Lasts 4.80 Seconds", then use:
;		FlaskDurationInit[3] := 4800
;
; To disable a particular flask, set it's duration to 0
;
; Note: Delete the last line (["e"]), or set value to 0, if you don't use a buff skill
;----------------------------------------------------------------------
FlaskDurationInit[1] := 0		
FlaskDurationInit[2] := 0
FlaskDurationInit[3] := 0
FlaskDurationInit[4] := 0
FlaskDurationInit[5] := 0
FlaskDurationInit["e"] := 0
FlaskDurationInit["r"] := 0		
FlaskDurationInit["t"] := 0

FlaskDurationInit["^q"] := 0
FlaskDurationInit["^w"] := 0
FlaskDurationInit["^e"] := 0
FlaskDurationInit["^r"] := 0
FlaskDurationInit["^t"] := 0

CharName := ""

FlaskDuration := []
FlaskLastUsed := []
UseFlasks := false	
HoldRightClick := false
LastRightClick := 0

;----------------------------------------------------------------------
; Main program loop - basics are that we use flasks whenever flask
; usage is enabled via hotkey (default is F12), and we've attacked
; within the last 0.5 second (or are channeling/continuous attacking.
;----------------------------------------------------------------------
Loop {
	if (UseFlasks) {
		; have we attacked in the last 0.5 seconds?
		if ((A_TickCount - LastRightClick) < 500) {
			Gosub, CycleAllFlasksWhenReady
		} else {
			; We haven't attacked recently, but are we channeling/continuous?
			if (HoldRightClick) {
				Gosub, CycleAllFlasksWhenReady
			}
		}
	}
}

clear_tool_tip:
  tooltip
  return
  
F2::
	Gosub, ToggleCDs
	Gosub, ToggleFlaskMacro
	return

F3::
	cIndex += 1
	aLen := CDn.Length()+1
	if (cIndex = aLen) {
		cIndex :=0
	}
	Gosub, ToggleCDs
	ToolTip, Character: - %CharName% - loaded
	settimer clear_tool_tip, -1000
	return

ToggleCDs:
	CharName := CDn[cIndex]
	FlaskDurationInit[1] := CDs[cIndex][1]
	FlaskDurationInit[2] := CDs[cIndex][2]
	FlaskDurationInit[3] := CDs[cIndex][3]
	FlaskDurationInit[4] := CDs[cIndex][4]
	FlaskDurationInit[5] := CDs[cIndex][5]
	FlaskDurationInit["e"] := CDs[cIndex][6]
	FlaskDurationInit["r"] := CDs[cIndex][7]
	FlaskDurationInit["t"] := CDs[cIndex][8]
	
	FlaskDurationInit["^q"] := CDs[cIndex][9]
	FlaskDurationInit["^w"] := CDs[cIndex][10]
	FlaskDurationInit["^e"] := CDs[cIndex][11]
	FlaskDurationInit["^r"] := CDs[cIndex][12]
	FlaskDurationInit["^t"] := CDs[cIndex][13]
	return

ToggleFlaskMacro:
	UseFlasks := not UseFlasks
	if UseFlasks {
		; initialize start of auto-flask use
		ToolTip, Character: - %CharName% - [ON]
		settimer clear_tool_tip, -1000
		
		; reset usage timers for all flasks
		for i in FlaskDurationInit {
			FlaskLastUsed[i] := 0
			FlaskDuration[i] := FlaskDurationInit[i]
		}
	} else {
		ToolTip, Character: - %CharName% - [OFF]
		settimer clear_tool_tip, -1000
	}
	return

~Shift::
	UseFlasks := false
	return
	
~Ctrl::
	UseFlasks := false
	return

;----------------------------------------------------------------------
; To use a different moust button (default is right click), change the
; "RButton" to:
;		RButton - to use the {default} right mouse button
;		MButton - to use the {default} middle mouse button (wheel)
;		LButton - to use the {default} Left mouse button
;
; Make the change in both places, below (the first is click,
; 2nd is release of button}
;----------------------------------------------------------------------
~RButton::
	; pass-thru and capture when the last attack (Right click) was done
	; we also track if the mouse button is being held down for continuous attack(s) and/or channelling skills
	HoldRightClick := true
	LastRightClick := A_TickCount
	return

~RButton up::
	; pass-thru and release the right mouse button
	HoldRightClick := false
	return

;----------------------------------------------------------------------
; The following 5 hotkeys allow for manual use of flasks while still
; tracking optimal recast times.
;----------------------------------------------------------------------
~1::
	; pass-thru and start timer for flask 1
	FlaskLastUsed[1] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[1] := FlaskDurationInit[1] + VariableDelay ; randomize duration to simulate human
	return

~2::
	; pass-thru and start timer for flask 2
	FlaskLastUsed[2] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[2] := FlaskDurationInit[2] + VariableDelay ; randomize duration to simulate human
	return

~3::
	; pass-thru and start timer for flask 3
	FlaskLastUsed[3] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[3] := FlaskDurationInit[3] + VariableDelay ; randomize duration to simulate human
	return

~4::
	; pass-thru and start timer for flask 4
	FlaskLastUsed[4] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[4] := FlaskDurationInit[4] + VariableDelay ; randomize duration to simulate human
	return

~5::
	; pass-thru and start timer for flask 5
	FlaskLastUsed[5] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[5] := FlaskDurationInit[5] + VariableDelay ; randomize duration to simulate human
	return

~r::
	; pass-thru and start timer for flask 5
	FlaskLastUsed["r"] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[6] := FlaskDurationInit[6] + VariableDelay ; randomize duration to simulate human
	return

~e::
	; pass-thru and start timer for flask 5
	FlaskLastUsed["e"] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[7] := FlaskDurationInit[7] + VariableDelay ; randomize duration to simulate human
	return
	
~t::
	; pass-thru and start timer for flask 5
	FlaskLastUsed["t"] := A_TickCount
	Random, VariableDelay, -99, 99
	FlaskDuration[8] := FlaskDurationInit[8] + VariableDelay ; randomize duration to simulate human
	return
	
	

;----------------------------------------------------------------------
; Use all flasks, now.  A variable delay is included between flasks
; NOTE: this will use all flasks, even those with a FlaskDurationInit of 0
;----------------------------------------------------------------------
`::
	if UseFlasks {
		Send 1
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send 2
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send 3
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send 4
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send 5
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send e
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send r
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
		Send t
		Random, VariableDelay, -99, 99
		Sleep, %VariableDelay%
	}
	return

CycleAllFlasksWhenReady:
	for flask, duration in FlaskDuration {
		; skip flasks with 0 duration and skip flasks that are still active
		if ((duration > 0) & (duration < A_TickCount - FlaskLastUsed[flask])) {
			Send %flask%
			FlaskLastUsed[flask] := A_TickCount
			Random, VariableDelay, -99, 99
			FlaskDuration[flask] := FlaskDurationInit[flask] + VariableDelay ; randomize duration to simulate human
			sleep, %VariableDelay%
		}
	}
	return