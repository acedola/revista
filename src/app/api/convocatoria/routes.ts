import { pool } from "@/lib/db"
import { trabajoSchema } from "@/modules/convocatoria/validation/schema"
import { NextResponse } from "next/server"

export async function POST(req:Request){

  const data = await req.json()

  const result = trabajoSchema.safeParse(data)

  if(!result.success){

    return NextResponse.json({
      error:"Datos inválidos"
    },{status:400})

  }

  const t = result.data

  await pool.query(

  `INSERT INTO trabajos
  (nombre,apellido,dni,correo,titulo,seccion,eje,resumen,originalidad)

  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,

  [
    t.nombre,
    t.apellido,
    t.dni,
    t.correo,
    t.titulo,
    t.seccion,
    t.eje,
    t.resumen,
    t.originalidad
  ]

  )

  return NextResponse.json({ok:true})

}