export default function copy(value: any, success = () => {}, fail = () => {}) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', value);
  input.select();
  const ok = document.execCommand('copy');
  if (ok) {
    success();
  } else {
    fail();
  }
  document.body.removeChild(input);
}
