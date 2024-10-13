#!/usr/bin/env node

'use strict'

const fs = require('node:fs')

const prepareSvgFile = (svg) => {
	return svg
		.replace(/\n/g, '')
		.replace(/>\s+</g, '><')
		.replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s?\/>/, '')
		;
}

const iconsPkg = require('./node_modules/@tabler/icons/package.json')

const generateIconsJSON = (jsonFile, filename) => {
	const files = JSON.parse(fs.readFileSync(jsonFile))

	let svgList = [];
	let svgData = {
		version: iconsPkg.version,
		icons: []
	}

	for (let iconName in files) {
		let iconData = files[iconName]
		Object.keys(iconData.styles).forEach(style => {
			let name = iconName;
			if (iconData.styles.filled) {
				name += `_${style}`
			} 
			svgList.push({
				name: name,
				category: iconData.category,
				tags: iconData.tags?.filter(x => x).map(x => x.toString()) || [],
				svg: prepareSvgFile(fs.readFileSync(`./node_modules/@tabler/icons/icons/${style}/${iconName}.svg`).toString())
			})
		})
	}

	svgData.version = iconsPkg.version
	svgData.icons = svgList

	fs.writeFileSync(filename, JSON.stringify(svgData))
}

generateIconsJSON('./node_modules/@tabler/icons/icons.json', `./src/icons.json`)
