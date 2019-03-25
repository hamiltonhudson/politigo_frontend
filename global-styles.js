import myfont from '../Gloss_And_Bloom.ttf';
injectGlobal`
  @font-face {
    font-family: 'Gloss And Bloom';
    src: url(${myFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }`

injectGlobal`
@font-face {
  font-family: "Richie Brusher";
  src: url('../Richie Brusher.ttf') format("truetype");
}`

injectGlobal`
@font-face {
  font-family: "LeviReBrushed";
  src: url('../LeviReBrushed.ttf') format("truetype");
}
