const queryData = require('./query');

// make sure to export main, with the signature
function main(el, service, imEntity, state, config) {
	if (!state) state = {};
	if (!el || !service || !imEntity || !state || !config) {
		throw new Error('Call main with correct signature');
	}

	queryData(imEntity.Gene.value, service.root)
		.then(data => {
			const { end, start, locatedOn } = data.chromosomeLocation;
			const { taxonId } = data.organism;
			const loc = `${locatedOn.primaryIdentifier}:${start}...${end}`;
			const dataParam = `${service.root}/service/jbrowse/config/${taxonId}`;

			fetch(`${service.root}/service/web-properties`)
				.then(res => res.json())
				.then(obj => {
					const mine = obj['web-properties'].project.title;

					var iframe = document.createElement('iframe');
					// Ideally, we'd want JBrowse to fill the space when its container is
					// resized. If height is set on the container, we could simply set:
					//     el.style.height = '100%';
					// Sadly, there's no clean way to listen for that resize.
					iframe.src = `${config.jbrowseUrl}${encodeURIComponent(
						dataParam
					)}&loc=${loc}&tracks=${mine}-${taxonId}-Gene`;
					iframe.width = '100%';
					iframe.height = '100%';
					iframe.frameBorder = 0;
					el.appendChild(iframe);
				})
				.catch(() => {
					el.appendChild(document.createTextNode('Failed to start JBrowse'));
				});
		})
		.catch(() => {
			el.appendChild(document.createTextNode('Not available for this object'));
		});
}

module.exports = { main };
