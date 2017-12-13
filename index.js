const episodes = Array.from(document.getElementsByClassName('episodecell'));
const container = episodes[0].previousElementSibling;
let podcasts = {};

episodes.forEach(episodeCell => {
    const podcastName = episodeCell.getElementsByClassName('caption2')[0].innerText.trim();
    if (!podcasts[podcastName]) {
        podcasts[podcastName] = {
            name: podcastName,
            image: episodeCell.getElementsByClassName('art')[0].cloneNode(),
            episodes: []
        }
    }
    podcasts[podcastName].episodes.push(episodeCell);
});

const wrappers = Object.keys(podcasts).sort().map(podcastName => {
        return renderEpisodeContainer(podcasts[podcastName]);
});

wrappers.forEach(wrapper => {
    container.insertAdjacentElement('afterend', wrapper);
})


function renderEpisodeContainer(podcast) {
    const wrapper = document.createElement('div');
    const episodesContainer = document.createElement('div');
    const header = document.createElement('div');
    const title = document.createElement('h3');
    const episodeCount = podcast.episodes.length;
    title.classList.add('boc-title');
    title.innerText = podcast.name;
    title.setAttribute('data-episode-count',
        `${episodeCount} ${episodeCount === 1 ? 'episode' : 'episodes'}`
    );

    header.appendChild(title);
    wrapper.appendChild(header);
    episodesContainer.classList.add('boc-episode-container');
    episodesContainer.classList.add('boc-collapsed-episode-container');

    podcast.episodes.forEach(episodeCell => {
        episodesContainer.appendChild(episodeCell);
    });

    wrapper.appendChild(episodesContainer);

    title.addEventListener('click', toggleOpen);

    return wrapper;
}

function toggleOpen(event) {
    const clickedTitle = event.target;
    const container = clickedTitle.parentElement.nextElementSibling;
    if (container.classList.contains('boc-collapsed-episode-container')) {
        container.classList.remove('boc-collapsed-episode-container');
    } else {
        container.classList.add('boc-collapsed-episode-container');
    }
}