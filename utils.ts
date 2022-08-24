import path from "path";

const srcRegExp = /SRC:"([^"]*)"/i
export const srcLinesRegExp = /LINES:"([^"]*)"/i

export function pathJoin(dir: string, subpath: string): string {
  const result = path.join(dir, subpath);
  // it seems that obsidian do not understand paths with backslashes in Windows, so turn them into forward slashes
  return result.replace(/\\/g, "/");
}

export function analyseSrcLines(str: string): number[] {
	str = str.replace(/\s*/g, "") // 去除字符串中所有空格
	const result: number[] = []

	let strs = str.split(",")
	strs.forEach(it => {
		if(/\w+-\w+/.test(it)) { // 如果匹配 1-3 这样的格式，依次添加数字
			let left = Number(it.split('-')[0])
			let right = Number(it.split('-')[1])
			for(let i = left; i <= right; i++) {
				result.push(i)
			}
      result.push(0)
		} else {
			result.push(Number(it))
      result.push(0)
		}
	})

	return result
}

export function extractSrcPath(line: string): string {
  let src: string = "" 
	let matched = line.match(srcRegExp)
	if (matched == null) {
		return ""
	}
	return matched[1]
}

export function extractSrcLinesNums(codeBlockFirstLine: string): number[] {
    let srcLinesNum: number[] = []
    if (codeBlockFirstLine.match(srcLinesRegExp) != null) {
        let srcLinesInfo = codeBlockFirstLine.match(srcLinesRegExp)
        if (srcLinesInfo) {
            srcLinesNum = analyseSrcLines(srcLinesInfo[1])
        }
    }
    return srcLinesNum
}

export function extractSrcLines(fullSrc: string,  srcLinesNum: number[]): string {
    let src = ""

    const fullSrcLines = fullSrc.split("\n")

    srcLinesNum.forEach((lineNum, index) => {
        if (lineNum == 0 ) {
			src = src + '\n' + '...'
			return
		}

		if (index == 0 && lineNum != 1) {
			src = '...' + '\n' + fullSrcLines[lineNum-1]
			return
		}

		// case for end of file
        // and case for out of range

		if (index == 0) {
			src = fullSrcLines[lineNum-1]
		} else {
			src = src + '\n' + fullSrcLines[lineNum-1]
		}
	});

    return src
}
