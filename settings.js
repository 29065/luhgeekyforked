Game.settings = (function() {

    var autoSaveMapping = {
        '30secs': 30 * 1000,
        '2mins': 2 * 60 * 1000,
        '10mins': 10 * 60 * 1000,
        'off': 10000000000000000000
    };

    var instance = {
        dataVersion: 1,
        entries: {
            formatter: 'shortName',
            boldEnabled: false,
            sidebarCompressed: false,
            notificationsEnabled: true,
            saveNotifsEnabled: true,
            gainButtonsHidden: false,
            redDestroyButtons: false,
            hideCompleted: false,
            theme: 'base',
            autoSaveInterval: 30 * 1000
        },
        elementCache: {},
        reapplyTheme: true
    };

    instance.format = function(value, digit) {
        var format = this.entries.formatter || 'shortName';
        return Game.utils.formatters[format](value.toFixed(digit || 0));
    };

    instance.getEl = function(id) {
        var element = this.elementCache[id];
        if(!element) {
            element = $('#' + id);
            if(element.length > 0) {
                this.elementCache[id] = element;
            }
        }
        return element;
    };

    instance.turnRedOnNegative = function(value, id) {
        var element = this.getEl(id);
        if(element.length === 0) return false;

        if(value < 0){
            if(this.entries.boldEnabled){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }
            return true;
        } else {
            element.removeClass('red bold');
            return false;
        }
    };

    instance.turnRed = function(value, target, id) {
        var element = this.getEl(id);
        if(element.length === 0) return;

        if(value < target){
            if(this.entries.boldEnabled){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }
        } else {
            element.removeClass('red bold');
        }
    };

    instance.turnRedOrGreen = function(value, target, id) {
        var element = this.getEl(id);
        if(element.length === 0) return;

        if(value === 0){
            if(this.entries.boldEnabled){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }
        } else {
            element.removeClass('red bold');
        }

        if(value >= target && target >= 0) {
            element.addClass('green');
        } else {
            element.removeClass('green');
        }
    };

    instance.save = function(data) {
        data.settings = {version: this.dataVersion, entries: {}};
        for(var id in this.entries) {
            data.settings.entries[id] = this.entries[id];
        }
    };

    instance.load = function(data) {
        this.loadLegacy(data);

        if(data.settings && data.settings.version === this.dataVersion) {
            for(var id in data.settings.entries) {
                this.entries[id] = data.settings.entries[id];
            }
        }

        // Apply settings to UI elements
        $('#formatSelector').val(this.entries.formatter);
        $('#themeSelector').val(this.entries.theme);
        $('#boldEnabled').prop('checked', this.entries.boldEnabled);
        $('#sidebarCompressed').prop('checked', this.entries.sidebarCompressed);
        $('#notificationsEnabled').prop('checked', this.entries.notificationsEnabled);
        $('#saveNotifsEnabled').prop('checked', this.entries.saveNotifsEnabled);
        $('#gainButtonsHidden').prop('checked', this.entries.gainButtonsHidden);
        $('#redDestroyButtons').prop('checked', this.entries.redDestroyButtons);
        $('#hideCompleted').prop('checked', this.entries.hideCompleted);

        // Update sidebar heights
        const sideTabs = document.getElementsByClassName("sideTab");
        for(var i = 0; i < sideTabs.length; i++){
            sideTabs[i].style.height = this.entries.sidebarCompressed ? "30px" : "60px";
        }

        // Update gain buttons
        const gainButtons = document.getElementsByClassName("gainButton");
        for(var i = 0; i < gainButtons.length; i++){
            gainButtons[i].className = this.entries.gainButtonsHidden ? "gainButton hidden" : "gainButton";
        }

        // Update completed items
        const completed = document.getElementsByClassName("completed");
        for(var i = 0; i < completed.length; i++){
            completed[i].className = this.entries.hideCompleted ? "completed hidden" : "completed";
        }

        // Update autosave selector
        for(var id in autoSaveMapping) {
            var element = $('#' + id);
            element.val(this.entries.autoSaveInterval === autoSaveMapping[id] ? 'on' : 'off');
        }

        this.reapplyTheme = true;
    };

    instance.loadLegacy = function(data) {
        if(data.currentTheme) {
            this.set('theme', data.currentTheme);
        }
    };

    instance.set = function(key, value) {
        this.entries[key] = value;
    };

    instance.initialise = function() {
        $('#formatSelector').change(function(){
            Game.settings.set('formatter', $(this).val());
        });

        $('#themeSelector').change(function(){
            Game.settings.set('theme', $(this).val());
            Game.settings.reapplyTheme = true;
        });

        $('#boldEnabled').change(function(){
            Game.settings.set('boldEnabled', $(this).is(':checked'));
        });

        $('#sidebarCompressed').change(function(){
            Game.settings.set('sidebarCompressed', $(this).is(':checked'));
            const sideTabs = document.getElementsByClassName("sideTab");
            for(var i = 0; i < sideTabs.length; i++){
                sideTabs[i].style.height = Game.settings.entries.sidebarCompressed ? "30px" : "60px";
            }
        });

        $('#notificationsEnabled').change(function(){
            Game.settings.set('notificationsEnabled', $(this).is(':checked'));
        });

        $('#saveNotifsEnabled').change(function(){
            Game.settings.set('saveNotifsEnabled', $(this).is(':checked'));
        });

        $('#gainButtonsHidden').change(function(){
            Game.settings.set('gainButtonsHidden', $(this).is(':checked'));
            const gainButtons = document.getElementsByClassName("gainButton");
            for(var i = 0; i < gainButtons.length; i++){
                gainButtons[i].className = Game.settings.entries.gainButtonsHidden ? "gainButton hidden" : "gainButton";
            }
        });

        $('#redDestroyButtons').change(function(){
            Game.settings.set('redDestroyButtons', $(this).is(':checked'));
            if(Game.tech.isPurchased('unlockDestruction')) {
                const destroyBtns = document.getElementsByClassName("destroy");
                for(var i = 0; i < destroyBtns.length; i++){
                    destroyBtns[i].className = Game.settings.entries.redDestroyButtons ? "btn btn-danger destroy" : "btn btn-default destroy";
                }
            }
        });

        $('#hideCompleted').change(function(){
            Game.settings.set('hideCompleted', $(this).is(':checked'));
            const completed = document.getElementsByClassName("completed");
            for(var i = 0; i < completed.length; i++){
                completed[i].className = Game.settings.entries.hideCompleted ? "completed hidden" : "completed";
            }
        });

        // AutoSave mapping
        for(var id in autoSaveMapping) {
            var element = $('#' + id);
            element.change({val: autoSaveMapping[id]}, function(args){
                Game.settings.set('autoSaveInterval', args.data.val);
            });
        }
    };

    instance.update = function(delta) {
        if(this.reapplyTheme) {
            this.reapplyTheme = false;
            this.updateTheme();
        }
    };

    instance.updateTheme = function() {
        var element = $('#theme_css');
        if(element.length === 0) return;

        if(this.entries.theme === "base") {
            element.attr('href', 'lib/bootstrap.min.css');
        } else {
            element.attr('href', 'styles/' + this.entries.theme + '-bootstrap.min.css');
        }
    };

    instance.updateCompanyName = function() {
        document.getElementById("companyName").textContent = companyName;
    };

    return instance;

}());
