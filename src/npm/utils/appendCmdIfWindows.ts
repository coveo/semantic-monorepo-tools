export default function appendCmdIfWindows(cmd) {
  return `${cmd}${process.platform === "win32" ? ".ps1" : ""}`;
}
