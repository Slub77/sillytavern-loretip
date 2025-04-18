import {
  buildFancyDropdown,
  buildPrompt,
  BuildPromptOptions,
  ExtensionSettingsManager,
  getActiveWorldInfo,
} from 'sillytavern-utils-lib/types/world-info';
import { selected_group, st_createWorldInfoEntry, st_echo, this_chid } from 'sillytavern-utils-lib/config';
import { ChatCompletionMessage, ExtractedData } from 'sillytavern-utils-lib/types';
import { POPUP_TYPE } from 'sillytavern-utils-lib/types/popup';
import { DEFAULT_LOREBOOK_DEFINITION, DEFAULT_LOREBOOK_RULES, DEFAULT_ST_DESCRIPTION } from './constants.js';
import { DEFAULT_XML_DESCRIPTION, parseXMLOwn } from './xml.js';
import { WIEntry } from 'sillytavern-utils-lib/types/world-info';

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced } from "../../../../script.js";

// Keep track of where your extension is located, name should match repo name
const extensionName = "st-extension-loretip";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};
const LoreTipDebug = true;

const globalContext = SillyTavern.getContext();

 
// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
  //Create the settings if they don't exist
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  // Updating settings in the UI
  $("#LootTipsEnableToolTips").prop("checked", extension_settings[extensionName].example_setting).trigger("input");
}

// This function is called when the extension settings are changed in the UI
function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].LootTipEnable = value;
  saveSettingsDebounced();
}

// This function is called when the button is clicked
function onButtonClick() {
  // You can do whatever you want here
  // Let's make a popup appear with the checked setting
  toastr.info(
    `The checkbox is ${extension_settings[extensionName].example_setting ? "checked" : "not checked"}`,
    "A popup appeared because you clicked the button!"
  );
}

// This function is called when the extension is loaded
jQuery(async () => {
  // This is an example of loading HTML from a file
  const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);

  if(LoreTipDebug) console.log("Slub: Loaded Settings");

  // Append settingsHtml to extensions_settings
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings").append(settingsHtml);

  // These are examples of listening for events
  $("#LootTipsEnableToolTips").on("click", onExampleInput);
  $("#example_setting").on("input", onExampleInput);

  // Load settings when starting things up (if you have any)
  loadSettings();
});
