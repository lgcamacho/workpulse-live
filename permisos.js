/* =========================================================================
   WORKPULSE · Qué módulos ve cada puesto (una sola lista para el tablero y el sistema completo)
   - Los puestos que no aparecen aquí (ADMIN, SUPERVISOR, SUPERINTENDENTE, GERENCIA, CONSULTA) ven todo.
   - Esto decide qué BOTONES aparecen. Lo que cada quien puede GUARDAR lo revisa el servidor (Apps Script).
   ========================================================================= */
(function () {
  "use strict";
  // Claves de los botones (iguales a data-abrir del tablero y a ?abrir= del sistema completo)
  var FUNCIONES = {
    PRODUCCION: "abrirModalProduccion",          // Real Time Production Data
    EHS: "abrirSistemaPrimerosAuxiliosEHS",
    ALARMA: "solicitarInicioAlarmaEHS",
    TV: "iniciarCarruselEspejoTV",
    SEKAIA: "abrirResumenIA",
    T10FUGAS: "abrirTop10NuevaPestana",
    TMTTO: "abrirTarjetasMttoNuevaPestana",
    KPI: "abrirKpisNuevaPestana",
    HISTORIAL: "abrirHistorialNuevaPestana",
    MRO: "abrirRefaccionesNuevaPestana",
    OMRO: "abrirModalOpenMtto",
    CMTTO: "abrirModalCerrar",
    VALEHS: "abrirModalEHS",
    RESULTS: "abrirModalResultados",
    DATA: "cargarLogs",
    ADMIN: null,                                 // abrirModal('admin-modal')
    PERMISOS: "abrirPermisosEHSNuevaPestana",
    OPEHS: "abrirModalSolicitarPermisoEHS",
    PERSONAL: "abrirModalPersonal",
    PEMPLEADO: "abrirModalPerformance",
    EQUIPOS: "abrirModalEquipos",
    RESREF: "mostrarResumenExcelRefacciones",
    RESPROD: "mostrarResumenEjecutivoProduccion",
    PASE: "abrirMenuPaseRRHH",
    FUGAS: "abrirGestionFugas"
  };
  // PLAN = Plan Overview (solo existe en el tablero)

  // Puestos con lista cerrada: SOLO ven estos
  var SOLO = {
    PRACTICANTE: ["PLAN", "SEKAIA", "RESPROD", "PASE", "TV"]
  };
  // Puestos que ven todo MENOS estos (Personal y Equipos son de administración)
  var MENOS = {
    TECNICO: ["ADMIN", "PRODUCCION", "RESPROD", "HISTORIAL", "PERSONAL", "EQUIPOS"],
    INGENIERO: ["ADMIN", "PRODUCCION", "HISTORIAL", "PERSONAL", "EQUIPOS"],
    // PC central de producción: ve todo lo de planta; no administra usuarios, personal ni equipos
    CENTRAL: ["ADMIN", "PERSONAL", "EQUIPOS"]
  };

  function puedeVer(rol, clave) {
    rol = String(rol || "").toUpperCase();
    clave = String(clave || "").toUpperCase();
    if (SOLO[rol]) return SOLO[rol].indexOf(clave) !== -1;
    if (MENOS[rol]) return MENOS[rol].indexOf(clave) === -1;
    return true;
  }

  // Nombre bonito de cada puesto (pantalla de alta, chips, administración)
  var PUESTOS = {
    PRACTICANTE: "Practicante",
    TECNICO: "Técnico",
    INGENIERO: "Ingeniero",
    SUPERINTENDENTE: "Superintendente",
    GERENCIA: "Gerente",
    SUPERVISOR: "Supervisor",
    ADMIN: "Admin",
    CENTRAL: "Estación central",
    CONSULTA: "Consulta"
  };

  window.WP_PERMISOS = { puedeVer: puedeVer, FUNCIONES: FUNCIONES, PUESTOS: PUESTOS };
})();
