


const d = document;
const $q = d.querySelectorAll.bind(d);
const $g = d.querySelector.bind(d);
const $prev = $g(".prev");
const $next = $g(".next");
const $list = $g(".carousel__list");
let auto;
let pauser;

const getActiveIndex = () => {
    const $active = $g("[data-active]");
    return getSlideIndex($active);
}

const getSlideIndex = ($slide) => {
    return [...$q(".carousel__item")].indexOf( $slide );
}

const prevSlide = () => {
    const index = getActiveIndex();
    const $slides = $q(".carousel__item");
    const $last = $slides[$slides.length-1];
    $last.remove();
    $list.prepend($last);
    activateSlide( $q(".carousel__item")[index] );
}
const nextSlide = () => {
    const index = getActiveIndex();
    const $slides = $q(".carousel__item");
    const $first = $slides[0];
    $first.remove();
    $list.append($first);
    activateSlide( $q(".carousel__item")[index] );
}

const chooseSlide = (e) => {
    const max = (window.matchMedia("screen and ( max-width: 600px)").matches) ? 5 : 8;
    const $slide = e.target.closest( ".carousel__item" );
    const index = getSlideIndex( $slide );
    if ( index < 3 || index > max ) return;
    if ( index === max ) nextSlide();
    if ( index === 3 ) prevSlide();
    activateSlide($slide);
}

const activateSlide = ($slide) => {
    if (!$slide) return;
    const $slides = $q(".carousel__item");
    $slides.forEach(el => el.removeAttribute('data-active'));
    $slide.setAttribute( 'data-active', true );
    $slide.focus();
}

const autoSlide = () => {
    nextSlide();
}

const pauseAuto = () => {
    clearInterval( auto );
    clearTimeout( pauser );
}

const handleNextClick = (e) => {
    pauseAuto();
    nextSlide(e);
}

const handlePrevClick = (e) => {
    pauseAuto();
    prevSlide(e);
}

const handleSlideClick = (e) => {
    pauseAuto();
    chooseSlide(e);
}

const handleSlideKey = (e) => {
    switch(e.keyCode) {
        case 37:
        case 65:
            handlePrevClick();
            break;
        case 39:
        case 68:
            handleNextClick();
            break;
    }
}

const startAuto = () => {
    auto = setInterval( autoSlide, 3000 );
}

startAuto();

$next.addEventListener( "click", handleNextClick );
$prev.addEventListener( "click", handlePrevClick );
// $list.addEventListener( "click", handleSlideClick );
$list.addEventListener( "focusin", handleSlideClick );
$list.addEventListener("keyup", handleSlideKey);


const createSVG = (width, height, radius) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const rectangle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  svg.setAttributeNS(
    "http://www.w3.org/2000/svg",
    "viewBox",
    `0 0 ${width} ${height}`
  );

  rectangle.setAttribute("x", "0");
  rectangle.setAttribute("y", "0");
  rectangle.setAttribute("width", "100%");
  rectangle.setAttribute("height", "100%");
  rectangle.setAttribute("rx", `${radius}`);
  rectangle.setAttribute("ry", `${radius}`);
  rectangle.setAttribute("pathLength", "10");

  svg.appendChild(rectangle);

  return svg;
};

document.querySelectorAll(".sketch-button").forEach((button) => {
  const style = getComputedStyle(button);

  const lines = document.createElement("div");

  lines.classList.add("lines");

  const groupTop = document.createElement("div");
  const groupBottom = document.createElement("div");

  const svg = createSVG(
    button.offsetWidth,
    button.offsetHeight,
    parseInt(style.borderRadius, 10)
  );

  groupTop.appendChild(svg);
  groupTop.appendChild(svg.cloneNode(true));
  groupTop.appendChild(svg.cloneNode(true));
  groupTop.appendChild(svg.cloneNode(true));

  groupBottom.appendChild(svg.cloneNode(true));
  groupBottom.appendChild(svg.cloneNode(true));
  groupBottom.appendChild(svg.cloneNode(true));
  groupBottom.appendChild(svg.cloneNode(true));

  lines.appendChild(groupTop);
  lines.appendChild(groupBottom);

  button.appendChild(lines);

  button.addEventListener("pointerenter", () => {
    button.classList.add("start");
  });

  svg.addEventListener("animationend", () => {
    button.classList.remove("start");
  });
});
