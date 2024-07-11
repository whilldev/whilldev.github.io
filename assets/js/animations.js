
var descriptionText = document.getElementById('description-text');
//single letter text
var letterText = descriptionText.textContent.split("");
var clutter = ""
letterText.forEach(function(elem){
    clutter += `<span class = "span-texts">${elem}</span>`
})

descriptionText.innerHTML = clutter;

var spanTexts = document.getElementsByClassName('span-texts');

gsap.from(spanTexts, {
    y:100,
    opacity:0,
    duration:1,
    delay:0.5,
    stagger:0.03
})