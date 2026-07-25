/* =====================================
   MOTOR DE EXPERIENCIA INTERACTIVA
   Estrategias para la Comprensión Lectora
===================================== */


// Elementos principales

const discoverBtn = document.getElementById("discoverBtn");

const intro = document.getElementById("intro");

const scene2 = document.getElementById("scene2");

const music = document.getElementById("ambientMusic");

const progress = document.getElementById("progress");

const progressNumber = document.getElementById("progress-number");



// Textos iniciales

const lines = [

    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3"),
    document.getElementById("line4")

];



// Ocultar textos al inicio

lines.forEach(line => {

    line.style.opacity = "0";

});



discoverBtn.style.opacity = "0";

discoverBtn.style.pointerEvents = "none";




// =====================================
// EFECTO ESCRITURA LETRA POR LETRA
// =====================================


function typeWriter(element, text, speed = 60){


    element.innerHTML = "";

    element.style.opacity = "1";


    let index = 0;


    let timer = setInterval(()=>{


        element.innerHTML += text.charAt(index);


        index++;


        if(index >= text.length){

            clearInterval(timer);

        }


    }, speed);


}





// =====================================
// SECUENCIA CINEMATOGRÁFICA INICIAL
// =====================================


async function startIntro(){


    await wait(2000);



    await showLine(
        lines[0],
        "¿Estás listo para descubrir un secreto?"
    );



    await wait(1500);



    await showLine(
        lines[1],
        "Todos sabemos leer..."
    );



    await wait(1500);



    await showLine(
        lines[2],
        "Pero muy pocos comprenden realmente lo que leen."
    );



    await wait(2000);



    await showLine(
        lines[3],
        "¿Por qué sucede esto?"
    );



    await wait(1500);



    discoverBtn.style.opacity = "1";

    discoverBtn.style.pointerEvents = "auto";


}




// Mostrar línea

function showLine(element,text){


    return new Promise(resolve=>{


        typeWriter(element,text);


        let duration = text.length * 60 + 500;


        setTimeout(()=>{


            resolve();


        },duration);



    });


}





// Temporizador

function wait(time){

    return new Promise(resolve=>{

        setTimeout(resolve,time);

    });

}





// =====================================
// BOTÓN DESCUBRIR
// =====================================


discoverBtn.addEventListener("click",()=>{


    // Música

    music.volume = 0.35;


    music.play()
    .catch(()=>{

        console.log("Audio esperando interacción");

    });



    // Ocultar escena inicial


    intro.classList.remove("active");



    setTimeout(()=>{


        intro.style.display="none";


        scene2.classList.add("active");



        updateProgress(15);



    },1000);



});








// =====================================
// BARRA DE PROGRESO
// =====================================


function updateProgress(value){


    progress.style.width = value + "%";


    progressNumber.textContent = value + "%";


}







// =====================================
// CREAR PARTÍCULAS
// =====================================


function createParticles(){


    const container =
    document.querySelector(".particles");



    for(let i=0;i<80;i++){


        let particle =
        document.createElement("span");


        particle.classList.add("particle");



        particle.style.left =
        Math.random()*100+"%";



        particle.style.top =
        Math.random()*100+"%";



        particle.style.animationDelay =
        Math.random()*5+"s";



        container.appendChild(particle);



    }


}




// Iniciar experiencia


window.addEventListener("load",()=>{


    createParticles();


    startIntro();


});