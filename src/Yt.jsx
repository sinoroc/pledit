//


function PlaylistEmbed({list}) {

  function buildEmbedUrl(vids) {
    const url = `https://www.youtube-nocookie.com/embed?playlist=${vids}`;
    return url;
  }

  function buildExtUrl(vids) {
    const url = `https://www.youtube.com/watch_videos?video_ids=${vids}`;
    return url;
  }

  function Link({vids}) {
    const url = buildExtUrl(vids);
    return (
      <a href={url}>View on YouTube</a>
    );
  }

  function Iframe({vids}) {
    const url = buildEmbedUrl(vids);
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

  const vids = list.map(track => track.vid).join(',');

  return (
    <figure>
    <Iframe vids={vids} />
    <figcaption><Link vids={vids} /></figcaption>
    </figure>
  );
}

function getUrl(vid) {
  let url = null;
  if (vid !== null) {
    url = `https://www.youtube.com/watch?v=${vid}`;
  }
  return url;
}

function getVid(str) {
  let vid = null;
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
      vid = url.searchParams.get('v');
    }
  } else if (shortHostNames.includes(url.hostname)) {
    const pathParts = url.pathname.split('/');
    if (pathParts.length > 1) {
      vid = pathParts[1];
    }
  }
  return vid;
}

const PATTERN = '^((?:https:?:)?\\/\\/)?((?:www|m|music)\\.)?((?:youtube(-nocookie)?\\.com|youtu\\.be))\\/.*$';

export {
  getUrl,
  getVid,
  PATTERN,
  PlaylistEmbed,
};


// EOF
