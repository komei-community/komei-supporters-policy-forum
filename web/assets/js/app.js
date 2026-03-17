(() => {
  const main = document.querySelector("main.page-content .wrapper");
  if (!main) return;

  const isInternal = (url) => {
    try {
      const u = new URL(url, window.location.origin);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  const loadPath = async (path, push) => {
    const res = await fetch(path);
    if (!res.ok) {
      window.location.href = path;
      return;
    }
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    const newMain = dom.querySelector("main.page-content .wrapper");
    if (!newMain) {
      window.location.href = path;
      return;
    }
    main.innerHTML = newMain.innerHTML;
    if (push) {
      history.pushState({ path }, "", path);
    }
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    const url = new URL(href, window.location.origin);
    if (!isInternal(url.href)) return;
    if (!url.pathname.startsWith(window.location.pathname.split("/")[1] || "")) {
      // プロジェクトルート外はそのまま遷移
      return;
    }
    e.preventDefault();
    loadPath(url.pathname + url.search + url.hash, true);
  });

  window.addEventListener("popstate", (e) => {
    const path = (e.state && e.state.path) || window.location.pathname;
    loadPath(path, false);
  });
})();

