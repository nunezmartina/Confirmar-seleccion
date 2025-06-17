"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, FileText, Users, Calendar, AlertTriangle, CheckSquare, Printer } from "lucide-react"

// Tipos de datos
interface Estudiante {
  dni: string
  nombre: string
  apellido: string
  correoInstitucional: string
}

interface Postulacion {
  numeroPostulacion: string
  estudiante: Estudiante
  ordenMerito: number
  estadoActual: "En evaluacion" | "Confirmado" | "Rechazado"
}

interface ProyectoPuesto {
  idPuesto: string
  nombrePuesto: string
  cantVacantes: number
  postulaciones: Postulacion[]
}

interface Proyecto {
  numeroProyecto: string
  nombreProyecto: string
  fechaCierrePostulaciones: string
  estado: string
  puestos: ProyectoPuesto[]
}

interface Contrato {
  numeroContrato: string
  estudiante: Estudiante
  fechaEmision: string
  fechaInicio: string
  fechaFin: string
  puesto: string
}

export default function ConfirmarSeleccion() {
  const [step, setStep] = useState<"input" | "processing" | "confirmation" | "results" | "contracts">("input")
  const [numeroProyecto, setNumeroProyecto] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [shouldClearOnFocus, setShouldClearOnFocus] = useState(false)
  const [progress, setProgress] = useState(0)

  // Datos de ejemplo
  const proyectoEjemplo: Proyecto = {
    numeroProyecto: "PROJ-2024-001",
    nombreProyecto: "Sistema de Gestión Académica",
    fechaCierrePostulaciones: "2024-03-15",
    estado: "En evaluación",
    puestos: [
      {
        idPuesto: "P001",
        nombrePuesto: "Desarrollador Frontend",
        cantVacantes: 2,
        postulaciones: [
          {
            numeroPostulacion: "POST-001",
            estudiante: {
              dni: "12345678",
              nombre: "Juan",
              apellido: "Pérez",
              correoInstitucional: "juan.perez@universidad.edu",
            },
            ordenMerito: 1,
            estadoActual: "En evaluacion",
          },
          {
            numeroPostulacion: "POST-002",
            estudiante: {
              dni: "87654321",
              nombre: "María",
              apellido: "González",
              correoInstitucional: "maria.gonzalez@universidad.edu",
            },
            ordenMerito: 2,
            estadoActual: "En evaluacion",
          },
          {
            numeroPostulacion: "POST-003",
            estudiante: {
              dni: "11223344",
              nombre: "Carlos",
              apellido: "López",
              correoInstitucional: "carlos.lopez@universidad.edu",
            },
            ordenMerito: 3,
            estadoActual: "En evaluacion",
          },
        ],
      },
      {
        idPuesto: "P002",
        nombrePuesto: "Desarrollador Backend",
        cantVacantes: 1,
        postulaciones: [
          {
            numeroPostulacion: "POST-004",
            estudiante: {
              dni: "55667788",
              nombre: "Ana",
              apellido: "Martínez",
              correoInstitucional: "ana.martinez@universidad.edu",
            },
            ordenMerito: 1,
            estadoActual: "En evaluacion",
          },
          {
            numeroPostulacion: "POST-005",
            estudiante: {
              dni: "99887766",
              nombre: "Luis",
              apellido: "Rodríguez",
              correoInstitucional: "luis.rodriguez@universidad.edu",
            },
            ordenMerito: 2,
            estadoActual: "En evaluacion",
          },
        ],
      },
    ],
  }

  // Efecto para simular el progreso del algoritmo
  useEffect(() => {
    if (step === "processing") {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep("confirmation"), 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [step])

  const handleBuscarProyecto = async () => {
    setError("")
    setLoading(true)

    // Simular validación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!numeroProyecto.trim()) {
      setError("Los datos son incorrectos. Intenta nuevamente.")
      setShouldClearOnFocus(true) // Marcar para limpiar en próximo focus
      setLoading(false)
      return
    }

    // Verificar si contiene letras
    if (!/^\d+$/.test(numeroProyecto)) {
      setError("Los datos son incorrectos. Intenta nuevamente.")
      setShouldClearOnFocus(true) // Marcar para limpiar en próximo focus
      setLoading(false)
      return
    }

    // Verificar si no tiene exactamente 5 dígitos
    if (numeroProyecto.length !== 5) {
      setError("Los datos están incompletos. Intenta nuevamente.")
      setShouldClearOnFocus(true) // Marcar para limpiar en próximo focus
      setLoading(false)
      return
    }

    if (numeroProyecto === "11111") {
      setError("No se ha podido encontrar el proyecto ingresado. Intente nuevamente")
      setShouldClearOnFocus(true) // Marcar para limpiar en próximo focus
      setLoading(false)
      return
    }

    // Crear el proyecto con el número ingresado por el usuario
    const proyectoConNumeroIngresado = {
      ...proyectoEjemplo,
      numeroProyecto: numeroProyecto,
    }

    setProyecto(proyectoConNumeroIngresado)
    setLoading(false)
    setStep("processing")
  }

  const handleConfirmarSeleccion = async () => {
    setLoading(true)

    // Simular procesamiento del algoritmo de selección
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (proyecto) {
      // Procesar postulaciones según el algoritmo
      const proyectoActualizado = { ...proyecto }
      const nuevosContratos: Contrato[] = []

      proyectoActualizado.puestos.forEach((puesto) => {
        puesto.postulaciones.forEach((postulacion) => {
          if (postulacion.ordenMerito <= puesto.cantVacantes) {
            postulacion.estadoActual = "Confirmado"
            // Crear contrato
            nuevosContratos.push({
              numeroContrato: `CONT-${Date.now()}-${postulacion.numeroPostulacion}`,
              estudiante: postulacion.estudiante,
              fechaEmision: new Date().toISOString().split("T")[0],
              fechaInicio: new Date().toISOString().split("T")[0],
              fechaFin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              puesto: puesto.nombrePuesto,
            })
          } else {
            postulacion.estadoActual = "Rechazado"
          }
        })
      })

      setProyecto(proyectoActualizado)
      setContratos(nuevosContratos)
    }

    setLoading(false)
    setStep("results")
  }

  const handleImprimirReporte = () => {
    if (!proyecto) return

    const confirmados = proyecto.puestos.flatMap((p) =>
      p.postulaciones.filter((post) => post.estadoActual === "Confirmado"),
    )
    const rechazados = proyecto.puestos.flatMap((p) =>
      p.postulaciones.filter((post) => post.estadoActual === "Rechazado"),
    )

    // Crear contenido para imprimir
    const printContent = `
      <html>
        <head>
          <title>Reporte de Selección - Proyecto ${proyecto.numeroProyecto}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
            .project-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .section { margin-bottom: 30px; }
            .student { margin-bottom: 10px; padding: 10px; border-left: 4px solid #ddd; }
            .confirmed { border-left-color: #22c55e; background: #f0fdf4; }
            .rejected { border-left-color: #ef4444; background: #fef2f2; }
            .student-name { font-weight: bold; }
            .student-details { font-size: 0.9em; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Selección de Prácticas Profesionales</h1>
          
          <div class="project-info">
            <h3>Información del Proyecto</h3>
            <p><strong>Número:</strong> N° - ${proyecto.numeroProyecto}</p>
            <p><strong>Nombre:</strong> ${proyecto.nombreProyecto}</p>
            <p><strong>Estado:</strong> ${proyecto.estado}</p>
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Postulaciones Confirmadas (${confirmados.length})</h2>
            ${confirmados
              .map(
                (postulacion) => `
              <div class="student confirmed">
                <div class="student-name">${postulacion.estudiante.nombre} ${postulacion.estudiante.apellido}</div>
                <div class="student-details">
                  DNI: ${postulacion.estudiante.dni} | 
                  Email: ${postulacion.estudiante.correoInstitucional} | 
                  Orden de Mérito: #${postulacion.ordenMerito}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <h2>Postulaciones Rechazadas (${rechazados.length})</h2>
            ${rechazados
              .map(
                (postulacion) => `
              <div class="student rejected">
                <div class="student-name">${postulacion.estudiante.nombre} ${postulacion.estudiante.apellido}</div>
                <div class="student-details">
                  DNI: ${postulacion.estudiante.dni} | 
                  Email: ${postulacion.estudiante.correoInstitucional} | 
                  Orden de Mérito: #${postulacion.ordenMerito}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </body>
      </html>
    `

    // Abrir ventana de impresión
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleVolver = () => {
    setStep("input")
    setNumeroProyecto("")
    setError("")
    setProyecto(null)
    setContratos([])
    setShouldClearOnFocus(false)
    setProgress(0)
  }

  if (step === "input") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-xl mx-auto">
          {/* Título principal del sistema */}
          <h1 className="text-3xl font-bold text-center text-black mb-6">Sistema de Prácticas Profesionales</h1>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {/* Agregar el icono arriba del título */}
              <CardTitle className="text-2xl">Confirmación de Selección</CardTitle>
              <CardDescription>Ingresar el número del Proyecto del cual desea confirmar la selección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="numeroProyecto">
                  Número del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroProyecto"
                  placeholder="# Ej: 00001"
                  value={numeroProyecto}
                  maxLength={5}
                  onFocus={() => {
                    if (shouldClearOnFocus) {
                      setNumeroProyecto("")
                      setShouldClearOnFocus(false)
                    }
                    setError("")
                  }}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 5) {
                      setNumeroProyecto(value)
                    }
                  }}
                  className="w-full"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleBuscarProyecto} className="w-full" disabled={loading}>
                {loading ? "Buscando..." : "Continuar"}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-blue-700 font-semibold mb-3">Ejemplos para prueba:</h3>
                <ul className="space-y-2 text-sm text-blue-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese cualquier número válido para continuar con el flujo normal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "11111" para simular que el proyecto no se encuentra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese texto o números incompletos para simular datos no válidos</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-xl mx-auto">
          {/* Título principal del sistema */}
          <h1 className="text-3xl font-bold text-center text-black mb-6">Sistema de Prácticas Profesionales</h1>

          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">Ejecutando algoritmo de selección...</h2>
                <p className="text-gray-600">Procesando postulaciones y asignando estados</p>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-black h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600 font-medium">{progress}% completado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "confirmation" && proyecto) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        {/* Título principal del sistema */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Sistema de Prácticas Profesionales</h1>
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Número de Proyecto</Label>
                  <p className="text-lg font-semibold">N° - {proyecto.numeroProyecto}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nombre del Proyecto</Label>
                  <p className="text-lg font-semibold">{proyecto.nombreProyecto}</p>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-gray-500">Estado</Label>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {proyecto.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {proyecto.puestos.map((puesto) => (
            <Card key={puesto.idPuesto}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {puesto.nombrePuesto}
                  </span>
                  <Badge variant="secondary">
                    {puesto.cantVacantes} vacante{puesto.cantVacantes !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {puesto.postulaciones
                    .sort((a, b) => a.ordenMerito - b.ordenMerito)
                    .map((postulacion) => (
                      <div
                        key={postulacion.numeroPostulacion}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{postulacion.ordenMerito}</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {postulacion.estudiante.nombre} {postulacion.estudiante.apellido}
                            </p>
                            <p className="text-sm text-gray-500">{postulacion.estudiante.correoInstitucional}</p>
                            <p className="text-xs text-gray-400">DNI: {postulacion.estudiante.dni}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={postulacion.ordenMerito <= puesto.cantVacantes ? "default" : "secondary"}
                            className="border border-black"
                          >
                            {postulacion.ordenMerito <= puesto.cantVacantes ? "Será Confirmado" : "Será Rechazado"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("input")}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarSeleccion} disabled={loading} className="flex-1">
              {loading ? "Procesando Selección..." : "Confirmar Selección"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "results" && proyecto) {
    const confirmados = proyecto.puestos.flatMap((p) =>
      p.postulaciones.filter((post) => post.estadoActual === "Confirmado"),
    )
    const rechazados = proyecto.puestos.flatMap((p) =>
      p.postulaciones.filter((post) => post.estadoActual === "Rechazado"),
    )

    return (
      <div className="min-h-screen bg-slate-100 p-4">
        {/* Título principal del sistema */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Sistema de Prácticas Profesionales</h1>
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl text-green-600">
                ✅ Selección Confirmada Exitosamente
              </CardTitle>
              <CardDescription className="text-center">
                El proceso de selección ha sido completado para el proyecto {proyecto.numeroProyecto}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Postulaciones Confirmadas ({confirmados.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {confirmados.map((postulacion) => (
                    <div
                      key={postulacion.numeroPostulacion}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            {postulacion.estudiante.nombre} {postulacion.estudiante.apellido}
                          </p>
                          <p className="text-sm text-green-600">{postulacion.estudiante.correoInstitucional}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Mérito #{postulacion.ordenMerito}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Postulaciones Rechazadas ({rechazados.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rechazados.map((postulacion) => (
                    <div key={postulacion.numeroPostulacion} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-800">
                            {postulacion.estudiante.nombre} {postulacion.estudiante.apellido}
                          </p>
                          <p className="text-sm text-red-600">{postulacion.estudiante.correoInstitucional}</p>
                        </div>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Mérito #{postulacion.ordenMerito}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={handleVolver}>
              Volver
            </Button>
            <Button onClick={handleImprimirReporte} className="flex-1 flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Reporte
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "contracts") {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        {/* Título principal del sistema */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Sistema de Prácticas Profesionales</h1>
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contratos Emitidos
              </CardTitle>
              <CardDescription>Lista de contratos generados para las postulaciones confirmadas</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {contratos.map((contrato) => (
              <Card key={contrato.numeroContrato}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Número de Contrato</Label>
                        <p className="text-lg font-semibold">{contrato.numeroContrato}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Estudiante</Label>
                          <p className="font-medium">
                            {contrato.estudiante.nombre} {contrato.estudiante.apellido}
                          </p>
                          <p className="text-sm text-gray-600">{contrato.estudiante.correoInstitucional}</p>
                          <p className="text-xs text-gray-500">DNI: {contrato.estudiante.dni}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">Puesto</Label>
                          <p className="font-medium">{contrato.puesto}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Fecha de Emisión</Label>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {contrato.fechaEmision}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Fecha de Inicio</Label>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {contrato.fechaInicio}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Fecha de Fin</Label>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {contrato.fechaFin}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge className="bg-green-100 text-green-800">Emitido</Badge>
                      <Button variant="outline" size="sm">
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("results")}>
              Volver a Resultados
            </Button>
            <Button onClick={handleVolver}>Volver</Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
