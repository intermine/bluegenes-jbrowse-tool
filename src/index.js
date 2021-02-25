const queryData = require('./query');

// make sure to export main, with the signature
function main(el, service, imEntity, state, config) {
	if (!state) state = {};
	if (!el || !service || !imEntity || !state || !config) {
		throw new Error('Call main with correct signature');
	}

	queryData(imEntity.Gene.value, service.root).then(data => {
		const { end, start, locatedOn } = data.chromosomeLocation;
		const loc = `${locatedOn.primaryIdentifier}:${start}...${end}`;
		var iframe = document.createElement('iframe');
		// Ideally, we'd want JBrowse to fill the space when its container is
		// resized. If height is set on the container, we could simply set:
		//     el.style.height = '100%';
		// Sadly, there's no clean way to listen for that resize.
		iframe.src = `${config.jbrowseUrl}${encodeURIComponent(
			service.root
		)}/service/jbrowse/config/9606&amp;loc=${loc}&amp;tracks=HumanMine-9606-Gene`;
		iframe.width = '100%';
		iframe.height = '100%';
		iframe.frameBorder = 0;
		el.appendChild(iframe);
	});
}

module.exports = { main };
