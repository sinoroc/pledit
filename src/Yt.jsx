//


function PlaylistEmbed({list}) {

  function getIdFromUrl(url) {
    const uid = new URL(url).searchParams.get('v');
    return uid;
  }

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
      title="Embedded playlist view"
      src={url}
      type="text/html">
      </iframe>
    );
  }

  const ids = list.map(item => getIdFromUrl(item.url)).join(',');

  return (
    <figure>
    <Iframe ids={ids} />
    <figcaption><Link ids={ids} /></figcaption>
    </figure>
  );
}

export {
  PlaylistEmbed,
};


// EOF
