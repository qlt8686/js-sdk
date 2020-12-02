export default ({
  base64,
  maxWidth = Infinity,
  maxHeight = Infinity,
  outputType = 'file',
  outType = 'image/png',
  Orientation = 0,
}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const originWidth = img.width;
      const originHeight = img.height;

      // 目标尺寸
      let targetWidth = originWidth,
        targetHeight = originHeight;
      // 图片尺寸超过400x400的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight);

      switch (Orientation) {
        case 6: // 旋转90度
          canvas.width = targetHeight;
          canvas.height = targetWidth;
          context.rotate(Math.PI / 2);
          context.drawImage(img, 0, -targetHeight, targetWidth, targetHeight);
          break;
        case 3: // 旋转180度
          context.rotate(Math.PI);
          context.drawImage(
            img,
            -targetWidth,
            -targetHeight,
            targetWidth,
            targetHeight,
          );
          break;
        case 8: // 旋转-90度
          canvas.width = targetHeight;
          canvas.height = targetWidth;
          context.rotate((3 * Math.PI) / 2);
          context.drawImage(img, -targetWidth, 0, targetWidth, targetHeight);
          break;
        default:
          context.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      const buffer = context.getImageData(0, 0, targetHeight, targetWidth);

      switch (outputType) {
        case 'file':
          canvas.toBlob(blob => {
            // 图片ajax上传

            resolve(blob);
            // 用于测试 , 下载到本地
            // var blobURL = window.URL.createObjectURL(blob);
            // var tempLink = document.createElement("a");
            // tempLink.style.display = "none";
            // tempLink.href = blobURL;
            // tempLink.setAttribute(
            //   "download",
            //   "msr-" + new Date().toISOString().replace(/:|\./g, "-") + ".png"
            // );
            // document.body.appendChild(tempLink);
            // tempLink.click();
          }, outType);
          break;
        case 'base64':
          resolve(canvas.toDataURL());
          break;
        case 'buffer':
          resolve(buffer.data);
          break;
        default:
          reject('error, no output type.');
          break;
      }
    }; // CHANGE to whatever function you want which would eventually call resolve
  });
};
