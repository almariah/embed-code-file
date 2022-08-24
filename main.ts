import { Plugin, MarkdownView, MarkdownRenderer, TFile } from 'obsidian';
import { EmbedCodeFileSettingTab } from './settings';
import { EmbedCodeFileSettings, DEFAULT_SETTINGS} from "./settings";
import { extractSrcPath, extractSrcLinesNums, extractSrcLines} from "./utils";

export default class EmbedCodeFile extends Plugin {
	settings: EmbedCodeFileSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new EmbedCodeFileSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));


		// live preview renderers
		let supportedLanguages = this.settings.supportedLanguages.split(",")
		supportedLanguages.forEach(l => {
			console.log(`registering renderer for ${l}`)
			this.registerRenderer(l)
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async registerRenderer(l: string) {
		this.registerMarkdownCodeBlockProcessor(`src-${l}`, async (_src, el, ctx) => {
			let codeSection = ctx.getSectionInfo(el)
			let codeBlockFirstLine = ""
			let lineStart = 0
			if (codeSection) {
				lineStart = codeSection.lineStart
			}

			let view = app.workspace.getActiveViewOfType(MarkdownView)
			if (view) {
				codeBlockFirstLine = view.editor.getLine(lineStart)
			}

			let src = ""
			let srcPath = extractSrcPath(codeBlockFirstLine)
			if (srcPath != "") {
				let tFile = <TFile> app.vault.getAbstractFileByPath(srcPath)
				let fullSrc = await app.vault.read(tFile)

				let srcLinesNum = extractSrcLinesNums(codeBlockFirstLine)

				if (srcLinesNum.length == 0) {
					src = fullSrc
				} else {
					src = extractSrcLines(fullSrc, srcLinesNum)
				}	
			}

			await MarkdownRenderer.renderMarkdown('```' + l + '\n' + src + '\n```', el, '', this)

		});
	}
}

