import { z } from "zod"

export const trabajoSchema = z.object({

  nombre: z.string().min(2),

  apellido: z.string().min(2),

  dni: z.string().min(6),

  correo: z.string().email(),

  titulo: z.string().min(5),

  resumen: z.string().min(20),

  seccion: z.string(),

  eje: z.string(),

  originalidad: z.string()

})