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

    ;~~space Up::		;4. Place Sigil of Power
    ;    Sleep, 400
    ;    Send {t}		;5. Use Wrath aura (temporary aura linked to Divine Blessing)
    ;return

    ~LButton::
        Send {d}		;detonate mines
    return 

    ;~q Up::				;1. Place Decoy Totems if not on cooldown (to not get hit and lock Boss in place)
    ;    ;Sleep, 400		;3. Cast Conductivity Curse
    ;    Send {t}
    ;return

    ;~RButton Up::
    ;    ;Send {r}		
    ;return 

    ; space 	=> throw mine 
    ;	detonate
    ;	Place Sigil of Power
    ;	Use Wrath aura (temporary aura linked to Divine Blessing)
    ;
    ; q 		=> throw stormblast mines
    ;
    ;
    ; w 		=> selfcast Storm Burst

    ;1. Place Decoy Totems if not on cooldown (to not get hit and lock Boss in place)
    ;2. Place Storm Burst Totems
    ;3. Cast Conductivity Curse
    ;4. Place Sigil of Power
    ;5. Use Wrath aura (temporary aura linked to Divine Blessing)
    ;6. Cast selfcast Storm Burst for 0.6+ seconds (to proc Infusion buff that gives totems +16% more damage)
    ;7. Throw and detonate few Stormblast Mines until you get 3 Frenzy charges (from Charged Mines Support)
    ;8. (optional) While not busy with replacing totems or dodging boss mechanics, keep throwing Stormblast Mines without detonating them (in order to proc 3% increased damage taken on Monsters from Mine skill ge)