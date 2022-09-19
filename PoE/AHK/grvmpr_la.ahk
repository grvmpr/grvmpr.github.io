;#IfWinActive LOST ARK (64-bit) v2.15.1.1
#SingleInstance force
#NoEnv  
#Warn  
#Persistent

blink_cd :=8000
last_cast :=0

;$f::
;    Send, {z}
;    Sleep, 10
;    Send, {f}
;    return

$Space::    

    ToolTip, TRIGGERED
	settimer clear_tool_tip, -1000

    if (last_cast == 0) {
        Send, {Space}
        last_cast := A_TickCount
    }
    else {
        elapsed := (A_TickCount - last_cast)
        if (elapsed < blink_cd) { ; on cd
            Send, {x}
            ToolTip, XXXX
	        settimer clear_tool_tip, -1000
        }
        else { ; cd expired
            Send, {Space}
            last_cast := A_TickCount
        }
    }

    return




clear_tool_tip:
  tooltip
  return