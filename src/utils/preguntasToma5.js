export const PREGUNTAS_TOMA5 = {
  1: {
    titulo: 'Paso 1 — Pienso en mis condiciones y las de la actividad/tarea',
    preguntas: {
      '1A': '¿Me encuentro sin la influencia del alcohol, drogas y/o medicamentos que afecten mi capacidad para hacer la actividad/tarea?',
      '1B': '¿Tengo las competencias, estoy autorizado/certificado para realizar la actividad/tarea?',
      '1C': '¿Identifico en el área de trabajo la presencia de otras personas y les informé de mi actividad/tarea?',
      '1D': '¿Tengo los EPP adecuados para la tarea, sé cómo usarlos correctamente y están en buen estado?',
      '1E': '¿Cuento con las herramientas y equipos para realizar la tarea y sé cuándo están en buen estado?',
      '1F': '¿Tengo los controles para evitar un impacto negativo en el medioambiente y/o comunidad (Ej: material particulado, derrames, incendios)?',
      '1G': '¿Conozco y tengo los medios para activar el plan de respuesta ante una emergencia?',
      '1H': '¿Conozco y cumplo los Comportamientos que Salvan Vidas?',
    },
  },
  2: {
    titulo: 'Paso 2 — Identifico el peligro',
    preguntas: {
      '2A': '¿He identificado las fuentes de energías presentes y/o almacenadas durante la tarea y tengo los elementos para realizar su aislamiento/bloqueo?',
      '2B': '¿Voy a realizar una actividad que tiene procedimiento/instructivo? ¿Lo conozco y entiendo los pasos?',
      '2C': '¿Ejecutaré una tarea/actividad rutinaria?',
      '2D': '¿He realizado antes esta tarea bajo condiciones y entornos similares, y entiendo su alcance?',
      '2E': '¿Puedo realizar mi tarea sin diligenciar un permiso de trabajo (Ej: Alturas, Aislamiento Grupal, Espacio Confinado, entre otros)?',
    },
  },
  3: {
    titulo: 'Paso 3 — Evalúo el riesgo',
    preguntas: {
      '3A': '¿Sé en qué momento y bajo qué condiciones debo PARAR la actividad/tarea, analizar los riesgos y definir un nuevo PLAN SEGURO?',
      '3B': '¿Tengo claro los riesgos asociados a la actividad/tarea, trabajos simultáneos y del entorno?',
    },
  },
  4: {
    titulo: 'Paso 4 — Confirmo los controles requeridos',
    preguntas: {
      '4A': '¿Conozco el/los Protocolos de Peligros Fatales y los controles críticos que aplican a la actividad/tarea que voy a realizar?',
      '4B': 'Confirmo que he realizado una evaluación de riesgos y cuento con los controles requeridos.',
    },
  },
  5: {
    titulo: 'Paso 5 — Estoy listo para trabajar con salud y seguridad',
    preguntas: {
      '5A': 'Confirmo que he tenido en cuenta todos los ítems anteriores y estoy listo para trabajar de forma segura.',
    },
  },
};

export const obtenerTextoPregunta = (paso, codigo) => {
  return PREGUNTAS_TOMA5[paso]?.preguntas[codigo] || codigo;
};

// Listado plano para usar en la app móvil al construir el formulario
export const getPreguntasPorPaso = (paso) => {
  const datos = PREGUNTAS_TOMA5[paso];
  if (!datos) return [];
  return Object.entries(datos.preguntas).map(([codigo, texto]) => ({
    codigo,
    texto,
    paso,
  }));
};

// Todos los pasos como array para iterar fácilmente
export const PASOS = Object.keys(PREGUNTAS_TOMA5).map((numPaso) => ({
  paso: parseInt(numPaso),
  titulo: PREGUNTAS_TOMA5[numPaso].titulo,
  preguntas: getPreguntasPorPaso(parseInt(numPaso)),
}));
