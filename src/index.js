const queryData = require('./query');

// make sure to export main, with the signature
function main(el, service, imEntity, state, config) {
	if (!state) state = {};
	if (!el || !service || !imEntity || !state || !config) {
		throw new Error('Call main with correct signature');
	}

	queryData(imEntity.Gene.value, service.root).then(data => {
		const { end, start, locatedOn } = data.chromosomeLocation;
		const loc = `${locatedOn.primaryIdentifier * 1}:${start}...${end}`;
		el.innerHTML = `
		<div class="rootContainer">
			<span class="chart-title">JBrowse Tool</span>
			<iframe src="${config.jbrowseUrl}${encodeURIComponent(
			service.root
		)}/service/jbrowse/config/9606&amp;loc=${loc}&amp;tracks=HumanMine-9606-Gene" width="1130" height="550"></iframe>
		</div>`;
	});
}

module.exports = { main };
