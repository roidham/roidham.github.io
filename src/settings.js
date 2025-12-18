class Setting{
    constructor(key, defaultValue = null){
        this.Key = key;
        this.defaultValue = defaultValue;
        if(this.Value === undefined || this.Value === null) this.Value == defaultValue;
    }

    get Value() { return this.get(); }
    set Value(v) { this.set(v); }

    get() { return localStorage.getItem(this.Key); }
    set(v) { localStorage.setItem(this.Key, v); }
}

class IntSetting extends Setting{
    constructor(key, defaultValue = null, minValue = null, maxValue = null ){
        super(key, defaultValue);
        this.minValue = minValue;
        this.maxValue = maxValue;
        if(Number.isNaN(this.Value)) this.Value = defaultValue;
    }

    get Value() { return parseInt(this.get()); }
    set Value(v) { 
        if(v == undefined || v == null){ v = this.defaultValue; }
        if(this.minValue != null && v < this.minValue) { v = this.minValue; }
        if(this.maxValue != null && v > this.maxValue) { v = this.maxValue; }
        this.set(v?.toString()); 
    }
}

class SettingsManager{
    constructor(smEl,smToogleEl){
        this.SettingsModalElement = smEl;
        this.SettingsToggleElement = smToogleEl;
        smToogleEl.addEventListener("click", ()=>this.toggle());
    }

    isOpen(){ return this.SettingsModalElement.classList.contains("open");}
    open() { if(!this.isOpen()) this.SettingsModalElement.classList.add("open");}
    close() { if(this.isOpen()) this.SettingsModalElement.classList.remove("open");}
    toggle(){ if(this.isOpen()){ this.close();} else { this.open();}}

    addSetting(settingElId, settingControl){
        let smw = document.getElementById(settingElId);
        smw.appendChild(settingControl.Label);
        smw.appendChild(settingControl.El);
        smw.appendChild(settingControl.ValueDisplay);
    }
}

class SettingSlider{
    /** 
     * @param {string} name
     * @param {IntSetting} setting
      */
    constructor(name, setting, onValueChange){
        this.Name = name;
        this.Setting = setting;
        this.OnValueChange = onValueChange;
        this.Updating = false;

        this.createElement();
        this.createLabel();
        this.createValueDisplay();

        this.valueChange(setting.Value);
    }

    createElement(){
        this.El = document.createElement("input");
        this.El.type = "range";
        if(this.Setting.maxValue != null) { this.El.max = this.Setting.maxValue; } 
        if(this.Setting.minValue != null) { this.El.min = this.Setting.minValue; } 
        this.El.value = this.Setting.Value;
        this.El.addEventListener("change", () => this.valueChange(this.El.value) );
    }

    createLabel(){
        this.Label = document.createElement("label");
        this.Label.innerText = this.Name + ":";
    }

    createValueDisplay(){
        this.ValueDisplay = document.createElement("input");
        this.ValueDisplay.type = "number";
        this.ValueDisplay.addEventListener("change", () => this.valueChange(this.ValueDisplay.value) );
    }

    valueChange(value){
        this.Setting.Value = value;
        this.ValueDisplay.value = this.Setting.Value;
        this.El.value = this.Setting.Value;
        this.OnValueChange(this.Setting.Value);
    }
}