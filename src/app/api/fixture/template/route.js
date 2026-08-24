// src/app/api/fixture/template/route.js
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
	// Definir encabezados del Excel
	const headers = [
		"Equipo Local",
		"Equipo Visitante",
		"Categoría",
		"Deporte (rugby/hockey)",
		"Fecha (AAAA-MM-DD)",
	];

	// Crear hoja de cálculo
	const ws = XLSX.utils.aoa_to_sheet([headers]);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Fixture");

	// Generar buffer
	const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

	// Devolver el archivo
	return new NextResponse(buf, {
		headers: {
			"Content-Type":
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"Content-Disposition":
				"attachment; filename=plantilla_fixture.xlsx",
		},
	});
}
