function home_index(ver, refs) {
  function href(fname) {
    return `
<a href="./${fname}?v=${ver}" target="_blank"> ${fname} </a><br/>
`;
  }

  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>skt?v=${ver}</title>
</head>

<body>

<h1> 
  jht DICE pages 2021-06-10 ?v=26
<h1/>
<h2> 
  <a href="./dice_faces?v=26" target="_blank"> dice_faces </a><br/>
  <a href="./dice_multi_mirror?v=26" target="_blank"> dice_multi_mirror </a><br/>
  <a href="./dice_video_HD_filter-xt90rp8XO?v=26" target="_blank"> dice_video_HD_filter-xt90rp8XO </a><br/>
  <a href="./fft_mic?v=26" target="_blank"> fft_mic </a><br/>
  ${refs.map(href).join('\n')}
  ${refs
    .map(
      (fname) => `
<a href="./${fname}?v=${ver}" target="_blank"> ${fname} </a><br/>
`
    )
    .join('\n')}
</h2> 

</body>
</html>
`;
}
