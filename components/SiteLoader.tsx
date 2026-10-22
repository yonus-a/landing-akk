export function SiteLoader() {
  return (
    <>
      <span aria-hidden className="site-loader">
        <span className="site-loader-orbit" />

        <svg viewBox="0 0 40 40" className="site-loader-globe" fill="none" strokeWidth="1.6">
          <circle cx="20" cy="20" r="14" />
          <path d="M6 20h28M8.5 13h23M8.5 27h23" strokeOpacity="0.45" />
          <ellipse className="site-loader-meridian" cx="20" cy="20" rx="6" ry="14" />
          <ellipse className="site-loader-meridian site-loader-meridian-late" cx="20" cy="20" rx="6" ry="14" />
        </svg>

        <span className="site-loader-flight">
          <span className="site-loader-trail" />
          <svg viewBox="0 0 24 24" className="site-loader-plane">
            <path d="M2 12 9.5 10.2 13 3h2l-1.6 7.2H20l1.8-2.2h1.2l-.8 4 .8 4h-1.2L20 13.8h-6.6L15 21h-2l-3.5-7.2Z" />
          </svg>
        </span>
      </span>
      <span className="site-loader-label text-sm font-medium text-zinc-500 dark:text-zinc-300">
        در حال بارگذاری...
      </span>
    </>
  );
}

export default SiteLoader;
