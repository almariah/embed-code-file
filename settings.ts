import EmbedCodeFile from './main';

import { PluginSettingTab, Setting, App } from 'obsidian';

export interface EmbedCodeFileSettings {
	includedLanguages: string;
	titleBackgroundColor: string;
	titleFontColor: string;
	displayIpynbAsPython: boolean;
	showIpynbCellNumbers: boolean;
}

export const DEFAULT_SETTINGS: EmbedCodeFileSettings = {
	includedLanguages: 'c,cs,cpp,java,python,go,ruby,javascript,js,typescript,ts,shell,sh,bash,ipynb',
	titleBackgroundColor: "#00000020",
	titleFontColor: "",
	displayIpynbAsPython: true,
	showIpynbCellNumbers: true,
}

export class EmbedCodeFileSettingTab extends PluginSettingTab {
	plugin: EmbedCodeFile;

	constructor(app: App, plugin: EmbedCodeFile) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Embed Code File Settings'});

		new Setting(containerEl)
			.setName('Included Languages')
			.setDesc('Comma separated list of included languages.')
			.addText(text => text
				.setPlaceholder('Comma separated list')
				.setValue(this.plugin.settings.includedLanguages)
				.onChange(async (value) => {
					this.plugin.settings.includedLanguages = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Font color of title")
			.addText(text => text
				.setPlaceholder('Enter a color')
				.setValue(this.plugin.settings.titleFontColor)
				.onChange(async (value) => {
					this.plugin.settings.titleFontColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Background color of title')
			.addText(text => text
				.setPlaceholder('#00000020')
				.setValue(this.plugin.settings.titleBackgroundColor)
				.onChange(async (value) => {
					this.plugin.settings.titleBackgroundColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Display Jupyter Notebooks as python')
			.setDesc('Parse .ipynb files to extract and display their python source code.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.displayIpynbAsPython)
				.onChange(async (value) => {
					this.plugin.settings.displayIpynbAsPython = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Jupyter Notebook Cell Numbers')
			.setDesc('Show Jupyter Notebook cell numbers in the embedded python code.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showIpynbCellNumbers)
				.onChange(async (value) => {
					this.plugin.settings.showIpynbCellNumbers = value;
					await this.plugin.saveSettings();
				}));

	}
}
