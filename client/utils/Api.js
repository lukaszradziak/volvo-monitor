const timeout = (time) => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), time);
  return controller;
};

const Api = async (path, post = null, config = { timeout: 5000 }) => {
  let body;

  if (post) {
    body = new FormData();
    Object.keys(post).forEach((name) => body.append(name, post[name]));
  }

  const request = await fetch(`http://192.168.4.1/api/${path}`, {
    signal: timeout(config.timeout).signal,
    method: post ? "POST" : "GET",
    body,
  });
  const text = await request.text();

  return text;
};

export default Api;
