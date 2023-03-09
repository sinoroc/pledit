//


function PlaylistEmbed({list}) {

  function buildEmbedUrl(ids) {
    const url = `https://www.youtube-nocookie.com/embed?playlist=${ids}`;
    return url;
  }

  function buildExtUrl(ids) {
    const url = `https://www.youtube.com/watch_videos?video_ids=${ids}`;
    return url;
  }

  function Link({ids}) {
    const url = buildExtUrl(ids);
    return (
      <a href={url}>View on YouTube</a>
    );
  }

  function Iframe({ids}) {
    const url = buildEmbedUrl(ids);
    return (
      <iframe
      allow="fullscreen"
      height={270}
      src={url}
      title="Embedded playlist view"
      type="text/html"
      width={480}
      >
      </iframe>
    );
  }

  const ids = list.map(item => extractId(item.url)).join(',');

  return (
    <figure>
    <Iframe ids={ids} />
    <figcaption><Link ids={ids} /></figcaption>
    </figure>
  );
}

function makeCanonicalUrl(str) {
  let url = null;
  const id = extractId(str);
  if (id !== null) {
    url = canonicalUrl(id);
  }
  return url;
}

function canonicalUrl(id) {
  let url = null;
  if (id !== null) {
    url = `https://www.youtube.com/watch?v=${id}`;
  }
  return url;
}

function extractId(str) {
  let id = null;
  const url = new URL(str);
  const longHostNames = [
    'youtube.com',
    'youtube-nocookie.com',
    'm.youtube.com',
    'music.youtube.com',
    'www.youtube.com',
    'www.youtube-nocookie.com',
  ];
  const shortHostNames = [
    'youtu.be',
  ];
  if (longHostNames.includes(url.hostname)) {
    if (url.searchParams.has('v')) {
      id = url.searchParams.get('v');
    }
  } else if (shortHostNames.includes(url.hostname)) {
    const pathParts = url.pathname.split('/');
    if (pathParts.length > 1) {
      id = pathParts[1];
    }
  }
  return id;
}

export {
  makeCanonicalUrl,
  PlaylistEmbed,
};


// EOF
