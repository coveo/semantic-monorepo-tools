export const appendCmdIfWindows = (cmd) =>
  `${cmd}${process.platform === "win32" ? ".cmd" : ""}`;
