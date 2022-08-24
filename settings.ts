import EmbedCodeFile from './main';

import { PluginSettingTab, Setting, App } from 'obsidian';

export interface EmbedCodeFileSettings {
	supportedLanguages: string;
}

export const DEFAULT_SETTINGS: EmbedCodeFileSettings = {
	supportedLanguages: 'c,cpp,java,shell'
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
			.setName('Supported Languages')
			.setDesc('Comma separated list of supported languages.')
			.addText(text => text
				.setPlaceholder('Comma separated list')
				.setValue(this.plugin.settings.supportedLanguages)
				.onChange(async (value) => {
					this.plugin.settings.supportedLanguages = value;
					await this.plugin.saveSettings();
				}));
	}
}
