"use client"

import { useEffect,useState } from "react"

export default function AdminPanel(){

const [data,setData] = useState([])

useEffect(()=>{

fetch("/api/convocatoria/list")
.then(r=>r.json())
.then(setData)

},[])

return(

<div className="container">

<h2>Trabajos recibidos</h2>

<table>

<thead>

<tr>
<th>Autor</th>
<th>Título</th>
<th>Sección</th>
<th>Fecha</th>
</tr>

</thead>

<tbody>

{data.map((t:any)=>(

<tr key={t.id}>

<td>{t.nombre}</td>
<td>{t.titulo}</td>
<td>{t.seccion}</td>
<td>{new Date(t.created_at).toLocaleDateString()}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}