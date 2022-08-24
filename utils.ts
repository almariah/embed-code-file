import path from "path";

const srcRegExp = /PATH:"([^"]*)"/i
const srcLinesRegExp = /LINES:"([^"]*)"/i
const titleRegExp = /TITLE:"([^"]*)"/i

export function pathJoin(dir: string, subpath: string): string {
  const result = path.join(dir, subpath);
  // it seems that obsidian do not understand paths with backslashes in Windows, so turn them into forward slashes
  return result.replace(/\\/g, "/");
}

export function analyseSrcLines(str: string): number[] {
	str = str.replace(/\s*/g, "")
	const result: number[] = []

	let strs = str.split(",")
	strs.forEach(it => {
		if(/\w+-\w+/.test(it)) {
			let left = Number(it.split('-')[0])
			let right = Number(it.split('-')[1])
			for(let i = left; i <= right; i++) {
				result.push(i)
			}
			result.push(0) // three dots
		} else {
			result.push(Number(it))
			result.push(0) // three dots
		}
	})

	return result
}

export function extractSrcPath(line: string): string {
	let matched = line.match(srcRegExp)
	if (matched == null) {
		return ""
	}
	return matched[1]
}

export function extractSrcLinesNums(codeBlockFirstLine: string): number[] {
    let srcLinesNum: number[] = []
    if (codeBlockFirstLine.match(srcLinesRegExp) != null) {
        let srcLinesNumInfo = codeBlockFirstLine.match(srcLinesRegExp)
        if (srcLinesNumInfo) {
            srcLinesNum = analyseSrcLines(srcLinesNumInfo[1])
        }
    }
    return srcLinesNum
}

export function extractSrcLines(fullSrc: string,  srcLinesNum: number[]): string {
    let src = ""

    const fullSrcLines = fullSrc.split("\n")
	const fullSrcLinesLen = fullSrcLines.length

	srcLinesNum.forEach((lineNum, index, arr) => {
		if (lineNum > fullSrcLinesLen) {
		  arr.splice(index, 1);
		}
	});

	srcLinesNum.forEach((lineNum, index, arr) => {
		if (lineNum == 0 && arr[index-1] == 0) {
		  arr.splice(index, 1);
		}
	});
	
    srcLinesNum.forEach((lineNum, index) => {
		if (lineNum > fullSrcLinesLen) {
			return
		}

		if (index == srcLinesNum.length-1 && lineNum == 0 && srcLinesNum[index-1] == fullSrcLinesLen) {
			return
		} 

		if (index == 0 && lineNum != 1) {
			src = '...' + '\n' + fullSrcLines[lineNum-1]
			return
		}
		
		// zeros is dots (analyseSrcLines)
        if (lineNum == 0 ) {
			src = src + '\n' + '...'
			return
		}

		if (index == 0) {
			src = fullSrcLines[lineNum-1]
		} else {
			src = src + '\n' + fullSrcLines[lineNum-1]
		}
	});

    return src
}

export function extractTitle(line: string): string {
	let matched = line.match(titleRegExp)
	if (matched == null) {
		return ""
	}
	return matched[1]
}
