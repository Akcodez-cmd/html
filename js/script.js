const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a')];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navItems.forEach(item => item.classList.toggle(
      'active', item.getAttribute('href') === `#${entry.target.id}`
    ));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));

/* =========================================
   INFINITE PROJECT SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const slider = document.getElementById("projectSlider");
  const track = document.getElementById("projectTrack");

  const prevBtn = document.getElementById("projectPrev");
  const nextBtn = document.getElementById("projectNext");

  const dotsContainer =
    document.getElementById("projectDots");

  const currentNumber =
    document.getElementById("projectCurrent");


  if (!slider || !track) return;


  const originalCards =
    Array.from(track.querySelectorAll(".project-card"));


  const totalProjects = originalCards.length;


  let currentIndex = 0;
  let autoSlide = null;
  let isTransitioning = false;


  /* -----------------------------------------
     Clone cards for infinite loop
  ----------------------------------------- */

  const visibleCount = () => {

    if (window.innerWidth <= 650) {
      return 1;
    }

    if (window.innerWidth <= 1000) {
      return 2;
    }

    return 3;

  };


  function setupClones() {

    track
      .querySelectorAll(".project-clone")
      .forEach(card => card.remove());


    const count = visibleCount();


    originalCards
      .slice(0, count)
      .forEach(card => {

        const clone = card.cloneNode(true);

        clone.classList.add("project-clone");

        track.appendChild(clone);

      });


    originalCards
      .slice(-count)
      .reverse()
      .forEach(card => {

        const clone = card.cloneNode(true);

        clone.classList.add("project-clone");

        track.insertBefore(clone, track.firstChild);

      });


    currentIndex = count;

  }


  /* -----------------------------------------
     Card movement
  ----------------------------------------- */

  function getStep() {

    const card =
      track.querySelector(".project-card");

    if (!card) return 0;


    const width =
      card.getBoundingClientRect().width;


    const styles =
      window.getComputedStyle(track);


    const gap =
      parseFloat(styles.gap) || 0;


    return width + gap;

  }


  function moveSlider(animate = true) {

    const step = getStep();


    track.style.transition =
      animate
        ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";


    track.style.transform =
      `translateX(-${currentIndex * step}px)`;


    updateUI();

  }


  /* -----------------------------------------
     UI
  ----------------------------------------- */

  function getRealIndex() {

    const count = visibleCount();

    let index = currentIndex - count;


    if (index < 0) {
      index += totalProjects;
    }


    return index % totalProjects;

  }


  function updateUI() {

    const realIndex =
      getRealIndex();


    if (currentNumber) {

      currentNumber.textContent =
        String(realIndex + 1).padStart(2, "0");

    }


    if (dotsContainer) {

      const dots =
        dotsContainer.querySelectorAll(".project-dot");


      dots.forEach((dot, index) => {

        dot.classList.toggle(
          "active",
          index === realIndex
        );

      });

    }

  }


  /* -----------------------------------------
     Dots
  ----------------------------------------- */

  function createDots() {

    if (!dotsContainer) return;


    dotsContainer.innerHTML = "";


    for (
      let i = 0;
      i < totalProjects;
      i++
    ) {

      const dot =
        document.createElement("button");


      dot.type = "button";

      dot.className =
        "project-dot";


      dot.setAttribute(
        "aria-label",
        `Show project ${i + 1}`
      );


      dot.addEventListener(
        "click",
        () => {

          const count =
            visibleCount();


          currentIndex =
            count + i;


          moveSlider(true);

          restartAutoSlide();

        }
      );


      dotsContainer.appendChild(dot);

    }

  }


  /* -----------------------------------------
     Next
  ----------------------------------------- */

  function nextProject() {

    if (isTransitioning) return;


    isTransitioning = true;


    currentIndex++;


    moveSlider(true);

  }


  /* -----------------------------------------
     Previous
  ----------------------------------------- */

  function previousProject() {

    if (isTransitioning) return;


    isTransitioning = true;


    currentIndex--;


    moveSlider(true);

  }


  /* -----------------------------------------
     Infinite reset
  ----------------------------------------- */

  track.addEventListener(
    "transitionend",
    () => {

      const count =
        visibleCount();


      /*
       * We've reached the cloned
       * projects at the end.
       */

      if (
        currentIndex >=
        count + totalProjects
      ) {

        currentIndex = count;

        moveSlider(false);

      }


      /*
       * We've reached the cloned
       * projects at the beginning.
       */

      if (
        currentIndex < count
      ) {

        currentIndex =
          count + totalProjects - 1;

        moveSlider(false);

      }


      isTransitioning = false;

    }
  );


  /* -----------------------------------------
     Auto Slide
  ----------------------------------------- */

  function startAutoSlide() {

    stopAutoSlide();


    autoSlide =
      setInterval(() => {

        nextProject();

      }, 2000);

  }


  function stopAutoSlide() {

    if (autoSlide) {

      clearInterval(autoSlide);

      autoSlide = null;

    }

  }


  function restartAutoSlide() {

    stopAutoSlide();

    startAutoSlide();

  }


  /* -----------------------------------------
     Hover Pause
  ----------------------------------------- */

  slider.addEventListener(
    "mouseenter",
    () => {

      stopAutoSlide();

    }
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      startAutoSlide();

    }
  );


  /* -----------------------------------------
     Buttons
  ----------------------------------------- */

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      () => {

        nextProject();

        restartAutoSlide();

      }
    );

  }


  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      () => {

        previousProject();

        restartAutoSlide();

      }
    );

  }


  /* -----------------------------------------
     Resize
  ----------------------------------------- */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);


      resizeTimer =
        setTimeout(() => {

          setupClones();

          createDots();

          moveSlider(false);

        }, 200);

    }
  );


  /* -----------------------------------------
     Initial setup
  ----------------------------------------- */

  setupClones();

  createDots();

  moveSlider(false);

  startAutoSlide();

});