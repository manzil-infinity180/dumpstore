export function generateUserAgents(count: number): string[] {
  const userAgents: string[] = [];
  const baseOS = [
    "X11; Linux i686",
    "X11; Linux x86_64",
    "X11; Ubuntu i686",
    "X11; Ubuntu x86_64",
    "X11; Fedora i686",
  ];
  const baseChromeVersion = 111;
  const subVersionMax = 500;
  const webkitVersion = "537.36";
  const safariVersion = "537.36";

  for (let i = 0; i < count; i++) {
    const os = baseOS[Math.floor(Math.random() * baseOS.length)];
    const chromeVersion = `${baseChromeVersion}.${Math.floor(
      Math.random() * subVersionMax
    )}.${Math.floor(Math.random() * 100)}`;
    const userAgent = `Mozilla/5.0 (${os}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${chromeVersion} Safari/${safariVersion}`;
    userAgents.push(userAgent);
  }

  return userAgents;
}
