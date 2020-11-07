(async () => {
    const episodes = Array.from(document.getElementsByClassName('episodecell'));
    const container = episodes[0].previousElementSibling;
    let podcasts = {};
    var episodeRequests = episodes.map(episodeCell => {
        const artURL = episodeCell.getElementsByClassName('art')[0].src;
        let promise = null;
        if (!podcasts[artURL]) {
            podcasts[artURL] = {
                artURL,
                image: episodeCell.getElementsByClassName('art')[0].cloneNode(),
                episodes: [],
                name: 'Podcast name not found'
            };
            
            promise = new Promise(async (resolve, reject) => {
                const storedName = await browser.storage.local.get(artURL);
                if (storedName[artURL] !== undefined) {
                    podcasts[artURL].name = storedName[artURL];
                    resolve(artURL);
                    return;
                }
                
                
                fetch(episodeCell.href).then(async episodeResponse => {
                    var episodeResponseBodyReader = episodeResponse.body.getReader();
                    try {
                        let { value: chunk, done: readerDone } = await episodeResponseBodyReader.read();
                        const utf8Decoder = new TextDecoder('utf-8');
                        chunk = chunk ? utf8Decoder.decode(chunk) : '';
                        const div = document.createElement('div');
                        div.innerHTML = chunk;
                        let h3s = div.getElementsByTagName('h3');
                        if (h3s.length === 1) {
                            podcasts[artURL].name = h3s[0].innerText.trim();
                            await browser.storage.local.set({
                                [artURL] : podcasts[artURL].name
                            });
                        }
                    } catch (e) { }
                    resolve(artURL);
                }).catch(async e => {
                    resolve(artURL);
                });
            });
        }
        podcasts[artURL].episodes.push(episodeCell);
        return promise;
    });

    const wrappers = Object.keys(podcasts).sort().map(artURL => {
        podcasts[artURL].container = renderEpisodeContainer(podcasts[artURL]);
        return podcasts[artURL].container;
    });

    wrappers.forEach(wrapper => {
        container.insertAdjacentElement('afterend', wrapper);
    })


    function renderEpisodeContainer(podcast) {
        const episodeCount = podcast.episodes.length;
        const tpl = `
<div class="boc-podcast-container">
    <div class="boc-podcast-art-container">
        <img class="boc-podcast-art" src="${podcast.artURL}" />
    </div>
    <div class="boc-episodes-container">
        <h3 class="boc-podcast-title loading">...</h3>
        <h4 class="boc-podcast-subtitle">${episodeCount} ${episodeCount === 1 ? 'episode' : 'episodes'}</h4>
        <div class="boc-episodes-list"></div>
    </div>
</div>
    `;

        const container = document.createElement('div');
        container.className=  'boc-main-wrapper boc-collapsed-episode-container';
        container.innerHTML = tpl;
        const episodesContainer = container.getElementsByClassName('boc-episodes-list')[0];

        podcast.episodes.forEach(episodeCell => {
            episodesContainer.appendChild(episodeCell);
        });

        container.addEventListener('click', toggleOpen);

        return container;
    }

    function toggleOpen(event) {
        let target = event.target;
        let linkClicked = false;
        while(true){
            if (target.classList.contains('boc-main-wrapper')) {
                break;
            }
            if (target.classList.contains('episodecell')) {
                linkClicked = true;
                break;
            }
            target = target.parentElement;
        }
        if (linkClicked) {
            return;
        }
        event.preventDefault();
        const container = event.currentTarget;
        if (container.classList.contains('boc-collapsed-episode-container')) {
            container.classList.remove('boc-collapsed-episode-container');
        } else {
            container.classList.add('boc-collapsed-episode-container');
        }
    }


    console.log('waiting now...', podcasts);
    episodeRequests.forEach(async (p)=> {
        const artURL = await p;
        var podcastInfo = podcasts[artURL];
        if (!podcastInfo.container) {
            return;
        }
        var titleContainer = podcastInfo.container.getElementsByClassName('boc-podcast-title')[0];
        titleContainer.innerText = podcastInfo.name;
        titleContainer.classList.remove('loading');
    });

})();