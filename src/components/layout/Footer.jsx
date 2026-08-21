import Link from "next/link";

const WpIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const IgIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-verde text-white/80">
            <div className="container-club py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Identidad */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-display text-lg">C</div>
                        <div>
                            <span className="font-display text-2xl text-white tracking-wide">Club Curiyú</span>
                            <p className="text-xs text-white/60 -mt-0.5">Rugby & Hockey</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">
                        Institución deportiva y social de Chajarí, Entre Ríos. Formamos personas a través del deporte y los valores del rugby y el hockey.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Navegación</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { href: "/historia", label: "Historia" },
                            { href: "/rugby", label: "Rugby" },
                            { href: "/hockey", label: "Hockey" },
                            { href: "/noticias", label: "Noticias" },
                            { href: "/fixture", label: "Fixture" },
                        ].map(l => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Contacto</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Chajarí, Entre Ríos, Argentina</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href="tel:+543456578953" className="hover:text-white transition-colors">+54 3456 578953</a>
                        </li>
                    </ul>
                </div>

                {/* Redes */}
                <div>
                    <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Seguinos</h3>
                    <div className="flex gap-3">
                        <a href="https://wa.me/543456578953" target="_blank" rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-verde-oscuro text-white p-2.5 rounded-full transition-colors" aria-label="WhatsApp">
                            <WpIcon />
                        </a>
                        <a href="https://www.instagram.com/clubcuriyu" target="_blank" rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-verde-oscuro text-white p-2.5 rounded-full transition-colors" aria-label="Instagram">
                            <IgIcon />
                        </a>
                    </div>
                </div>

            </div>

            <div className="border-t border-white/20">
                <div className="container-club py-4 flex flex-col md:flex-row items-center justify-between text-xs text-white/60">
                    <p>© {new Date().getFullYear()} Club de Rugby y Hockey Curiyú. Todos los derechos reservados.</p>
                    <p className="mt-1 md:mt-0">Chajarí, Entre Ríos, Argentina</p>
                </div>
            </div>
        </footer>
    );
}