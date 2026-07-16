// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

const _GENERATE_SUBJOURNAL = 1;
const _GENERATE_WHO = 2;
const _GENERATE_WHERE = 3;
const _GENERATE_PERSONALLOG = 4;
const _GENERATE_PERSONALBOND = 5;

const Historian = {
    // Constants
    moduleName: "✒️ Historian 📜",
    configCardName: "⚙️ Settings",
    journalCardName: "Master Journal",
    subJournalCardName: "Journal - ",
    whoCardSuffix: " - Who",
    whereCardSuffix: " - Where",
    logCardName: "'s Log",
    bondCardName: "'s Bond",

    // ------------------------------ //
    // ----- Settings to adjust ----- //
    // ------------------------------ //

    // List of main characters separated by comma
    mainCharacters: "Ewen,Duncan,Hamish",

    // Characters' alternative names/pet names/nicknames
    altNames: [
        { character: "Luna", altName: "Lùnastal" }
    ],

    // Default enable statuses
    d_defaultEnabled: true,
    d_elaborateWho: true,
    d_elaborateWhere: true,
    d_recordActivity: true,
    d_recordBond: true,
    d_autoAddCharacter: true,

    // Secret that goes into the beginning of the author's note
    secretText: "(Luna doesn't appear in the story unless the player specifically looks for her)",

    // ------------------------------ //
    // ------------------------------ //
    // ------------------------------ //

    // Default values
    d_delayStart: 8,

    d_maxJournalLength: 1775,
    d_maxSubJournal: 1,
    d_subJournalSegments: 4,
    d_journalExpiry: 10,

    d_maxLogLength: 775,
    d_characterDelay: 8,
    d_autoAddCharacterLimit: 3,

    // Supported AI models
    supportedModels: [ "DeepSeek", "DeepSeek V4 Flash", "Equinox", "Fable", "Gemma 4 31B", "Harbinger", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],

    // Prompts (tuned for at least 12B)
    journalPrompts: [
                    {
                        models: [ "DeepSeek", "DeepSeek V4 Flash", "Deepseek v4 Pro", "Equinox", "Fable", "Gemma 4 31B", "GLM 5.1", "GLM 5.2", "Harbinger", "Hermes 3 405B", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],
                        position: "END",
                        prompt: "### Generate below in addition to the story:\n\nFormat: |When~Where~Who~What|Story\n\n⚠️ DO NOT copy example text. Write ORIGINAL content.\n\nExtract from \"Recent Story\": create a 4W sentence about a player-involved promise.\n\nRules:\n- Start line with |\n- Max 35 words inside |...|\n- When = Time the promise should be fulfilled\n- Where = location name only (no prepositions)\n- Who = NPC name only (no prepositions, the NPC who interacts with the player)\n- What = The promise\n- Story = Your original story narrative\n- Order: When → Where → Who → What\n- Prepend formatted line before story\n\nExample (FORMAT ONLY): |today~library~Peter~read the new book|John walk out of the house."
                    }
                ],
        
    whoPrompts: [
                    {
                        models: [ "DeepSeek", "DeepSeek V4 Flash", "Deepseek v4 Pro", "Equinox", "Fable", "Gemma 4 31B", "GLM 5.1", "GLM 5.2", "Harbinger", "Hermes 3 405B", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],
                        position: "END",
                        prompt: "### Generate below in addition to the story:\n\nFormat: |Name~Description|Story\n\n⚠️ DO NOT copy example text. Write ORIGINAL content.\n\nCreate a character paragraph about \"[character]\" based on \"[event]\".\n\nRules:\n- Start line with |\n- Max 40 words inside |...|\n- Name = Name of the character provided\n- Description = One sentence description about the character provided\n- Story = Your original story narrative\n- Prepend formatted line before story\n\nExample (FORMAT ONLY): |Mary~A pretty lady with long red hair.|Kate walked forward cautiously."
                    }
                ],
        
    wherePrompts: [
                    {
                        models: [ "DeepSeek", "DeepSeek V4 Flash", "Deepseek v4 Pro", "Equinox", "Fable", "Gemma 4 31B", "GLM 5.1", "GLM 5.2", "Harbinger", "Hermes 3 405B", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],
                        position: "END",
                        prompt: "### Generate below in addition to the story:\n\nFormat: |Name~Description|Story\n\n⚠️ DO NOT copy example text. Write ORIGINAL content.\n\nCreate a location paragraph about \"[location]\" based on \"[event]\".\n\nRules:\n- Start line with |\n- Max 40 words inside |...|\n- Name = Name of the location provided\n- Description = One sentence description about the location provided\n- Story = Your original story narrative\n- Prepend formatted line before story\n\nExample (FORMAT ONLY): |Forest~A forest near the capital, where hunters go hunting.|Dark trees loomed ahead in the distance."
                    }
                ],

    activityPrompts: [
                    {
                        models: [ "DeepSeek", "DeepSeek V4 Flash", "Deepseek v4 Pro", "Equinox", "Fable", "Gemma 4 31B", "GLM 5.1", "GLM 5.2", "Harbinger", "Hermes 3 405B", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],
                        position: "END",
                        prompt: "### Generate below in addition to the story:\n\nFormat: |Name~Event|Story\n\n⚠️ DO NOT copy example text. Write ORIGINAL content.\n\nSelect the person who appeared most in \"Recent Story\" strictly from: [characters].\n\nCreate a paragraph about an event that happened to them:\n- Start line with |\n- Max 35 words inside |...|\n- Name = NPC name only (no prepositions)\n- Event = An event happened to the NPC (third person)\n- Story = Your original story narrative\n- Prepend formatted line before story\n\nExample (FORMAT ONLY): |John~He confronted his rival at the town square.|Duncan stepped forward with determination."
                    }
                ],

    bondPrompts: [
                    {
                        models: [ "DeepSeek", "DeepSeek V4 Flash", "Deepseek v4 Pro", "Equinox", "Fable", "Gemma 4 31B", "GLM 5.1", "GLM 5.2", "Harbinger", "Hermes 3 405B", "Hearthfire", "Madness", "Muse", "Nova", "Wayfarer Large", "Wayfarer Small 2" ],
                        position: "END",
                        prompt: "### Generate below in addition to the story:\n\nFormat: |Name~Relationship|Story\n\n⚠️ DO NOT copy example text. Write ORIGINAL content.\n\nSelect the person who appeared most in \"Recent Story\" strictly from: [characters].\n\nCreate a paragraph about the latest relationship between this person and the player:\n- Start line with |\n- Max 35 words inside |...|\n- Name = NPC name only (no prepositions)\n- Relationship = A description of the relationship (third person)\n- Story = Your original story narrative\n- Prepend formatted line before story\n\nExample (FORMAT ONLY): |Duncan~Your new boyfriend you met in a party,.|Peter came into the bathroom."
                    }
                ],

    // -------------------------------------------------- //

    injectSecret: function(text, secret) {
        let target = "[Author's note: ";
        let index = text.indexOf(target);
        let result = "";

        if (index < 0) return text;

        result += text.substring(0, text.indexOf(target) + target.length);
        result += secret + "\n\n";
        result += text.substring(text.indexOf(target) + target.length);

        return result;
    },

    // -------------------------------------------------- //

    getCharacterNames: function(includeYou) {
        let names = info.characters;
        let result = "";

        for (let i = 0; i < names.length; i++) {
            if (i > 0) result += ",";
            result += names[i];
        }

        if (includeYou && result.length > 0)
            result += ",you";

        return result;
    },

    getActionCount: function() {
        return info.actionCount;
    },

    getModelName: function() {
        // Lately, when game starts, info.storyModel is missing...
        if (info.storyModel === undefined || info.storyModel === null) return "(Empty)";

        return info.storyModel.name;
    },

    getSettingsCardDescription: function() {
        let result = "";
        
        result += "Updated: 15.07.2026" + "\n";
        result += "\n";

        result += "--------------------------------------------------" + "\n";
        result += "\n";

        result += "[Settings]" + "\n";
        result += "- Enable: true/false. Set to 'true' to use the script." + "\n";
        result += "- Elaborate Who: true/false. An additional card will be generated for the person mentioned in the journal." + "\n";
        result += "- Elaborate Where: true/false. An additional card will be generated for the place mentioned in the journal." + "\n";
        result += "- Characters: A list of main characters (excluding yourself), separated by commas." + "\n";
        result += "- Record Activity: true/false. Records the activities of a character." + "\n";
        result += "- Record Bond: true/false. Records the latest relationship between you and a character." + "\n";
        result += "- Auto Add Character: true/false. Adds newly identified characters from journals into the character list, if fewer than 3 characters are registered." + "\n";
        result += "\n";

        result += "[Supported AI models]" + "\n";
        result += this.supportedModels.toString().replaceAll(",", ", ") + "\n";
        result += "\n";

        result += "[Hidden settings]" + "\n";
        result += "- The script won't start before the " + this.d_delayStart.toString() + "th action." + "\n";
        result += "- Only " + this.d_maxSubJournal.toString() + " active journal at a time (Do things one by one!)." + "\n";
        result += "- Journals expire after " + this.d_journalExpiry.toString() + " actions." + "\n";
        result += "- Character log has a delay of " + this.d_characterDelay.toString() + " actions, but journal takes priority." + "\n";
        result += "    > Base delay = 8 actions. Increases based on the number of characters listed, starting from the 4th person onward." + "\n";
        result += "- The AI decides which character's log to update based on the number of mentions in the recent story." + "\n";
        result += "\n";

        result += "--------------------------------------------------" + "\n";
        result += "\n";

        result += "There are a couple of tweaks which can make the AI behave better, under scenario settings → Gameplay → AI Models:" + "\n";
        result += "\n";

        result += "> Memory System: Disable \"Optimized Context\" to use the script. (DeepSeek V4 Flash, Equinox, Gemma 4 31B)" + "\n";
        result += "> Model Settings: Adjust \"Response Length\" to 150~175, if possible." + "\n";
        result += "\n";

        result += "But the AI can still get confused. Erase and continue usually gets the story back on track." + "\n";
        result += "\n";

        result += "--------------------------------------------------" + "\n";
        result += "\n";

        result += "In case anyone wants to know what the script does behind the scenes:" + "\n";
        result += "https://github.com/Lunastal/Historian";

        return result;
    },

    getDefaultEnabled: function() {
        // May not work because info.storyModel is sometimes empty when game starts
        // return this.supportedModels.includes(this.getModelName());

        return this.d_defaultEnabled;
    },

    // -------------------------------------------------- //

    getStoryCard: function(searchText) {
        let cards = storyCards;
        let target = null;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].title === searchText) {
                target = cards[i];
                break;
            }
        }

        return target;
    },

    getStoryCardIndex: function(searchText) {
        let cards = storyCards;
        let index = -999;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].title === searchText) {
                index = i;
                break;
            }
        }

        return index;
    },

    // -------------------------------------------------- //

    getConfigCard: function() {
        return this.getStoryCard(this.configCardName);
    },

    getConfigCardIndex: function() {
        return this.getStoryCardIndex(this.configCardName);
    },

    addDefaultConfigCard: function() {
        let configCard = this.getConfigCard();
        if (!(configCard === undefined || configCard === null)) return configCard;

        // Create config card
        let entry = "";
        entry += "Enable: " + this.getDefaultEnabled().toString() + "\n";
        entry += "Elaborate Who: " + this.d_elaborateWho.toString() + "\n";
        entry += "Elaborate Where: " + this.d_elaborateWhere.toString() + "\n";
        entry += "Characters: " + this.mainCharacters + "\n";
        entry += "Record Activity: " + this.d_recordActivity.toString() + "\n";
        entry += "Record Bond: " + this.d_recordBond.toString() + "\n";
        entry += "Auto Add Character: " + this.d_autoAddCharacter.toString();

        return addStoryCard("", entry, this.moduleName, this.configCardName, this.getSettingsCardDescription(), { returnCard: true });
    },

    updateConfigCard: function(configObj) {
        let configCard = this.getConfigCard();
        if (configCard === undefined || configCard === null)
            configCard = this.addDefaultConfigCard();
        
        let configCardIndex = this.getConfigCardIndex();
        if (configCardIndex < 0) return;

        let updatedEntry = "";
        updatedEntry += "Enable: " + configObj.enabled.toString() + "\n";
        updatedEntry += "Elaborate Who: " + configObj.elaborateWho.toString() + "\n";
        updatedEntry += "Elaborate Where: " + configObj.elaborateWhere.toString() + "\n";
        updatedEntry += "Characters: " + configObj.characters + "\n";
        updatedEntry += "Record Activity: " + configObj.recordActivity.toString() + "\n";
        updatedEntry += "Record Bond: " + configObj.recordBond.toString() + "\n";
        updatedEntry += "Auto Add Character: " + configObj.autoAddCharacter.toString();

        updateStoryCard(configCardIndex, configCard.keys, updatedEntry, configCard.type, configCard.title, configCard.description);
    },

    getConfigObj: function() {
        let configCard = this.getConfigCard();
        if (configCard === undefined || configCard === null)
            configCard = this.addDefaultConfigCard();

        let resultObj = new Object();
        let sentences = configCard.entry.split("\n");

        sentences.forEach((element) => {
            if (element.startsWith("Enable:")) {
                resultObj.enabled = (element.substring(7).trim().toUpperCase() == "TRUE" ? true : false);
            } else if (element.startsWith("Elaborate Who:")) {
                resultObj.elaborateWho = (element.substring(14).trim().toUpperCase() == "TRUE" ? true : false);
            } else if (element.startsWith("Elaborate Where:")) {
                resultObj.elaborateWhere = (element.substring(16).trim().toUpperCase() == "TRUE" ? true : false);
            } else if (element.startsWith("Characters:")) {
                resultObj.characters = element.substring(11).trim();
            } else if (element.startsWith("Record Activity:")) {
                resultObj.recordActivity = (element.substring(16).trim().toUpperCase() == "TRUE" ? true : false);
            } else if (element.startsWith("Record Bond:")) {
                resultObj.recordBond = (element.substring(12).trim().toUpperCase() == "TRUE" ? true : false);
            } else if (element.startsWith("Auto Add Character:")) {
                resultObj.autoAddCharacter = (element.substring(19).trim().toUpperCase() == "TRUE" ? true : false);
            } else {
                // No idea what it is
            }
        });

        return resultObj;
    },

    // -------------------------------------------------- //

    getMasterJournal: function() {
        let card = this.getStoryCard(this.journalCardName);
        if (!(card === undefined || card === null)) return card;

        return addStoryCard("", "", this.moduleName, this.journalCardName, "", { returnCard: true });
    },

    appendMasterJournal: function(text) {
        // Master journal card won't be undefined, try to trust it...
        let card = this.getMasterJournal();
        let cardIndex = this.getStoryCardIndex(this.journalCardName);

        let entries = card.entry.split("\n");
        let updatedEntry = "";
        let updatedNotes = card.description;

        entries.push(this.getActionCount().toString() + ": " + text.trim());

        while (entries.toString().length > this.d_maxJournalLength) {
            if (updatedNotes.length > 0) updatedNotes += "\n";
            updatedNotes += entries[0];
            entries = entries.slice(1);
        }

        entries.forEach((element) => {
            if (updatedEntry.length > 0) updatedEntry += "\n";
            updatedEntry += element.replaceAll("\n\n", " ").replaceAll("\n", " ");
        });

        updateStoryCard(cardIndex, card.keys, updatedEntry, card.type, card.title, updatedNotes);
    },

    updateMasterJournal: function(subJournals) {
        // Master journal card won't be undefined, try to trust it...
        let card = this.getMasterJournal();
        let cardIndex = this.getStoryCardIndex(this.journalCardName);

        let updateText = "";

        subJournals.forEach((element) => {
            updateText += (updateText.length > 0 ? "\n" : "");

            // Already deleted sub journal
            if (element.isExpired && element.action < 0)
                updateText += "X: " + element.event;

            // Delete old sub journals
            if (element.isExpired && element.action > 0)
                updateText += "X: " + element.event;

            // Create new sub journals
            if (!element.isExpired)
                updateText += element.action.toString() + ": " + element.event;
        });

        updateStoryCard(cardIndex, card.keys, updateText, card.type, card.title);
    },

    getSubJournals: function() {
        // Master journal card won't be undefined, try to trust it...
        let card = this.getMasterJournal();

        let resultArr = [];
        let sentences = card.entry.split("\n");

        let a = 0;
        let e = "";

        sentences.forEach((element) => {
            a = element.substring(0, element.indexOf(":"));
            e = element.substring(element.indexOf(":") + 1);

            if (a.length > 0 && e.length > 0) {
                if (isNaN(a)) {
                    resultArr.push({
                        action: -999,
                        event: e.trim(),
                        cardName: this.subJournalCardName + "XXX",
                        expireAt: null,
                        isExpired: true
                    });
                } else {
                    resultArr.push({
                        action: Number(a),
                        event: e.trim(),
                        cardName: this.subJournalCardName + a.toString(),
                        expireAt: Number(a) + this.d_journalExpiry,
                        isExpired: ((Number(a) + this.d_journalExpiry) < this.getActionCount())
                    });
                }
            }
        });

        return resultArr;
    },

    addSubJournal: function(subJournal) {
        let card = this.getStoryCard(subJournal.cardName);
        if (!(card === undefined || card === null)) return;

        addStoryCard(this.getCharacterNames(true), subJournal.event, this.moduleName, subJournal.cardName, "Expires at action " + subJournal.expireAt.toString(), { returnCard: false });
    },

    deleteSubJournal: function(subJournal) {
        let cardIndex = -999;
        
        // Delete sub journal card
        cardIndex = this.getStoryCardIndex(subJournal.cardName);
        if (cardIndex === undefined || cardIndex === null) return;

        removeStoryCard(cardIndex);

        // Delete who card
        cardIndex = this.getStoryCardIndex(subJournal.cardName + this.whoCardSuffix);
        if (cardIndex === undefined || cardIndex === null) return;

        removeStoryCard(cardIndex);

        // Delete where card
        cardIndex = this.getStoryCardIndex(subJournal.cardName + this.whereCardSuffix);
        if (cardIndex === undefined || cardIndex === null) return;

        removeStoryCard(cardIndex);
    },

    addCharacterCard: function(subJournal, name, description) {
        let cardName = subJournal.cardName + this.whoCardSuffix;

        let card = this.getStoryCard(cardName);
        if (!(card === undefined || card === null)) return;

        addStoryCard(name, description, this.moduleName, cardName, "", { returnCard: false });
    },

    addLocationCard: function(subJournal, name, description) {
        let cardName = subJournal.cardName + this.whereCardSuffix;

        let card = this.getStoryCard(cardName);
        if (!(card === undefined || card === null)) return;

        addStoryCard(name, description, this.moduleName, cardName, "", { returnCard: false });
    },

    autoAddCharacter: function(name) {
        // Config object won't be undefined, try to trust it...
        let configObj = this.getConfigObj();
        let characters = configObj.characters.trim().split(",");

        if (characters.length >= this.d_autoAddCharacterLimit) return;

        if (configObj.characters.trim() === "") {
            // List is empty
            configObj.characters = this.parseAltName(name).trim();
        } else {
            let found = false;

            for (let i = 0; i < characters.length; i++) {
                if (characters[i].trim().toUpperCase() === name.toUpperCase()) found = true;
                if (characters[i].trim().toUpperCase() === this.parseAltName(name.trim()).toUpperCase()) found = true;

                if (found)
                    break;
            }
            
            // Name exists, do nothing
            if (found) return;

            // Add that random character into the list
            characters.push(this.parseAltName(name).trim());
            configObj.characters = characters.toString().trim();
        }

        this.updateConfigCard(configObj);
    },

    // -------------------------------------------------- //

    shouldGetSubJournal: function(subJournals) {
        let c = 0;
        
        subJournals.forEach((element) => {
            if (!element.isExpired) c++;
        });

        return (c < this.d_maxSubJournal);
    },

    maintainSubJournals: function() {
        let subJournals = this.getSubJournals();

        subJournals.forEach((element) => {
            // Delete old sub journals
            if (element.isExpired && element.action > 0)
                this.deleteSubJournal(element);

            // Create new sub journals
            if (!element.isExpired)
                this.addSubJournal(element);
        });

        this.updateMasterJournal(subJournals);
    },

    // -------------------------------------------------- //

    getCharacterDelay: function() {
        let result = this.d_characterDelay;
        let logs = this.getPersonalLogHistory();

        if (logs.length > 3)
            result += (logs.length - 3);

        return result;
    },

    parseAltName: function(name) {
        let result = name;

        for (let i = 0; i < this.altNames.length; i++) {
            if (this.altNames[i].altName.trim().toUpperCase() === name.trim().toUpperCase()) {
                result = this.altNames[i].character.trim();
            }
        }

        return result;
    },

    // -------------------------------------------------- //

    getPersonalLogHistory: function() {
        // Config object won't be undefined, try to trust it...
        let configObj = this.getConfigObj();
        let characters = configObj.characters.trim().split(",");

        let result = [];
        let card, cardName, entries, action;
        
        for (let i = 0; i < characters.length; i++) {
            cardName = characters[i].trim() + this.logCardName;
            card = this.getStoryCard(cardName);

            if (card === undefined || card === null) {
                // No card yet, brand new
                result.push({ name: characters[i].trim(), lastRound: 0 });
            } else {
                entries = card.entry.split("\n");

                if (entries.length < 1) {
                    // No entry yet, brand new
                    result.push({ name: characters[i].trim(), lastRound: 0 });
                } else {
                    action = entries.reverse()[0].split(":")[0];

                    if (isNaN(action)) {
                        // Deleted entries?
                        result.push({ name: characters[i].trim(), lastRound: 0 });
                    } else {
                        // Valid entry
                        result.push({ name: characters[i].trim(), lastRound: Number(action) });
                    }
                }
            }
        }

        return result;
    },

    getPersonalLogsToUpdate: function() {
        let logs = this.getPersonalLogHistory();
        let characters = "";
        
        logs.forEach((element) => {
            if (element.lastRound + this.getCharacterDelay() < this.getActionCount()) {
                if (characters.length > 0) characters += ",";
                characters += element.name;
            }
        });

        return characters;
    },

    // -------------------------------------------------- //

    getPersonalBondHistory: function() {
        // Config object won't be undefined, try to trust it...
        let configObj = this.getConfigObj();
        let characters = configObj.characters.trim().split(",");

        let result = [];
        let card, cardName, entries, action;
        
        for (let i = 0; i < characters.length; i++) {
            cardName = characters[i].trim() + this.bondCardName;
            card = this.getStoryCard(cardName);

            if (card === undefined || card === null) {
                // No card yet, brand new
                result.push({ name: characters[i].trim(), lastRound: 0 });
            } else {
                entries = card.entry.split("\n");

                if (entries.length < 1) {
                    // No entry yet, brand new
                    result.push({ name: characters[i].trim(), lastRound: 0 });
                } else {
                    action = entries.reverse()[0].split(":")[0];

                    if (isNaN(action)) {
                        // Deleted entries?
                        result.push({ name: characters[i].trim(), lastRound: 0 });
                    } else {
                        // Valid entry
                        result.push({ name: characters[i].trim(), lastRound: Number(action) });
                    }
                }
            }
        }

        return result;
    },

    getPersonalBondsToUpdate: function() {
        let logs = this.getPersonalBondHistory();
        let characters = "";
        
        logs.forEach((element) => {
            if (element.lastRound + this.getCharacterDelay() < this.getActionCount()) {
                if (characters.length > 0) characters += ",";
                characters += element.name;
            }
        });

        return characters;
    },

    // -------------------------------------------------- //

    addPersonalLogCard: function(name) {
        let cardName = name + this.logCardName;

        let card = this.getStoryCard(cardName);
        if (!(card === undefined || card === null)) return card;

        return addStoryCard(name, "", this.moduleName, cardName, "", { returnCard: true });
    },

    appendPersonalLog: function(name, content) {
        let cardName = name + this.logCardName;

        let card = this.getStoryCard(cardName);
        if (card === undefined || card === null)
            card = this.addPersonalLogCard(name);

        let cardIndex = this.getStoryCardIndex(cardName);
        
        let entries = card.entry.split("\n");
        let updatedEntry = "";
        let updatedNotes = card.description;

        entries.push(this.getActionCount().toString() + ": " + content.trim());

        while (entries.toString().length > this.d_maxLogLength) {
            if (updatedNotes.length > 0) updatedNotes += "\n";
            updatedNotes += entries[0];
            entries = entries.slice(1);
        }

        entries.forEach((element) => {
            if (updatedEntry.length > 0) updatedEntry += "\n";
            updatedEntry += element.replaceAll("\n\n", " ").replaceAll("\n", " ");
        });

        updateStoryCard(cardIndex, card.keys, updatedEntry, card.type, card.title, updatedNotes);
    },

    // -------------------------------------------------- //

    addPersonalBondCard: function(name) {
        let cardName = name + this.bondCardName;

        let card = this.getStoryCard(cardName);
        if (!(card === undefined || card === null)) return card;

        return addStoryCard(name, "", this.moduleName, cardName, "", { returnCard: true });
    },

    updatePersonalBond: function(name, content) {
        let cardName = name + this.bondCardName;

        let card = this.getStoryCard(cardName);
        if (card === undefined || card === null)
            card = this.addPersonalBondCard(name);

        let cardIndex = this.getStoryCardIndex(cardName);
        
        let updatedEntry = this.getActionCount() + ": " + content.trim();
        let updatedNotes = card.description;

        if (updatedNotes.length > 0) updatedNotes += "\n";
        updatedNotes += card.entry;

        updateStoryCard(cardIndex, card.keys, updatedEntry, card.type, card.title, updatedNotes);
    },

    // -------------------------------------------------- //

    getGenerationReport: function() {
        if (state.c_generationReport === undefined || state.c_generationReport === null) return null;
        return state.c_generationReport;
    },

    setGenerationReport: function(type, subJournal, characters) {
        state.c_generationReport = {
            type: type,
            subJournal: subJournal,
            characters: characters
        };
    },

    clearGenerationReport: function() {
        state.c_generationReport = null;
    },

    // -------------------------------------------------- //

    insertPrompt: function(text, prompts, placeholders) {
        let result = text;
        let prompt = "";

        for (let i = 0; i < prompts.length; i++) {
            if (prompts[i].models.includes(this.getModelName())) {
                prompt = prompts[i].prompt;

                placeholders.forEach((item) => {
                    prompt = prompt.replaceAll(item.placeholder, item.replacement);
                });

                if (prompts[i].position === "START") {
                    result = prompt + "\n" + result;
                } else if (prompts[i].position === "END") {
                    result = result + "\n" + prompt;
                } else {
                    // No change to original context
                }

                break;
            }
        }

        return result;
    },

    // -------------------------------------------------- //

    getInputHookText: function(text) {
        // First before everything
        this.addDefaultConfigCard();
        
        return { text: text, modified: false };
    },

    getContextHookText: function(text) {
        // First before everything
        this.addDefaultConfigCard();

        // Returns
        let result = text;
        let modified = false;

        // Always inject secret first...secret is not modification, but hidden facts
        if (this.secretText.length > 0)
            result = this.injectSecret(text, this.secretText);

        // Skip for the start
        let actionCount = this.getActionCount();
        if (actionCount < this.d_delayStart) return { text: result, modified: modified };

        // ----- Actual flow ----- //

        // Config object won't be undefined, try to trust it...
        let configObj = this.getConfigObj();

        // Return if module is not enabled
        if (!configObj.enabled) return { text: result, modified: modified };

        /****************************** Sub Journal ******************************/

        // Check current journal
        let subJournals = this.getSubJournals();

        // Generate for sub journal
        if (this.shouldGetSubJournal(subJournals)) {
            result = this.insertPrompt(result, this.journalPrompts, []);
            this.setGenerationReport(_GENERATE_SUBJOURNAL, null, null);
            modified = true;
        } else {
            // Priority is to supplement sub journals, so it is in the else clause

            let segments = [];
            let placeholders = [];

            for (let i = 0; i < subJournals.length; i++) {
                // Skip expired sub journals
                if (subJournals[i].isExpired) continue;

                // Break sub journal into parsable segments
                segments = subJournals[i].event.trim().split("~");

                // Skip sub journals in wrong format
                if (segments.length != this.d_subJournalSegments) continue;

                // Generate who
                if (configObj.elaborateWho) {
                    let whoCardName = subJournals[i].cardName + this.whoCardSuffix;
                    let whoCard = this.getStoryCard(whoCardName);

                    if (whoCard === undefined || whoCard === null) {
                        placeholders = [];
                        placeholders.push({ placeholder: "[event]", replacement: subJournals[i].event });
                        placeholders.push({ placeholder: "[character]", replacement: segments[2].trim() });

                        result = this.insertPrompt(result, this.whoPrompts, placeholders);
                        this.setGenerationReport(_GENERATE_WHO, subJournals[i], null);

                        // Got prompt, exit loop
                        modified = true;
                        break;
                    }
                }

                // Generate where
                if (configObj.elaborateWhere) {
                    let whereCardName = subJournals[i].cardName + this.whereCardSuffix;
                    let whereCard = this.getStoryCard(whereCardName);

                    if (whereCard === undefined || whereCard === null) {
                        placeholders = [];
                        placeholders.push({ placeholder: "[event]", replacement: subJournals[i].event });
                        placeholders.push({ placeholder: "[location]", replacement: segments[1].trim() });

                        result = this.insertPrompt(result, this.wherePrompts, placeholders);
                        this.setGenerationReport(_GENERATE_WHERE, subJournals[i], null);

                        // Got prompt, exit loop
                        modified = true;
                        break;
                    }
                }
            }
        }

        // Early exit point
        if (modified) return { text: result, modified: modified };

        /** Personal Log/Bond **/
        let characters = "";
        
        if (configObj.recordActivity) {
            // Check current personal log to update
            characters = this.getPersonalLogsToUpdate();

            // Generate personal log
            if (characters.length > 0) {
                let placeholders = [];
                placeholders.push({ placeholder: "[characters]", replacement: characters });

                result = this.insertPrompt(result, this.activityPrompts, placeholders);
                this.setGenerationReport(_GENERATE_PERSONALLOG, null, characters);

                modified = true;
            }
        }

        // Early exit point
        if (modified) return { text: result, modified: modified };
        
        if (configObj.recordBond) {
            // Check current personal bond to update
            characters = this.getPersonalBondsToUpdate();

            // Generate personal bond
            if (characters.length > 0) {
                let placeholders = [];
                placeholders.push({ placeholder: "[characters]", replacement: characters });

                result = this.insertPrompt(result, this.bondPrompts, placeholders);
                this.setGenerationReport(_GENERATE_PERSONALBOND, null, characters);

                modified = true;
            }
        }

        return { text: result, modified: modified };
    },

    getOutputHookText: function(text) {
        // Returns
        let result = text;
        let modified = false;

        // Skip for the start
        let actionCount = this.getActionCount();
        if (actionCount < this.d_delayStart) return { text: result, modified: modified };

        // ----- Actual flow ----- //

        // Config object won't be undefined, try to trust it...
        let configObj = this.getConfigObj();

        // Return if module is not enabled
        if (!configObj.enabled) return { text: result, modified: modified };

        // Return if stroke doesn't exist
        if (!text.includes("|")) return { text: result, modified: modified };

        // Start parsing
        let responses = result.split("|");

        // Success or fail, the result is modified...
        modified = true;
        
        if (responses.length == 3 && !responses[2].includes("#")) {
            // Story lines, may need formatting...
            let origStoryLine = responses[2].trimEnd();

            if (history.reverse()[0].type.toUpperCase() === "CONTINUE") {
                if (origStoryLine.startsWith("\n\n")) {
                    // Do nothing
                    result = origStoryLine;
                } else if (origStoryLine.startsWith("\n")) {
                    result = "\n" + origStoryLine;
                } else {
                    result = origStoryLine;
                }
            } else {
                // User performed action
                let padding = (origStoryLine.startsWith(" ") ? " " : "");
                origStoryLine = origStoryLine.trimStart();

                if (origStoryLine.startsWith("\n\n")) {
                    result = padding + origStoryLine.substring(2);
                } else if (origStoryLine.startsWith("\n")) {
                    result = padding + origStoryLine.substring(1);
                } else {
                    result = origStoryLine;
                }
            }

            let report = this.getGenerationReport();
            let segments;

            switch (report.type) {
                case _GENERATE_SUBJOURNAL:
                    // Sub journal
                    this.appendMasterJournal(responses[1].trim());
                    this.maintainSubJournals();

                    break;
                case _GENERATE_WHO:
                    // Character
                    segments = responses[1].trim().split("~");

                    if (segments.length == 2)
                        this.addCharacterCard(report.subJournal, segments[0].trim(), segments[1].trim());
                    
                    if (configObj.autoAddCharacter) {
                        // For characters randomly created by AI, like surprise girlfriend or a random highlander
                        this.autoAddCharacter(segments[0].trim());
                    }

                    break;
                case _GENERATE_WHERE:
                    // Location
                    segments = responses[1].trim().split("~");

                    if (segments.length == 2)
                        this.addLocationCard(report.subJournal, segments[0].trim(), segments[1].trim());

                    break;
                case _GENERATE_PERSONALLOG:
                    // Personal log
                    segments = responses[1].trim().split("~");

                    if (segments.length == 2) {
                        let characters = report.characters.split(",");
                        let personName = this.parseAltName(segments[0].trim());

                        if (characters.includes(personName))
                            this.appendPersonalLog(personName, segments[1].trim());
                    }

                    break;
                case _GENERATE_PERSONALBOND:
                    // Personal bond
                    segments = responses[1].trim().split("~");

                    if (segments.length == 2) {
                        let characters = report.characters.split(",");
                        let personName = this.parseAltName(segments[0].trim());

                        if (characters.includes(personName))
                            this.updatePersonalBond(personName, segments[1].trim());
                    }

                    break;
                default:
                    break;
            }

            this.clearGenerationReport();
        } else {
            result = "­";
        }

        return { text: result, modified: modified };
    }
};
