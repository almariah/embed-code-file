import { Plugin, MarkdownRenderer, TFile, MarkdownPostProcessorContext, MarkdownView, Notice} from 'obsidian';
import { EmbedCodeFileSettings, EmbedCodeFileSettingTab, DEFAULT_SETTINGS} from "./settings";
import { extractSrcPath, extractSrcLinesNums, extractSrcLines, extractTitle} from "./utils";

export default class EmbedCodeFile extends Plugin {
	settings: EmbedCodeFileSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new EmbedCodeFileSettingTab(this.app, this));

		this.registerMarkdownPostProcessor((element, context) => {
			this.addTitle(element, context);
		});

		// live preview renderers
		const supportedLanguages = this.settings.includedLanguages.split(",")
		supportedLanguages.forEach(l => {
			console.log(`registering renderer for ${l}`)
			this.registerRenderer(l)
		});
	}

	onunload() {
		document
		.querySelectorAll(".obsidian-embed-code-file")
		.forEach((x) => x.remove());
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async registerRenderer(lang: string) {
		this.registerMarkdownCodeBlockProcessor(`embed-${lang}`, async (meta, el, ctx) => {
			let src = ""
			const srcPath = extractSrcPath(meta)
			if (srcPath != "") {
				const tFile = <TFile> app.vault.getAbstractFileByPath(srcPath)
				if (!tFile) {
					const errMsg = `\`ERROR: could't read file '${srcPath}'\``
					await MarkdownRenderer.renderMarkdown(errMsg, el, '', this)
					return
				}

				const fullSrc = await app.vault.read(tFile)
				const srcLinesNum = extractSrcLinesNums(meta)

				if (srcLinesNum.length == 0) {
					src = fullSrc
				} else {
					src = extractSrcLines(fullSrc, srcLinesNum)
				}
			}

			let title = extractTitle(meta)
			if (title == "") {
				title = srcPath
			}

			await MarkdownRenderer.renderMarkdown('```' + lang + '\n' + src + '\n```', el, '', this)
			this.addTitleLivePreview(el, title);
		});
	}

	addTitleLivePreview(el: HTMLElement, title: string) {
		const codeElm = el.querySelector('pre > code')
		if (!codeElm) { return }
		const pre = codeElm.parentElement as HTMLPreElement;

		this.insertTitlePreElement(pre, title)
	}

	addTitle(el: HTMLElement, context: MarkdownPostProcessorContext) {
		let codeElm = el.querySelector('pre > code')
		if (!codeElm) {
			return
		}
		
		const pre = codeElm.parentElement as HTMLPreElement;

		const codeSection = context.getSectionInfo(pre)
		if (!codeSection) {
			return
		}

		const view = app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) {
			return
		}
		
		const num = codeSection.lineStart
		const codeBlockFirstLine = view.editor.getLine(num)

		const title = extractTitle(codeBlockFirstLine)
		if (title == "") {
			return
		}

		this.insertTitlePreElement(pre, title)
	}

	insertTitlePreElement(pre: HTMLPreElement, title: string) {
		pre
		.querySelectorAll(".obsidian-embed-code-file")
		.forEach((x) => x.remove());

		let titleElement = document.createElement("pre");
		titleElement.appendText(title);
		titleElement.className = "obsidian-embed-code-file";
		titleElement.style.color = this.settings.titleFontColor;
		titleElement.style.backgroundColor = this.settings.titleBackgroundColor;
		pre.prepend(titleElement);
	}
}
