import XLSX from 'xlsx';

export default function downloadExl({ json, type, name }) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(json, { header: Object.keys(json[0]), skipHeader: true });

  XLSX.utils.book_append_sheet(wb, ws, 'sheetName');

  const tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          wb,
          { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' }, // 这里的数据是用来定义导出的格式类型
        ),
      ),
    ],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ); // 创建二进制对象写入转换好的字节流
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(tmpDown);
  link.download = name || 'excel文件';
  link.click();
  window.URL.revokeObjectURL(link.href);
}

function s2ab(s) {
  // 字符串转字符流
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
