/* Banco de preguntas de la ruleta. Script clásico: expone window.PREGUNTAS
   y se puede usar con require() desde Node para los tests.
   Las preguntas de "Viaje" usan solo datos confirmados (La Gaceta 26/03/2026
   y el Instagram @cevet_2027). No incluir fechas del viaje 2027 ni la ciudad
   de IBM Quantum en España: no están confirmadas. */
(function (raiz) {
  "use strict";

  var TEMAS = ["IA", "Cuántica", "Viaje", "Sistemas"];

  var BANCO = {
    IA: [
      {
        pregunta: "¿Qué significa la sigla «IA»?",
        opciones: ["Internet Avanzada", "Inteligencia Artificial", "Informática Aplicada", "Interfaz Automática"],
        correcta: 1,
        explicacion: "IA es Inteligencia Artificial: programas que aprenden de datos para hacer tareas como reconocer imágenes, traducir o conversar."
      },
      {
        pregunta: "¿Cómo aprende un modelo de inteligencia artificial?",
        opciones: ["Viendo muchísimos ejemplos (datos)", "Leyendo un solo libro de reglas", "Conectándose a una red eléctrica especial", "No aprende: todo lo escribe un programador a mano"],
        correcta: 0,
        explicacion: "Se entrena con muchos ejemplos y va ajustando sus números internos hasta acertar cada vez más. Por eso los datos son tan importantes."
      },
      {
        pregunta: "Cuando le escribís algo a ChatGPT para que te responda, eso que escribís se llama…",
        opciones: ["Un pixel", "Un prompt", "Un firewall", "Un router"],
        correcta: 1,
        explicacion: "El prompt es la instrucción o pregunta que le das a la IA. Cuanto más claro el prompt, mejor suele ser la respuesta."
      },
      {
        pregunta: "¿Qué es una «alucinación» de una IA?",
        opciones: ["Cuando se apaga sola", "Cuando genera imágenes de colores", "Cuando inventa un dato falso pero lo dice con total seguridad", "Cuando se queda sin batería"],
        correcta: 2,
        explicacion: "Los modelos de lenguaje a veces inventan datos que suenan creíbles. Por eso siempre conviene chequear lo que dice una IA."
      },
      {
        pregunta: "¿Qué tipo de chip se usa muchísimo para entrenar inteligencia artificial?",
        opciones: ["La GPU (placa de video)", "El chip de una tarjeta SIM", "El de un control remoto", "El de una calculadora"],
        correcta: 0,
        explicacion: "Las GPU nacieron para videojuegos, pero hacen miles de cuentas en paralelo, justo lo que necesita entrenar una IA."
      },
      {
        pregunta: "¿Quién propuso en 1950 una prueba para saber si una máquina puede «pensar»?",
        opciones: ["Albert Einstein", "Alan Turing", "Steve Jobs", "Isaac Newton"],
        correcta: 1,
        explicacion: "Alan Turing propuso el famoso «test de Turing»: si no podés distinguir a la máquina de una persona conversando, la máquina lo pasa."
      },
      {
        pregunta: "¿Cuál de estas cosas usa inteligencia artificial?",
        opciones: ["Una lamparita común", "Un reloj de agujas", "Las recomendaciones de videos y series de tu celular", "Una regla de 30 cm"],
        correcta: 2,
        explicacion: "Las plataformas aprenden de lo que mirás para recomendarte lo próximo. Es IA que usás todos los días sin darte cuenta."
      },
      {
        pregunta: "En 1997 una computadora de IBM llamada Deep Blue le ganó al campeón mundial de…",
        opciones: ["Truco", "Ajedrez", "Fútbol", "Póker"],
        correcta: 1,
        explicacion: "Deep Blue le ganó un match de ajedrez a Garry Kasparov en 1997. Fue un hito: por primera vez una máquina vencía al campeón del mundo en un match."
      }
    ],

    "Cuántica": [
      {
        pregunta: "Una computadora común usa bits. ¿Qué usa una computadora cuántica?",
        opciones: ["Bytes gigantes", "Qubits", "Megapíxeles", "Válvulas de vapor"],
        correcta: 1,
        explicacion: "El qubit es el bit cuántico: además de 0 o 1, puede estar en una combinación de los dos hasta que lo medimos."
      },
      {
        pregunta: "¿Qué es la «superposición»?",
        opciones: ["Poner una computadora encima de otra", "Que un qubit esté en una combinación de 0 y 1 a la vez hasta que se mide", "Un virus informático", "Un tipo de pantalla"],
        correcta: 1,
        explicacion: "En superposición el qubit no tiene un valor definido: al medirlo «elige» 0 o 1 con cierta probabilidad. Probalo en la moneda cuántica."
      },
      {
        pregunta: "¿Qué pasa cuando medís un qubit que está en superposición?",
        opciones: ["Se rompe", "Da 0 o 1, y queda en ese valor", "Da siempre 2", "Explota la computadora"],
        correcta: 1,
        explicacion: "Medir obliga al qubit a definirse: da 0 o 1 y la superposición se pierde. Eso se llama «colapso»."
      },
      {
        pregunta: "Los chips cuánticos de IBM funcionan a una temperatura cercana a…",
        opciones: ["La de una heladera (4 °C)", "La del Sol", "El cero absoluto (−273 °C)", "La temperatura ambiente"],
        correcta: 2,
        explicacion: "Se enfrían a unas milésimas de grado sobre el cero absoluto, más frío que el espacio, para que el ruido no arruine los qubits."
      },
      {
        pregunta: "El «candelabro» dorado que aparece en las fotos de computadoras cuánticas es…",
        opciones: ["Un adorno de diseño", "La parte que enfría y conecta el chip cuántico", "Una antena de wifi", "Un ventilador gigante"],
        correcta: 1,
        explicacion: "Es la estructura del refrigerador: cada piso está más frío que el anterior, y abajo de todo va el chip con los qubits."
      },
      {
        pregunta: "Cuando dos qubits están «entrelazados»…",
        opciones: ["Están pegados con cinta", "Sus resultados quedan conectados: medir uno te dice algo del otro", "Comparten la misma batería", "Se apagan juntos"],
        correcta: 1,
        explicacion: "El entrelazamiento hace que los resultados de dos qubits estén correlacionados aunque estén separados. Es clave para la computación cuántica."
      },
      {
        pregunta: "¿Una computadora cuántica va a reemplazar a tu notebook?",
        opciones: ["Sí, el año que viene", "No: sirve para problemas específicos, como simular moléculas", "Sí, pero solo para jugar", "No, porque no existen"],
        correcta: 1,
        explicacion: "No reemplaza a las computadoras comunes: se usa para ciertos problemas muy difíciles, como simular moléculas o materiales nuevos."
      },
      {
        pregunta: "¿Qué hace la compuerta Hadamard (H) con un qubit en |0⟩?",
        opciones: ["Lo apaga", "Lo pone en superposición: 50% de chances de medir 0 y 50% de medir 1", "Lo convierte en un byte", "Lo duplica"],
        correcta: 1,
        explicacion: "H es como tirar una moneda cuántica: después de aplicarla, medir da 0 o 1 mitad y mitad. ¡Y si la aplicás dos veces, vuelve a |0⟩!"
      }
    ],

    Viaje: [
      {
        pregunta: "¿A qué feria tecnológica viajaron estudiantes de Sistemas de la UTN FRT en mayo de 2026?",
        opciones: ["Tech Show Frankfurt", "CES de Las Vegas", "Mobile World Congress", "Campus Party"],
        correcta: 0,
        explicacion: "Según La Gaceta, el 6 y 7 de mayo de 2026 viajaron a Alemania para participar del Tech Show Frankfurt."
      },
      {
        pregunta: "Frankfurt, donde fue el viaje de 2026, queda en…",
        opciones: ["Francia", "Alemania", "Inglaterra", "Italia"],
        correcta: 1,
        explicacion: "Frankfurt está en Alemania. Allí se hizo el Tech Show Frankfurt, uno de los eventos tecnológicos más importantes del continente."
      },
      {
        pregunta: "Según La Gaceta, ¿cuántos estudiantes de Sistemas lograron juntar la plata para ir a Frankfurt?",
        opciones: ["3", "8", "25", "50"],
        correcta: 1,
        explicacion: "Eran 25 los que organizaron rifas, eventos y colectas; ocho estudiantes lograron reunir el dinero (La Gaceta, 26/03/2026)."
      },
      {
        pregunta: "El viaje a Frankfurt fue parte de un proyecto académico de la cátedra de…",
        opciones: ["Comunicación de Datos", "Análisis Matemático", "Química", "Física II"],
        correcta: 0,
        explicacion: "Fue un proyecto de la cátedra de Comunicación de Datos, con bitácora de actividades y un trabajo final sobre una tendencia tecnológica."
      },
      {
        pregunta: "¿Cuál de estas áreas del Tech Show Frankfurt recorrieron?",
        opciones: ["Data Centre World", "Salón del Automóvil", "Feria del Libro", "Semana de la Moda"],
        correcta: 0,
        explicacion: "Recorrieron Big Data & AI World, Cloud & AI Infrastructure y Data Centre World."
      },
      {
        pregunta: "¿Cuál es la próxima meta de CEVET?",
        opciones: ["Tech Show London 2027", "Un viaje a la Luna", "El Mundial 2030", "Tech Show Tokio 2026"],
        correcta: 0,
        explicacion: "CEVET va rumbo al Tech Show London 2027, en Londres. Para eso organiza eventos, rifas y actividades."
      },
      {
        pregunta: "Además de Londres, ¿qué quiere visitar CEVET en España?",
        opciones: ["Un estadio de fútbol", "IBM Quantum, para conocer la computación cuántica", "Una fábrica de autos", "Un museo de dinosaurios"],
        correcta: 1,
        explicacion: "El objetivo es visitar IBM Quantum en España para conocer más sobre la computación cuántica y sus avances."
      },
      {
        pregunta: "¿Qué significa CEVET?",
        opciones: ["Centro de Viajes Tecnológicos", "Centro de Veterinaria", "Centro de Estudiantes de Tucumán", "Comité de Eventos y Torneos"],
        correcta: 0,
        explicacion: "CEVET es el Centro de Viajes Tecnológicos de la UTN FRT: estudiantes y docentes de Ingeniería en Sistemas de Información."
      },
      {
        pregunta: "¿Dónde podés seguir el viaje de CEVET?",
        opciones: ["@cevet_2027 en Instagram", "En la radio AM", "En el diario de 1990", "En ningún lado"],
        correcta: 0,
        explicacion: "Seguí a @cevet_2027 en Instagram para enterarte de los eventos, la rifa y la Gran Peña."
      }
    ],

    Sistemas: [
      {
        pregunta: "¿Cuántos bits tiene un byte?",
        opciones: ["2", "8", "10", "100"],
        correcta: 1,
        explicacion: "Un byte son 8 bits. Con 8 ceros y unos se pueden formar 256 combinaciones distintas."
      },
      {
        pregunta: "¿Qué dígitos usa el sistema binario?",
        opciones: ["Del 0 al 9", "Solo 0 y 1", "Solo 1 y 2", "Letras de la A a la F"],
        correcta: 1,
        explicacion: "Binario usa solo 0 y 1. Todo lo que guarda una computadora, fotos, música o tu nombre, termina siendo ceros y unos."
      },
      {
        pregunta: "¿Qué significa CPU?",
        opciones: ["Computadora Personal Usada", "Unidad Central de Procesamiento", "Cable Para USB", "Centro de Programas Útiles"],
        correcta: 1,
        explicacion: "La CPU (Central Processing Unit) es el «cerebro» que ejecuta las instrucciones de los programas."
      },
      {
        pregunta: "¿Qué pasa con lo que está en la memoria RAM cuando apagás la compu?",
        opciones: ["Se guarda para siempre", "Se borra", "Se manda por mail", "Se imprime"],
        correcta: 1,
        explicacion: "La RAM es memoria de trabajo: es rapidísima pero se borra al apagar. Lo que querés conservar va al disco."
      },
      {
        pregunta: "¿Por dónde viajan los datos en la fibra óptica?",
        opciones: ["Por pulsos de luz", "Por agua", "Por aire comprimido", "Por ondas de sonido"],
        correcta: 0,
        explicacion: "La fibra óptica lleva la información como pulsos de luz dentro de un hilo de vidrio finísimo. Por eso es tan rápida."
      },
      {
        pregunta: "En programación, ¿qué es un «bug»?",
        opciones: ["Un error en el programa", "Un tipo de teclado", "Un virus que solo ataca celulares", "Un programa terminado"],
        correcta: 0,
        explicacion: "Un bug es un error. Se cuenta que en 1947 encontraron una polilla real trabada en una computadora y la pegaron en la bitácora."
      },
      {
        pregunta: "¿Cuál de estos es un lenguaje de programación?",
        opciones: ["HDMI", "Python", "Wi-Fi", "JPEG"],
        correcta: 1,
        explicacion: "Python es uno de los lenguajes más usados, por ejemplo en ciencia de datos e IA. HDMI y Wi-Fi son conexiones; JPEG es un formato de imagen."
      },
      {
        pregunta: "¿Qué significan las letras «www» de las páginas web?",
        opciones: ["World Wide Web", "Wireless Web Window", "Web With Wifi", "World Wireless Wave"],
        correcta: 0,
        explicacion: "World Wide Web: la «telaraña mundial» de páginas conectadas, inventada por Tim Berners-Lee en 1989."
      }
    ]
  };

  var api = { TEMAS: TEMAS, BANCO: BANCO };
  raiz.PREGUNTAS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
