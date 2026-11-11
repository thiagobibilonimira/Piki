/* Estados de cada componente del UI kit: nombre y para qué se usa.
   El orden sigue el de las variantes exportadas de Figma. null = variante que no se muestra como estado. */
(() => {
  const campo = (vacio, completo) => [
    ["Vacío", `Muestra el texto de ayuda en gris (“${vacio}”) para indicar qué hay que completar.`],
    ["Completo", `El dato cargado (${completo}) pasa a petróleo y con borde, para confirmar que quedó ingresado.`],
  ];
  const guardar = cosa => [
    ["Predeterminado", `Invita a guardar ${cosa} para tenerlo a mano. Es el botón primario de la pantalla.`],
    ["Guardado", "Confirma la acción: el botón pasa a celeste y el texto cambia para avisar que se guardó."],
  ];
  const filtro = (nombre, detalle) => [`${nombre} activo`, detalle];
  window.PIKI_UIK_STATES = {
    "Barra de navegación": [
      ["Inicio activo", "Sección activa al abrir la app: el resumen del día. La activa va en petróleo pleno y el resto al 60 %."],
      ["Recuperar activo", "Se activa al entrar a la biblioteca de ejercicios y rutinas."],
      ["Mi estado activo", "Se activa en el seguimiento de los check-ins y el mapa corporal."],
      ["Plan activo", "Se activa en la planificación de cargas y eventos."],
      ["Perfil activo", "Se activa en los datos, los desafíos y los ajustes de la cuenta."],
    ],
    "Selector de acceso": [
      ["Iniciar sesión", "Opción activa por defecto en la bienvenida, para quien ya tiene cuenta."],
      ["Registrarse", "Se activa al tocarla para crear una cuenta nueva."],
    ],
    "Filtros de ejercicios": [
      null,
      filtro("Todos", "Estado por defecto: muestra toda la biblioteca de relajación."),
      filtro("Tren superior", "Muestra solo los ejercicios de brazos, hombros y espalda."),
      filtro("Tren inferior", "Muestra solo los ejercicios de piernas y cadera."),
      filtro("Zona media", "Muestra solo los ejercicios de abdomen y zona lumbar."),
    ],
    "Filtros de artículos": [
      filtro("Todos", "Estado por defecto: muestra todos los artículos."),
      filtro("Sueño", "Muestra solo los artículos sobre descanso y sueño."),
      filtro("Recuperación", "Muestra solo los artículos sobre recuperación física."),
      filtro("Salud mental", "Muestra solo los artículos sobre salud mental."),
      filtro("Fatiga", "Muestra solo los artículos sobre fatiga."),
    ],
    "Chip": [
      ["Apagado", "El filtro no está aplicado: borde gris y texto apagado."],
      ["Activo", "El filtro está aplicado: relleno petróleo para que se distinga de un vistazo."],
    ],
    "Guardar ejercicio": guardar("el ejercicio"),
    "Guardar artículo": guardar("el artículo"),
    "Guardar receta": guardar("la receta"),
    "Desbloquear desafío": [
      ["Disponible", "El desafío todavía no empezó: el botón invita a desbloquearlo."],
      ["Desbloqueado", "Confirma que el desafío ya está activo en el perfil."],
    ],
    "Reproducir / pausar": [
      ["Pausado", "Muestra el ícono de reproducir: el ejercicio guiado está detenido."],
      ["Reproduciendo", "Muestra el ícono de pausa mientras corre el ejercicio."],
    ],
    "Escala de 1 a 5": [
      ["Sin elegir", "Estado inicial de la pregunta del check-in: todavía no hay ningún valor marcado."],
      ["1 · Muy bajo", "Se marca el 1 y la pregunta muestra “1/5”."],
      ["2 · Bajo", "Se rellenan los valores del 1 al 2 y la pregunta muestra “2/5”."],
      ["3 · Intermedio", "Se rellenan los valores del 1 al 3 y la pregunta muestra “3/5”."],
      ["4 · Alto", "Se rellenan los valores del 1 al 4 y la pregunta muestra “4/5”."],
      ["5 · Muy alto", "Se rellenan los valores del 1 al 5 y la pregunta muestra “5/5”."],
    ],
    "Opción de calidad de sueño": [
      ["Sin elegir", "Opción disponible: borde y texto en gris."],
      ["Elegida", "Relleno petróleo: es la respuesta marcada sobre cómo dormiste."],
    ],
    "Opción única": [
      ["Sin marcar", "Radio vacío: la opción está disponible."],
      ["Marcada", "Radio lleno en petróleo. Solo puede haber una marcada por pregunta."],
    ],
    "Interruptor": [
      ["Apagado", "La notificación o la preferencia está desactivada."],
      ["Encendido", "El interruptor pasa a petróleo: la opción queda activa."],
    ],
    "Casilla": [
      ["Sin marcar", "Tarea pendiente o términos todavía sin aceptar."],
      ["Marcada", "Tilde sobre petróleo: la tarea está hecha o los términos, aceptados."],
    ],
    "Día de la semana": [
      ["No elegido", "El día no forma parte de la rutina o del traslado."],
      ["Elegido", "Relleno petróleo: el día queda incluido."],
    ],
    "Cargando": [
      ["Cargando", "Gira mientras conectamos el reloj o sincronizamos los datos, y desaparece al terminar."],
      null, null, null,
    ],
    "Campo de texto": campo("Nombre del evento", "por ejemplo, “Examen inglés”"),
    "Campo de deporte": campo("Deporte", "por ejemplo, “Fútbol”"),
    "Campo de lugar": campo("Lugar", "por ejemplo, “Médico”"),
    "Campo genérico": campo("Texto", "el texto escrito"),
    "Fecha": campo("Fecha", "por ejemplo, “18/09/2026”"),
    "Hora": campo("Hora", "por ejemplo, “15:00”"),
    "Tipo de evento": [
      ["Sin elegir", "Al agregar un evento, todavía no hay ningún tipo marcado."],
      ["Examen", "Queda marcado en petróleo: el evento se guarda como examen."],
      ["Entrenamiento", "El evento se guarda como entrenamiento."],
      ["Gimnasio", "El evento se guarda como sesión de gimnasio."],
      ["Competencia", "El evento se guarda como competencia."],
    ],
    "Punto del mapa corporal": [
      ["Sin marcar", "La zona no tiene ninguna sensación registrada."],
      ["Fatiga", "Verde: cansancio leve en esa zona."],
      ["Molestia", "Naranja: algo incomoda en esa zona."],
      ["Dolor", "Rojo: hay dolor en esa zona."],
    ],
    "Ventana de la zona": [
      ["Abierta", "Aparece al tocar un punto del cuerpo para elegir Fatiga, Molestia o Dolor. Se cierra con la X."],
    ],
  };
  /* Componentes del videojuego (Piki Game) */
  Object.assign(window.PIKI_UIK_STATES, {
    "Botón principal del juego": [
      [
        "Menta",
        "Acción principal en la portada, la recuperación física y la vuelta a la calma."
      ],
      [
        "Naranja",
        "Acción principal de la etapa nutricional, con el color de acento de esa etapa."
      ]
    ],
    "Botón secundario del juego": [
      [
        "Reintentar",
        "Repite el minijuego para mejorar el resultado."
      ],
      [
        "Continuar igual",
        "Sigue a la etapa siguiente aunque el minijuego haya fallado."
      ]
    ],
    "Tarjeta de deporte": [
      [
        "Disponible",
        "El deporte se puede jugar. Lleva el ícono y la etiqueta menta “Disponible”."
      ],
      [
        "Al pasar el puntero",
        "El borde se ilumina en menta para confirmar qué tarjeta se va a elegir."
      ],
      [
        "Próximamente",
        "Deporte todavía no habilitado: inicial en gris, candado y sin interacción."
      ]
    ],
    "Herramientas de recuperación": [
      [
        "Disponibles",
        "Cada herramienta espera sobre su anillo, con el color que la identifica."
      ],
      [
        "En uso",
        "La herramienta agarrada se agranda y su anillo se ilumina mientras se aplica."
      ],
      [
        "Descartada",
        "Aparece una cruz roja sobre la herramienta que no era la mejor opción."
      ]
    ],
    "Categoría de nutrientes": [
      [
        "Energía",
        "Amarillo: carbohidratos para reponer la energía gastada."
      ],
      [
        "Hidratación",
        "Celeste: líquidos y sales para reponer lo que se perdió con el sudor."
      ],
      [
        "Reparación",
        "Naranja: proteínas para reparar el músculo."
      ]
    ],
    "Etiqueta de alimento": [
      [
        "Flotante",
        "Pastilla blanca con el nombre, siempre debajo del objeto 3D para leerse desde cualquier ángulo."
      ]
    ],
    "Progreso de etapas": [
      [
        "Física",
        "Primera etapa activa: el número queda resaltado con un anillo."
      ],
      [
        "Nutrición",
        "La etapa física pasa a tilde menta y se activa la segunda."
      ],
      [
        "Calma",
        "Las dos primeras completas y la última en curso."
      ],
      [
        "Completado",
        "Las tres etapas con tilde, en el resumen final."
      ]
    ],
    "Etiqueta de síntoma": [
      [
        "Dolor",
        "Rojo: hay dolor puntual en la zona."
      ],
      [
        "Molestia",
        "Naranja: algo incomoda sin golpe ni hinchazón."
      ],
      [
        "Fatiga",
        "Amarillo: el músculo está cargado y sin fuerza."
      ],
      [
        "Rigidez",
        "Violeta: la zona está dura y cuesta moverla."
      ]
    ],
    "Medidor de intensidad": [
      [
        "Leve",
        "Hasta 3 de 10: segmentos en amarillo."
      ],
      [
        "Moderada",
        "De 4 a 6: los segmentos pasan a naranja."
      ],
      [
        "Alta",
        "De 7 a 10: segmentos en rojo, la situación es más urgente."
      ]
    ],
    "Etiqueta de zona": [
      [
        "Fatiga",
        "Amarillo, igual que la etiqueta de síntoma."
      ],
      [
        "Rigidez",
        "Violeta."
      ],
      [
        "Molestia",
        "Naranja."
      ],
      [
        "Dolor",
        "Rojo."
      ]
    ],
    "Barra de nutriente": [
      [
        "Bajo",
        "Falta ese nutriente: el valor se marca en rojo."
      ],
      [
        "En zona",
        "El nivel está dentro de la zona verde: es el objetivo."
      ],
      [
        "Alto",
        "Sobra: también desequilibra y se marca en naranja."
      ]
    ],
    "Calificación": [
      [
        "Una estrella",
        "Faltó equilibrio: invita a reintentar."
      ],
      [
        "Dos estrellas",
        "Equilibrio parcial."
      ],
      [
        "Tres estrellas",
        "Las tres barras se mantuvieron en la zona verde."
      ]
    ],
    "Estado de la respiración": [
      [
        "Tranquilo",
        "El punto sigue el camino: la agitación queda en 0 % y en menta."
      ],
      [
        "Agitado",
        "El punto se sale del camino: la agitación sube y pasa a naranja."
      ],
      [
        "Fallido",
        "La agitación llega al 100 %, se marca en rojo y el ejercicio termina."
      ]
    ],
    "Indicación de respiración": [
      [
        "Inhalá",
        "Menta: el camino sube y hay que llevar el punto hacia arriba durante 4 s."
      ],
      [
        "Exhalá",
        "Violeta: el camino baja durante 6 s."
      ],
      [
        "Misión fallida",
        "Rojo claro: avisa que el cuerpo no logró volver a la calma."
      ]
    ],
    "Datos del partido": [
      [
        "Fijo",
        "Número grande en blanco y bajada gris. Se agrupan en una grilla de tres columnas."
      ]
    ],
    "Panel de respuesta": [
      [
        "Esperando",
        "Plantea la pregunta y explica cómo usar las herramientas."
      ],
      [
        "Aplicando",
        "Confirma la herramienta correcta y muestra el tiempo con una barra de progreso."
      ],
      [
        "Incorrecta",
        "Fondo rojo: explica por qué esa herramienta no sirve y pide probar otra."
      ],
      [
        "Resuelta",
        "Fondo verde: la zona se recuperó y explica por qué funcionó."
      ]
    ],
    "Fila de situación": [
      [
        "A la primera",
        "Resultado en verde: se eligió la herramienta correcta en el primer intento."
      ],
      [
        "Con intentos",
        "Resultado en naranja con la cantidad de intentos."
      ]
    ],
    "Resultado de etapa": [
      [
        "Completada",
        "Punto y texto en verde."
      ],
      [
        "Misión fallida",
        "Punto rojo y borde rojo: la etapa se terminó sin lograr el objetivo."
      ]
    ],
    "Aviso de nivel": [
      [
        "Visible",
        "Pastilla dorada con borde claro, centrada en el campo de visión."
      ]
    ],
    "Barra de instrucciones": [
      [
        "Fija",
        "Siempre en el mismo lugar, con texto blanco sobre una franja oscura translúcida."
      ]
    ]
  });
})();
