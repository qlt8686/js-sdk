export default new RegExp(
  'https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
);

// 匹配所有链接
// const firstSplit = new RegExp(
//   '.*https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|].*',
//   'g',
// );
// const secondSplit = new RegExp(
//   '(.*)(https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])(.*)',
// );
// const matchRroup = value.match(firstSplit);
// // console.log('matchRroup', matchRroup);
// return matchRroup?.map((i, idx) => {
//   const splitUrl = i.match(secondSplit);
//   const [pre, url, next] = [splitUrl[1], splitUrl[2], splitUrl[3]];
//   return (
//     <Fragment key={idx}>
//       {pre}
//       <a
//         alt='外链'
//         style={{
//           color: linkColor,
//         }}
//         href={url}
//         rel='noopener noreferrer'
//         target='_blank'
//       >
//         {url}
//       </a>
//       {next}
//     </Fragment>
//   );
// });
