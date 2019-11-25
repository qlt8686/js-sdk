export default function autoCompHttp(str) {
  const reg = new RegExp("^http");
  return str.match(reg) ? str : `http://${str}`;
}
